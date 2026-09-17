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

export function createIndex(dictionary, { language = 'en', phrases = [] } = {}) {
  const readings = new Map();
  const families = new Map();
  for (const [raw, phones] of Object.entries(dictionary)) {
    const word = normalize(raw.replace(/\(\d+\)$/, ''), language);
    if (!/^[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)?$/u.test(word)) continue;
    const key = tail(phones);
    if (!key) continue;
    if (!readings.has(word)) readings.set(word, new Set());
    readings.get(word).add(key);
    if (!families.has(key)) families.set(key, new Map());
    families.get(key).set(word, { word, syllables: (phones.match(/\d/g) || []).length });
  }
  const phraseFamilies = new Map();
  for (const raw of phrases) {
    const phrase = normalize(raw, language);
    const words = phrase.split(' ');
    if (words.length < 2 || words.some(word => !readings.has(word))) continue;
    for (const key of readings.get(words.at(-1))) {
      if (!phraseFamilies.has(key)) phraseFamilies.set(key, new Map());
      phraseFamilies.get(key).set(phrase, { word: phrase, phrase: true });
    }
  }
  return { readings, families, phraseFamilies, language };
}

export function findRhymes(index, input, mode = 'perfect') {
  const word = normalize(input, index.language);
  if (!['perfect', 'multi', 'slant', 'phrase'].includes(mode) ||
      !/^[\p{L}\p{M}]+(?:[' ][\p{L}\p{M}]+)*$/u.test(word) || word.length > 60) return { state: 'invalid', results: [] };
  const inputWords = word.split(' ');
  if (inputWords.some(w => !index.readings.has(w))) return { state: 'unknown', results: [] };
  const keys = index.readings.get(inputWords.at(-1));
  if (!keys) return { state: 'unknown', results: [] };
  const matches = new Map();
  for (const key of keys) {
    // Multi-syllabic means at least two matching vowel nuclei, not just a long word.
    const depth = key.split(' ').filter(p => /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p)).length;
    if (mode === 'multi' && depth < 2) continue;
    const candidates = mode === 'phrase' ? index.phraseFamilies.get(key)?.values() || [] : index.families.get(key).values();
    if (mode !== 'slant') for (const result of candidates) {
      if (result.word !== word && !result.word.split(' ').includes(inputWords.at(-1))) matches.set(result.word, result);
    }
    if (mode === 'slant') for (const [other, family] of index.families) {
      if (!nearTail(key, other) || keys.has(other)) continue;
      for (const result of family.values()) {
        if (result.word !== word && ![...index.readings.get(result.word)].some(k => keys.has(k))) matches.set(result.word, result);
      }
    }
  }
  const all = [...matches.values()].sort((a, b) => (a.syllables || 0) - (b.syllables || 0) || a.word.localeCompare(b.word, index.language));
  return { state: 'known', total: all.length, results: all.slice(0, 150) };
}

const isVowel = p => /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p);
export function nearTail(a, b) {
  if (a === b) return false;
  const x = a.split(' '), y = b.split(' ');
  // Preserve vowels and allow one consonant edit; exact matches stay in Perfect.
  if (x.filter(isVowel).join(' ') !== y.filter(isVowel).join(' ')) return false;
  if (Math.abs(x.length - y.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (x.length >= y.length) i++;
    if (y.length >= x.length) j++;
  }
  return edits + (x.length - i) + (y.length - j) === 1;
}
