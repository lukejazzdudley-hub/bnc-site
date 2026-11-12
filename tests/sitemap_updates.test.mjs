import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withPublicationDates} from '../scripts/sitemap-updates.mjs';

test('only evidenced changed pages receive dates, with video metadata preserved', () => {
  const original = '<urlset><url><loc>https://brandnamechanges.com/cadence/</loc><video:video>keep this metadata</video:video></url><url><loc>https://brandnamechanges.com/privacy</loc></url></urlset>';
  const updates = {'https://brandnamechanges.com/cadence/':{lastmod:'2026-11-12',release:'https://github.com/lukejazzdudley-hub/bnc-site/pull/62'}};
  const result = withPublicationDates(original, updates);
  assert.match(result, /<lastmod>2026-11-12<\/lastmod>/);
  assert.ok(result.includes('<video:video>keep this metadata</video:video>'));
  assert.ok(result.includes('<url><loc>https://brandnamechanges.com/privacy</loc></url>'));
  assert.equal(withPublicationDates(result, updates), result);
});
test('bad publication dates and noncanonical URL records fail before publishing', () => {
  for (const lastmod of ['today','2026-02-30','2026-13-01']) {
    assert.throws(() => withPublicationDates('<urlset/>', {'https://brandnamechanges.com/cadence/':{lastmod}}));
  }
  assert.throws(() => withPublicationDates('<urlset/>', {'https://example.com/':{lastmod:'2026-11-12'}}));
  assert.throws(() => withPublicationDates('<urlset/>', {'https://brandnamechanges.com/cadence/':{lastmod:'2026-11-12'}}));
});
test('the built sitemap dates exactly the evidenced pages and retains both watch entries', () => {
  const updates = JSON.parse(readFileSync(new URL('../content/published-page-updates.json', import.meta.url), 'utf8'));
  const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const dated = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)];
  assert.deepEqual(dated.map(match => match[1]).sort(), Object.keys(updates).sort());
  for (const [, url, date] of dated) assert.equal(date, updates[url].lastmod);
  assert.equal((sitemap.match(/<video:video>/g) || []).length, 2);
});
