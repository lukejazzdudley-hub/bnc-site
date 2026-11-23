const form = document.querySelector('#syllable-form');
const lyric = document.querySelector('#lyric-lines');
const status = document.querySelector('#syllable-status');
const results = document.querySelector('#syllable-results');
const submit = form.querySelector('[type=submit]');
let worker;

function finish(message) {
  status.textContent = message;
  submit.disabled = false;
}

function receive({ data }) {
  if (data.error) {
    finish('The pronunciation dictionary could not load. Try again.');
    return;
  }
  for (const line of data.lines) {
    const item = document.createElement('li');
    const text = document.createElement('p');
    const count = document.createElement('strong');
    const check = document.createElement('p');
    text.textContent = `Line ${line.line} · ${line.text}`;
    count.textContent = `${line.low === line.high ? line.low : `${line.low}–${line.high}`} ${line.unknown.length ? 'known syllables' : 'syllables'}`;
    check.textContent = line.unknown.length ? `Check by ear: ${line.unknown.join(', ')}` : '';
    count.className = 'syllable-count';
    item.append(text, count, check);
    results.append(item);
  }
  finish(data.lines.length ? `Counted ${data.lines.length} lines.` : 'Enter a line with words to count.');
}

form.hidden = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (submit.disabled) return;
  results.replaceChildren();
  if (lyric.value.split(/\r?\n/).length > 80) {
    finish('Use up to 80 lines at a time.');
    return;
  }
  submit.disabled = true;
  status.textContent = 'Checking pronunciations…';
  try {
    if (!worker) {
      worker = new Worker(new URL('./syllable-worker.mjs', import.meta.url), { type: 'module' });
      worker.onmessage = receive;
      worker.onerror = () => {
        worker.terminate();
        worker = undefined;
        finish('The syllable counter could not start. Try again.');
      };
    }
    worker.postMessage(lyric.value);
  } catch {
    finish('This browser could not start the syllable counter.');
  }
});
for (const example of form.querySelectorAll('[data-syllable-example]')) {
  example.addEventListener('click', () => {
    if (submit.disabled) return;
    lyric.value = example.dataset.syllableExample;
    form.requestSubmit();
  });
}
