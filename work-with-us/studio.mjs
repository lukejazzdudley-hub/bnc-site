import {readEnquiry, validateEnquiry} from './enquiry-model.mjs';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
// Keep native scrolling and keyboard anchors. Smooth only deliberate anchor clicks;
// no wheel interception, synthetic scrollbar or continuous render loop.
for (const link of document.querySelectorAll('a[href^="#"]')) link.addEventListener('click', event => {
 const target=document.querySelector(link.getAttribute('href'));
 if(!target || reduced.matches || event.metaKey || event.ctrlKey) return;
 event.preventDefault(); history.pushState(null,'',link.hash);
 target.scrollIntoView({behavior:'smooth'});
});
const comparison=document.querySelector('.comparison');
if(comparison){
 let target=72,current=72,frame=0,last=0,active=false;
 const paint=time=>{
  frame=0; if(reduced.matches || document.hidden || !active)return;
  const dt=Math.min((time-(last||time))/1000,.05); last=time;
  current+=(target-current)*(1-Math.exp(-12*dt));
  comparison.style.setProperty('--reveal',`${current.toFixed(2)}%`);
  if(Math.abs(target-current)>.1)frame=requestAnimationFrame(paint);else last=0;
 };
 const schedule=()=>{if(!frame && active && !document.hidden && !reduced.matches)frame=requestAnimationFrame(paint);};
 const update=()=>{if(!fine.matches){const r=comparison.getBoundingClientRect();target=Math.max(12,Math.min(92,(1-r.top/innerHeight)*100));schedule();}};
 const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){update();schedule();}else{cancelAnimationFrame(frame);frame=0;last=0;}},{threshold:0});
 observer.observe(comparison);
 comparison.addEventListener('pointermove',e=>{if(!fine.matches)return;const r=comparison.getBoundingClientRect();target=Math.max(5,Math.min(95,(e.clientX-r.left)/r.width*100));schedule();});
 comparison.addEventListener('pointerleave',()=>{target=72;schedule();});
 addEventListener('scroll',update,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});
 reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;last=0;if(reduced.matches)comparison.style.removeProperty('--reveal');else{update();schedule();}});
 const hint=document.querySelector('.compare-hint');if(hint&&!fine.matches)hint.textContent='Scroll to reveal ↕';
}
// A bounded response to scroll velocity, limited to visible concept cards.
const cards=[...document.querySelectorAll('.concept-card')];
let previousY=scrollY,previousTime=performance.now(),resetTimer=0;
addEventListener('scroll',()=>{
 if(reduced.matches || !fine.matches || document.hidden || !cards.length)return;
 const now=performance.now(),velocity=(scrollY-previousY)/Math.max(16,now-previousTime);
 previousY=scrollY;previousTime=now;
 const skew=Math.max(-1.2,Math.min(1.2,velocity*.35));
 for(const card of cards){const r=card.getBoundingClientRect();if(r.bottom>0 && r.top<innerHeight)card.style.setProperty('--card-skew',`${skew.toFixed(2)}deg`);}
 clearTimeout(resetTimer);resetTimer=setTimeout(()=>cards.forEach(card=>card.style.removeProperty('--card-skew')),100);
},{passive:true});
// Progressive headline entrance: actual text remains available without JavaScript.
const heading=document.querySelector('.studio-hero h1');
if(heading&&!reduced.matches){
 const title=heading.innerText.trim().replace(/\s+/g,' ');const words=title.split(' ');heading.setAttribute('aria-label',title);
 heading.replaceChildren(...words.flatMap((word,i)=>{const span=document.createElement('span');span.textContent=word;span.className='headline-word';span.setAttribute('aria-hidden','true');span.style.display='inline-block';span.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:1100,delay:i*35,easing:'cubic-bezier(.22,.9,.12,1)',fill:'backwards'});return [span,document.createTextNode(' ')];}));
}
const form=document.querySelector('.enquiry-form');
if(form){
 const started=form.elements.namedItem('started_at');started.value=String(Date.now());
 const status=form.querySelector('.form-status'),button=form.querySelector('button[type=submit]');
 const report=(state,message)=>{status.dataset.state=state;status.textContent=message;};
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(button.disabled)return;
  const body=new FormData(form),errors=validateEnquiry(readEnquiry(body));
  for(const key of ['name','email','business','website','needs','message']){
   const field=form.elements.namedItem(key),note=document.getElementById(`${key}-error`);
   if(note)note.textContent=errors[key]||'';
   for(const control of key==='needs'?form.querySelectorAll('[name=needs]'):[field]){
    control?.setAttribute('aria-describedby',`${key}-error${key==='needs'?' needs-hint':''}`);
    if(errors[key])control?.setAttribute('aria-invalid','true');else control?.removeAttribute('aria-invalid');
   }
  }
  if(Object.keys(errors).length){report('error','Check the highlighted fields before sending.');form.querySelector('[aria-invalid=true]')?.focus();return;}
  report('sending','Sending your enquiry…');button.disabled=true;
  try{
   const response=await fetch(form.action,{method:'POST',body:new URLSearchParams(body),headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(result.code==='too_fast')started.value=String(Date.now()-2000);
   if(!response.ok||!result.ok)throw new Error(result.code==='rate_limited'?'Please wait a little before trying again. You can also email us.':result.code==='too_fast'?'Please take a moment to review your enquiry, then send again.':'Your enquiry hasn’t been sent. Please try again or email us.');
   form.reset();started.value=String(Date.now());report('success','Thanks, Luke will reply within one working day.');status.focus();
  }catch(error){report('error',error.name==='TimeoutError'?'Delivery is taking longer than expected. Your details are still here. Please email us if you don’t receive a reply.':error.message==='Failed to fetch'?'Couldn’t connect. Your details are still here; try again or email us.':['Please wait a little before trying again. You can also email us.','Please take a moment to review your enquiry, then send again.','Your enquiry hasn’t been sent. Please try again or email us.'].includes(error.message)?error.message:'Your enquiry hasn’t been sent. Please try again or email us.');}
  finally{button.disabled=false;}
 });
 // Retain native constraint validation without JS; JS offers consistent inline errors.
 form.noValidate=true;
}
// Every page footer reaches an actual form, including the fictional previews.
if(!document.querySelector('.enquiry-form'))document.querySelector('.footer-project')?.setAttribute('href','/contact/#enquiry');
