import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {articles} from '../content/resources/comparisons/index.mjs';
import {buyingTools} from '../content/resources/comparisons/buyers.mjs';

test('lyric-writing alternatives have sourced entries without invented competitive scores', () => {
  const guide = articles[0];
  for (const name of ['SongRight', 'Rhymer’s Block']) assert.ok(buyingTools.some(row => row[0] === name), name);
  const section = guide.sections.find(section => section.id === 'lyric-writing-apps');
  assert.ok(section);
  assert.match(section.html, /three-day trial/i);
  assert.match(section.html, /in-app purchases/i);
  assert.doesNotMatch(section.html, /beats every|independent winner|rated 5/);
});

test('buyer guide supplies a usable static shortlist and captioned original evidence', () => {
  const html = readFileSync(new URL('../cadence/resources/choosing-a-songwriting-app/index.html', import.meta.url), 'utf8');
  assert.match(html, /id="app-shortlist"/);
  assert.equal((html.match(/data-app-option=/g) || []).length, 7);
  assert.match(html, /<form[^>]*data-app-filters[^>]*hidden/);
  assert.match(html, /kind="captions"[^>]*springtime-arrangement-export\.vtt/);
  assert.match(html, /preload="none"/);
  assert.match(html, /development.*build 86/i);
  const product = readFileSync(new URL('../cadence/index.html', import.meta.url), 'utf8');
  assert.match(product, /choosing-a-songwriting-app\/#app-shortlist/);
});
