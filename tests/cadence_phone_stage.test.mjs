import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cameraOrbitForProgress,
  resolvePhoneStageMode,
  selectActiveChapter,
  shouldCommitVideoFrame,
} from '../cadence/phone-stage.js';

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

test('late media events cannot overwrite the active chapter screen', () => {
  const library = { id: 'library' };
  const rhyme = { id: 'rhyme' };

  assert.equal(shouldCommitVideoFrame(rhyme, rhyme), true);
  assert.equal(shouldCommitVideoFrame(library, rhyme), false);
  assert.equal(shouldCommitVideoFrame(library, null), false);
});
