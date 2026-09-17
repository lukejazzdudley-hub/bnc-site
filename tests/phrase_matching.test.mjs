import test from 'node:test';
import assert from 'node:assert/strict';
import { createIndex, findRhymes } from '../cadence/search/rhymes.mjs';
const dictionary = {ice:'AY1 S',cream:'K R IY1 M',i:'AY1',scream:'S K R IY1 M',nice:'N AY1 S',dream:'D R IY1 M',light:'L AY1 T',night:'N AY1 T',all:'AO1 L',insight:'IH1 N S AY2 T',in:'IH0 N',sight:'S AY1 T'};
const index = createIndex(dictionary, {phrases:['ice cream','i scream','nice dream','all night','in sight']});
test('multi-word mode matches sound across a word boundary', () => {
  const results = findRhymes(index,'ice cream','phrase').results;
  assert.ok(results.some(r=>r.word==='i scream' && r.matchedSyllables===2));
  assert.ok(results.some(r=>r.word==='nice dream'));
  assert.ok(!results.some(r=>r.word==='ice cream'));
});
test('single-word input can match a phrase spanning two syllables', () => {
  assert.ok(findRhymes(index,'insight','phrase').results.some(r=>r.word==='in sight'));
});
test('matching only the last word is not a multi-word rhyme', () => {
  assert.equal(findRhymes(index,'light','phrase').results.length,0);
  assert.ok(findRhymes(index,'light','endings').results.some(r=>r.word==='all night'));
});
test('unknown tokens and oversized phrase input fail safely', () => {
  assert.equal(findRhymes(index,'unknown cream','phrase').state,'unknown');
  assert.equal(findRhymes(index,'ice ice ice ice ice ice ice','phrase').state,'invalid');
});
