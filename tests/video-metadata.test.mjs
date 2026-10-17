import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {addWatchVideo} from '../scripts/build_video_metadata.mjs';

const html = readFileSync(new URL('../content/type-beat-walkthrough.html', import.meta.url), 'utf8');
const xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://brandnamechanges.com/cadence/type-beat-walkthrough/</loc></url></urlset>';

test('watch metadata is derived from the real page and does not duplicate on regeneration', () => {
  const built = addWatchVideo(xml, html);
  assert.equal(addWatchVideo(built, html), built);
  assert.equal((built.match(/<video:video>/g) || []).length, 1);
  assert.ok(built.includes('beat-first-workflow.mp4'));
  assert.ok(built.includes('beat-first-poster.jpg'));
  assert.ok(built.includes('Not a finished performance or exported demo.'));
  assert.equal((built.match(/<url>/g) || []).length, 1);
});

test('missing or remote media cannot silently create bogus video entries', () => {
  assert.throws(() => addWatchVideo(xml, '<html></html>'), /requires/);
  assert.throws(() => addWatchVideo(xml, html.replace('https://brandnamechanges.com/assets/cadence/type-beat/beat-first-workflow.mp4', 'https://example.com/other.mp4')), /locally/);
  assert.throws(() => addWatchVideo('<urlset></urlset>', html), /missing/);
});
