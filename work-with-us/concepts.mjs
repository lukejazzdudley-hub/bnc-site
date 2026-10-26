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
// Progressive circuit draw uses scroll progress; the full line is the static fallback.
const circuit=document.querySelector('.concept-scene .circuit');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(circuit){const length=circuit.getTotalLength();const update=()=>{if(reduced.matches){circuit.style.removeProperty('stroke-dasharray');circuit.style.removeProperty('stroke-dashoffset');return;}const r=circuit.getBoundingClientRect();circuit.style.strokeDasharray=String(length);circuit.style.strokeDashoffset=String(length*(1-Math.max(0,Math.min(1,1-r.top/innerHeight))));};addEventListener('scroll',update,{passive:true});reduced.addEventListener('change',update);update();}
const dialog=document.querySelector('.booking-dialog');
let opener=null;
for(const button of document.querySelectorAll('[data-open-demo]'))button.addEventListener('click',()=>{opener=button;dialog.showModal();document.documentElement.style.overflow='hidden';});
document.querySelector('[data-close-demo]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>{document.documentElement.style.removeProperty('overflow');opener?.focus();});
dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
// Distinct input and entrance motion for each business, using pinned local Motion.
if(!reduced.matches&&window.Motion){
 const {animate,inView}=window.Motion;
 if(document.querySelector('.wine-title')){animate('.wine-title',{opacity:[0,1],y:[30,0]},{duration:1.1,ease:[.22,.9,.12,1]});inView('.wine-statement',element=>{animate(element,{opacity:[.4,1],y:[40,0]},{duration:1.1,ease:[.22,.9,.12,1]});});}
 if(document.querySelector('.volt-title'))animate('.volt-title',{clipPath:['inset(0 0 100% 0)','inset(0 0 0% 0)'],y:[-20,0]},{duration:.7,ease:[.65,0,.2,1]});
 if(document.querySelector('.still-title'))animate('.still-title',{opacity:[0,1],filter:['blur(5px)','blur(0px)']},{duration:1.1,ease:[.22,.9,.12,1]});
}
const power=document.querySelector('[data-power-toggle]');
power?.addEventListener('click',()=>{const on=power.getAttribute('aria-pressed')!=='true';power.setAttribute('aria-pressed',String(on));power.setAttribute('aria-label',on?'Turn the demo circuit off':'Turn the demo circuit on');power.closest('[data-power]').dataset.power=on?'on':'off';document.querySelector('[data-power-label]').textContent=on?'CIRCUIT CONNECTED':'CIRCUIT OPEN';});
const scene=document.querySelector('[data-scene]');
if(scene&&!reduced.matches&&!navigator.connection?.saveData){
 const load=()=>import('./concept-scenes.mjs').then(module=>module.mountScene(scene,scene.dataset.scene)).catch(()=>{scene.classList.remove('scene-ready');});
 if('requestIdleCallback' in window)requestIdleCallback(load,{timeout:1200});else setTimeout(load,100);
}
// Very low-amplitude original candlelight wash, drawn after first paint.
const wineHero=document.querySelector('.wine-opening');
if(wineHero&&!reduced.matches&&!navigator.connection?.saveData){
 const canvas=document.createElement('canvas');canvas.className='wine-light';canvas.setAttribute('aria-hidden','true');wineHero.append(canvas);
 const ctx=canvas.getContext('2d');let visible=false,frame=0,last=0;
 const resize=()=>{const ratio=Math.min(devicePixelRatio,innerWidth<700?1.25:1.5);canvas.width=Math.round(wineHero.clientWidth*ratio);canvas.height=Math.round(wineHero.clientHeight*ratio);};resize();
 const observer=new ResizeObserver(resize);observer.observe(wineHero);
 const paint=time=>{frame=0;if(!visible||document.hidden||reduced.matches)return;if(time-last>45){last=time;const w=canvas.width,h=canvas.height,pulse=.11+Math.sin(time*.0014)*.009+Math.sin(time*.0037)*.004;ctx.clearRect(0,0,w,h);const light=ctx.createRadialGradient(w*.84,h*.35,0,w*.84,h*.35,w*.5);light.addColorStop(0,`rgba(255,180,85,${pulse})`);light.addColorStop(1,'rgba(255,160,50,0)');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);}frame=requestAnimationFrame(paint);};
 const stop=()=>{cancelAnimationFrame(frame);frame=0;};const start=()=>{if(visible&&!frame&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(paint);};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();}).observe(wineHero);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 reduced.addEventListener('change',()=>{if(reduced.matches){stop();ctx.clearRect(0,0,canvas.width,canvas.height);}else start();});
}
// Wine: photographic drift follows the visitor; no perpetual parallax loop.
const wineImage=document.querySelector('.wine-image');
if(wineImage&&!reduced.matches){
 let frame=0,targetX=0,targetY=0,x=0,y=0,last=0;
 const paint=time=>{frame=0;if(reduced.matches||document.hidden)return;const dt=Math.min((time-(last||time))/1000,.05);last=time;x+=(targetX-x)*(1-Math.exp(-4*dt));y+=(targetY-y)*(1-Math.exp(-4*dt));wineImage.style.transform=`translate(${x}px,${y}px) scale(1.04)`;if(Math.abs(targetX-x)+Math.abs(targetY-y)>.1)frame=requestAnimationFrame(paint);else last=0;};
 const start=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 wineHero.addEventListener('pointermove',event=>{if(!matchMedia('(hover:hover)').matches)return;targetX=(event.clientX/innerWidth-.5)*-18;targetY=(event.clientY/innerHeight-.5)*-12;start();},{passive:true});
 wineHero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;start();});
 reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;wineImage.style.removeProperty('transform');}});
}
// Still Room: an original field of continuous contours responds like a soft body.
const field=document.querySelector('[data-movement-field]');
if(field){
 const caption=document.querySelector('[data-body-caption]');
 const descriptions={shoulder:'Open up. A little room through the shoulders.',back:'Find balance. Space to move through your back.',leg:'Move forward. Find your own comfortable range.'};
 const positions={shoulder:[.54,.33],back:[.5,.5],leg:[.46,.73]};
 let selected='back',tx=.5,ty=.5,x=.5,y=.5,visible=false,frame=0,last=0;
 for(const button of field.querySelectorAll('[data-body-area]')){
  const select=()=>{selected=button.dataset.bodyArea;[tx,ty]=positions[selected];caption.textContent=descriptions[selected];field.querySelectorAll('[data-body-area]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));start();};
  button.addEventListener('pointerenter',select);button.addEventListener('focus',select);button.addEventListener('click',select);
 }
 const canvas=document.createElement('canvas');canvas.className='movement-lines movement-canvas';canvas.setAttribute('aria-hidden','true');field.prepend(canvas);const ctx=canvas.getContext('2d');
 const resize=()=>{const ratio=Math.min(devicePixelRatio,innerWidth<700?1.25:1.5);canvas.width=Math.round(field.clientWidth*ratio);canvas.height=Math.round(field.clientHeight*ratio);};resize();new ResizeObserver(resize).observe(field);
 const paint=time=>{frame=0;if(reduced.matches||!visible||document.hidden)return;
  if(time-last>30){last=time;x+=(tx-x)*.07;y+=(ty-y)*.07;const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);const figure=field.querySelector('.still-art');if(figure)figure.style.transform=`translate(${(x-.5)*8}px,${(y-.5)*6}px) rotate(${(x-.5)*1.3}deg)`;ctx.lineWidth=.65*Math.min(devicePixelRatio,1.5);
   for(let line=0;line<33;line++){
    const radius=.07+line*.0095,phase=time*.00012;
    ctx.beginPath();ctx.strokeStyle=`rgba(75,111,91,${.08+line*.002})`;
    for(let point=0;point<=120;point++){
     const a=point/120*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),wave=Math.sin(a*3+phase)*.013+Math.sin(a*5-phase)*.008;
     const px=(.5+dx*(radius+wave)+(x-.5)*.08)*w,py=(.48+dy*(radius*1.5+wave)+(y-.5)*.065)*h;
     if(point===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.stroke();
   }
  }frame=requestAnimationFrame(paint);
 };
 const stop=()=>{cancelAnimationFrame(frame);frame=0;};
 function start(){if(visible&&!document.hidden&&!reduced.matches&&!frame)frame=requestAnimationFrame(paint);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();}).observe(field);
 field.addEventListener('pointermove',event=>{const r=field.getBoundingClientRect();tx=(event.clientX-r.left)/r.width;ty=(event.clientY-r.top)/r.height;start();},{passive:true});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());reduced.addEventListener('change',()=>{if(reduced.matches){stop();ctx.clearRect(0,0,canvas.width,canvas.height);}else start();});
}
