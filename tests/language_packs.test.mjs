import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validatePack, verifyResponse } from '../cadence/search/pack-loader.mjs';
import { languages } from '../cadence/search/languages.mjs';
import { createIndex, findRhymes, normalize, nearTail } from '../cadence/search/rhymes.mjs';
const raw = readFileSync(new URL('../cadence/search/pack-en.json', import.meta.url), 'utf8');
const pack = JSON.parse(raw);
const manifest = JSON.parse(readFileSync(new URL('../cadence/search/packs.json', import.meta.url)));
const index = createIndex(Object.fromEntries(pack.entries), { phrases: pack.phrases, frequencies: pack.frequencies });
test('published manifest authenticates exactly the generated English pack', async () => {
  assert.equal(createHash('sha256').update(raw).digest('hex'), manifest.en.sha256);
  assert.equal((await verifyResponse(new Response(raw), manifest.en, 'en')).id, 'en');
  await assert.rejects(verifyResponse(new Response(raw + ' '), manifest.en, 'en'), /integrity/);
});
test('wrong language and malformed payloads fail closed', () => {
  assert.throws(() => validatePack(pack, 'es'));
  assert.throws(() => validatePack({ id: 'en', entries: [['cat', '<script>']], phrases: [] }, 'en'));
  assert.equal(languages.length, 25);
  assert.deepEqual(languages.filter(l => l.available).map(l => l.id), ['en']);
  assert.deepEqual(Object.keys(manifest), ['en']);
});
test('English vocabulary filters previous name noise without losing core rhymes', () => {
  for (const name of ['bocian', 'hoeschen', 'kocian']) assert.equal(index.readings.has(name), false);
  assert.ok(findRhymes(index, 'motion', 'multi').results.some(r => r.word === 'ocean'));
});
test('slant preserves vowels and excludes exact rhymes', () => {
  assert.equal(nearTail('AE T', 'AE P'), true);
  assert.equal(nearTail('AE T', 'EY T'), false);
  assert.equal(nearTail('AE T', 'AE T'), false);
  const small = createIndex({ cat: 'K AE1 T', cap: 'K AE1 P', bat: 'B AE1 T', cut: 'K AH1 T' });
  assert.deepEqual(findRhymes(small, 'cat', 'slant').results.map(r => r.word), ['cap']);
});
test('phrase endings are real curated entries, not generated word combinations', () => {
  const found = findRhymes(index, 'light', 'phrase').results;
  assert.ok(found.some(r => r.word === 'all night'));
  assert.ok(found.every(r => r.phrase && pack.phrases.includes(r.word)));
});
test('Unicode normalization preserves accents and selected-language casing', () => {
  assert.equal(normalize(' E\u0301TÉ ', 'fr'), 'été');
  assert.equal(normalize('I', 'tr'), 'ı');
  assert.equal(normalize('किताब', 'hi'), 'किताब');
});
