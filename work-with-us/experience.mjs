const study=document.querySelector('[data-design-comparison]');
if(study){
 const range=document.querySelector('#design-reveal');
 const update=()=>{study.style.setProperty('--reveal',`${range.value}%`);range.setAttribute('aria-valuetext',`${range.value}% art-directed execution`);};
 range.addEventListener('input',update);study.dataset.ready='true';update();
}
const showcase=document.querySelector('[data-project-switcher]');
if(showcase){
 const projects={wine:{name:'Harbour & Vine',slug:'harbour-and-vine',image:'harbour-wine.webp',alt:'Original candlelit wine-bar imagery for the Harbour and Vine fictional concept'},volt:{name:'Volt & Co.',slug:'volt-and-co',image:'volt-architecture.webp',alt:'Original architectural lighting imagery for the Volt and Co fictional concept'},physio:{name:'Still Room',slug:'still-room',image:'still-movement.webp',alt:'Original human movement sculpture for the Still Room fictional concept'}};
 const host=showcase.querySelector('[data-showcase-field]');let field=null;
 let starting=false;
 const startField=async()=>{if(field||starting)return;starting=true;const {imageField}=await import('./effects/field.mjs');field=await imageField(host,{mode:1});};
 showcase.addEventListener('pointerenter',startField,{once:true});showcase.addEventListener('focusin',startField,{once:true});
 showcase.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.project,project=projects[key],src='/assets/studio/'+project.image;
  showcase.dataset.active=key;showcase.querySelectorAll('[data-project]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const image=host.querySelector('img');image.srcset='';image.alt=project.alt;if(field)field.setSource(src);else image.src=src;
  const link=showcase.querySelector('[data-project-link]');link.href='/work-with-us/concepts/'+project.slug+'/';link.setAttribute('aria-label',`${project.name} Explore concept for a fictional business`);showcase.querySelector('[data-project-name]').textContent=project.name;
 }));
}
