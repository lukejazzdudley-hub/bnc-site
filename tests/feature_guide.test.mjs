import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guide} from '../content/feature-guide.mjs';
import {renderFeatureGuide} from '../scripts/build_feature_guide.mjs';
test('guide covers the requested workflows with usable paths, steps and outcomes',()=>{
 const ids=guide.chapters.map(c=>c.id);
 for(const id of ['voice-memos','import-audio','transcription','syllables','rhyme-inspector','languages','arrange-draft','section-recording','build-in-daw','daw-recording','export-audio'])assert.ok(ids.includes(id));
 assert.equal(ids.length,new Set(ids).size);
 for(const c of guide.chapters){assert.ok(c.where.length>20);assert.ok(c.steps.length>=3);assert.ok(c.result.length>20);}
 const html=renderFeatureGuide(guide);
 for(const c of guide.chapters){assert.ok(html.includes(`id="${c.id}"`));assert.ok(html.includes(`href="#${c.id}"`));}
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.ok(html.includes('datetime="2026-10-16"'));
 assert.ok(html.includes('rel="canonical" href="https://brandnamechanges.com/cadence/guide/"'));
 assert.ok(html.includes('Rhymes on / Rhymes off'));
 assert.ok(html.includes('Priority first'));
 assert.ok(html.includes('Update DAW from draft?'));
 assert.ok(html.includes('silence-padded WAVs'));
 assert.ok(!html.includes('autoplay'));
});
test('guide can be updated without stale hardcoded navigation or unsafe markup',()=>{
 const modified={...guide,checked:'2026-11-01',chapters:[{...guide.chapters[0],id:'new-location',title:'<Tool & location>'}]};
 const html=renderFeatureGuide(modified);
 assert.ok(html.includes('href="#new-location"'));
 assert.ok(html.includes('id="new-location"'));
 assert.ok(html.includes('&lt;Tool &amp; location&gt;'));
 assert.ok(html.includes('datetime="2026-11-01"'));
 assert.ok(!html.includes('<Tool & location>'));
});
test('published guide and entry links survive regeneration',()=>{
 const html=readFileSync(new URL('../cadence/guide/index.html',import.meta.url),'utf8');
 assert.equal(html,renderFeatureGuide(guide));
 for(const file of ['../cadence/index.html','../cadence/resources/index.html','../support.html'])assert.ok(readFileSync(new URL(file,import.meta.url),'utf8').includes('href="/cadence/guide/"'),file);
});
