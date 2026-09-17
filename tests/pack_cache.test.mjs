import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loadPack,verifyResponse} from '../cadence/search/pack-loader.mjs';
const raw = JSON.stringify({id:'en',entries:[['light','L AY1 T']],phrases:[],frequencies:{light:5}});
const descriptor = {url:'/pack.json',sha256:createHash('sha256').update(raw).digest('hex')};
function environment(t,{cache,fetcher}={}) {
  const before = ['self','caches','fetch'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]);
  t.after(()=>{for(const [key,value] of before) { if(value) Object.defineProperty(globalThis,key,value); else delete globalThis[key]; }});
  Object.defineProperty(globalThis,'self',{configurable:true,value:{location:{href:'https://example.com/tool',origin:'https://example.com'}}});
  Object.defineProperty(globalThis,'caches',{configurable:true,value:{open:async()=>{if(!cache)throw Error('storage denied');return cache;}}});
  Object.defineProperty(globalThis,'fetch',{configurable:true,value:fetcher || (async()=>new Response(raw))});
}
test('storage denied still allows a verified network search',async t=>{
  environment(t);assert.equal((await loadPack(descriptor,'en')).id,'en');
});
test('verified cache works offline without network access',async t=>{
  environment(t,{cache:{match:async()=>new Response(raw)},fetcher:async()=>{throw Error('must not fetch');}});
  assert.equal((await loadPack(descriptor,'en')).id,'en');
});
test('corrupt cache is replaced only after network validation',async t=>{
  let deleted=false,stored=false;
  environment(t,{cache:{match:async()=>new Response('{}'),delete:async()=>{deleted=true;},put:async(_,r)=>{assert.equal(await r.text(),raw);stored=true;},keys:async()=>[]}});
  await loadPack(descriptor,'en');assert.ok(deleted&&stored);
});
test('cache eviction keeps at most three packs',async t=>{
  const deleted=[];
  environment(t,{cache:{match:async()=>undefined,put:async()=>{},keys:async()=>['old1','old2','new1','new2','current'],delete:async key=>deleted.push(key)}});
  await loadPack(descriptor,'en');assert.deepEqual(deleted,['old1','old2']);
});
test('bad integrity never enters cache and a subsequent retry succeeds',async t=>{
  let count=0,stored=0;
  environment(t,{cache:{match:async()=>undefined,put:async()=>stored++,keys:async()=>[]},fetcher:async()=>new Response(count++ ? raw : '{}')});
  await assert.rejects(loadPack(descriptor,'en'),/integrity/);assert.equal(stored,0);
  await loadPack(descriptor,'en');assert.equal(stored,1);
});
test('unapproved origins, missing release and oversized responses fail closed',async t=>{
  environment(t,{fetcher:async()=>{throw Error('must not fetch');}});
  await assert.rejects(loadPack({...descriptor,url:'https://other.example/data'},'en'),/host/);
  await assert.rejects(loadPack(undefined,'es'),/Unreleased/);
  await assert.rejects(verifyResponse(new Response('{}',{headers:{'content-length':'16000001'}}),descriptor,'en'),/large/);
});
