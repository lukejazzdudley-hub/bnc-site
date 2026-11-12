import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const published = JSON.parse(readFileSync(new URL('../content/published-page-updates.json', import.meta.url), 'utf8'));

// Dates describe significant published changes, never the time a build happens.
export function withPublicationDates(sitemap, updates = published) {
  for (const [url, {lastmod, release}] of Object.entries(updates)) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://brandnamechanges.com');
    assert.ok(!parsed.search && !parsed.hash, 'Use canonical URLs without queries or fragments.');
    assert.match(lastmod, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${lastmod}T00:00:00Z`).toISOString().slice(0, 10), lastmod, 'Use a valid calendar date.');
    assert.match(release, /^https:\/\/github\.com\/lukejazzdudley-hub\/bnc-site\/(pull\/\d+|commit\/[a-f0-9]{40})$/, 'A confirmed release must support each publication date.');
  }
  return sitemap.replace(/<url>[\s\S]*?<\/url>/g, block => {
    const url = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!updates[url]) return block;
    const tag = `<lastmod>${updates[url].lastmod}</lastmod>`;
    return /<lastmod>/.test(block) ? block.replace(/<lastmod>[^<]*<\/lastmod>/, tag) : block.replace('</loc>', `</loc>${tag}`);
  });
}
