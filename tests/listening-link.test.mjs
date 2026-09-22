import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tokenFromHash, verifiedPlaybackURL } from '../cadence/listen/link-policy.mjs';
test('listening token stays in fragment and rejects malformed values', () => {
  assert.equal(tokenFromHash('#token=' + 'a'.repeat(43)), 'a'.repeat(43));
  assert.equal(tokenFromHash('#token=bad'), null);
  assert.equal(tokenFromHash(''), null);
});
test('audio only loads from the expected private signed storage route', () => {
  assert.ok(verifiedPlaybackURL('https://goupfxfloriqtucppmbx.supabase.co/storage/v1/object/sign/listening-audio/a?token=x'));
  for (const url of ['javascript:alert(1)', 'https://evil.test/audio', 'https://goupfxfloriqtucppmbx.supabase.co/storage/v1/object/public/listening-audio/a']) assert.equal(verifiedPlaybackURL(url), null);
});
test('private fallback is not indexed and loads no tracking scripts', () => {
  const html = readFileSync(new URL('../cadence/listen/index.html', import.meta.url), 'utf8');
  assert.match(html, /noindex,nofollow,noarchive/); assert.match(html, /no-referrer/);
  assert.equal((html.match(/<script/g) || []).length, 1);
  assert.doesNotMatch(html, /googletagmanager|facebook|analytics|site\.js/);
});
