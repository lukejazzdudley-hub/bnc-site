const selector = document.querySelector('.studio-selector');
const picture = selector.parentElement.querySelector('img');
const status = selector.parentElement.querySelector('[role="status"]');
const original = { src: picture.src, srcset: picture.srcset, alt: picture.alt };
selector.hidden = false;
let selection = 0;

selector.addEventListener('click', async event => {
  const button = event.target.closest('button[data-view]');
  if (!button) return;
  const version = ++selection;
  status.textContent = '';
  const preview = new Image();
  const library = button.dataset.view === '01-library-neutral';
  preview.sizes = picture.sizes;
  preview.srcset = library ? original.srcset : '';
  preview.src = library ? original.src : new URL(button.dataset.view + '.webp', original.src).href;
  try {
    await preview.decode();
  } catch {
    if (version === selection) status.textContent = 'This preview could not load. Select it again to retry.';
    return;
  }
  if (version !== selection) return;
  picture.srcset = preview.srcset;
  picture.src = preview.src;
  picture.alt = button.dataset.alt || original.alt;
  for (const item of selector.querySelectorAll('button')) {
    item.setAttribute('aria-pressed', String(item === button));
  }
});
