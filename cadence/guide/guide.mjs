// Navigation and reading remain static. The renderer is imported only on request.
export function matchesFeature(query, text) {
  const normalise = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  return normalise(query).trim().split(/\s+/).every(term => normalise(text).includes(term));
}

if (typeof document !== 'undefined') {
  const search = document.querySelector('#guide-search');
  const items = [...document.querySelectorAll('#guide-feature-links li')];
  const searchStatus = document.querySelector('#guide-search-status');
  document.querySelector('.guide-search').hidden = false;
  search.addEventListener('input', () => {
    let found = 0;
    for (const item of items) {
      item.hidden = !matchesFeature(search.value, `${item.textContent} ${item.dataset.guideKeywords}`);
      if (!item.hidden) found++;
    }
    searchStatus.textContent = found ? `${found} ${found === 1 ? 'feature' : 'features'}. Choose one to jump to the steps.` : 'No matching tool. Try a shorter word, or clear the search to see all features.';
  });
  const links = items.map(item => item.querySelector('a'));
  const chapters = [...document.querySelectorAll('.guide-chapter')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!current) return;
      for (const link of links) {
        if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }, {rootMargin:'-10% 0px -55% 0px'});
    chapters.forEach(chapter => observer.observe(chapter));
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const actions = document.querySelector('.guide-model-actions');
  const load = document.querySelector('#load-guide-model');
  const reset = document.querySelector('#reset-guide-model');
  const close = document.querySelector('#close-guide-model');
  const status = document.querySelector('#guide-model-status');
  const poster = document.querySelector('#guide-poster');
  const device = document.querySelector('#guide-device');
  let viewer;
  let generation = 0;
  const orbit = '-12deg 85deg 108%';
  function useStill() {
    generation++;
    viewer?.remove(); viewer = null;
    poster.hidden = false; load.hidden = false; load.disabled = false;
    reset.hidden = true; close.hidden = true; status.textContent = '';
  }
  function preference() {
    const lightweight = reduced.matches || Boolean(navigator.connection?.saveData);
    if (lightweight) useStill();
    actions.hidden = lightweight;
  }
  preference();
  reduced.addEventListener('change', preference);
  navigator.connection?.addEventListener('change', preference);
  load.addEventListener('click', async () => {
    const request = ++generation;
    load.disabled = true; status.textContent = 'Loading the 3D handset…';
    try {
      // Keep geometry, texture binding and vendor revision shared with the product page.
      const {initialiseViewer} = await import('../phone-stage.js');
      await import('/assets/vendor/model-viewer.min.js');
      if (request !== generation) return;
      viewer = document.createElement('model-viewer');
      for (const [key,value] of Object.entries({src:'/assets/cadence/cadence-phone-feedback.glb','camera-controls':'','interaction-prompt':'none','touch-action':'pan-y','camera-orbit':orbit,orientation:'15deg 0deg 0deg','camera-target':'0m 0m 0m','field-of-view':'25deg','environment-image':'neutral',exposure:'1.1','shadow-intensity':'.8','aria-label':'Interactive Cadence handset. Drag or use arrow keys to rotate; use Reset view to return.'})) viewer.setAttribute(key,value);
      viewer.dataset.staticScreen = '/assets/cadence/rhyme-families.webp';
      device.append(viewer);
      await initialiseViewer(viewer);
      if (request !== generation) return;
      poster.hidden = true; load.hidden = true; reset.hidden = false; close.hidden = false;
      status.textContent = 'Drag or use arrow keys to rotate. Scroll the page normally to read.';
    } catch (error) {
      if (request !== generation) return;
      useStill(); status.textContent = 'The 3D view could not load. The image and all instructions are still available; you can retry.';
      console.warn('[Cadence guide] 3D view unavailable:', error);
    }
  });
  reset.addEventListener('click', () => { viewer?.setAttribute('camera-orbit', orbit); viewer?.setAttribute('field-of-view','25deg'); });
  close.addEventListener('click', () => {useStill();load.focus();});
}
