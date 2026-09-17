import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createIndex, findRhymes } from '../cadence/search/rhymes.mjs';
const pack = JSON.parse(readFileSync(new URL('../cadence/search/pack-en.json', import.meta.url)));
const index = createIndex(Object.fromEntries(pack.entries), {phrases:pack.phrases, frequencies:pack.frequencies});
test('reported light search excludes obscure word-game noise and ranks usable slants', () => {
  const result = findRhymes(index, 'light', 'slant');
  const words = result.results.map(r => r.word);
  for (const noise of ['ais', 'bice', 'bise', 'cline', 'cripe', 'crise']) assert.ok(!words.includes(noise), noise);
  assert.ok(words.slice(0, 20).includes('ride'));
  assert.ok(words.slice(0, 30).includes('like'));
  assert.ok(!words.includes('night'), 'exact rhymes belong in Perfect');
  assert.ok(result.total < 500, 'do not repeat the 1421-result flood');
});
test('every mode filters candidates but does not prevent rare-word lookup', () => {
  const small = createIndex({light:'L AY1 T', night:'N AY1 T', ais:'AY1 S', ice:'AY1 S'}, {frequencies:{light:5,night:5,ais:3.06,ice:4.5}});
  assert.deepEqual(findRhymes(small,'ais').results.map(r=>r.word), ['ice']);
  assert.ok(!findRhymes(small,'ice').results.some(r=>r.word==='ais'));
  assert.equal(findRhymes(small,'ais').state, 'known');
});
test('common legitimate vocabulary remains available across writing prompts', () => {
  for (const [query, expected] of [['motion','ocean'],['light','night'],['love','above'],['time','rhyme'],['fire','desire'],['away','day'],['flow','know'],['pain','rain']]) {
    assert.ok(findRhymes(index,query).results.some(r=>r.word===expected), `${query} -> ${expected}`);
  }
  for (const word of ['aisle','aye','chai']) assert.ok(index.readings.has(word));
  for (const name of ['cohen','logan','st']) assert.equal(index.readings.has(name),false);
});
test('unstressed reduced pronunciations do not create false families', () => {
  const small = createIndex({love:'L AH1 V', that:'DH AE1 T', 'that(2)':'DH AH0 T'});
  assert.ok(!findRhymes(small,'love','slant').results.some(r=>r.word==='that'));
});
