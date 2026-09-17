import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES,
  appendSitemap,
  buildResourceHub,
  loadArticles,
  renderArticle,
  readingMinutes,
  renderHub,
  validateArticles,
} from '../scripts/build_resource_hub.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function makeArticle(index, overrides = {}) {
  const sourceUrl = `https://example.com/reference-${index}`;
  return {
    slug: `resource-${index}`,
    title: `Practical songwriting resource ${index}`,
    description: `A concrete description for songwriting resource ${index}, with enough detail to distinguish its purpose.`,
    heading: `Make resource ${index} useful.`,
    intro: `A practical introduction for resource ${index}.`,
    category: CATEGORIES[index % CATEGORIES.length],
    sections: [
      {
        id: `section-${index}`,
        heading: `Section ${index}`,
        html: `<p>Evidence-backed guidance for this test. <a href="${sourceUrl}">Read the source</a>.</p>`,
      },
    ],
    sources: [{ title: `Reference ${index}`, url: sourceUrl, checked: '2026-09-17' }],
    ...overrides,
  };
}

function makeArticles() {
  return Array.from({ length: 10 }, (_, index) => makeArticle(index + 1));
}

function writeContentModule(directory, articles) {
  mkdirSync(directory, { recursive: true });
  const modulePath = path.join(directory, 'index.mjs');
  writeFileSync(modulePath, `export const articles = ${JSON.stringify(articles)};\n`);
  return modulePath;
}

function runFilters({ reducedMotion = false } = {}) {
  const listeners = new Map();
  const makeLink = (filter, href, current = false) => {
    const attributes = new Map([['href', href]]);
    if (current) attributes.set('aria-current', 'true');
    return {
      dataset: { resourceFilter: filter },
      addEventListener(type, listener) { listeners.set(`${filter}:${type}`, listener); },
      getAttribute(name) { return attributes.get(name) ?? null; },
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); },
    };
  };
  const links = [
    makeLink('all', '#resource-list', true),
    makeLink('Choose your tools', '#choose-your-tools'),
    makeLink('Improve your writing', '#improve-your-writing'),
    makeLink('Finish your ideas', '#finish-your-ideas'),
  ];
  const topics = [
    { dataset: { resourceTopic: 'Choose your tools' }, hidden: false, querySelectorAll: () => Array(4) },
    { dataset: { resourceTopic: 'Improve your writing' }, hidden: false, querySelectorAll: () => Array(3) },
    { dataset: { resourceTopic: 'Finish your ideas' }, hidden: false, querySelectorAll: () => Array(3) },
  ];
  const status = { textContent: '' };
  const scrollCalls = [];
  const resourceList = { scrollIntoView: (options) => scrollCalls.push(options) };
  const historyCalls = [];
  const context = {
    document: {
      documentElement: { dataset: {} },
      querySelectorAll(selector) {
        if (selector === '[data-resource-filter]') return links;
        if (selector === '[data-resource-topic]') return topics;
        return [];
      },
      querySelector(selector) {
        if (selector === '[data-resource-status]') return status;
        if (selector === '#resource-list') return resourceList;
        return null;
      },
    },
    window: {
      location: { hash: '' },
      matchMedia: () => ({ matches: reducedMotion }),
    },
    history: { replaceState: (...args) => historyCalls.push(args) },
  };
  const source = readFileSync(path.join(root, 'cadence/resources/filters.mjs'), 'utf8');
  vm.runInNewContext(source, context);

  return { historyCalls, links, listeners, scrollCalls, status, topics };
}

test('content loader imports both named article arrays and enforces the final count', async () => {
  const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'cadence-resource-modules-'));
  const articles = makeArticles();
  const guides = writeContentModule(path.join(temporaryRoot, 'guides'), articles.slice(0, 6));
  const comparisons = writeContentModule(path.join(temporaryRoot, 'comparisons'), articles.slice(6));

  const loaded = await loadArticles([guides, comparisons]);
  assert.equal(loaded.length, 10);
  assert.deepEqual(loaded.map(({ slug }) => slug), articles.map(({ slug }) => slug));
});

test('content loader fails closed when a module is missing', async () => {
  await assert.rejects(
    loadArticles(['/tmp/cadence-resource-module-that-does-not-exist.mjs']),
    /Unable to import resource content module/,
  );
});

test('article validation rejects duplicate routes and malformed content', () => {
  const duplicate = makeArticles();
  duplicate[1].slug = duplicate[0].slug;
  assert.throws(() => validateArticles(duplicate), /Duplicate resource slug/);

  const unknownCategory = makeArticles();
  unknownCategory[0].category = 'Invented category';
  assert.throws(() => validateArticles(unknownCategory), /unknown category/);

  const missingNearClaimLink = makeArticles();
  missingNearClaimLink[0].sections[0].html = '<p>A claim without its source link.</p>';
  assert.throws(() => validateArticles(missingNearClaimLink), /must be linked near its supporting claim/);

  const firstPartyRelativeLink = makeArticles();
  firstPartyRelativeLink[0].sources = [{
    title: 'Cadence',
    url: 'https://brandnamechanges.com/cadence/',
    checked: '2026-09-17',
  }];
  firstPartyRelativeLink[0].sections[0].html = '<p>See the <a href="/cadence/">Cadence workspace</a>.</p>';
  assert.doesNotThrow(() => validateArticles(firstPartyRelativeLink));
});

test('hub renders ten crawlable routes, progressive filters and existing resources', () => {
  const html = renderHub(makeArticles());
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /"numberOfItems":10/);
  assert.equal((html.match(/class="resource-card"/g) || []).length, 10);
  assert.equal((html.match(/data-resource-filter=/g) || []).length, 4);
  assert.match(html, /href="#choose-your-tools" data-resource-filter="Choose your tools"/);
  assert.match(html, /href="\/cadence\/songwriting-app\/"/);
  assert.match(html, /href="\/cadence\/rap-writing-app\/"/);
  assert.match(html, /href="\/cadence\/voice-memos-to-lyrics\/"/);
  assert.match(html, /href="\/cadence\/springtime-showers\/"/);
  assert.match(html, /href="\/cadence\/rhyme-finder\/"/);
  assert.doesNotMatch(html, /data-testid|read time|tested by|written by/i);
});

test('article renderer includes accessible contents, section targets, sources and schema', () => {
  const article = makeArticle(1, {
    sections: [
      {
        id: 'first-step',
        heading: 'First step',
        html: '<p>First guidance with <a href="https://example.com/reference-1">the source</a>.</p>',
      },
      {
        id: 'second-step',
        heading: 'Second step',
        html: '<p>Second guidance that builds on the first.</p>',
      },
    ],
  });
  const html = renderArticle(article);

  assert.match(html, /<details open>/);
  assert.match(html, /<nav aria-label="Table of contents">/);
  assert.match(html, /href="#first-step"/);
  assert.match(html, /<section id="first-step"[^>]+aria-labelledby="first-step-heading">/);
  assert.match(html, /<h2 id="sources-heading">Sources<\/h2>/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/brandnamechanges\.com\/cadence\/resources\/resource-1\/">/);
  assert.doesNotMatch(html, /author|datePublished|readingTime/);
});

test('sitemap append preserves existing routes and is idempotent', () => {
  const original = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://brandnamechanges.com/cadence/</loc></url>
  <url><loc>https://brandnamechanges.com/cadence/rhyme-finder/</loc></url>
</urlset>
`;
  const routes = ['/cadence/resources/', '/cadence/resources/resource-1/'];
  const once = appendSitemap(original, routes);
  const twice = appendSitemap(once, routes);

  assert.equal(twice, once);
  assert.match(once, /brandnamechanges\.com\/cadence\/<\/loc>/);
  assert.match(once, /brandnamechanges\.com\/cadence\/rhyme-finder\/<\/loc>/);
  assert.equal((once.match(/cadence\/resources\/resource-1\//g) || []).length, 1);
});

test('builder emits the hub and ten articles without replacing sitemap content', () => {
  const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'cadence-resource-build-'));
  const existingRoute = 'https://brandnamechanges.com/cadence/songwriting-app/';
  writeFileSync(
    path.join(temporaryRoot, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${existingRoute}</loc></url></urlset>\n`,
  );

  const articles = makeArticles();
  const result = buildResourceHub({ rootDir: temporaryRoot, articles });
  const sitemapAfterFirstBuild = readFileSync(path.join(temporaryRoot, 'sitemap.xml'), 'utf8');
  buildResourceHub({ rootDir: temporaryRoot, articles });
  const sitemapAfterSecondBuild = readFileSync(path.join(temporaryRoot, 'sitemap.xml'), 'utf8');

  assert.equal(result.articleCount, 10);
  assert.equal(result.routes.length, 11);
  assert.match(readFileSync(path.join(temporaryRoot, 'cadence/resources/index.html'), 'utf8'), /Songwriting guides/);
  for (const article of articles) {
    assert.match(
      readFileSync(path.join(temporaryRoot, `cadence/resources/${article.slug}/index.html`), 'utf8'),
      new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
  assert.match(sitemapAfterFirstBuild, new RegExp(existingRoute.replaceAll('.', '\\.')));
  assert.equal(sitemapAfterSecondBuild, sitemapAfterFirstBuild);
});

test('every first-party asset referenced by the templates exists', () => {
  const html = `${renderHub(makeArticles())}\n${renderArticle(makeArticle(1))}`;
  const paths = [...html.matchAll(/(?:src|href)="(\/(?:assets|cadence)\/[^"#?]+)"/g)]
    .map((match) => match[1])
    .filter((assetPath) => /\.(?:css|mjs|js|webp)$/.test(assetPath));

  for (const assetPath of new Set(paths)) {
    assert.doesNotThrow(
      () => readFileSync(path.join(root, assetPath)),
      `Expected referenced asset to exist: ${assetPath}`,
    );
  }
});

test('resource styles preserve keyboard focus, reduced motion and mobile reflow', () => {
  const css = readFileSync(path.join(root, 'cadence/resources/resource.css'), 'utf8');
  const filters = readFileSync(path.join(root, 'cadence/resources/filters.mjs'), 'utf8');

  assert.match(css, /:focus-visible/);
  assert.match(css, /\.article-section pre \{[^}]*overflow-x: auto;/);
  assert.match(css, /\.table-scroll \{[^}]*overflow-x: auto;/);
  assert.match(css, /\.table-scroll table \{[^}]*min-width: 620px;/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /\.resource-filter-bar \{[\s\S]*?flex-wrap: wrap;/);
  assert.match(filters, /aria-current/);
  assert.match(renderHub(makeArticles()), /aria-live="polite"/);
});

test('articles expose descriptive titles, reading time and relevant next reads', () => {
  const article = makeArticle(1);
  const related = makeArticle(2, { category: article.category });
  const unrelated = makeArticle(3);
  const html = renderArticle(article, [article, related, unrelated]);
  assert.ok(html.includes(`<h1>${article.title}</h1>`));
  assert.match(html, /Read the guide/);
  assert.equal(readingMinutes(article), 1);
  assert.equal(readingMinutes(makeArticle(4, { sections: [{html: `<p>${'word '.repeat(401)}</p>`}] })), 3);
  const navigation = html.match(/<nav class="article-related"[\s\S]*?<\/nav>/)[0];
  assert.ok(navigation.includes(`/cadence/resources/${related.slug}/`));
  assert.ok(!navigation.includes(`/cadence/resources/${article.slug}/`));
  assert.ok(!navigation.includes(`/cadence/resources/${unrelated.slug}/`));
  assert.ok(!renderArticle(article).includes('class="article-related"'));
});

test('topic filters select a category, hide other sections and announce its result count', () => {
  const filter = runFilters();
  let prevented = false;
  filter.listeners.get('Choose your tools:click')({ preventDefault: () => { prevented = true; } });

  assert.equal(prevented, true);
  assert.deepEqual(filter.topics.map(({ hidden }) => hidden), [false, true, true]);
  assert.equal(filter.status.textContent, 'Showing 4 resources for Choose your tools.');
  assert.equal(filter.links[0].getAttribute('aria-current'), null);
  assert.equal(filter.links[1].getAttribute('aria-current'), 'true');
  assert.deepEqual(filter.historyCalls[0], [null, '', '#choose-your-tools']);
  assert.equal(filter.scrollCalls[0].behavior, 'smooth');
  assert.equal(filter.scrollCalls[0].block, 'start');
});

test('topic filters avoid smooth scrolling when reduced motion is requested', () => {
  const filter = runFilters({ reducedMotion: true });
  filter.listeners.get('Improve your writing:click')({ preventDefault() {} });

  assert.equal(filter.scrollCalls[0].behavior, 'auto');
  assert.equal(filter.scrollCalls[0].block, 'start');
  assert.equal(filter.status.textContent, 'Showing 3 resources for Improve your writing.');
});
