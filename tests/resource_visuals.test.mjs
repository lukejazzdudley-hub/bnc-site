import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';
import {renders, visualGuides} from '../content/resources/visuals.mjs';
import {loadArticles, renderArticle} from '../scripts/build_resource_hub.mjs';

test('every article has a topic-specific complete-device illustration with a useful route', async () => {
  const articles = await loadArticles();
  assert.equal(Object.keys(visualGuides).length, articles.length);
  for (const article of articles) {
    const guide = visualGuides[article.slug];
    assert.ok(guide, article.slug);
    assert.equal(guide.steps.length, 3);
    assert.ok(renders[guide.image]);
    const html = renderArticle(article, articles);
    assert.match(html, /class="field-note"/);
    assert.match(html, /Interface may vary by version/);
    assert.doesNotMatch(html, /\/assets\/cadence\/screens\//);
    assert.ok(html.includes(guide.href));
  }
  for (const render of Object.values(renders)) {
    assert.ok(existsSync(new URL(`..${render.src}`, import.meta.url)), render.src);
  }
});

test('reading enhancement highlights current section without changing content or scrolling', () => {
  let callback;
  const links = ['#one', '#two'].map(href => ({attrs: {href}, getAttribute(k) {return this.attrs[k];}, setAttribute(k,v) {this.attrs[k]=v;}, removeAttribute(k) {delete this.attrs[k];}}));
  const sections = [{id:'one'}, {id:'two'}];
  const observed = [];
  const source = readFileSync(new URL('../cadence/resources/reading.mjs', import.meta.url), 'utf8');
  const context = {document: {querySelectorAll: selector => selector === '.article-section, .field-note' ? sections : links}, window: {IntersectionObserver: true}, IntersectionObserver: class {constructor(cb) {callback=cb;} observe(s) {observed.push(s);}}};
  vm.runInNewContext(source, context);
  assert.equal(observed.length, 2);
  callback([{isIntersecting:true, target:sections[0], boundingClientRect:{top:140}}]);
  assert.equal(links[0].attrs['aria-current'], 'location');
  callback([{isIntersecting:true, target:sections[1], boundingClientRect:{top:150}}]);
  assert.equal(links[0].attrs['aria-current'], undefined);
  assert.equal(links[1].attrs['aria-current'], 'location');
  callback([]);
  assert.equal(links[1].attrs['aria-current'], 'location');
  assert.doesNotThrow(()=>vm.runInNewContext(source, {...context,window:{}}));
});

test('device art stays uncropped and scroll motion is opt-in to motion preference', () => {
  const css = readFileSync(new URL('../cadence/resources/resource.css', import.meta.url), 'utf8');
  assert.match(css, /\.article-hero figure img \{[^}]*object-fit: contain/s);
  assert.match(css, /\.resource-topic__heading img \{[^}]*object-fit: contain/s);
  assert.match(css, /prefers-reduced-motion: no-preference[\s\S]*animation-timeline: view\(\)/);
  assert.match(css, /\.field-note img \{[^}]*object-fit: contain/s);
});
