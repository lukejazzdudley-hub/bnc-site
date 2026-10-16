import {calculateSections, worksheetText} from './beat-worksheet-model.mjs';

const form = document.querySelector('[data-beat-worksheet]');
if (form) {
  form.classList.add('is-enhanced');
  const status = form.querySelector('[data-plan-status]');
  const timeline = form.querySelector('[data-section-plan]');
  const download = form.querySelector('[data-download-worksheet]');
  const read = () => {
    const data = new FormData(form);
    return Object.fromEntries([...data.entries(), ['bars', ['introBars', 'verseBars', 'hookBars', 'outroBars'].map(key => data.get(key))]]);
  };
  const update = () => {
    form.querySelectorAll('[data-print-field]').forEach(node => {
      node.textContent = form.elements.namedItem(node.dataset.printField).value || '________________';
    });
    try {
      const plan = calculateSections(read().tempo, read().bars);
      const list = document.createElement('ol');
      list.className = 'beat-timeline';
      for (const section of plan.sections) {
        const item = document.createElement('li');
        const name = document.createElement('strong');
        name.textContent = section.name;
        const detail = document.createElement('span');
        detail.textContent = `Bars ${section.startBar}–${section.endBar} · ${section.startSeconds.toFixed(1)}–${section.endSeconds.toFixed(1)}s`;
        item.append(name, detail);
        list.append(item);
      }
      timeline.replaceChildren(list);
      status.textContent = `${plan.bars} bars · ${plan.seconds.toFixed(1)} seconds at ${plan.bpm} BPM. Four beats per bar; constant tempo assumed.`;
      download.disabled = false;
    } catch (error) {
      timeline.replaceChildren();
      status.textContent = error.message;
      download.disabled = true;
    }
  };
  form.querySelector('[data-worksheet-actions]').hidden = false;
  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  download.addEventListener('click', () => {
    const blob = new Blob([worksheetText(read())], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'beat-to-demo-worksheet.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  form.querySelector('[data-print-worksheet]').addEventListener('click', () => window.print());
  update();
}
