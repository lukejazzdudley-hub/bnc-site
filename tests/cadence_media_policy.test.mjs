import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canScrubMedia,
  mediaTimeForProgress,
  normalizedScrollProgress,
  resolveMediaMode,
  scrollProgressForBounds,
  selectActiveMedia,
  selectActiveScene,
  shouldPlayMedia,
} from '../cadence/media-policy.js';

test('reduced motion and data saving select the composed poster experience', () => {
  assert.equal(resolveMediaMode({ reducedMotion: true, saveData: false }), 'static');
  assert.equal(resolveMediaMode({ reducedMotion: false, saveData: true }), 'static');
  assert.equal(resolveMediaMode({ reducedMotion: false, saveData: false }), 'motion');
});

test('media only plays while visible, in view and allowed by visitor preferences', () => {
  const ready = {
    documentVisible: true,
    intersecting: true,
    reducedMotion: false,
    saveData: false,
  };

  assert.equal(shouldPlayMedia(ready), true);
  for (const key of Object.keys(ready)) {
    if (key === 'reducedMotion' || key === 'saveData') {
      assert.equal(shouldPlayMedia({ ...ready, [key]: true }), false);
    } else {
      assert.equal(shouldPlayMedia({ ...ready, [key]: false }), false);
    }
  }
});

test('the most visible eligible demonstration wins at section boundaries', () => {
  const first = { id: 'first' };
  const second = { id: 'second' };

  assert.equal(selectActiveMedia([
    { media: first, intersecting: true, ratio: 0.51 },
    { media: second, intersecting: true, ratio: 0.72 },
  ]), second);
  assert.equal(selectActiveMedia([
    { media: first, intersecting: true, ratio: 0.34 },
    { media: second, intersecting: false, ratio: 0.9 },
  ]), null);
  assert.equal(selectActiveMedia([
    { media: first, intersecting: true, ratio: 0.6 },
    { media: second, intersecting: true, ratio: 0.6 },
  ]), first);
});

test('scroll progress remains stable before, inside and after a scene', () => {
  assert.equal(normalizedScrollProgress({ start: 100, end: 500, position: 0 }), 0);
  assert.equal(normalizedScrollProgress({ start: 100, end: 500, position: 300 }), 0.5);
  assert.equal(normalizedScrollProgress({ start: 100, end: 500, position: 800 }), 1);
  assert.equal(normalizedScrollProgress({ start: 100, end: 100, position: 100 }), 0);
});

test('scene bounds map the viewport crossing to zero through one', () => {
  assert.equal(scrollProgressForBounds({ top: 800, height: 1000, viewportHeight: 800 }), 0);
  assert.equal(scrollProgressForBounds({ top: -100, height: 1000, viewportHeight: 800 }), 0.5);
  assert.equal(scrollProgressForBounds({ top: -1000, height: 1000, viewportHeight: 800 }), 1);
});

test('forward and reverse progress map deterministically to media time', () => {
  assert.equal(mediaTimeForProgress({ duration: 8, progress: 0.75 }), 6);
  assert.equal(mediaTimeForProgress({ duration: 8, progress: 0.25 }), 2);
  assert.equal(mediaTimeForProgress({ duration: Number.NaN, progress: 0.5 }), 0);
  assert.equal(mediaTimeForProgress({ duration: 8, progress: -1 }), 0);
  assert.equal(mediaTimeForProgress({ duration: 8, progress: 2 }), 8);
});

test('scrubbing requires metadata and honors visibility and visitor preferences', () => {
  const ready = {
    documentVisible: true,
    reducedMotion: false,
    saveData: false,
    readyState: 1,
  };

  assert.equal(canScrubMedia(ready), true);
  assert.equal(canScrubMedia({ ...ready, documentVisible: false }), false);
  assert.equal(canScrubMedia({ ...ready, reducedMotion: true }), false);
  assert.equal(canScrubMedia({ ...ready, saveData: true }), false);
  assert.equal(canScrubMedia({ ...ready, readyState: 0 }), false);
});

test('the nearest intersecting scene wins at section boundaries', () => {
  const near = { id: 'near' };
  const far = { id: 'far' };

  assert.equal(selectActiveScene([
    { media: far, intersecting: true, distance: 500 },
    { media: near, intersecting: true, distance: 40 },
  ]), near);
  assert.equal(selectActiveScene([
    { media: far, intersecting: false, distance: 0 },
    { media: near, intersecting: false, distance: 10 },
  ]), null);
});
