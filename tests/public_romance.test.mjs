import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRomanceIndex,searchRomance} from '../cadence/search/romance.mjs';
const index=Object.fromEntries(['fr','es'].map(id=>[id,createRomanceIndex(JSON.parse(readFileSync(new URL(`../cadence/search/public-${id}.json`,import.meta.url))))]));
const positives={fr:[['amour','jour'],['lumière','poussière'],['père','frère'],['cœur','sœur'],['peur','fleur'],['nuit','bruit'],['beau','eau'],['chanson','maison'],['vie','envie'],['mer','terre'],['soleil','sommeil'],['main','pain'],['temps','blanc']],es:[['amor','dolor'],['canción','corazón'],['casa','masa'],['camino','destino'],['vida','herida'],['luna','cuna'],['mirar','soñar'],['mundo','segundo'],['cantar','bailar'],['alegría','poesía'],['canciones','emociones'],['sueño','dueño'],['verdad','ciudad']]};
const negatives={fr:[['père','peur'],['vent','vin'],['bon','banc'],['roue','rue'],['beau','bas'],['amour','amer'],['vie','vert']],es:[['casa','café'],['camino','caminó'],['público','publicó'],['término','terminó'],['libro','cabro'],['canto','cantó'],['canción','canciones']]};
for(const id of ['fr','es']){
 for(const [a,b] of positives[id])test(`${id}: ${a}/${b} shares a perfect ending`,()=>assert.ok(searchRomance(index[id],a,'perfect',10000).results.some(x=>x.word===b)));
 for(const [a,b] of negatives[id])test(`${id}: ${a}/${b} remains distinct`,()=>{assert.equal(searchRomance(index[id],a).state,'ready');assert.equal(searchRomance(index[id],b).state,'ready');assert.ok(!searchRomance(index[id],a,'perfect',10000).results.some(x=>x.word===b));});
}
test('lookup preserves accents and refuses unknown/invalid input',()=>{
 assert.equal(searchRomance(index.es,'xyzzy').state,'unknown');
 assert.equal(searchRomance(index.fr,'<script>').state,'invalid');
 assert.equal(searchRomance(index.es,'a'.repeat(100)).state,'invalid');
 assert.equal(searchRomance(index.fr,' AMOUR ').state,'ready');
});
test('unsupported modes and malformed packs fail closed',()=>{
 assert.throws(()=>createRomanceIndex({id:'ar',entries:[]}));
 assert.throws(()=>createRomanceIndex({id:'fr',entries:[['x',['a'],9,0]]}));
 assert.equal(searchRomance(index.es,'amor','invented').state,'invalid');
});
test('results expose source readings and are capped',()=>{
 const r=searchRomance(index.fr,'amour');assert.ok(r.results.length<=100);
 assert.ok(r.results.every(x=>x.reading&&x.word!=='amour'));
});
test('Spanish assonance keeps tonic vowels while allowing different consonants',()=>{
 assert.ok(searchRomance(index.es,'casa','assonance',10000).results.some(x=>x.word==='cama'));
 assert.ok(!searchRomance(index.es,'casa','perfect',10000).results.some(x=>x.word==='cama'));
});
test('French assonance preserves vowel quality while allowing different tails',()=>{
 assert.ok(searchRomance(index.fr,'amour','assonance',10000).results.some(x=>x.word==='doux'));
 assert.ok(!searchRomance(index.fr,'amour','perfect',10000).results.some(x=>x.word==='doux'));
});
