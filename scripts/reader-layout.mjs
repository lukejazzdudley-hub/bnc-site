import { renders } from '../content/resources/visuals.mjs';

const labels = {en:'On this page',fr:'Sur cette page',es:'En esta página',de:'Auf dieser Seite',it:'In questa pagina',pt:'Nesta página',ru:'На этой странице',ar:'في هذه الصفحة',he:'בעמוד זה',ja:'このページの内容',ko:'이 페이지의 내용',hi:'इस पृष्ठ पर',tr:'Bu sayfada',id:'Di halaman ini',ms:'Pada halaman ini',pl:'Na tej stronie',tl:'Sa pahinang ito',vi:'Trên trang này',yo:'On this page',pcm:'On this page'};
const text = html => html.replace(/<[^>]*>/g,'').trim();

// Author-time layout: the document remains complete when JavaScript is disabled.
export function readerLayout(html) {
  if (html.includes('class="reader-page"')) return html;
  const lang = html.match(/<html lang="([^"]+)"/)?.[1] || 'en';
  const label = labels[lang.split('-')[0]] || labels.en;
  let index = 0;
  const used = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const links = [];
  html = html.replace(/<section\b([^>]*class="[^"]*\bcontent\b[^"]*"[^>]*)>\s*<h2([^>]*)>([\s\S]*?)<\/h2>/g, (whole, attrs, headingAttrs, heading) => {
    let id = attrs.match(/\bid="([^"]+)"/)?.[1];
    if (!id) { do { id = `reading-${++index}`; } while (used.has(id)); used.add(id); }
    if (!attrs.match(/\bid="/)) attrs += ` id="${id}"`;
    links.push(`<a href="#${id}">${text(heading)}</a>`);
    return `<section${attrs}><h2${headingAttrs}>${heading}</h2>`;
  });
  if (!links.length) return html;
  const art = `<figure class="reader-art"><img src="${renders.rhyme.src}" alt="${renders.rhyme.alt}" width="900" height="1650" decoding="async"><figcaption lang="en">Cadence workspace illustration · interface varies by version</figcaption></figure>`;
  html = html.replace(/(<section class="hero text-only">[\s\S]*?)<\/div><\/section>/, `$1</div>${art}</section>`);
  const start = html.search(/<section\b[^>]*class="[^"]*\b(?:content|tool)\b/);
  const end = html.indexOf('</main>', start);
  if (start < 0 || end < 0) return html;
  const body = html.slice(start,end);
  const rail = `<aside class="reader-index"><details open><summary>${label}</summary><nav aria-label="${label}">${links.join('')}</nav></details></aside>`;
  html = html.slice(0,start) + `<div class="reader-layout">${rail}<div class="reader-body">${body}</div></div>` + html.slice(end);
  return html.replace('<body>', '<body class="reader-page">')
    .replace('</head>', '<link rel="stylesheet" href="/cadence/search/reader.css"><script type="module" src="/cadence/search/reader.mjs"></script></head>');
}
