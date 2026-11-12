import {matchesOption} from './app-shortlist-model.mjs';

const shortlist = document.querySelector('#app-shortlist');
if (shortlist) {
  const form = shortlist.querySelector('[data-app-filters]');
  const cards = [...shortlist.querySelectorAll('[data-app-option]')];
  const status = shortlist.querySelector('[data-app-status]');
  const empty = shortlist.querySelector('[data-app-empty]');
  const update = () => {
    const selection = Object.fromEntries(new FormData(form));
    let count = 0;
    for (const card of cards) {
      const option = Object.fromEntries(['device', 'task', 'access'].map(key => [key, card.dataset[key].split(' ')]));
      option.accessDevices = JSON.parse(card.dataset.accessDevices || '{}');
      card.hidden = !matchesOption(option, selection);
      if (!card.hidden) count++;
    }
    status.textContent = `${count} of ${cards.length} options match your filters.`;
    empty.hidden = count !== 0;
  };
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  // The native reset action runs after the reset event; read values next task.
  form.addEventListener('reset', () => setTimeout(update, 0));
  const revealAnchor = () => {
    if (location.hash === '#app-shortlist') shortlist.open = true;
  };
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();
  update();
  form.hidden = false;
}
