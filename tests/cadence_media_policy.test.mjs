import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizedScrollProgress,
  resolveMediaMode,
  selectActiveMedia,
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
