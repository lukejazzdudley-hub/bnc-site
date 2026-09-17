// Small public dictionary lookup. The app's proprietary ranking/highlighting is not bundled.
export function normalize(value, language = 'en') {
  return value.normalize('NFC').trim().toLocaleLowerCase(language).replaceAll('’', "'").replace(/\s+/g, ' ');
}

export function tail(phones) {
  const parts = phones.split(' ');
  let start = -1;
  for (let i = 0; i < parts.length; i++) if (/[12]$/.test(parts[i])) start = i;
  if (start < 0) for (let i = 0; i < parts.length; i++) if (/\d$/.test(parts[i])) start = i;
  return start < 0 ? null : parts.slice(start).map(p => p.replace(/\d/g, '')).join(' ');
}

export function createIndex(dictionary, { language = 'en', phrases = [], frequencies = null } = {}) {
  const readings = new Map();
  const families = new Map();
  const pronunciations = new Map();
  for (const [raw, phones] of Object.entries(dictionary)) {
    const word = normalize(raw.replace(/\(\d+\)$/, ''), language);
    if (!/^[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)?$/u.test(word)) continue;
    if (!pronunciations.has(word)) pronunciations.set(word, new Set());
    pronunciations.get(word).add(phones.replace(/\d/g, ''));
    // Preserve reduced forms for phrase interiors, not standalone rhyme targets.
    if (!/[12](?: |$)/.test(phones)) continue;
    const key = tail(phones);
    if (!key) continue;
    if (!readings.has(word)) readings.set(word, new Set());
    readings.get(word).add(key);
    if (!families.has(key)) families.set(key, new Map());
    families.get(key).set(word, { word, syllables: (phones.match(/\d/g) || []).length });
  }
  const phraseFamilies = new Map();
  const phraseSounds = new Map();
  for (const raw of phrases) {
    const phrase = normalize(raw, language);
    const words = phrase.split(' ');
    if (words.length < 2 || words.some(word => !pronunciations.has(word))) continue;
    phraseSounds.set(phrase, phraseSignatures(pronunciations, words, true));
    for (const key of readings.get(words.at(-1)) || []) {
      if (!phraseFamilies.has(key)) phraseFamilies.set(key, new Map());
      phraseFamilies.get(key).set(phrase, { word: phrase, phrase: true });
    }
  }
  return { readings, families, phraseFamilies, phraseSounds, pronunciations, language, frequencies };
}

// Compare 2–4 vowel nuclei across an actual word boundary, retaining consonants.
// Bound pronunciation combinations so unfamiliar input cannot explode work.
function phraseSignatures(pronunciations, words, mustCrossBoundary = false) {
  if (words.length > 6) return [];
  let variants = [{phones:[], lastStart:0}];
  for (const word of words) {
    const next = [];
    for (const prefix of variants) {
      for (const reading of pronunciations.get(word) || []) {
        next.push({phones:[...prefix.phones, ...reading.split(' ')], lastStart:prefix.phones.length});
        if (next.length >= 32) break;
      }
      if (next.length >= 32) break;
    }
    variants = next;
  }
  const found = new Map();
  for (const {phones, lastStart} of variants) {
    const vowels = phones.flatMap((p,i) => isVowel(p) ? [i] : []);
    for (let depth = 2; depth <= Math.min(4, vowels.length); depth++) {
      const start = vowels.at(-depth);
      if (mustCrossBoundary && start >= lastStart) continue;
      const key = phones.slice(start).join(' ');
      found.set(key, {key, depth});
    }
  }
  return [...found.values()];
}

export function findRhymes(index, input, mode = 'perfect') {
  const word = normalize(input, index.language);
  if (!['perfect', 'multi', 'slant', 'phrase', 'endings'].includes(mode) ||
      !/^[\p{L}\p{M}]+(?:[' ][\p{L}\p{M}]+)*$/u.test(word) || word.length > 60) return { state: 'invalid', results: [] };
  const inputWords = word.split(' ');
  if (inputWords.length > 6) return {state:'invalid',results:[]};
  if (mode === 'phrase') return findPhraseRhymes(index, word, inputWords);
  if (inputWords.some(w => !index.readings.has(w))) return { state: 'unknown', results: [] };
  const keys = index.readings.get(inputWords.at(-1));
  if (!keys) return { state: 'unknown', results: [] };
  const matches = new Map();
  const usage = candidate => index.frequencies ? Math.min(...candidate.split(' ').map(w => index.frequencies[w] || 0)) : 0;
  const add = (result, distance = 0) => {
    const frequency = usage(result.word);
    // About 1.6 occurrences per million words. Query lookup remains unrestricted.
    if (index.frequencies && frequency < 3.2) return;
    const previous = matches.get(result.word);
    if (!previous || distance < previous.distance) matches.set(result.word, {...result, frequency, distance});
  };
  for (const key of keys) {
    // Multi-syllabic means at least two matching vowel nuclei, not just a long word.
    const depth = key.split(' ').filter(p => /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p)).length;
    if (mode === 'multi' && depth < 2) continue;
    const candidates = mode === 'endings' ? index.phraseFamilies.get(key)?.values() || [] : index.families.get(key).values();
    if (mode !== 'slant') for (const result of candidates) {
      if (result.word !== word && !result.word.split(' ').includes(inputWords.at(-1))) add(result);
    }
    if (mode === 'slant') for (const [other, family] of index.families) {
      const distance = slantDistance(key, other);
      if (!Number.isFinite(distance) || keys.has(other)) continue;
      for (const result of family.values()) {
        if (result.word !== word && ![...index.readings.get(result.word)].some(k => keys.has(k))) add(result, distance);
      }
    }
  }
  const score = r => r.frequency - 2 * r.distance;
  const all = [...matches.values()].sort((a, b) => score(b) - score(a) || (a.syllables || 0) - (b.syllables || 0) || a.word.localeCompare(b.word, index.language));
  return { state: 'known', total: all.length, results: all.slice(0, 150) };
}

function findPhraseRhymes(index, query, words) {
  if (words.some(w => !index.pronunciations.has(w))) return {state:'unknown',results:[]};
  const sounds = phraseSignatures(index.pronunciations, words);
  const results = [];
  for (const [phrase, candidates] of index.phraseSounds) {
    if (phrase === query) continue;
    const frequency = index.frequencies ? Math.min(...phrase.split(' ').map(w=>index.frequencies[w] || 0)) : 0;
    if (index.frequencies && frequency < 3.2) continue;
    let best;
    for (const a of sounds) for (const b of candidates) {
      if (a.depth !== b.depth) continue;
      const distance = a.key === b.key ? 0 : slantDistance(a.key,b.key);
      if (!Number.isFinite(distance)) continue;
      if (!best || a.depth > best.matchedSyllables || (a.depth === best.matchedSyllables && distance < best.distance)) {
        best = {word:phrase,phrase:true,matchedSyllables:a.depth,distance,frequency};
      }
    }
    if (best) results.push(best);
  }
  results.sort((a,b)=>b.matchedSyllables-a.matchedSyllables || a.distance-b.distance || b.frequency-a.frequency || a.word.localeCompare(b.word,index.language));
  return {state:'known',total:results.length,results:results.slice(0,150)};
}

const isVowel = p => /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p);
export function nearTail(a, b) {
  return Number.isFinite(slantDistance(a, b));
}

export function slantDistance(a, b) {
  if (a === b) return Infinity;
  const x = a.split(' '), y = b.split(' ');
  if (x.filter(isVowel).join(' ') !== y.filter(isVowel).join(' ')) return Infinity;
  if (Math.abs(x.length - y.length) > 1) return Infinity;
  // A bare vowel is assonance, not a close consonant-tail match.
  if (!x.some(p => !isVowel(p)) || !y.some(p => !isVowel(p))) return Infinity;
  let i = 0, j = 0, edits = 0;
  let distance = 0.7;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { i++; j++; continue; }
    if (++edits > 1) return Infinity;
    if (x.length === y.length) {
      if (isVowel(x[i]) || isVowel(y[j])) return Infinity;
      const pair = [x[i], y[j]].sort().join(' ');
      const voicedPairs = new Set(['B P', 'D T', 'G K', 'F V', 'S Z', 'SH ZH', 'DH TH', 'CH JH']);
      const stops = new Set(['P','B','T','D','K','G']);
      const obstruents = new Set([...stops, 'F','V','S','Z','SH','ZH','TH','DH','CH','JH']);
      if (voicedPairs.has(pair)) distance = 0.2;
      else if (stops.has(x[i]) && stops.has(y[j])) distance = 0.5;
      else if (obstruents.has(x[i]) && obstruents.has(y[j])) distance = 0.9;
      else return Infinity;
    }
    if (x.length >= y.length) i++;
    if (y.length >= x.length) j++;
  }
  return edits + (x.length - i) + (y.length - j) === 1 ? distance : Infinity;
}
