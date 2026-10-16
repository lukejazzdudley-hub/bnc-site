import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matchesFeature} from '../cadence/guide/guide.mjs';
import {guide} from '../content/feature-guide.mjs';
import {renderFeatureGuide} from '../scripts/build_feature_guide.mjs';

test('feature lookup handles multiword, case, accents and an empty query',()=>{
 assert.ok(matchesFeature('  VOICE memo  ','Record a voice memo or rough take'));
 assert.ok(matchesFeature('demo','DÉMO recording'));
 assert.ok(matchesFeature('','Anything'));
 assert.ok(!matchesFeature('voice export','Record a voice memo'));
 assert.ok(!matchesFeature('nonsense','Rhyme inspector'));
});
test('navigation enhancement never removes the static instructions or loads 3D upfront',()=>{
 const html=renderFeatureGuide(guide);
 assert.ok(html.includes('id="guide-search"'));
 assert.ok(html.includes('class="guide-model-actions" hidden'));
 assert.ok(html.includes('id="guide-poster"'));
 assert.ok(!html.includes('<model-viewer'));
 for(const id of ['voice-memos','rhyme-inspector','arrange-draft','export-audio']) assert.ok(html.includes(`href="#${id}"`));
 for(const c of guide.chapters) assert.ok(html.includes(c.steps[0].replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));
 const script=readFileSync(new URL('../cadence/guide/guide.mjs',import.meta.url),'utf8');
 assert.ok(script.includes("load.addEventListener('click', async"));
 assert.ok(script.includes("import('/assets/vendor/model-viewer.min.js')"));
 assert.ok(script.includes("navigator.connection?.saveData"));
 assert.ok(script.includes("prefers-reduced-motion: reduce"));
 assert.ok(script.includes("viewer?.remove()"));
 assert.ok(script.includes('request !== generation'));
 assert.ok(!script.includes('localStorage'));
 assert.ok(!script.includes('fetch('));
});

test('lightweight preferences avoid 3D controls and preserve static help',async()=>{
 const {default:vm}=await import('node:vm');
 const elements = new Map();
 const element = key => {
   if (!elements.has(key)) elements.set(key,{hidden:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},focus(){},textContent:''});
   return elements.get(key);
 };
 let connectionChange;
 const reduced={matches:true,addEventListener(type,fn){this.change=fn;}};
 const source=readFileSync(new URL('../cadence/guide/guide.mjs',import.meta.url),'utf8').replace('export function matchesFeature','function matchesFeature');
 vm.runInNewContext(source,{
   document:{querySelector:element,querySelectorAll:()=>[]},
   window:{},matchMedia:()=>reduced,
   navigator:{connection:{saveData:false,addEventListener(type,fn){connectionChange=fn;}}},
   console,
 });
 assert.equal(element('.guide-model-actions').hidden,true);
 assert.equal(element('#guide-poster').hidden,false);
 reduced.matches=false;reduced.change();
 assert.equal(element('.guide-model-actions').hidden,false);
 // A network quality event must not reset a loaded/live control state.
 element('#load-guide-model').hidden=true;
 connectionChange();
 assert.equal(element('#load-guide-model').hidden,true);
 reduced.matches=true;reduced.change();
 assert.equal(element('#load-guide-model').hidden,false);
 assert.equal(element('.guide-model-actions').hidden,true);
});
