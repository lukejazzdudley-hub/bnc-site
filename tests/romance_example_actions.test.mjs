import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('editorial examples select their documented mode and bring the search into view; quick examples retain the chosen mode', () => {
  const actions = [];
  const buttons = [
    {dataset: {romanceExample:'amor',romanceMode:'perfect'}},
    {dataset: {romanceExample:'canción'}},
  ].map(button => ({...button, addEventListener(event, handler) {this.click = handler;}}));
  const form = {
    elements: {word: {value:'', focus: () => actions.push('focus')}, mode: {value:'assonance'}},
    addEventListener() {}, requestSubmit: () => actions.push('submit'),
    scrollIntoView: options => {assert.equal(options.behavior, 'instant'); actions.push('scroll');},
  };
  const document = {
    documentElement: {lang:'es'}, querySelector: selector => selector === '#romance-form' ? form : {},
    querySelectorAll: () => buttons,
  };
  vm.runInNewContext(readFileSync(new URL('../cadence/search/romance-tool.mjs', import.meta.url), 'utf8'), {document});
  buttons[0].click();
  assert.equal(form.elements.word.value, 'amor');
  assert.equal(form.elements.mode.value, 'perfect');
  assert.deepEqual(actions, ['scroll', 'focus', 'submit']);
  form.elements.mode.value = 'assonance';
  buttons[1].click();
  assert.equal(form.elements.word.value, 'canción');
  assert.equal(form.elements.mode.value, 'assonance');
  assert.deepEqual(actions, ['scroll', 'focus', 'submit', 'submit']);
});
