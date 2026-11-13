import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { englishExamples } from '../content/english-rhyme-examples.mjs';
import { createIndex, findRhymes } from '../cadence/search/rhymes.mjs';

const pack = JSON.parse(readFileSync(new URL('../cadence/search/pack-en.json', import.meta.url)));
const index = createIndex(Object.fromEntries(pack.entries), { phrases: pack.phrases, frequencies: pack.frequencies });
const html = readFileSync(new URL('../cadence/rhyme-finder/index.html', import.meta.url), 'utf8');
test('all four worked searches match the current public engine and remain in served HTML', () => {
  assert.equal(englishExamples.length, 4);
  for (const example of englishExamples) {
    const live = findRhymes(index, example.word, example.mode);
    assert.equal(live.state, 'known');
    assert.ok(example.results.length >= 2);
    assert.deepEqual(example.results, live.results.slice(0, 8).map(result => result.word));
    const card = html.split(`<h3>${example.title}</h3>`)[1]?.split('</article>')[0];
    assert.ok(card, `missing static example: ${example.word}/${example.mode}`);
    for (const word of example.results) assert.ok(card.includes(`<li>${word}</li>`));
    assert.ok(card.includes('data-worked-example hidden'));
  }
  assert.match(html, /<h1>Free English rhyme finder<\/h1>/);
});
test('worked examples distinguish strict, loose and cross-word matches', () => {
  const results = mode => englishExamples.find(example => example.mode === mode).results;
  assert.ok(results('perfect').includes('night'));
  assert.ok(results('multi').includes('ocean'));
  assert.ok(results('slant').includes('like'));
  assert.ok(!results('slant').includes('night'));
  assert.deepEqual(results('phrase'), ['i scream', 'nice dream']);
});
