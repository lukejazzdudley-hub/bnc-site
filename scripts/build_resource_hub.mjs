import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {renders, visualGuides} from '../content/resources/visuals.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
export const DOMAIN = 'https://brandnamechanges.com';

export const CATEGORIES = [
  'Choose your tools',
  'Improve your writing',
  'Finish your ideas',
];

export const CONTENT_MODULES = [
  path.join(DEFAULT_ROOT, 'content/resources/guides/index.mjs'),
  path.join(DEFAULT_ROOT, 'content/resources/comparisons/index.mjs'),
];

const CATEGORY_PRESENTATION = {
  'Choose your tools': {
    id: 'choose-your-tools',
    description: 'Pick the workspace that fits the way you write, record and finish.',
    image: renders.library.src,
    imageAlt: 'Cadence song library showing projects and songs',
  },
  'Improve your writing': {
    id: 'improve-your-writing',
    description: 'Work with rhyme, stress and structure without flattening your voice.',
    image: renders.rhyme.src,
    imageAlt: 'Cadence lyric editor with rhyme families beside the draft',
  },
  'Finish your ideas': {
    id: 'finish-your-ideas',
    description: 'Move a lyric or voice memo towards a performance you can hear and share.',
    image: renders.arrange.src,
    imageAlt: renders.arrange.alt,
  },
};

const EXISTING_RESOURCES = [
  {
    href: '/cadence/songwriting-app/',
    title: 'Songwriting app guide',
    description: 'See how lyrics, beats, takes and demos stay connected in Cadence.',
  },
  {
    href: '/cadence/rap-writing-app/',
    title: 'Rap writing workflow',
    description: 'Write against a beat, explore rhyme families and check the delivery.',
  },
  {
    href: '/cadence/voice-memos-to-lyrics/',
    title: 'Voice memos to lyrics',
    description: 'Import a recording, transcribe it on device and develop the draft.',
  },
  {
    href: '/cadence/springtime-showers/',
    title: 'Arrange and DAW walkthrough',
    description: 'Follow a real Cadence song from arrangement into vocal effects.',
  },
  {
    href: '/cadence/rhyme-finder/',
    title: 'Free rhyme finder',
    description: 'Explore perfect, slant, multisyllabic and multi-word English rhymes.',
  },
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function normaliseLinkedUrl(value) {
  const url = new URL(value.replaceAll('&amp;', '&'), DOMAIN);
  const comparable = `${url.origin}${url.pathname}${url.search}`;
  return comparable.endsWith('/') ? comparable.slice(0, -1) : comparable;
}

function linksToSource(html, sourceUrl) {
  const target = normaliseLinkedUrl(sourceUrl);
  return [...html.matchAll(/href=["']([^"']+)["']/g)]
    .some((match) => normaliseLinkedUrl(match[1]) === target);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function validateArticles(articles, expectedCount = 10) {
  assert(Array.isArray(articles), 'Resource articles must be an array.');
  assert(
    articles.length === expectedCount,
    `Expected exactly ${expectedCount} resource articles; received ${articles.length}.`,
  );

  const slugs = new Set();
  for (const [index, article] of articles.entries()) {
    const label = article?.slug || `article ${index + 1}`;
    assert(article && typeof article === 'object', `Invalid ${label}: expected an object.`);
    for (const key of ['slug', 'title', 'description', 'heading', 'intro', 'category']) {
      assert(typeof article[key] === 'string' && article[key].trim(), `Invalid ${label}: ${key} is required.`);
    }
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug), `Invalid ${label}: slug must be lowercase and hyphenated.`);
    assert(!slugs.has(article.slug), `Duplicate resource slug: ${article.slug}.`);
    slugs.add(article.slug);
    assert(article.title.length <= 75, `Invalid ${label}: title exceeds 75 characters.`);
    assert(article.description.length <= 180, `Invalid ${label}: description exceeds 180 characters.`);
    assert(CATEGORIES.includes(article.category), `Invalid ${label}: unknown category "${article.category}".`);
    assert(Array.isArray(article.sections) && article.sections.length > 0, `Invalid ${label}: sections are required.`);
    assert(Array.isArray(article.sources) && article.sources.length > 0, `Invalid ${label}: at least one source is required.`);

    const sectionIds = new Set();
    const articleHtml = article.sections.map((section) => section?.html || '').join('\n');
    for (const section of article.sections) {
      assert(section && typeof section === 'object', `Invalid ${label}: every section must be an object.`);
      assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id || ''), `Invalid ${label}: section IDs must be lowercase and hyphenated.`);
      assert(!sectionIds.has(section.id), `Invalid ${label}: duplicate section ID "${section.id}".`);
      sectionIds.add(section.id);
      assert(typeof section.heading === 'string' && section.heading.trim(), `Invalid ${label}: section heading is required.`);
      assert(typeof section.html === 'string' && section.html.trim(), `Invalid ${label}: section HTML is required.`);
    }

    for (const source of article.sources) {
      assert(source && typeof source === 'object', `Invalid ${label}: every source must be an object.`);
      assert(typeof source.title === 'string' && source.title.trim(), `Invalid ${label}: source title is required.`);
      assert(/^https:\/\//.test(source.url || ''), `Invalid ${label}: source URLs must use HTTPS.`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(source.checked || ''), `Invalid ${label}: source checked date must be YYYY-MM-DD.`);
      assert(
        linksToSource(articleHtml, source.url),
        `Invalid ${label}: source "${source.title}" must be linked near its supporting claim.`,
      );
    }
  }

  return articles;
}

export async function loadArticles(modulePaths = CONTENT_MODULES) {
  const collections = [];
  for (const modulePath of modulePaths) {
    assert(existsSync(modulePath), `Unable to import resource content module ${modulePath}: file does not exist.`);
    const module = await import(pathToFileURL(modulePath).href);
    assert(Array.isArray(module.articles), `Resource content module ${modulePath} must export a named articles array.`);
    collections.push(...module.articles);
  }
  return validateArticles(collections);
}

function renderJsonLd(data) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function renderHead({ title, description, canonical, schema, image = '/assets/cadence/v3/hero-desktop.webp', ogType = 'article' }) {
  const absoluteImage = `${DOMAIN}${image}`;
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Cadence">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${absoluteImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#07090c">
  <link rel="icon" type="image/webp" sizes="256x256" href="/assets/cadence/cadence-mark-static.webp">
  <link rel="stylesheet" href="/cadence/resources/resource.css?v=20260918a">
  <script type="module" src="/cadence/resources/reading.mjs"></script>
  <script type="application/ld+json">${renderJsonLd(schema)}</script>
  <script type="module" src="/cadence/media-policy.js"></script>`;
}

function renderHeader() {
  return `<a class="resource-skip" href="#main">Skip to content</a>
  <header class="resource-header">
    <div class="resource-shell resource-header__inner">
      <a class="resource-brand" href="/cadence/" aria-label="Cadence home">
        <picture aria-hidden="true">
          <source media="(prefers-reduced-motion: reduce)" srcset="/assets/cadence/cadence-mark-static.webp">
          <img src="/assets/cadence/cadence-mark.webp" data-animated-mark data-static-src="/assets/cadence/cadence-mark-static.webp" alt="" width="38" height="38">
        </picture>
        <span>Cadence</span>
      </a>
      <nav aria-label="Main navigation">
        <a aria-current="page" href="/cadence/resources/">Resources</a>
        <a href="/cadence/rhyme-finder/">Rhyme finder</a>
        <a class="resource-header__cta" href="/cadence/#download">Get Cadence</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="resource-footer">
    <div class="resource-shell resource-footer__inner">
      <p><strong>Cadence</strong><span>Tools for your writing. Not writing in your place.</span></p>
      <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/support">Support</a>
        <a href="/cadence/feedback/">Send feedback</a>
      </nav>
    </div>
  </footer>`;
}

export function readingMinutes(article) {
  const text = article.sections.map(section => section.html).join(' ').replace(/<[^>]*>/g, ' ');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/u).length / 200));
}

function renderArticleCard(article) {
  return `<article class="resource-card" data-resource-card>
    <p>${readingMinutes(article)} min read</p>
    <h3><a href="/cadence/resources/${article.slug}/">${escapeHtml(article.title)}</a></h3>
    <div>${escapeHtml(article.description)}</div>
    <span aria-hidden="true">Read the guide</span>
  </article>`;
}

function itemListSchema(articles) {
  return articles.map((article, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: article.title,
    url: `${DOMAIN}/cadence/resources/${article.slug}/`,
  }));
}

export function renderHub(articles) {
  validateArticles(articles);
  const title = 'Songwriting resources: practical guides and comparisons | Cadence';
  const description = 'Practical guides for writing lyrics, finding rhymes, organising voice memos, choosing songwriting tools and finishing a song demo.';
  const canonical = `${DOMAIN}/cadence/resources/`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: articles.length,
        itemListElement: itemListSchema(articles),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Cadence', item: `${DOMAIN}/cadence/` },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: canonical },
      ],
    },
  ];

  const categorySections = CATEGORIES.map((category) => {
    const presentation = CATEGORY_PRESENTATION[category];
    const categoryArticles = articles.filter((article) => article.category === category);
    return `<section class="resource-topic" id="${presentation.id}" data-resource-topic="${escapeHtml(category)}" aria-labelledby="${presentation.id}-heading">
      <div class="resource-topic__heading">
        <div><h2 id="${presentation.id}-heading">${escapeHtml(category)}</h2><div>${escapeHtml(presentation.description)}</div></div>
        <img src="${presentation.image}" alt="${escapeHtml(presentation.imageAlt)}" loading="lazy" width="900" height="1650">
      </div>
      <div class="resource-grid">${categoryArticles.map(renderArticleCard).join('')}</div>
    </section>`;
  }).join('');

  const filters = [
    { label: 'All topics', href: '#resource-list', filter: 'all' },
    ...CATEGORIES.map((category) => ({
      label: category,
      href: `#${CATEGORY_PRESENTATION[category].id}`,
      filter: category,
    })),
  ].map(({ label, href, filter }, index) => `<a href="${href}" data-resource-filter="${escapeHtml(filter)}"${index === 0 ? ' aria-current="true"' : ''}>${escapeHtml(label)}</a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  ${renderHead({ title, description, canonical, schema, ogType: 'website' })}
  <script type="module" src="/cadence/resources/filters.mjs"></script>
</head>
<body class="resource-page resource-hub">
  ${renderHeader()}
  <main id="main">
    <section class="resource-hero resource-shell" aria-labelledby="resource-title">
      <div class="resource-hero__copy">
        <p class="resource-breadcrumb"><a href="/cadence/">Cadence</a><span aria-hidden="true">/</span>Resources</p>
        <h1 id="resource-title">Start anywhere.<br>Make it a song.</h1>
        <p>Practical guides for the messy middle of songwriting—from choosing a workspace and shaping a rhyme to turning a voice memo into a demo.</p>
        <div class="resource-actions"><a href="#resource-list">Browse the guides</a><a href="/cadence/rhyme-finder/">Try the free rhyme finder</a></div>
      </div>
      <figure class="resource-hero__evidence">
        <picture>
          <img src="${renders.library.src}" alt="${renders.library.alt}" width="900" height="1650">
        </picture>
        <figcaption>Real Cadence workspace</figcaption>
      </figure>
    </section>

    <div class="resource-filter-wrap">
      <nav class="resource-shell resource-filter-bar" aria-label="Filter resources by topic">${filters}</nav>
      <p class="resource-shell resource-filter-status" data-resource-status aria-live="polite">Showing all ${articles.length} new resources.</p>
    </div>

    <div class="resource-shell resource-list" id="resource-list">${categorySections}</div>

    <section class="resource-shell resource-existing" aria-labelledby="existing-heading">
      <div class="resource-existing__intro">
        <p>Tools and walkthroughs</p>
        <h2 id="existing-heading">Start with something you can use now.</h2>
      </div>
      <div class="resource-existing__list">${EXISTING_RESOURCES.map((resource) => `<a href="${resource.href}"><strong>${escapeHtml(resource.title)}</strong><span>${escapeHtml(resource.description)}</span></a>`).join('')}</div>
    </section>

    <aside class="resource-shell resource-product" aria-label="Continue in Cadence">
      <div><p>From page to playback</p><h2>Keep the lyric, beat and take in one place.</h2></div>
      <a href="/cadence/">See the Cadence workspace</a>
    </aside>
  </main>
  ${renderFooter()}
</body>
</html>\n`;
}

function renderSources(sources) {
  return `<section class="article-sources" aria-labelledby="sources-heading">
    <h2 id="sources-heading">Sources</h2>
    <ol>${sources.map((source) => `<li><a href="${escapeHtml(source.url)}" rel="noopener">${escapeHtml(source.title)}</a><span>Checked ${escapeHtml(source.checked)}</span></li>`).join('')}</ol>
  </section>`;
}

function articleImage(category) {
  if (category === 'Improve your writing') {
    return {
      src: renders.rhyme.src,
      alt: 'Cadence lyric editor with highlighted rhyme families and suggestions',
    };
  }
  if (category === 'Finish your ideas') {
    return {
      src: renders.arrange.src,
      alt: renders.arrange.alt,
    };
  }
  return {
    src: renders.library.src,
    alt: 'Cadence library showing songwriting projects and songs',
  };
}

export function renderFieldNote(guide) {
  if (!guide) return '';
  const image = renders[guide.image];
  return `<aside id="workflow-in-practice" class="field-note" aria-label="${escapeHtml(guide.title)}">
    <figure><img src="${image.src}" alt="${escapeHtml(image.alt)}" width="900" height="1650" loading="lazy"><figcaption>Cadence workflow illustration. Interface may vary by version.</figcaption></figure>
    <div><h2>${escapeHtml(guide.title)}</h2><ol class="workflow-route">${guide.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p>${escapeHtml(guide.takeaway)}</p><a href="${guide.href}">${escapeHtml(guide.action)}</a></div>
  </aside>`;
}

export function renderArticle(article, allArticles = []) {
  validateArticles([article], 1);
  const canonical = `${DOMAIN}/cadence/resources/${article.slug}/`;
  const title = `${article.title} | Cadence`;
  const image = articleImage(article.category);
  const guide = visualGuides[article.slug];
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      mainEntityOfPage: canonical,
      image: `${DOMAIN}${image.src}`,
      publisher: {
        '@type': 'Organization',
        name: 'Brand Name Changes',
        url: DOMAIN,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Cadence', item: `${DOMAIN}/cadence/` },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${DOMAIN}/cadence/resources/` },
        { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
      ],
    },
  ];
  const contents = article.sections.map((section, index) => `${guide && index === 2 ? '<li><a href="#workflow-in-practice">The workflow in practice</a></li>' : ''}<li><a href="#${section.id}">${escapeHtml(section.heading)}</a></li>`).join('');
  const related = allArticles.filter(candidate => candidate.slug !== article.slug && candidate.category === article.category).slice(0, 2);
  const sections = article.sections.map((section, index) => `${index === 2 ? renderFieldNote(guide) : ''}<section id="${section.id}" class="article-section" aria-labelledby="${section.id}-heading">
    <h2 id="${section.id}-heading">${escapeHtml(section.heading)}</h2>
    ${section.html}
  </section>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  ${renderHead({ title, description: article.description, canonical, schema, image: image.src })}
</head>
<body class="resource-page resource-article">
  <div class="reading-progress" aria-hidden="true"></div>
  ${renderHeader()}
  <main id="main">
    <header class="article-hero resource-shell">
      <div class="article-hero__copy">
        <p class="resource-breadcrumb"><a href="/cadence/">Cadence</a><span aria-hidden="true">/</span><a href="/cadence/resources/">Resources</a><span aria-hidden="true">/</span>${escapeHtml(article.category)}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p>${escapeHtml(article.intro)}</p>
        <div class="resource-actions"><a href="#${article.sections[0].id}">Read the guide</a><span>${readingMinutes(article)} min read</span></div>
      </div>
      <figure>
        <img src="${image.src}" alt="${escapeHtml(image.alt)}" width="900" height="1650">
        <figcaption>A complete workspace for the idea.</figcaption>
      </figure>
    </header>

    <div class="article-layout resource-shell">
      <aside class="article-rail">
        <details open>
          <summary>On this page</summary>
          <nav aria-label="Table of contents"><ol>${contents}</ol></nav>
        </details>
        <a class="article-rail__back" href="/cadence/resources/">All resources</a>
      </aside>
      <article class="article-body">
        ${sections}
        ${renderSources(article.sources)}
        ${related.length ? `<nav class="article-related" aria-label="Related guides"><h2>Keep exploring</h2>${related.map(candidate => `<a href="/cadence/resources/${candidate.slug}/">${escapeHtml(candidate.title)}</a>`).join('')}</nav>` : ''}
        <aside class="article-next">
          <p>Keep the idea moving</p>
          <h2>Your next song can start anywhere.</h2>
          <p>A beat, a bar or a freestyle. Import, write or record first—then keep the takes, arrangement and demo connected in Cadence.</p>
          <a href="/cadence/">Explore Cadence</a>
        </aside>
      </article>
    </div>
  </main>
  ${renderFooter()}
</body>
</html>\n`;
}

export function appendSitemap(sitemap, routes) {
  assert(typeof sitemap === 'string' && sitemap.includes('</urlset>'), 'Sitemap must contain a closing </urlset> tag.');
  let next = sitemap;
  const additions = [];
  for (const route of routes) {
    const url = `${DOMAIN}${route}`;
    if (!next.includes(`<loc>${url}</loc>`)) additions.push(`  <url><loc>${url}</loc></url>`);
  }
  if (additions.length === 0) return next;
  const separator = next.includes('\n</urlset>') ? '' : '\n';
  return next.replace('</urlset>', `${separator}${additions.join('\n')}\n</urlset>`);
}

export function writeResourcePages({ rootDir = DEFAULT_ROOT, articles }) {
  validateArticles(articles);
  const resourcesDir = path.join(rootDir, 'cadence/resources');
  mkdirSync(resourcesDir, { recursive: true });
  writeFileSync(path.join(resourcesDir, 'index.html'), renderHub(articles));

  for (const article of articles) {
    const articleDir = path.join(resourcesDir, article.slug);
    mkdirSync(articleDir, { recursive: true });
    writeFileSync(path.join(articleDir, 'index.html'), renderArticle(article, articles));
  }

  return { articleCount: articles.length };
}

export function buildResourceHub({ rootDir = DEFAULT_ROOT, articles }) {
  const result = writeResourcePages({ rootDir, articles });

  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const routes = ['/cadence/resources/', ...articles.map((article) => `/cadence/resources/${article.slug}/`)];
  writeFileSync(sitemapPath, appendSitemap(sitemap, routes));
  return { ...result, routes };
}

async function main() {
  const articles = await loadArticles();
  const result = buildResourceHub({ articles });
  console.log(`Built the Cadence resource hub, ${result.articleCount} articles and ${result.routes.length} sitemap routes.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
