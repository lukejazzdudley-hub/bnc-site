import { createIndex, findRhymes } from './rhymes.mjs';
import { loadPack } from './pack-loader.mjs';
import { languageById } from './languages.mjs';
let pending;
let activeLanguage;
self.onmessage = async ({ data }) => {
  try {
    if (!languageById(data.language)?.available) {
      self.postMessage({ id: data.id, state: 'unavailable', results: [] });
      return;
    }
    if (activeLanguage && activeLanguage !== data.language) throw new Error('Switch requires a fresh worker');
    activeLanguage = data.language;
    pending ||= fetch('./packs.json', { cache: 'no-cache' }).then(r => {
      if (!r.ok) throw new Error('Manifest unavailable');
      return r.json();
    }).then(manifest => loadPack(manifest[data.language], data.language))
      .then(pack => createIndex(Object.fromEntries(pack.entries), { language: pack.id, phrases: pack.phrases, frequencies: pack.frequencies }))
      .catch(error => { pending = null; throw error; });
    const index = await pending;
    self.postMessage({ id: data.id, ...findRhymes(index, data.word, data.mode) });
  } catch {
    self.postMessage({ id: data.id, state: 'error', results: [] });
  }
};
