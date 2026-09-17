// Small public dictionary lookup. The app's proprietary ranking/highlighting is not bundled.
export function normalize(value) {
  return value.trim().toLowerCase().replaceAll('’', "'");
}

export function tail(phones) {
  const parts = phones.split(' ');
  let start = -1;
  for (let i = 0; i < parts.length; i++) if (/[12]$/.test(parts[i])) start = i;
  if (start < 0) for (let i = 0; i < parts.length; i++) if (/\d$/.test(parts[i])) start = i;
  return start < 0 ? null : parts.slice(start).map(p => p.replace(/\d/g, '')).join(' ');
}

export function createIndex(dictionary) {
  const readings = new Map();
  const families = new Map();
  for (const [raw, phones] of Object.entries(dictionary)) {
    const word = raw.replace(/\(\d+\)$/, '');
    if (!/^[a-z]+(?:'[a-z]+)?$/.test(word)) continue;
    const key = tail(phones);
    if (!key) continue;
    if (!readings.has(word)) readings.set(word, new Set());
    readings.get(word).add(key);
    if (!families.has(key)) families.set(key, new Map());
    families.get(key).set(word, { word, syllables: (phones.match(/\d/g) || []).length });
  }
  return { readings, families };
}

export function findRhymes(index, input, mode = 'perfect') {
  const word = normalize(input);
  if (!/^[a-z]+(?:'[a-z]+)?$/.test(word) || word.length > 60) return { state: 'invalid', results: [] };
  const keys = index.readings.get(word);
  if (!keys) return { state: 'unknown', results: [] };
  const matches = new Map();
  for (const key of keys) {
    // Multi-syllabic means at least two matching vowel nuclei, not just a long word.
    const depth = key.split(' ').filter(p => /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p)).length;
    if (mode === 'multi' && depth < 2) continue;
    for (const result of index.families.get(key).values()) if (result.word !== word) matches.set(result.word, result);
  }
  const all = [...matches.values()].sort((a, b) => a.syllables - b.syllables || a.word.localeCompare(b.word));
  return { state: 'known', total: all.length, results: all.slice(0, 150) };
}
