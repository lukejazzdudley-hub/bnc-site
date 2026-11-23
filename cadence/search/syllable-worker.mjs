import { loadPack } from './pack-loader.mjs';
import { buildSyllableIndex, countLyricLines } from './syllables.mjs';

let dictionary;
self.onmessage = async ({ data: lyric }) => {
  try {
    dictionary ||= fetch('./packs.json', { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw new Error('Dictionary manifest unavailable');
      return response.json();
    }).then(manifest => loadPack(manifest.en, 'en')).then(pack => buildSyllableIndex(pack.entries));
    self.postMessage({ lines: countLyricLines(lyric, await dictionary) });
  } catch {
    dictionary = undefined;
    self.postMessage({ error: true });
  }
};
