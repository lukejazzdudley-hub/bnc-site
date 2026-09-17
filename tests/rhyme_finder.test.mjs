import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createIndex, findRhymes, normalize } from '../cadence/search/rhymes.mjs';
const dictionary = JSON.parse(readFileSync(new URL('../cadence/search/dictionary.json', import.meta.url)));
const index = createIndex(dictionary);
const words = (word, mode) => findRhymes(index, word, mode).results.map(x => x.word);
test('sound-based matches, not spelling', () => {
  assert.ok(words('light').includes('night'));
  assert.ok(!words('love').includes('move'));
  assert.ok(!words('light').includes('light'));
});
test('multiple matching syllables, not merely long words', () => {
  assert.ok(words('motion', 'multi').includes('ocean'));
  assert.equal(words('light', 'multi').length, 0);
});
test('input normalization and safe rejection', () => {
  assert.equal(normalize('  DON’T '), "don't");
  for (const word of ['<script>', 'two words', '123', 'a'.repeat(61)]) assert.equal(findRhymes(index, word).state, 'invalid');
  assert.equal(findRhymes(index, 'zzzzqxx').state, 'unknown');
});
test('alternate pronunciations and bounded distinct output', () => {
  assert.ok(index.readings.get('read').size > 1);
  const results = words('read');
  assert.ok(results.includes('red'));
  assert.ok(results.includes('reed'));
  assert.equal(new Set(results).size, results.length);
  assert.ok(results.length <= 150);
});
