import test from 'node:test';import assert from 'node:assert/strict';
import {sourceGroup,storeFor,eventPayload,startMeasurement} from '../cadence/search/measurement.mjs';
test('source grouping discards full URLs, queries and identifying campaign values',()=>{
 assert.equal(sourceGroup('https://google.fr/search?q=private'),'google');
 assert.equal(sourceGroup('https://bing.com/?q=private'),'bing');
 assert.equal(sourceGroup('https://brandnamechanges.com/cadence/'),'direct');
 assert.equal(sourceGroup('','?utm_source=private@example.com'),'campaign');
 assert.equal(sourceGroup('invalid'),'direct');
});
test('only exact known store destinations count',()=>{
 assert.equal(storeFor('https://apps.apple.com/gb/app/id6778554520'),'apple');
 assert.equal(storeFor('https://play.google.com/store/apps/details?id=io.cadenceapp.mobile'),'google');
 assert.equal(storeFor('https://apps.apple.com.evil/app/id6778554520'),null);
 assert.equal(storeFor('https://apps.apple.com/app/id67785545209'),null);
 assert.equal(storeFor('https://apps.apple.com/app/id6778554520/other'),null);
 assert.equal(storeFor('https://play.google.com/store/apps/details?id=other'),null);
});
test('payload has bounded aggregate dimensions only',()=>{
 assert.deepEqual(eventPayload('/cadence/','google','view'),{route:'/cadence/',source:'google',event:'view',store:'none'});
 assert.equal(eventPayload('/cadence/?q=private','direct','view'),null);
 assert.equal(eventPayload('/cadence/','private','view'),null);
});
test('no document body produces no request',()=>{startMeasurement({},{});});
function fixture({consent=null,dnt=false,gpc=false}={}){
 const nodes=[];const clicks={};const calls=[];const memory=new Map(consent?[['cadence-website-counts',consent]]:[]);
 const node=()=>{const n={children:[],handlers:{},append(...x){this.children.push(...x);},setAttribute(){},addEventListener(type,fn){this.handlers[type]=fn;},focus(){}};nodes.push(n);return n;};
 const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 const doc={body:{append(){}},documentElement:{lang:'en'},referrer:'https://google.com/search?q=secret',createElement:node,addEventListener:(type,fn)=>clicks[type]=fn};
 const win={location:{pathname:'/cadence/',search:'?private=hidden'},navigator:{doNotTrack:dnt?'1':'0',globalPrivacyControl:gpc},localStorage:storage,sessionStorage:storage,fetch:(_u,opts)=>{calls.push(JSON.parse(opts.body));return Promise.resolve({ok:true});}};
 startMeasurement(win,doc);return {nodes,calls,clicks,memory};
}
test('no counts before opt-in; accepting counts once and keeps sensitive fields out',()=>{
 const f=fixture();assert.equal(f.calls.length,0);
 f.nodes.find(n=>n.textContent==='Allow counts').handlers.click();assert.equal(f.calls.length,1);
 assert.equal(JSON.stringify(f.calls).includes('secret'),false);assert.equal(JSON.stringify(f.calls).includes('hidden'),false);
 f.clicks.click({target:{closest:()=>({href:'https://apps.apple.com/app/id6778554520'})}});
 assert.equal(f.calls.length,2);
 f.clicks.click({target:{closest:()=>({href:'https://apps.apple.com/app/id6778554520'})}});assert.equal(f.calls.length,2);
 f.nodes.find(n=>n.textContent==='No thanks').handlers.click();
 f.clicks.click({target:{closest:()=>({href:'https://play.google.com/store/apps/details?id=io.cadenceapp.mobile'})}});assert.equal(f.calls.length,2);
});
for(const preference of [{consent:'deny'},{consent:'allow',dnt:true},{consent:'allow',gpc:true}])test('decline/privacy signals prevent collection '+JSON.stringify(preference),()=>{const f=fixture(preference);assert.equal(f.calls.length,0);});
