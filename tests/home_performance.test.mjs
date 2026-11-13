import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildHomePerformance, homeStyles, homeFonts } from '../scripts/build_home_performance.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const html = readFileSync('index.html', 'utf8');
const manifest = JSON.parse(readFileSync('content/home-assets.json', 'utf8'));

test('homepage keeps the full source cascade without render-blocking stylesheet requests', () => {
  const css = homeStyles.map(file => `/* ${file} */\n${readFileSync(file)}`).join('\n');
  assert.ok(html.includes(`<style id="home-styles" data-source-sha256="${hash(css)}">\n${css}\n</style>`));
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"/);
  for (const font of homeFonts) assert.ok(html.includes(`href="/assets/fonts/${font}.woff2" as="font" type="font/woff2" crossorigin`));
  assert.equal((html.match(/rel="preload"/g) || []).length, 3);
});

test('long-lived cache candidates have actual content hashes and unchanged source bytes', () => {
  assert.equal(manifest.assets.length, 8);
  for (const asset of manifest.assets) {
    const bytes = readFileSync(asset.url.slice(1));
    assert.equal(hash(bytes), asset.sha256);
    assert.equal(bytes.length, asset.bytes);
    assert.ok(asset.url.includes(asset.sha256.slice(0, 12)));
    assert.deepEqual(bytes, readFileSync(asset.source));
    if (!asset.url.endsWith('6ee678c33f38.woff2')) assert.ok(html.includes(asset.url));
  }
  const experience = manifest.assets.find(asset => asset.source === 'work-with-us/experience.mjs');
  assert.match(readFileSync(experience.url.slice(1), 'utf8'), /import\('\/work-with-us\/effects\/field.mjs'\)/);
  assert.match(html, /<script src="\/assets\/immutable\/site\.[a-f0-9]{12}\.js" defer>/);
});

test('regeneration is stable, changes asset URLs with content and retains previously cached files', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'bnc-home-performance-'));
  try {
    const sources = ['index.html', ...homeStyles, ...manifest.assets.map(asset => asset.source)];
    for (const file of new Set(sources)) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), readFileSync(file));
    }
    buildHomePerformance(root);
    const before = readFileSync(path.join(root, 'index.html'));
    buildHomePerformance(root);
    assert.deepEqual(readFileSync(path.join(root, 'index.html')), before);
    const prior = JSON.parse(readFileSync(path.join(root, 'content/home-assets.json'))).assets.find(asset => asset.source === 'site.js');
    writeFileSync(path.join(root, 'site.js'), readFileSync(path.join(root, 'site.js')) + '\n// Changed fixture.\n');
    buildHomePerformance(root);
    const updated = JSON.parse(readFileSync(path.join(root, 'content/home-assets.json'))).assets.find(asset => asset.source === 'site.js');
    assert.notEqual(updated.url, prior.url);
    assert.ok(existsSync(path.join(root, prior.url.slice(1))));
    assert.ok(readFileSync(path.join(root, 'index.html'), 'utf8').includes(updated.url));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
