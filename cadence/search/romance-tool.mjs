const form=document.querySelector('#romance-form');
const locale=document.documentElement.lang;
const status=document.querySelector('#romance-status');
const results=document.querySelector('#romance-results');
const messages=locale==='fr'?{loading:'Chargement du dictionnaire… Le premier téléchargement peut prendre quelques secondes.',unknown:'Mot absent du dictionnaire. Essayez une autre orthographe. Aucun résultat anglais ne remplace votre recherche.',invalid:'Entrez un seul mot (60 caractères maximum).',error:'Le dictionnaire ne peut pas être chargé. Vérifiez la connexion et réessayez.',ready:'résultats. Prononciations du dictionnaire ; vérifiez dans votre accent.'}:{loading:'Cargando el diccionario… La primera descarga puede tardar unos segundos.',unknown:'Palabra ausente del diccionario. Prueba otra escritura. No se sustituyen resultados en inglés.',invalid:'Introduce una sola palabra (máximo 60 caracteres).',error:'No se pudo cargar el diccionario. Comprueba tu conexión e inténtalo de nuevo.',ready:'resultados. Pronunciaciones del diccionario; comprueba tu acento.'};
const more=document.querySelector('#romance-more');
let worker,sequence=0,timer,loaded=0,query;
function count(shown,total){return locale==='fr'?`${shown} résultats affichés sur ${total}. Prononciations du dictionnaire ; vérifiez dans votre accent.`:`${shown} de ${total} resultados mostrados. Pronunciaciones del diccionario; comprueba tu acento.`;}
function fail(){clearTimeout(timer);worker?.terminate();worker=null;status.textContent=messages.error;results.setAttribute('aria-busy','false');more.hidden=true;more.disabled=false;}
function search(append=false){
 clearTimeout(timer);
 if(!append){loaded=0;results.replaceChildren();query={language:locale,word:form.elements.word.value,mode:form.elements.mode.value,options:{prefix:form.elements.prefix?.value??'',sort:form.elements.sort?.value??'frequency'}};}
 more.hidden=!append;more.disabled=true;status.textContent=messages.loading;results.setAttribute('aria-busy','true');
 try{
  if(!worker){worker=new Worker('/cadence/search/romance-worker.mjs?v=20261102-controls',{type:'module'});worker.onerror=fail;worker.onmessage=({data})=>{
   if(data.id!==sequence)return;clearTimeout(timer);results.setAttribute('aria-busy','false');more.disabled=false;
   if(data.state!=='ready'){status.textContent=messages[data.state]||messages.error;more.hidden=true;return;}
   for(const match of data.results){const li=document.createElement('li'),word=document.createElement('span'),reading=document.createElement('small');word.textContent=match.word;reading.textContent=`/${match.reading}/`;li.append(word,reading);results.append(li);}
   loaded+=data.results.length;status.textContent=data.total===0?(locale==='fr'?'Aucune rime avec ces critères. Effacez le filtre ou essayez une autre correspondance.':'No hay rimas con estos criterios. Borra el filtro o prueba otra coincidencia.'):count(loaded,data.total);more.hidden=loaded>=data.total||!data.results.length;
  };}
  worker.postMessage({id:++sequence,...query,offset:loaded});timer=setTimeout(fail,30000);
 }catch{fail();}
}
document.querySelector('#romance-reset')?.addEventListener('click',()=>{
 form.elements.prefix.value='';form.elements.sort.value='frequency';
 if(form.elements.word.value.trim())form.requestSubmit();
 form.elements.prefix.focus();
});
form.hidden=false;
form.addEventListener('submit',event=>{event.preventDefault();search();});
more?.addEventListener('click',()=>search(true));
for(const button of document.querySelectorAll('[data-romance-example]'))button.addEventListener('click',()=>{
 form.elements.word.value=button.dataset.romanceExample;
 if(form.elements.prefix)form.elements.prefix.value='';
 if(form.elements.sort)form.elements.sort.value='frequency';
 if(button.dataset.romanceMode){
  form.elements.mode.value=button.dataset.romanceMode;
  form.scrollIntoView({block:'start',behavior:'instant'});
  form.elements.word.focus({preventScroll:true});
 }
 form.requestSubmit();
});
