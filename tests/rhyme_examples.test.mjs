import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rhymeExamples} from '../content/rhyme-examples.mjs';
import {createRomanceIndex, searchRomance} from '../cadence/search/romance.mjs';

for (const [language, content] of Object.entries(rhymeExamples)) {
  const index = createRomanceIndex(JSON.parse(readFileSync(new URL(`../cadence/search/public-${language}.json`, import.meta.url))));
  const route = language === 'es' ? 'es/diccionario-rimas' : 'fr/dictionnaire-rimes';
  test(`${language}: published examples are real dictionary matches and readable without search`, () => {
    const html = readFileSync(new URL(`../cadence/${route}/index.html`, import.meta.url), 'utf8');
    for (const example of content.examples) {
      const result = searchRomance(index, example.word, 'perfect', 10000);
      assert.equal(result.state, 'ready');
      for (const word of example.matches) assert.ok(result.results.some(match => match.word === word), `${example.word}/${word}`);
      assert.ok(html.includes(example.sentence));
      assert.ok(html.includes(`data-romance-example="${example.word}"`));
    }
    assert.ok(html.includes('id="rhyme-examples"'));
    assert.ok(html.includes('id="search-help"'));
  });
}

test('new instructional links point to real guide chapters', () => {
  const guide = readFileSync(new URL('../cadence/guide/index.html', import.meta.url), 'utf8');
  const pages = ['songwriting-app-android', 'resources/internal-rhymes-and-rhyme-schemes', 'es/diccionario-rimas', 'fr/dictionnaire-rimes'];
  for (const page of pages) {
    const html = readFileSync(new URL(`../cadence/${page}/index.html`, import.meta.url), 'utf8');
    for (const [, anchor] of html.matchAll(/href="\/cadence\/guide\/#([^"]+)"/g)) {
      assert.ok(guide.includes(`id="${anchor}"`), `${page}: ${anchor}`);
    }
  }
});
