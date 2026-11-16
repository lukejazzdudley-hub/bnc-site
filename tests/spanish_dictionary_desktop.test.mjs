import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRomanceIndex, searchRomance} from '../cadence/search/romance.mjs';
const html = readFileSync(new URL('../cadence/es/diccionario-rimas/index.html', import.meta.url), 'utf8');

test('Spanish dictionary puts lookup before article navigation and examples before app promotion', () => {
  assert.ok(html.indexOf('id="romance-form"') < html.indexOf('<aside class="reader-index">'));
  assert.ok(html.indexOf('id="rhyme-examples"') < html.indexOf('id="cadence-app"'));
  assert.doesNotMatch(html, /class="reader-art"/);
  assert.match(html, /<title>Diccionario de rimas en español gratis \| Cadence<\/title>/);
  assert.match(html, /data-nosnippet[^>]*id="cadence-app"/);
});

test('Spanish word previews publish actual frequency-ordered results without a browser download', () => {
  const index = createRomanceIndex(JSON.parse(readFileSync(new URL('../cadence/search/public-es.json', import.meta.url))));
  for (const word of ['amor', 'canción', 'camino', 'vida', 'luna', 'alegría']) {
    const section = html.match(new RegExp(`<article[^>]*id="rimas-con-${word}"[\\s\\S]*?<\\/article>`))?.[0];
    assert.ok(section, word);
    const expected = searchRomance(index, word, 'perfect', 6).results.map(row => row.word);
    assert.ok(expected.length >= 4);
    for (const result of expected) assert.ok(section.includes(`<li>${result}</li>`), `${word}/${result}`);
    assert.ok(section.includes(`data-romance-example="${word}" data-romance-mode="perfect"`));
    assert.ok(section.includes(`data-romance-example="${word}" data-romance-mode="assonance"`));
  }
});
