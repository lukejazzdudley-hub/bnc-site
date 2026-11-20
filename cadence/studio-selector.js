const selector = document.querySelector('.studio-selector');
const picture = selector.closest('figure').querySelector('.studio-featured');
const companion = selector.closest('figure').querySelector('.studio-companion');
const companionOriginal = { src: companion.src, alt: companion.alt };
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
  const initial = button.dataset.view === 'studio';
  preview.sizes = picture.sizes;
  preview.srcset = initial ? original.srcset : '';
  preview.src = initial ? original.src : button.dataset.src || new URL(button.dataset.view + '.webp', original.src).href;
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
  companion.src = initial ? companionOriginal.src : original.src;
  companion.alt = initial ? companionOriginal.alt : original.alt;
  prepareMotion();
  motionReady?.then(motion => {
    if (motion && version === selection && !reduce.matches && !navigator.connection?.saveData) {
      motion.animate(picture, { opacity: [.72, 1], y: [4, 0] }, { duration: .22 });
    }
  });
  for (const item of selector.querySelectorAll('button')) {
    item.setAttribute('aria-pressed', String(item === button));
  }
});

// Load the pinned UMD build on interaction. Selection works independently of Motion.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let motionReady;
function prepareMotion() {
  if (reduce.matches || navigator.connection?.saveData) return;
  if (!motionReady) motionReady = new Promise(resolve => {
    if (window.Motion) return resolve(window.Motion);
    const script = document.createElement('script');
    script.src = '/assets/vendor/motion-12.23.24.js';
    script.onload = () => resolve(window.Motion);
    script.onerror = () => resolve(null);
    document.head.append(script);
  });
}
selector.addEventListener('pointerdown', prepareMotion);
selector.addEventListener('focusin', prepareMotion);
