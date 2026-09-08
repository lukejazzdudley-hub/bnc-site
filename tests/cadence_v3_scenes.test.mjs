import assert from 'node:assert/strict';
import test from 'node:test';

import {
  progressAcrossScene,
  renderDimensionsForScene,
  resolveCadenceSceneMode,
  selectCadenceSceneVariant,
} from '../cadence/v3-scenes.js';

test('live scenes render at their displayed size instead of wasting pixels off-screen', () => {
  assert.deepEqual(
    renderDimensionsForScene({ width: 2000, height: 1400 }, 785),
    { width: 785, height: 550 },
  );
  assert.deepEqual(
    renderDimensionsForScene({ width: 780, height: 4000 }, 390),
    { width: 390, height: 2000 },
  );
});

test('scene variants preserve the separately authored desktop and mobile compositions', () => {
  const scene = {
    desktop: { model: '/hero-desktop.glb', poster: '/hero-desktop.webp', width: 1000, height: 1400 },
    mobile: { model: '/hero-mobile.glb', poster: '/hero-mobile.webp', width: 780, height: 1400 },
  };

  assert.deepEqual(selectCadenceSceneVariant(scene, 721), scene.desktop);
  assert.deepEqual(selectCadenceSceneVariant(scene, 720), scene.mobile);
});

test('scene playback follows the complete scroll span and reverses without restarting', () => {
  assert.equal(progressAcrossScene({ top: 800, bottom: 2200 }, 1000), 0);
  assert.equal(progressAcrossScene({ top: -200, bottom: 1200 }, 1000), 0.5);
  assert.equal(progressAcrossScene({ top: -1200, bottom: 200 }, 1000), 1);
  assert.equal(progressAcrossScene({ top: -200, bottom: 1200 }, 1000), 0.5);
});

test('reduced motion, save-data and missing WebGL use the verified poster without loading a GLB', () => {
  assert.equal(resolveCadenceSceneMode({ reducedMotion: false, saveData: false, webglAvailable: true }), 'live');
  assert.equal(resolveCadenceSceneMode({ reducedMotion: true, saveData: false, webglAvailable: true }), 'poster');
  assert.equal(resolveCadenceSceneMode({ reducedMotion: false, saveData: true, webglAvailable: true }), 'poster');
  assert.equal(resolveCadenceSceneMode({ reducedMotion: false, saveData: false, webglAvailable: false }), 'poster');
});
