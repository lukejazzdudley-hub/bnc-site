import {readEnquiry, validateEnquiry} from './enquiry-model.mjs';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
// Keep native scrolling and keyboard anchors. Smooth only deliberate anchor clicks;
// no wheel interception, synthetic scrollbar or continuous render loop.
for (const link of document.querySelectorAll('a[href^="#"]')) link.addEventListener('click', event => {
 const target=document.querySelector(link.getAttribute('href'));
 if(!target || reduced.matches || event.metaKey || event.ctrlKey) return;
 event.preventDefault(); history.pushState(null,'',link.hash);
 target.scrollIntoView({behavior:'smooth'});
});
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
