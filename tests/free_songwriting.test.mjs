import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {articles} from '../content/resources/comparisons/index.mjs';

const article = articles.find(item => item.slug === 'choosing-a-songwriting-app');
test('free intent is answered before the promotional shortlist, with bounded offers', () => {
  const section = article.sections[0];
  assert.equal(section.id, 'free-songwriting-apps');
  for (const name of ['BandLab', 'GarageBand', 'MuseScore Studio', 'Cadence', 'Song Cage']) assert.ok(section.html.includes(name));
  assert.match(section.html, /three free notes/i);
  assert.match(section.html, /Pro unlocks/i);
  assert.match(section.html, /14-day desktop trial/i);
  assert.match(section.html, /upcoming/i);
  assert.match(section.html, /12 November 2026/);
  assert.match(article.title, /free.*paid/i);
});
test('free comparison has cited evidence and a crawlable product-page route', () => {
  for (const host of ['songcage.com/shop/', 'musescore.org/en/download', 'apps.apple.com/us/app/garageband/id408709785']) {
    assert.ok(article.sources.some(source => source.url.includes(host) && source.checked === '2026-11-12'));
  }
  const html = readFileSync(new URL('../cadence/songwriting-app/index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('/cadence/resources/choosing-a-songwriting-app/#free-songwriting-apps'));
});
