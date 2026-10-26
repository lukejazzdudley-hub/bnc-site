import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const data=JSON.parse(m[1]);return data['@graph']||[data];});
test('local pages are complete enquiries with accurate location identity',()=>{
 for(const city of ['bristol','london']){
  const html=read(`work-with-us/${city}/index.html`);
  assert.match(html,new RegExp(`<link rel="canonical" href="https://brandnamechanges.com/work-with-us/${city}/">`));
  assert.doesNotMatch(html,/noindex/);assert.match(html,/<form[^>]+method="post"/);assert.match(html,/name="needs"/);
  const service=schemas(html).find(s=>s['@type']==='Service');assert.equal(service.areaServed.name,city==='bristol'?'Bristol':'London');
  assert.equal(service.provider['@id'],'https://brandnamechanges.com/#studio');
  assert.match(read('sitemap.xml'),new RegExp(`/work-with-us/${city}/`));
 }
 assert.match(read('work-with-us/london/index.html'),/based in Bristol/);
 assert.match(read('work-with-us/bristol/index.html'),/based in Bristol/);
});
test('one studio entity is consistent and no fictional business becomes the provider',()=>{
 for(const path of ['index.html','work-with-us/index.html','contact/index.html','work-with-us/bristol/index.html','work-with-us/london/index.html']){
  const org=schemas(read(path)).find(s=>s['@type']==='Organization');assert.ok(org,path);assert.equal(org['@id'],'https://brandnamechanges.com/#studio');assert.equal(org.name,'BNC Studio');assert.equal(org.legalName,'Brand Name Changes Ltd');assert.equal(org.address.addressLocality,'Bristol');assert.equal(org.identifier.value,'17297548');assert.equal(org.address.streetAddress,undefined);assert.ok(read(path).includes('tel:'+org.telephone));
 }
 for(const slug of ['harbour-and-vine','volt-and-co','still-room'])assert.equal(schemas(read(`work-with-us/concepts/${slug}/index.html`)).length,0);
});
test('city pages are discoverable from the main services page and homepage',()=>{
 for(const path of ['index.html','work-with-us/index.html'])for(const city of ['bristol','london'])assert.ok(read(path).includes(`href="/work-with-us/${city}/"`),`${path}: ${city}`);
});
