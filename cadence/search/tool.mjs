const form = document.querySelector('#rhyme-form');
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
    invalid: 'Enter one English word, using letters and an optional apostrophe.',
    unknown: 'That word is not in this dictionary. Try another spelling or a different word.',
    error: 'The dictionary could not load. Check your connection and try again.',
  };
  status.textContent = messages[data.state] || (data.total ? `${data.total} matches${data.total > 150 ? ' — showing the first 150' : ''}. Listed by syllable count, then alphabetically.` : 'No matches in this mode. Try Perfect rhymes or another word.');
  for (const match of data.results) {
    const item = document.createElement('li');
    const small = document.createElement('small');
    small.textContent = `${match.syllables} ${match.syllables === 1 ? 'syllable' : 'syllables'}`;
    item.append(document.createTextNode(match.word), small);
    results.append(item);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
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
    worker.postMessage({ id: ++sequence, word: field.value, mode: new FormData(form).get('mode') });
    timer = setTimeout(fail, 20000);
  } catch { fail(); }
});
for (const button of document.querySelectorAll('[data-example]')) button.addEventListener('click', () => {
  field.value = button.dataset.example;
  form.requestSubmit();
});
document.querySelector('#tool-controls').hidden = false;
