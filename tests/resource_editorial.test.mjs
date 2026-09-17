import test from 'node:test';
import assert from 'node:assert/strict';
import {articles as guides} from '../content/resources/guides/index.mjs';
import {articles as comparisons} from '../content/resources/comparisons/index.mjs';
import {buyingTools} from '../content/resources/comparisons/buyers.mjs';

test('buying guide compares eleven named tools with source links and a disclosed editorial recommendation', () => {
  assert.equal(buyingTools.length, 11);
  assert.equal(new Set(buyingTools.map(t => t[0])).size, 11);
  const guide = comparisons[0];
  const html = guide.sections.map(s => s.html).join(' ');
  for (const [name, url, fit, strength, caveat] of buyingTools) {
    assert.ok(html.includes(`href="${url}">${name}</a>`), name);
    assert.ok(fit && strength && caveat, name);
  }
  assert.match(html, /We make Cadence/);
  assert.match(html, /not a hands-on benchmark/);
  assert.match(html, /aria-label="Compare 11 songwriting apps"/);
  assert.equal(guide.sections[0].heading, 'Start with a beat, a bar or a freestyle.');
  assert.match(html, /Our artist-workflow pick/);
  assert.match(html, /Import beats/);
  assert.doesNotMatch(html, /lyric-first pick|recommendation for lyric-first/);
  assert.doesNotMatch(html, /AggregateRating|tested for six weeks/);
});

test('approved content map contains six guides and four comparisons with substantive distinct sections', () => {
  assert.equal(guides.length, 6);
  assert.equal(comparisons.length, 4);
  const all = [...guides, ...comparisons];
  assert.equal(new Set(all.map(a => a.slug)).size, 10);
  for (const article of all) {
    assert.ok(article.sections.length >= 4, article.slug);
    const prose = article.sections.map(s => s.html.replace(/<[^>]*>/g, ' ')).join(' ');
    assert.ok(prose.split(/\s+/).length >= 700, article.slug);
    assert.doesNotMatch(prose, /lorem ipsum|TODO|TBD/);
    for (const section of article.sections) {
      const tables = (section.html.match(/<table>/g) || []).length;
      const wrappers = (section.html.match(/class="table-scroll" tabindex="0" role="region" aria-label="[^"]+"/g) || []).length;
      assert.equal(tables, wrappers, `${article.slug}: every table needs a named keyboard-scrollable region`);
      assert.doesNotMatch(section.html, /<th>/, `${article.slug}: table header scope required`);
    }
  }
});

test('review corrections remain explicit in comparisons and lyric examples', () => {
  const bandlab = comparisons.find(a => a.slug === 'cadence-vs-bandlab');
  const copy = bandlab.sections.map(s => s.html).join(' ');
  assert.match(copy, /Membership/);
  assert.match(copy, /32/);
  assert.match(copy, /16/);
  assert.ok(bandlab.sources.some(s => s.url.includes('Track-and-Project-Duration-Limits')));
  const stress = guides.find(a => a.slug === 'syllables-stress-and-flow');
  assert.doesNotMatch(stress.sections.map(s => s.html).join(' '), /“The morning stays outside my window”/);
  const rhyme = guides.find(a => a.slug === 'perfect-slant-multisyllabic-rhymes');
  assert.doesNotMatch(rhyme.sections.map(s => s.html).join(' '), /Room\/storm/i);
});
