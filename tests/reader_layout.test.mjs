import test from 'node:test';
import assert from 'node:assert/strict';
import {readerLayout} from '../scripts/reader-layout.mjs';
const document = (body,lang='en') => `<html lang="${lang}"><head><title>Example</title></head><body><main id="main">${body}</main></body></html>`;
test('reader retains authored anchors, copy and static navigation',()=>{
 const html=readerLayout(document('<section class="content" id="export-audio"><h2>Export &amp; share</h2><p>Original copy.</p></section><section class="content"><h2>Next step</h2></section>'));
 assert.match(html,/href="#export-audio"/);assert.match(html,/id="export-audio"/);
 assert.match(html,/Original copy/);assert.match(html,/href="#reading-1"/);
 assert.equal(readerLayout(html),html);
 assert.match(html,/<aside class="reader-index">/);
});
test('reader keeps translated section names and labels',()=>{
 const html=readerLayout(document('<section class="content"><h2>Écrire</h2></section>','fr'));
 assert.match(html,/Sur cette page/);assert.match(html,/>Écrire<\/a>/);
});
test('reader leaves pages without reading sections alone',()=>{
 const input=document('<form><input></form>');assert.equal(readerLayout(input),input);
});
test('reader keeps tools before explanatory text and complete without scripts',()=>{
 const html=readerLayout(document('<section class="tool"><form id="rhyme-form"><input name="word"></form></section><section class="content"><h2>Method</h2></section>'));
 assert.ok(html.indexOf('reader-body')<html.indexOf('id="rhyme-form"'));
 assert.ok(html.indexOf('id="rhyme-form"')<html.indexOf('<h2>Method'));
});

test('dictionary workspace can put the tool before navigation without altering the default layout',()=>{
 const source=document('<section class="hero text-only"><div><h1>Search</h1></div></section><section class="tool"><form id="romance-form"></form></section><section class="content"><h2>Examples</h2></section>','es');
 const html=readerLayout(source,{toolFirst:true,illustration:false});
 assert.ok(html.indexOf('id="romance-form"')<html.indexOf('reader-layout'));
 assert.doesNotMatch(html,/reader-art/);
 assert.match(html,/class="reader-page dictionary-page"/);
 assert.equal(readerLayout(html),html);
 assert.match(readerLayout(source),/class="reader-art"/);
});

test('generated IDs cannot collide with authored IDs',()=>{
 const html=readerLayout(document('<section class="content" id="reading-1"><h2>First</h2></section><section class="content"><h2>Second</h2></section>'));
 assert.match(html,/href="#reading-2"/);
 assert.equal((html.match(/id="reading-1"/g)||[]).length,1);
});
