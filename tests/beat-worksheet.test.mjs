import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateSections, worksheetText} from '../cadence/resources/beat-worksheet-model.mjs';

test('section timing accumulates four-beat bars without rounding drift', () => {
  const result = calculateSections(90, [4, 8, 4, 4]);
  assert.equal(result.bars, 20);
  assert.ok(Math.abs(result.seconds - 160 / 3) < 1e-9);
  assert.deepEqual(result.sections.map(s => s.startBar), [1, 5, 13, 17]);
  assert.deepEqual(result.sections.map(s => s.endBar), [4, 12, 16, 20]);
});

test('invalid tempo and section lengths never produce misleading timestamps', () => {
  for (const bpm of ['', '90x', 0, 39, 241, Infinity, NaN]) {
    assert.throws(() => calculateSections(bpm, [4, 8, 4, 4]), /tempo/i);
  }
  for (const bars of [[4, -1, 4, 4], [4, 1.5, 4, 4], [4, '', 4, 4], [4, 257, 4, 4], [4, 8], [0, 0, 0, 0]]) {
    assert.throws(() => calculateSections(90, bars), /bar|section/i);
  }
});

test('zero-bar sections are omitted and fractional tempo remains accurate', () => {
  const result = calculateSections(87.5, [0, 8, 4, 0]);
  assert.equal(result.sections.length, 2);
  assert.equal(result.sections[0].name, 'Verse');
  assert.equal(result.sections[0].startBar, 1);
  assert.ok(Math.abs(result.seconds - 12 * 4 * 60 / 87.5) < 1e-9);
});

test('download preserves multilingual lyrics and listening decisions as plain text', () => {
  const text = worksheetText({tempo: 90, bars: [4, 8, 4, 4], title: 'Échos 夜', beat: 'My licensed beat', intent: 'Return home', lyrics: '<verse>\nJe reviens', takeA: 'Entry late', takeB: 'Clearer breath', decision: 'Keep B; retake bar 3'});
  for (const expected of ['Échos 夜', '<verse>\nJe reviens', 'Entry late', 'Clearer breath', 'Keep B; retake bar 3', 'My licensed beat', '53.3', 'not a beat licence']) assert.ok(text.includes(expected), expected);
});

test('empty fields produce a useful blank worksheet rather than undefined', () => {
  const text = worksheetText({tempo: 90, bars: [4, 8, 4, 4]});
  assert.ok(text.includes('________________'));
  assert.ok(!text.includes('undefined'));
});
