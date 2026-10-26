import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateEnquiry} from '../work-with-us/enquiry-model.mjs';
const valid={name:'A Person',email:'person@example.test',business:'Example',website:'',needs:['Website'],message:'A new booking website.',company_fax:'',started_at:''};
test('native submissions work without a timing field; invalid data never passes',()=>{
 assert.deepEqual(validateEnquiry(valid),{});
 for(const [field,value] of [['name',''],['business',''],['email','broken'],['message',''],['website','javascript:alert(1)']])assert.ok(validateEnquiry({...valid,[field]:value})[field]);
 assert.ok(validateEnquiry({...valid,needs:['Unrecognised']}).needs);
 assert.ok(validateEnquiry({...valid,message:'a'.repeat(4001)}).message);
});
test('optional website accepts only a public web URL',()=>{
 assert.deepEqual(validateEnquiry({...valid,website:'https://example.test/path'}),{});
 assert.ok(validateEnquiry({...valid,website:'https://user:password@example.test'}).website);
});
test('service and contact share the exact same generated form',()=>{
 const services=readFileSync('work-with-us/index.html','utf8'), contact=readFileSync('contact/index.html','utf8');
 const form=s=>s.match(/<form[\s\S]*?<\/form>/)[0];
 assert.equal(form(services),form(contact));
 assert.match(form(services),/method="post"/); assert.match(form(services),/name="company_fax"/);
 assert.match(services,/We build the digital side of your business/);
});
test('fictional previews are excluded from search and sitemap',()=>{
 const sitemap=readFileSync('sitemap.xml','utf8');
 for(const slug of ['harbour-and-vine','volt-and-co','still-room']) {
  const html=readFileSync(`work-with-us/concepts/${slug}/index.html`,'utf8');
  assert.match(html,/noindex/); assert.match(html,/Concept for a fictional business/); assert.match(html,/This is a demo/);
  assert.ok(!sitemap.includes(`/concepts/${slug}`));
 }
 for(const path of ['/work-with-us/','/contact/']) assert.ok(sitemap.includes(`https://brandnamechanges.com${path}`));
});
