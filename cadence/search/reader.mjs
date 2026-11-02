// Reading-position feedback only. No text entry, storage or network measurement.
const links = [...document.querySelectorAll('.reader-index a')];
const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let motionReady;
function loadMotion() {
  if (reduced.matches || navigator.connection?.saveData) return Promise.resolve(null);
  if (!motionReady) motionReady = new Promise(resolve => {
    if (window.Motion) return resolve(window.Motion);
    const script = document.createElement('script');
    script.src = '/assets/vendor/motion-12.23.24.js';
    script.onload = () => resolve(window.Motion);
    script.onerror = () => resolve(null); // Native anchor navigation remains complete.
    document.head.append(script);
  });
  return motionReady;
}
function mark(id) {
  for (const link of links) {
    if (link.hash === `#${id}`) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.isIntersecting);
    if (entry) mark(entry.target.id);
  }, {rootMargin:'-10% 0px -65% 0px'});
  sections.forEach(section => observer.observe(section));
}
links.forEach(link => link.addEventListener('click',async () => {
  mark(link.hash.slice(1));
  const motion = await loadMotion();
  if (motion && !reduced.matches) motion.animate(link,{backgroundColor:['#c1d2e8','#dce5f0']},{duration:.35});
}));
// Compact mobile contents; users retain native control of the disclosure.
const contents = document.querySelector('.reader-index details');
if (contents && matchMedia('(max-width:750px)').matches) contents.open = false;
