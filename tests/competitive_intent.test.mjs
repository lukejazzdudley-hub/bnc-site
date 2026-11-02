import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {articles} from '../content/resources/comparisons/index.mjs';
import {acquisitionPages} from '../content/acquisition.mjs';
test('competitive Android advice connects evidence, plan limits and matching destinations',()=>{
 const guide=articles.find(p=>p.slug==='choosing-a-songwriting-app');
 const section=guide.sections.find(s=>s.id==='best-songwriting-app-android');
 assert.ok(section.html.includes('We make Cadence'));
 assert.ok(section.html.includes('requires Pro'));
 assert.ok(section.html.includes('https://songcage.com/mobile/'));
 assert.ok(section.html.includes('https://play.google.com/store/apps/details?id=io.cadenceapp.mobile'));
 const android=acquisitionPages.find(p=>p.slug==='songwriting-app-android');
 assert.ok(android.body.includes('#best-songwriting-app-android'));
 for(const route of ['resources/choosing-a-songwriting-app','songwriting-app-android']){
  const html=readFileSync(new URL(`../cadence/${route}/index.html`,import.meta.url),'utf8');
  for(const [,path,anchor] of html.matchAll(/href="(\/cadence\/[^"#]+\/)#([^"#]+)"/g)){
   const target=readFileSync(new URL(`..${path}index.html`,import.meta.url),'utf8');assert.ok(target.includes(`id="${anchor}"`),`${path}#${anchor}`);
  }
 }
});
