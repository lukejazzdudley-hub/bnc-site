import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSyllableIndex, countLyricLines} from '../cadence/search/syllables.mjs';

const pack = JSON.parse(readFileSync(new URL('../cadence/search/pack-en.json', import.meta.url), 'utf8'));
const index = buildSyllableIndex(pack.entries);

test('the published lyric example agrees with the public pronunciation data', () => {
  const lyrics = 'The last train left at midnight\r\n\r\nI heard the drums through the rain';
  assert.deepEqual(countLyricLines(lyrics, index).map(({line,low,high,unknown}) => [line,low,high,unknown]), [
    [1,7,7,[]], [3,7,7,[]],
  ]);
});

test('line counts preserve pronunciation ranges, contractions and unknown words', () => {
  const sample = buildSyllableIndex([
    ['fire','F AY1 R'], ['fire(2)','F AY1 ER0'], ["can't",'K AE1 N T'],
  ]);
  assert.deepEqual(countLyricLines('Fire, can’t! 808 rzx', sample), [
    {line:1,text:'Fire, can’t! 808 rzx',low:2,high:3,unknown:['808','rzx']},
  ]);
  assert.deepEqual(countLyricLines('… \n', sample), []);
});
