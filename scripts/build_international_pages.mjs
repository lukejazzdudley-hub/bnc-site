import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from '../content/locales.mjs';
import { regions, productFaqs } from '../content/regions.mjs';
import { appendSitemap } from './build_resource_hub.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const domain = 'https://brandnamechanges.com';
const productUrl = `${domain}/cadence/`;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const regionPath = region => `/cadence/regions/${region.code}/`;
const alternates = [
  `<link rel="alternate" hreflang="x-default" href="${productUrl}">`,
  `<link rel="alternate" hreflang="en" href="${productUrl}">`,
  ...locales.map(locale => `<link rel="alternate" hreflang="${locale.code}" href="${domain}/cadence/${locale.code}/">`),
  ...regions.map(region => `<link rel="alternate" hreflang="${region.language}" href="${domain}${regionPath(region)}">`),
].join('\n  ');
const faqSchema = faqs => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
});
const faqHtml = faqs => faqs.map(faq => `<details><summary>${escape(faq.question)}</summary><p>${escape(faq.answer)}</p></details>`).join('\n');
const localApple = region => `https://apps.apple.com/${region.code}/app/cadence-lyrics-rhymes/id6778554520`;
const localGoogle = region => `https://play.google.com/store/apps/details?id=io.cadenceapp.mobile&hl=en&gl=${region.code.toUpperCase()}`;
const storeLinks = region => `<div class="actions"><a class="button primary" href="${localApple(region)}">${escape(region.shortName)} App Store</a><a class="button" href="${escape(localGoogle(region))}">Google Play · ${escape(region.shortName)}</a></div>`;
const regionLinks = current => `<nav class="region-links" aria-label="Choose a country or region"><a href="/cadence/">Global English</a>${regions.map(region => `<a href="${regionPath(region)}" lang="${region.language}"${region.code === current ? ' aria-current="page"' : ''}>${escape(region.name)}</a>`).join('')}</nav>`;
const mark = `<picture aria-hidden="true"><source media="(prefers-reduced-motion: reduce)" srcset="/assets/cadence/cadence-mark-nav-static.webp"><img src="/assets/cadence/cadence-mark-nav.webp" data-animated-mark data-static-src="/assets/cadence/cadence-mark-nav-static.webp" alt="" width="36" height="36"></picture>`;

function render({ title, description, canonical, language = 'en', body, schema, regional = false }) {
  return `<!doctype html>
<html lang="${language}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
${regional ? alternates : ''}
  <meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Cadence"><meta property="og:image" content="${domain}/assets/cadence/share-card-v1.png"><meta property="og:image:alt" content="Cadence songwriting workspace"><meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#08090c"><meta name="apple-itunes-app" content="app-id=6778554520">
  <link rel="icon" type="image/webp" href="/assets/cadence/cadence-mark-static.webp">
  <link rel="stylesheet" href="/cadence/search/search.css"><link rel="stylesheet" href="/cadence/regions/regions.css">
  <script type="application/ld+json">${json(schema)}</script>
  <script type="module" src="/cadence/media-policy.js"></script>
<script type="module" src="/cadence/search/measurement.mjs"></script></head><body><a class="skip" href="#main">Skip to content</a>
  <header><div class="shell"><a class="brand" href="/cadence/">${mark}Cadence</a><nav aria-label="Main"><a href="/cadence/resources/">Resources</a><a href="/cadence/rhyme-finder/">Rhyme finder</a><a href="/cadence/regions/">Downloads by region</a><a href="/cadence/languages/">Languages</a></nav></div></header>
  <main class="shell" id="main">${body}</main>
  <footer><div class="shell"><p>Flow by Cadence · Cadence by Brand Name Changes</p>${regionLinks()}<nav aria-label="Footer"><a href="/support">Support</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/delete-account">Delete account</a></nav></div></footer>
</body></html>\n`;
}

const hubBody = `<section class="hero region-hero"><div><p class="crumb"><a href="/cadence/">Cadence</a> / Downloads by region</p><h1>Your song.<br>Your storefront.</h1><p class="intro">Find Cadence on your local App Store or Google Play. Keep lyrics, rhyme ideas, beats and vocal takes together, from the first idea to a demo.</p><p>Flow by Cadence brings you to the same Cadence app. Choose a region for storefront links, currency guidance and practical writing notes.</p></div><figure class="region-phone"><img src="/assets/cadence/resources/01-library-neutral.webp" width="900" height="1664" alt="Cadence song library on a silver phone"><figcaption>The same songwriting workspace, wherever you start.</figcaption></figure></section>
<section class="content"><h2>Choose your country or region</h2><p>These six English-language guides link to local storefronts. They do not add separate app versions, language packs or regional rhyme dictionaries.</p><div class="region-directory">${regions.map(region => `<article><h3><a href="${regionPath(region)}">${escape(region.name)}</a></h3><p>${escape(region.focus)}</p><p class="note">${region.language} · ${region.currency}</p>${storeLinks(region)}</article>`).join('')}</div></section>
<section class="content"><h2>Writing from somewhere else?</h2><p><a href="${productUrl}#download">Open the global Cadence download links.</a> Your store account and device determine the listing and plans you can access. This first set of guides is not a list of every country where Cadence is available.</p><p>For language support and system requirements, read the current store listing. The <a href="/cadence/rhyme-finder/">free web rhyme finder</a> currently uses American English pronunciations; its dictionary is separate from the app.</p></section>`;
mkdirSync(path.join(root, 'cadence/regions'), { recursive: true });
writeFileSync(path.join(root, 'cadence/regions/index.html'), render({
  title: 'Cadence downloads by country | Flow by Cadence',
  description: 'Find Cadence in your local App Store or Google Play. English guides for the UK, US, Canada, Australia, India and South Africa, with practical writing notes.',
  canonical: `${domain}/cadence/regions/`, body: hubBody,
  schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Cadence downloads by country', url: `${domain}/cadence/regions/`, hasPart: regions.map(region => ({ '@type': 'WebPage', name: `Cadence in ${region.name}`, url: `${domain}${regionPath(region)}` })) },
}));

for (const region of regions) {
  const title = `Songwriting app in ${region.shortName === 'US' ? 'the US' : region.shortName === 'UK' ? 'the UK' : region.shortName} | Cadence`;
  const canonical = `${domain}${regionPath(region)}`;
  const faqs = [
    { question: `Where can I download Cadence in ${region.name === 'United Kingdom' || region.name === 'United States' ? 'the ' : ''}${region.name}?`, answer: `Use the ${region.name} App Store listing for iPhone and iPad, or the Google Play link on this page for Android. The store checks compatibility and availability for your account and device.` },
    { question: `How do I check the local Cadence Pro price?`, answer: region.purchase },
    productFaqs[4], productFaqs[5],
  ];
  const body = `<section class="hero region-hero"><div><p class="crumb"><a href="/cadence/">Cadence</a> / <a href="/cadence/regions/">Regions</a> / ${escape(region.name)}</p><p class="note">Cadence for songwriters in ${region.name.startsWith('United') ? 'the ' : ''}${escape(region.name)}</p><h1>${escape(region.heading)}</h1><p class="intro">Start with a beat, a bar or a freestyle. Keep your lyrics, rhyme ideas, vocal takes and demo in one songwriting app for iPhone, iPad and Android.</p>${storeLinks(region)}<p class="note">Local storefront links · ${region.currency} for eligible local accounts</p></div><figure class="region-phone"><img src="/assets/cadence/resources/02-lyrics-rhyme-three-quarter.webp" width="900" height="1650" alt="Cadence lyric editor and rhyme suggestions on a silver phone"><figcaption>Rhyme choices stay beside your lyric.</figcaption></figure></section>
  <section class="content"><h2>${escape(region.focus)}</h2>${region.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}<p><a href="/cadence/rhyme-finder/">Try the free English rhyme finder</a> or <a href="/cadence/resources/${region.next}/">${escape(region.nextTitle.toLowerCase())}</a>.</p></section>
  <section class="content"><p class="note">Original writing exercise</p><h2>Make one take before you revise.</h2><p>${escape(region.exercise)}</p><p>Keep the first take, revise the line and record a second version. Compare the two in the context of the song. You can keep writing in <a href="/cadence/songwriting-app/">Cadence’s connected songwriting workflow</a>.</p></section>
  <section class="content"><h2>Download and check your plan</h2><p>${escape(region.purchase)}</p><p>Start with three free notes. Pro unlocks unlimited new work and the complete Draft-to-DAW workflow, including vocal FX and exports. A web page cannot confirm the offer or device requirements for every account; read the listing before installing.</p>${storeLinks(region)}<p class="note">Apple listing checked 16 October 2026. Your store account and device determine availability.</p></section>
  <section class="content region-faq"><h2>Before you start</h2>${faqHtml(faqs)}<p><a href="/support">Get help with Cadence</a> · <a href="/cadence/resources/">Browse the songwriting guides</a></p></section>
  <section class="content"><h2>Choose another region</h2>${regionLinks(region.code)}<p class="note">These are English-language guides. Flow by Cadence is a secondary name for Cadence, not a separate app.</p></section>`;
  const directory = path.join(root, 'cadence/regions', region.code);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, 'index.html'), render({
    title, description: region.description, canonical, language: region.language, body, regional: true,
    schema: [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: region.description, url: canonical, inLanguage: region.language, about: { '@type': 'SoftwareApplication', '@id': `${productUrl}#app`, name: 'Cadence', alternateName: 'Flow by Cadence', operatingSystem: 'iOS, iPadOS, Android', applicationCategory: 'MultimediaApplication', url: productUrl } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Cadence', item: productUrl }, { '@type': 'ListItem', position: 2, name: 'Regions', item: `${domain}/cadence/regions/` }, { '@type': 'ListItem', position: 3, name: region.name, item: canonical }] },
      faqSchema(faqs),
    ],
  }));
}

const languageDirectory = `<section class="hero text-only"><div><p class="crumb"><a href="/cadence/">Cadence</a> / Languages</p><h1>Write in the language of your song.</h1><p class="intro">App language packs, website languages and the free browser tool are different. Choose the page that explains the support you need.</p></div></section>
<section class="content"><h2>Read about Cadence in your language</h2><nav class="region-links" aria-label="Product languages"><a href="/cadence/" lang="en">English</a>${locales.map(locale => `<a href="/cadence/${locale.code}/" lang="${locale.code}" hreflang="${locale.code}">${locale.name}</a>`).join('')}</nav><p>French and Spanish introductions explain writing to a beat, recording takes and language packs. The detailed resource guides are currently in English.</p></section>
<section class="content"><h2>App packs are separate from interface language</h2><p>English is built in. Cadence’s app catalog includes 20 downloadable language packs, including French and Spanish. Download the packs you need while connected. The pronunciation-based rhyme engine runs on device. A rhyme pack does not mean every app screen is translated or every recording can be transcribed accurately.</p><p>Check a suggestion aloud in your own pronunciation. Language support does not remove accent, vocabulary or performance differences. <a href="https://play.google.com/store/apps/details?id=io.cadenceapp.mobile">Read the current store description</a> and check the app’s language picker before relying on a specific pack.</p></section>
<section class="content"><h2>Choose a free browser rhyme tool</h2><p><a href="/cadence/fr/dictionnaire-rimes/" lang="fr">Dictionnaire de rimes français</a> · <a href="/cadence/es/diccionario-rimas/" lang="es">Diccionario de rimas en español</a>. These independent public dictionaries are separate from app language packs; read each tool’s source and pronunciation limits.</p><p>The <a href="/cadence/rhyme-finder/">browser rhyme finder</a> uses American English dictionary pronunciations and a limited original phrase bank. The web tool and app have separate engines. These translated pages do not add French or Spanish results to that browser tool.</p><p>For your device, <a href="/cadence/songwriting-app-android/">read the Android guide</a>. For storefront links and currency guidance, <a href="/cadence/regions/">choose your country or region</a>. For a beat-first session, <a href="/cadence/type-beat-songwriting-app/">try the type-beat writing workflow</a>.</p></section>`;
mkdirSync(path.join(root, 'cadence/languages'), {recursive:true});
writeFileSync(path.join(root, 'cadence/languages/index.html'), render({title:'Songwriting languages: French, Spanish & app packs | Cadence', description:'Explore Cadence in French and Spanish. Understand downloadable app language packs, interface language and the English-only free browser rhyme finder.', canonical:`${domain}/cadence/languages/`, body:languageDirectory, schema:{'@context':'https://schema.org','@type':'CollectionPage',name:'Cadence writing languages',url:`${domain}/cadence/languages/`,hasPart:locales.map(locale => ({'@type':'WebPage',inLanguage:locale.code,url:`${domain}/cadence/${locale.code}/`}))}}));
for (const locale of locales) {
  const canonical = `${domain}/cadence/${locale.code}/`;
  const languageNav = `<a href="/cadence/" lang="en">English</a>${locales.map(item => `<a href="/cadence/${item.code}/" lang="${item.code}"${item.code === locale.code ? ' aria-current="page"' : ''}>${item.name}</a>`).join('')}`;
  const stores = `<div class="actions"><a class="button primary" href="https://play.google.com/store/apps/details?id=io.cadenceapp.mobile&amp;hl=${locale.code}">${locale.playStore}</a><a class="button" href="https://apps.apple.com/app/id6778554520">${locale.appStore}</a></div>`;
  const body = `<section class="hero text-only"><div><h1>${escape(locale.heading)}</h1><p class="intro">${escape(locale.intro)}</p>${stores}</div></section>${locale.sections.map(section => `<section class="content"><h2>${escape(section.heading)}</h2>${section.html}</section>`).join('')}<section class="content region-faq"><h2>${locale.questions}</h2>${faqHtml(locale.faqs)}${stores}</section>`;
  let html = render({title:locale.title,description:locale.description,canonical,language:locale.code,body,regional:true,schema:[{'@context':'https://schema.org','@type':'WebPage',name:locale.title,url:canonical,inLanguage:locale.code,about:{'@id':`${productUrl}#app`}}, {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Cadence',item:productUrl},{'@type':'ListItem',position:2,name:locale.name,item:canonical}]},faqSchema(locale.faqs)]});
  html = html.replace('Skip to content',locale.main).replace(/<nav aria-label="Main">[\s\S]*?<\/nav>/, `<nav aria-label="${locale.languages}">${languageNav}</nav>`).replace(/<footer>[\s\S]*?<\/footer>/, `<footer><div class="shell"><p>Flow by Cadence · Brand Name Changes</p><nav class="region-links" aria-label="${locale.languages}">${languageNav}</nav><nav aria-label="${locale.nav}"><a href="/support" lang="en">${locale.support} (English)</a><a href="/privacy" lang="en">${locale.privacy} (English)</a><a href="/terms" lang="en">${locale.terms} (English)</a></nav></div></footer>`);
  mkdirSync(path.join(root, 'cadence',locale.code), {recursive:true});
  writeFileSync(path.join(root,'cadence',locale.code,'index.html'),html);
}

// Replace only owned sections; preserve the accepted product copy and media.
const productPath = path.join(root, 'cadence/index.html');
let product = readFileSync(productPath, 'utf8');
product = product.replace(/<script type="application\/ld\+json">(.*?)<\/script>/g, (tag, raw) => {
  const data = JSON.parse(raw);
  if (data['@type'] !== 'SoftwareApplication') return tag;
  data.alternateName = 'Flow by Cadence';
  data['@id'] = `${productUrl}#app`;
  return `<script type="application/ld+json">${json(data)}</script>`;
});
const head = `<!-- international-seo:start -->\n  ${alternates}\n  <script type="application/ld+json">${json(faqSchema(productFaqs))}</script>\n  <link rel="stylesheet" href="/cadence/regions/regions.css">\n  <!-- international-seo:end -->`;
product = product.includes('<!-- international-seo:start -->')
  ? product.replace(/<!-- international-seo:start -->[\s\S]*?<!-- international-seo:end -->/, head)
  : product.replace('</head>', `${head}\n</head>`);
const section = `<!-- product-faq:start -->\n<section class="cadence-faq wrap" aria-labelledby="faq-title"><p class="cadence-label">Flow by Cadence</p><h2 id="faq-title">Before your next song.</h2><p>Cadence connects the lyric, beat, take and demo. <a href="/cadence/regions/">Choose your local download guide</a> or start with the questions below.</p><nav class="region-links" aria-label="Find your writing workflow"><a href="/cadence/type-beat-songwriting-app/">Write to type beats</a><a href="/cadence/songwriting-app-android/">Cadence for Android</a><a href="/cadence/song-structure/">Song structure</a><a href="/cadence/freestyle-rap-practice/">Freestyle practice</a><a href="/cadence/languages/">Languages · Français · Español</a></nav>${faqHtml(productFaqs)}</section>\n<!-- product-faq:end -->`;
product = product.includes('<!-- product-faq:start -->')
  ? product.replace(/<!-- product-faq:start -->[\s\S]*?<!-- product-faq:end -->/, section)
  : product.replace('  </main>', `${section}\n  </main>`);
writeFileSync(productPath, product);
const sitemapPath = path.join(root, 'sitemap.xml');
writeFileSync(sitemapPath, appendSitemap(readFileSync(sitemapPath, 'utf8'), ['/cadence/regions/', ...regions.map(regionPath), '/cadence/languages/', ...locales.map(locale => `/cadence/${locale.code}/`)]));
console.log(`Built ${regions.length} regional editions, download directory, product FAQs and reciprocal hreflang.`);
