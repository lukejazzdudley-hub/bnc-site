import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cameraOrbitForProgress,
  containRectForSource,
  modelOrientationForProgress,
  progressAcrossBounds,
  resolvePhoneStageMode,
  screenPlanForChapter,
  selectActiveChapter,
  shouldCommitVideoFrame,
  smoothMotionProgress,
  themeTrioReady,
} from '../cadence/phone-stage.js';

test('screen sources are contained without changing their aspect ratio', () => {
  const cropped = containRectForSource(1206, 2448, 620, 1348);
  assert.equal(cropped.width, 620);
  assert.equal(Math.round(cropped.height), 1259);
  assert.equal(Math.round(cropped.y), 45);
  assert.ok(Math.abs(cropped.width / cropped.height - 1206 / 2448) < 0.0001);

  const full = containRectForSource(1206, 2622, 620, 1348);
  assert.equal(Math.round(full.width), 620);
  assert.equal(Math.round(full.height), 1348);
});

test('theme trio waits until both independent side screens are bound', () => {
  assert.equal(themeTrioReady(true, ['true', 'true']), true);
  assert.equal(themeTrioReady(true, ['true', undefined]), false);
  assert.equal(themeTrioReady(false, ['true', 'true']), false);
});

test('live 3D is disabled when motion, data or WebGL constraints require a fallback', () => {
  assert.equal(resolvePhoneStageMode({ reducedMotion: false, saveData: false, webglAvailable: true }), 'live');
  assert.equal(resolvePhoneStageMode({ reducedMotion: true, saveData: false, webglAvailable: true }), 'poster');
  assert.equal(resolvePhoneStageMode({ reducedMotion: false, saveData: true, webglAvailable: true }), 'poster');
  assert.equal(resolvePhoneStageMode({ reducedMotion: false, saveData: false, webglAvailable: false }), 'poster');
});

test('the chapter nearest the viewport centre controls the persistent phone', () => {
  const capture = { id: 'capture' };
  const write = { id: 'write' };
  const arrange = { id: 'arrange' };

  assert.equal(selectActiveChapter([
    { chapter: capture, top: -500, bottom: 40 },
    { chapter: write, top: 40, bottom: 740 },
    { chapter: arrange, top: 740, bottom: 1440 },
  ], 800), write);

  assert.equal(selectActiveChapter([
    { chapter: capture, top: -900, bottom: -100 },
    { chapter: write, top: -100, bottom: 250 },
    { chapter: arrange, top: 250, bottom: 950 },
  ], 800), arrange);
});

test('camera motion interpolates and clamps to the authored chapter pose', () => {
  const pose = {
    from: { theta: -18, phi: 78, radius: 108 },
    to: { theta: 12, phi: 84, radius: 96 },
  };

  assert.equal(cameraOrbitForProgress(pose, -1), '-18.00deg 78.00deg 108.00%');
  assert.equal(cameraOrbitForProgress(pose, 0.5), '-3.00deg 81.00deg 102.00%');
  assert.equal(cameraOrbitForProgress(pose, 2), '12.00deg 84.00deg 96.00%');
});

test('model orientation uses model-viewer roll pitch yaw order', () => {
  const pose = {
    from: { roll: 15, pitch: -6, yaw: -8 },
    to: { roll: 15, pitch: 0, yaw: 0 },
  };

  assert.equal(modelOrientationForProgress(pose, -1), '15.00deg -6.00deg -8.00deg');
  assert.equal(modelOrientationForProgress(pose, 0.5), '15.00deg -3.00deg -4.00deg');
  assert.equal(modelOrientationForProgress(pose, 2), '15.00deg 0.00deg 0.00deg');
});

test('physical phone motion eases across one continuous story without breaking reverse scroll', () => {
  assert.equal(smoothMotionProgress(-1), 0);
  assert.equal(smoothMotionProgress(0), 0);
  assert.equal(smoothMotionProgress(0.25), 0.15625);
  assert.equal(smoothMotionProgress(0.5), 0.5);
  assert.equal(smoothMotionProgress(0.75), 0.84375);
  assert.equal(smoothMotionProgress(1), 1);
  assert.equal(smoothMotionProgress(2), 1);
});

test('the physical phone follows the complete story rather than restarting in every chapter', () => {
  assert.equal(progressAcrossBounds({ top: 820, bottom: 4820 }, 1000), 0);
  assert.equal(progressAcrossBounds({ top: -1500, bottom: 2500 }, 1000), 0.5);
  assert.equal(progressAcrossBounds({ top: -3820, bottom: 180 }, 1000), 1);
  assert.equal(progressAcrossBounds({ top: 1200, bottom: 5200 }, 1000), 0);
  assert.equal(progressAcrossBounds({ top: -4200, bottom: -200 }, 1000), 1);
});

test('a theme chapter selects one locked product frame instead of replaying theme switching', () => {
  assert.deepEqual(screenPlanForChapter({
    screenImage: '/theme-magenta.webp',
    screenVideo: '/themes.mp4',
  }), { kind: 'image', source: '/theme-magenta.webp' });
  assert.deepEqual(screenPlanForChapter({ screenVideo: '/rhyme.mp4' }), {
    kind: 'video',
    source: '/rhyme.mp4',
  });
  assert.equal(screenPlanForChapter({}), null);
});

test('late media events cannot overwrite the active chapter screen', () => {
  const library = { id: 'library' };
  const rhyme = { id: 'rhyme' };

  assert.equal(shouldCommitVideoFrame(rhyme, rhyme), true);
  assert.equal(shouldCommitVideoFrame(library, rhyme), false);
  assert.equal(shouldCommitVideoFrame(library, null), false);
});
