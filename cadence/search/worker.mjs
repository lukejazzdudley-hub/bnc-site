import { createIndex, findRhymes } from './rhymes.mjs';
let pending;
self.onmessage = async ({ data }) => {
  try {
    pending ||= fetch('./dictionary.json').then(r => {
      if (!r.ok) throw new Error('dictionary');
      return r.json();
    }).then(createIndex).catch(e => { pending = null; throw e; });
    const index = await pending;
    self.postMessage({ id: data.id, ...findRhymes(index, data.word, data.mode) });
  } catch {
    self.postMessage({ id: data.id, state: 'error', results: [] });
  }
};
