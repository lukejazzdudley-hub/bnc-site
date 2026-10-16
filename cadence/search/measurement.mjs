const ENDPOINT='https://goupfxfloriqtucppmbx.supabase.co/functions/v1/cadence-search-events';
export function sourceGroup(referrer,search=''){
 if(new URLSearchParams(search).has('utm_source'))return 'campaign';
 let host;try{host=new URL(referrer).hostname.toLowerCase();}catch{return 'direct';}
 if(/(^|\.)google\.(com|co\.uk|fr|es|ca|co\.in|com\.au|co\.za|com\.br|pt|de|it|ru|com\.sa|co\.kr|co\.il|co\.jp|com\.tr|co\.id|com\.my|pl|com\.ph|com\.vn|com\.ng)$/.test(host))return 'google';
 if(/(^|\.)bing\.com$/.test(host))return 'bing';
 if(/(^|\.)(duckduckgo\.com|search\.yahoo\.com|ecosia\.org)$/.test(host))return 'other_search';
 return host==='brandnamechanges.com'?'direct':'referral';
}
export function storeFor(raw){
 let url;try{url=new URL(raw);}catch{return null;}
 if(url.protocol!=='https:')return null;
 if(url.hostname==='apps.apple.com'&&/\/id6778554520\/?$/.test(url.pathname))return 'apple';
 if(url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')==='io.cadenceapp.mobile')return 'google';
 return null;
}
export function eventPayload(route,source,event,store='none'){
 if(!/^\/cadence\/(?:[a-z0-9-]+\/){0,3}$/.test(route)||!['google','bing','other_search','referral','direct','campaign'].includes(source)||!['view','store'].includes(event)||!['none','apple','google'].includes(store)||(event==='view')!==(store==='none'))return null;
 return {event,route,source,store};
}
export function startMeasurement(win,doc){
 if(!doc.body||!win.location.pathname.startsWith('/cadence/'))return;
 const preference='cadence-website-counts';
 const blocked=win.navigator.globalPrivacyControl===true||win.navigator.doNotTrack==='1';
 let allowed=false,viewSent=false,landing=win.location.pathname,source=sourceGroup(doc.referrer,win.location.search);
 const stores=new Set();
 try{allowed=!blocked&&win.localStorage.getItem(preference)==='allow';if(allowed){source=win.sessionStorage.getItem('cadence-entry-source')||source;landing=win.sessionStorage.getItem('cadence-entry-route')||landing;}}catch{allowed=false;}
 const send=(event,store='none')=>{
  if(!allowed||blocked)return;
  const payload=eventPayload(event==='store'?landing:win.location.pathname,source,event,store);if(!payload)return;
  win.fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true,credentials:'omit',referrerPolicy:'no-referrer'}).then(response=>{if(response && !response.ok)console.info('Optional website counts are unavailable.');}).catch(()=>console.info('Optional website counts are unavailable.'));
 };
 const view=()=>{if(allowed&&!viewSent){viewSent=true;send('view');}};
 const fr=doc.documentElement.lang.startsWith('fr'),es=doc.documentElement.lang.startsWith('es');
 const text=fr?{title:'Mesure facultative du site',body:'Autoriser des compteurs de pages et de clics vers les boutiques ? Aucun texte de chanson ni mot recherché. Ce choix ne change pas les réglages de l’application.',yes:'Autoriser les compteurs',no:'Non merci',change:'Choix de confidentialité',off:'Mesure désactivée',on:'Compteurs autorisés'}:es?{title:'Medición opcional del sitio',body:'¿Permitir recuentos de páginas y clics hacia las tiendas? No se recogen letras ni palabras buscadas. Esta elección no cambia los ajustes de la aplicación.',yes:'Permitir recuentos',no:'No, gracias',change:'Opciones de privacidad',off:'Medición desactivada',on:'Recuentos permitidos'}:{title:'Optional website measurement',body:'Allow counts of pages and clicks to the app stores? No lyrics or rhyme searches are collected. This choice is separate from the app’s settings.',yes:'Allow counts',no:'No thanks',change:'Privacy choices',off:'Measurement is off',on:'Optional counts allowed'};
 const root=doc.createElement('section');root.className='website-measurement';root.setAttribute('aria-label',text.title);root.setAttribute('lang',fr?'fr':es?'es':'en');root.setAttribute('dir','ltr');
 const prompt=doc.createElement('div'),heading=doc.createElement('h2'),p=doc.createElement('p'),yes=doc.createElement('button'),no=doc.createElement('button'),change=doc.createElement('button'),status=doc.createElement('p'),link=doc.createElement('a');
 heading.textContent=text.title;p.textContent=text.body;yes.textContent=text.yes;no.textContent=text.no;change.textContent=text.change;link.href='/privacy#website-measurement';link.textContent=fr?'Détails (English)':es?'Detalles (English)':'What is counted';status.setAttribute('role','status');
 prompt.append(heading,p,yes,no,link);root.append(prompt,status,change);doc.body.append(root);
 const render=()=>{let decided=false;try{decided=Boolean(win.localStorage.getItem(preference));}catch{decided=false;}prompt.hidden=blocked||decided;status.textContent=allowed?text.on:text.off;yes.disabled=blocked;};
 yes.addEventListener('click',()=>{if(blocked)return;allowed=true;try{win.localStorage.setItem(preference,'allow');win.sessionStorage.setItem('cadence-entry-source',source);win.sessionStorage.setItem('cadence-entry-route',landing);}catch{console.info('Website count preference will last for this page only.');}view();prompt.hidden=true;status.textContent=text.on;});
 no.addEventListener('click',()=>{allowed=false;try{win.localStorage.setItem(preference,'deny');win.sessionStorage.removeItem('cadence-entry-source');win.sessionStorage.removeItem('cadence-entry-route');}catch{console.info('Website count preference will last for this page only.');}prompt.hidden=true;status.textContent=text.off;});
 change.addEventListener('click',()=>{if(!blocked){prompt.hidden=!prompt.hidden;if(!prompt.hidden)no.focus();}});
 doc.addEventListener('click',event=>{const link=event.target.closest?.('a[href]');if(!link)return;const store=storeFor(link.href);if(store&&!stores.has(store)&&allowed){stores.add(store);send('store',store);}}, {capture:true});
 render();view();
}
if(typeof window!=='undefined')startMeasurement(window,document);
