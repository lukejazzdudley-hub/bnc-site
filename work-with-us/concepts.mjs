const form=document.querySelector('.concept-demo');
if(form){
 const steps=[...form.querySelectorAll('.demo-step')],confirmation=form.querySelector('.demo-confirmation'),reset=form.querySelector('[data-reset]');
 let current=0;
 form.addEventListener('submit',e=>e.preventDefault());
 const value=name=>form.elements.namedItem(name)?.value||'';
 const show=()=>{
  steps.forEach((step,i)=>{step.hidden=i!==current;});
  const summary=form.querySelector('[data-summary]');
  if(summary)summary.textContent=form.dataset.demo==='wine'?`${value('party')} · ${value('date')} · ${value('time')}`:`${value('treatment')} with ${value('practitioner')}.`;
  steps[current]?.querySelector('select,button')?.focus();
 };
 form.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>{current=Math.min(current+1,steps.length-1);show();}));
 form.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>{current=Math.max(0,current-1);show();}));
 const priceTable={socket:{small:'£120–180',large:'£180–260'},lighting:{small:'£180–300',large:'£300–480'},rewire:{small:'£3,000–4,500',large:'£4,500–6,500'}};
 form.querySelector('[data-quote]')?.addEventListener('click',()=>{form.querySelector('.quote-result').textContent=`Illustrative estimate: ${priceTable[value('job')][value('size')]}. This is a demo, not a real quote.`;});
 form.querySelector('[data-confirm]')?.addEventListener('click',()=>{
  steps.forEach(step=>{step.hidden=true;});
  const details=form.dataset.demo==='wine'?`${value('party')} · ${value('date')} · ${value('time')}`:`${value('treatment')} · ${value('practitioner')} · ${value('slot')}`;
  confirmation.textContent=`${details}. This is a demo. No appointment or table has been booked.`;
  confirmation.focus();reset.hidden=false;
 });
 reset?.addEventListener('click',()=>{form.reset();current=0;confirmation.textContent='';reset.hidden=true;show();});
}
const dialog=document.querySelector('.booking-dialog');
let opener=null;
const openDemo=button=>{opener=button;dialog.showModal();document.documentElement.style.overflow='hidden';};
for(const button of document.querySelectorAll('[data-open-demo]'))button.addEventListener('click',()=>openDemo(button));
document.querySelector('[data-close-demo]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>{document.documentElement.style.removeProperty('overflow');opener?.focus();});
dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

import {mountConceptMotion} from './effects/concept-motion.mjs?v=20261026-identities';
mountConceptMotion({openDemo});
