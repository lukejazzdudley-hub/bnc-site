import test from 'node:test';
import assert from 'node:assert/strict';
import {createRomanceIndex,searchRomance} from '../cadence/search/romance.mjs';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const index=createRomanceIndex({id:'es',entries:[['amor',['o'],0,1],...Array.from({length:205},(_,i)=>['match'+i,['o'],0,1])]});
test('all matches remain reachable in non-overlapping bounded pages',()=>{
 const pages=[0,100,200].map(offset=>searchRomance(index,'amor','perfect',100,offset));
 assert.deepEqual(pages.map(p=>p.results.length),[100,100,5]);
 assert.ok(pages.every(p=>p.total===205));
 assert.equal(new Set(pages.flatMap(p=>p.results.map(r=>r.word))).size,205);
 assert.equal(searchRomance(index,'amor','perfect',100,300).results.length,0);
 for(const offset of [-1,NaN,Infinity,1.5])assert.equal(searchRomance(index,'amor','perfect',100,offset).state,'invalid');
});
for(const locale of ['es','fr'])test(`${locale}: pagination counts, stale responses and new searches`,()=>{
 const elements={};const posts=[];let worker;
 const element=()=>({children:[],hidden:true,disabled:false,textContent:'',setAttribute(){},append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},addEventListener(event,fn){this[event]=fn;}});
 for(const name of ['romance-form','romance-status','romance-results','romance-more'])elements[name]=element();
 const form=elements['romance-form'];form.elements={word:{value:'amor'},mode:{value:'assonance'}};
 vm.runInNewContext(readFileSync(new URL('../cadence/search/romance-tool.mjs',import.meta.url),'utf8'),{
 document:{documentElement:{lang:locale},querySelector:s=>elements[s.slice(1)],querySelectorAll:()=>[],createElement:element},
 Worker:class{constructor(){worker=this;}postMessage(data){posts.push(data);}terminate(){}},setTimeout:()=>1,clearTimeout(){}
 });
 form.submit({preventDefault(){}});assert.equal(posts[0].offset,0);
 const respond=(id,count,total=205)=>worker.onmessage({data:{id,state:'ready',total,results:Array.from({length:count},(_,i)=>({word:'word'+i,reading:'o'}))}});
 respond(1,100);assert.equal(elements['romance-more'].hidden,false);assert.match(elements['romance-status'].textContent,/100.*205/);
 elements['romance-more'].click();assert.equal(posts[1].offset,100);assert.equal(elements['romance-more'].disabled,true);
 respond(1,100);assert.equal(elements['romance-results'].children.length,100);
 respond(2,100);assert.equal(elements['romance-results'].children.length,200);
 elements['romance-more'].click();respond(3,5);assert.equal(elements['romance-more'].hidden,true);assert.match(elements['romance-status'].textContent,/205.*205/);
 form.elements.word.value='vida';form.submit({preventDefault(){}});assert.equal(posts[3].offset,0);assert.equal(elements['romance-results'].children.length,0);
 worker.onerror();assert.equal(elements['romance-more'].hidden,true);assert.match(elements['romance-status'].textContent,/réessayez|inténtalo/);
});
