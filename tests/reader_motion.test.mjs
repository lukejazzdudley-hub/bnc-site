import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../cadence/search/reader.mjs',import.meta.url),'utf8');
for(const config of [{reduce:true,save:false},{reduce:false,save:true}]){
 test(`reading links stay native without loading Motion (reduce=${config.reduce}, saveData=${config.save})`,async()=>{
  let click;let loads=0;const attributes={};
  const link={hash:'#lesson',setAttribute:(k,v)=>attributes[k]=v,removeAttribute:k=>delete attributes[k],addEventListener:(_,fn)=>click=fn};
  const context={document:{querySelectorAll:()=>[link],getElementById:()=>({id:'lesson'}),querySelector:()=>null,createElement:()=>({}),head:{append:()=>loads++}},matchMedia:()=>({matches:config.reduce}),navigator:{connection:{saveData:config.save}},window:{}};
  vm.runInNewContext(source,context);await click();
  assert.equal(loads,0);assert.equal(attributes['aria-current'],'location');
 });
}
