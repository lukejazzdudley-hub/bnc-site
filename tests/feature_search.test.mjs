import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {featureSearchPages} from '../content/feature-search.mjs';
import {guide} from '../content/feature-guide.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('feature intent pages are indexable and reachable with real internal destinations',()=>{
 const sitemap=read('sitemap.xml');const routes=read('supabase/functions/cadence-search-events/routes.ts');
 assert.equal(new Set(featureSearchPages.map(p=>p.slug)).size,4);
 for(const page of featureSearchPages){
  const route=`/cadence/${page.slug}/`;const html=read(route.slice(1)+'index.html');
  assert.ok(sitemap.includes(`https://brandnamechanges.com${route}`));
  assert.ok(routes.includes(route));assert.ok(read('cadence/songwriting-app/index.html').includes(`href="${route}"`));
  assert.ok(html.includes(`rel="canonical" href="https://brandnamechanges.com${route}"`));
  assert.equal((html.match(/<h1>/g)||[]).length,1);assert.doesNotMatch(html,/name="robots" content="noindex/);
  for(const match of page.body.matchAll(/href="(\/[^"#]*)(?:#([^"]+))?"/g)){
   const target=match[1].slice(1)+(match[1].endsWith('/')?'index.html':'.html');
   assert.ok(existsSync(new URL('../'+target,import.meta.url)),target);
   if(match[2])assert.ok(read(target).includes(`id="${match[2]}"`),match[0]);
  }
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m=>JSON.parse(m[1]));
  const faq=schemas.find(s=>s['@type']==='FAQPage');
  for(const entry of faq.mainEntity){assert.ok(html.includes(entry.name));assert.ok(html.includes(entry.acceptedAnswer.text));}
 }
});
test('new workflows have searchable manual chapters with version and scope limits',()=>{
 for(const id of ['production-notes','listen-offline','writing-activity']){
  const chapter=guide.chapters.find(c=>c.id===id);assert.ok(chapter);assert.ok(chapter.steps.length>=3);
  assert.match(chapter.tip,/23 October 2026/);
  assert.ok(read('cadence/guide/index.html').includes(`href="#${id}"`));
 }
 assert.ok(read('cadence/guide/index.html').includes('"dateModified":"2026-10-23"'));
 const pages=featureSearchPages.map(p=>p.body).join('\n');
 assert.match(pages,/not a native project transfer/);assert.match(pages,/App-open time/);
 assert.match(pages,/saved locally/);assert.match(pages,/does not supply a royalty-free/);
});
