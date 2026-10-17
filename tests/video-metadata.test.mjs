import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
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


test('a second verified watch page gets its own video entry', () => {
  const second = xml.replace('/cadence/type-beat-walkthrough/', '/cadence/springtime-showers/');
  const built = addWatchVideo(second, html, '/cadence/springtime-showers/');
  assert.equal((built.match(/<video:video>/g) || []).length, 1);
  assert.equal(addWatchVideo(built, html, '/cadence/springtime-showers/'), built);
  assert.throws(() => addWatchVideo(second, html, 'https://example.com/watch/'), /local/);
});


test('the arrangement export publication matches its verified six-stem evidence', () => {
  const root = new URL('../', import.meta.url);
  const evidence = JSON.parse(readFileSync(new URL('assets/cadence/type-beat/springtime-export-evidence.json', root), 'utf8'));
  assert.equal(evidence.song, 'Springtime Showers');
  assert.equal(evidence.export.stem_count, 6);
  assert.equal(evidence.export.duration_seconds, 206.797);
  assert.equal(evidence.export.sample_rate, 48000);
  assert.ok(evidence.export.files.some(file => file.file === 'Verse.wav'));
  assert.ok(evidence.export.files.some(file => file.file === 'Hook.wav'));
  for (const file of evidence.derivatives) {
    const bytes = readFileSync(new URL(`assets/cadence/type-beat/${file.file}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
  }
  const page = readFileSync(new URL('cadence/springtime-showers/index.html', root), 'utf8');
  assert.ok(page.includes('six are 48 kHz'));
  assert.ok(page.includes('same take is not doubled unintentionally'));
  assert.ok(page.includes('springtime-arrangement-export.vtt'));
  assert.ok(page.includes('PT2M8.833S'));
  const sitemap = readFileSync(new URL('sitemap.xml', root), 'utf8');
  assert.ok(sitemap.includes('https://brandnamechanges.com/assets/cadence/type-beat/springtime-arrangement-export.mp4'));
});
