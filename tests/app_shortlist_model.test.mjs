import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesOption} from '../cadence/resources/app-shortlist-model.mjs';
import {shortlistOptions} from '../content/resources/comparisons/shortlist.mjs';

const find = overrides => shortlistOptions.filter(option => matchesOption(option, {device:'all',task:'all',access:'all',...overrides})).map(option => option.id);
test('device, workflow and free-access filters compose without inventing free Cadence access', () => {
  assert.equal(find({}).length, 7);
  assert.deepEqual(find({device:'android',task:'lyrics',access:'limited'}), ['cadence','songcage']);
  assert.deepEqual(find({device:'android',task:'lyrics',access:'free'}), []);
  assert.deepEqual(find({device:'apple',task:'lyrics',access:'free'}), ['rhymers-block']);
  assert.deepEqual(find({device:'desktop',task:'notation',access:'free'}), ['musescore']);
  assert.deepEqual(find({device:'android',task:'production',access:'free'}), ['bandlab']);
  assert.deepEqual(find({device:'browser',task:'lyrics',access:'trial'}), ['songright']);
});
test('a desktop trial is not incorrectly offered for the same vendor’s phone app', () => {
  assert.deepEqual(find({device:'android',access:'trial'}), []);
  assert.deepEqual(find({device:'desktop',access:'trial'}), ['songcage']);
  assert.deepEqual(find({device:'desktop',access:'limited'}), []);
  assert.deepEqual(find({device:'browser',access:'limited'}), ['songcage']);
  assert.deepEqual(find({device:'unknown'}), []);
});
