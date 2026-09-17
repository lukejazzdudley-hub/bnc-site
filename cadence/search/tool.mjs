import { languageById } from './languages.mjs';
const form = document.querySelector('#rhyme-form');
const language = document.querySelector('#language');
const field = document.querySelector('#word');
const status = document.querySelector('#results-status');
const results = document.querySelector('#results');
let worker;
let sequence = 0;
let timer;
function fail() {
  clearTimeout(timer);
  worker?.terminate();
  worker = null;
  status.textContent = 'The dictionary could not load. Check your connection and try again.';
  results.setAttribute('aria-busy', 'false');
}
function receive({ data }) {
  if (data.id !== sequence) return;
  clearTimeout(timer);
  results.replaceChildren();
  results.setAttribute('aria-busy', 'false');
  const messages = {
    invalid: 'Enter a word or short phrase using letters, spaces and apostrophes.',
    unknown: 'That word is not in this dictionary. Try another spelling or a different word.',
    error: 'The dictionary could not load. Check your connection and try again.',
    unavailable: 'This language is not available on the website yet. No English results have been substituted.',
  };
  status.textContent = messages[data.state] || (data.total ? `${data.total} matches${data.total > 150 ? ' — showing the best 150' : ''}. Ranked by common usage and sound similarity.` : 'No matches in this mode. Try Perfect rhymes or another word.');
  for (const match of data.results) {
    const item = document.createElement('li');
    const small = document.createElement('small');
    small.textContent = match.matchedSyllables ? `${match.matchedSyllables}-syllable phrase ${match.distance ? 'slant' : 'match'}` : match.phrase ? 'Phrase · matching ending' : `${match.syllables} ${match.syllables === 1 ? 'syllable' : 'syllables'}`;
    item.append(document.createTextNode(match.word), small);
    results.append(item);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!languageById(language.value)?.available) {
    status.textContent = languageById(language.value)?.reason || 'Unknown language';
    return;
  }
  clearTimeout(timer);
  results.replaceChildren();
  status.textContent = 'Finding rhymes… The dictionary downloads on your first search.';
  results.setAttribute('aria-busy', 'true');
  try {
    if (!worker) {
      worker = new Worker('/cadence/search/worker.mjs', { type: 'module' });
      worker.onmessage = receive;
      worker.onerror = fail;
    }
    worker.postMessage({ id: ++sequence, language: language.value, word: field.value, mode: new FormData(form).get('mode') });
    timer = setTimeout(fail, 20000);
  } catch { fail(); }
});
language.addEventListener('change', () => {
  sequence++;
  clearTimeout(timer);
  worker?.terminate(); // Cancel downloads/work and release the previous language index.
  worker = null;
  results.replaceChildren();
  results.setAttribute('aria-busy', 'false');
  const selected = languageById(language.value);
  const available = Boolean(selected?.available);
  form.querySelector('button[type=submit]').disabled = !available;
  for (const button of document.querySelectorAll('[data-example]')) button.disabled = !available;
  field.dir = ['ar', 'he', 'ur'].includes(language.value) ? 'rtl' : 'ltr';
  field.lang = language.value;
  status.textContent = available ? 'Ready. This language downloads only when you search.' : selected?.reason || 'Unknown language';
});
for (const button of document.querySelectorAll('[data-example]')) button.addEventListener('click', () => {
  field.value = button.dataset.example;
  if (button.dataset.mode) form.elements.mode.value = button.dataset.mode;
  form.requestSubmit();
});
document.querySelector('#tool-controls').hidden = false;
