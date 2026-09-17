import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const wordListPath = process.argv[2];
if (!wordListPath) throw new Error('Pass the extracted word-list@4.1.0 directory');
const words = new Set(readFileSync(path.join(wordListPath, 'words.txt'), 'utf8').split(/\r?\n/));
// Ordinary English forms absent from the word-game list, not a name whitelist.
for (const word of ['a', 'i', "don't", "can't", "won't", "isn't", "I'm", "it's", "you're", "we're", "they're"]) words.add(word.toLowerCase());
const dictionary = JSON.parse(readFileSync(new URL('../cadence/search/dictionary.json', import.meta.url)));
const modules = process.argv[4];
const {default: spellingDictionary} = await import(pathToFileURL(path.resolve(modules, 'dictionary-en/index.js')));
const {default: nspell} = await import(pathToFileURL(path.resolve(modules, 'nspell/lib/index.js')));
const spelling = nspell(spellingDictionary);
// Common English loanword missing from the spelling source, explicitly reviewed.
const supplements = new Set(['chai']);
const entries = Object.entries(dictionary).filter(([word, phones]) => {
  const base = word.replace(/\(\d+\)$/, '');
  return words.has(base) && /[aeiouy]/.test(base) && (base.length > 1 || ['a','i'].includes(base)) &&
    (spelling.correct(base) || supplements.has(base)) && /^[A-Z0-9 ]+$/.test(phones);
});
const phrases = JSON.parse(readFileSync(new URL('../cadence/search/phrases-en.json', import.meta.url)));
const sourceFrequencies = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const frequencies = Object.fromEntries(entries.map(([word]) => {
  const base = word.replace(/\(\d+\)$/, '');
  return [base, sourceFrequencies[base]];
}));
if (entries.some(([word]) => !Number.isFinite(frequencies[word.replace(/\(\d+\)$/, '')]))) throw new Error('Missing word frequency');
const bytes = JSON.stringify({ id: 'en', entries, phrases, frequencies });
writeFileSync(new URL('../cadence/search/pack-en.json', import.meta.url), bytes);
const sha256 = createHash('sha256').update(bytes).digest('hex');
writeFileSync(new URL('../cadence/search/packs.json', import.meta.url), JSON.stringify({ en: { url: '/cadence/search/pack-en.json', sha256, bytes: Buffer.byteLength(bytes), source: 'CMU 3.0.0, word-list 4.1.0, dictionary-en 4.0.0, wordfreq 3.1.1; original editorial phrases' } }, null, 2) + '\n');
console.log(JSON.stringify({ entries: entries.length, phrases: phrases.length, bytes: Buffer.byteLength(bytes), sha256 }));
