export function buildSyllableIndex(entries) {
  const counts = new Map();
  for (const [entry, phones] of entries) {
    const word = entry.replace(/\(\d+\)$/, '');
    const count = (phones.match(/[012](?= |$)/g) || []).length;
    if (!count) continue;
    if (!counts.has(word)) counts.set(word, new Set());
    counts.get(word).add(count);
  }
  return counts;
}

export function countLyricLines(text, index) {
  return text.split(/\r?\n/).flatMap((line, number) => {
    const words = line.toLowerCase().replaceAll('’', "'").match(/\p{L}+(?:'\p{L}+)*|\p{N}+/gu) || [];
    if (!words.length) return [];
    let low = 0;
    let high = 0;
    const unknown = new Set();
    for (const word of words) {
      const counts = index.get(word);
      if (!counts) {
        unknown.add(word);
        continue;
      }
      low += Math.min(...counts);
      high += Math.max(...counts);
    }
    return [{ line: number + 1, text: line, low, high, unknown: [...unknown] }];
  });
}
