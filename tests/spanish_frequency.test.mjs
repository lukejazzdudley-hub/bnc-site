import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRomanceIndex,searchRomance} from '../cadence/search/romance.mjs';
const pack=JSON.parse(readFileSync(new URL('../cadence/search/public-es.json',import.meta.url)));
const index=createRomanceIndex(pack);
test('Spanish ranks attested common words ahead of obscure length neighbours',()=>{
 const r=searchRomance(index,'amor','assonance').results.map(x=>x.word);
 assert.ok(r.indexOf('yo')>=0 && r.indexOf('yo')<10);
 assert.ok(r.includes('corazón'));
 assert.ok(!r.slice(0,10).includes('atol'));
});
test('frequency enrichment preserves all source pronunciations and accents',()=>{
 const baseline=JSON.parse(readFileSync(new URL('../content/research/spanish-ranking-baseline.json',import.meta.url)));
 assert.equal(pack.entries.length,baseline.entries);
 assert.equal(createHash('sha256').update(JSON.stringify(pack.entries.map(r=>r.slice(0,3)))).digest('hex'),baseline.pronunciation_sha256);
 assert.ok(pack.entries.filter(r=>r[3]>0).length>50000);
 assert.equal(new Set(pack.entries.map(r=>r[0])).size,baseline.words);
 for(const word of ['camino','caminó','público','publicó']) assert.equal(searchRomance(index,word).state,'ready');
 assert.equal(pack.ranking.version,'3.1.1');
 assert.equal(pack.ranking.license,'CC-BY-SA-4.0');
 assert.match(pack.ranking.attribution,/Robyn Speer/);
});
test('ranking changes order, not the candidate set, for both rhyme modes',()=>{
 const old=createRomanceIndex({...pack,entries:pack.entries.map(r=>[...r.slice(0,3),0])});
 for(const word of ['amor','vida','canción','casa','alegría','camino','caminó']) for(const mode of ['perfect','assonance']) {
  const words=i=>{const first=searchRomance(i,word,mode,10000);let all=[...first.results];for(let offset=10000;offset<first.total;offset+=10000)all.push(...searchRomance(i,word,mode,10000,offset).results);return all.map(x=>x.word).sort();};
  assert.deepEqual(words(index),words(old),`${word}/${mode}`);
 }
});
