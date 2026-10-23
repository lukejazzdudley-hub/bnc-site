const form=document.querySelector('#romance-form');
const locale=document.documentElement.lang;
const status=document.querySelector('#romance-status');
const results=document.querySelector('#romance-results');
const messages=locale==='fr'?{loading:'Chargement du dictionnaire… Le premier téléchargement peut prendre quelques secondes.',unknown:'Mot absent du dictionnaire. Essayez une autre orthographe. Aucun résultat anglais ne remplace votre recherche.',invalid:'Entrez un seul mot (60 caractères maximum).',error:'Le dictionnaire ne peut pas être chargé. Vérifiez la connexion et réessayez.',ready:'résultats. Prononciations du dictionnaire ; vérifiez dans votre accent.'}:{loading:'Cargando el diccionario… La primera descarga puede tardar unos segundos.',unknown:'Palabra ausente del diccionario. Prueba otra escritura. No se sustituyen resultados en inglés.',invalid:'Introduce una sola palabra (máximo 60 caracteres).',error:'No se pudo cargar el diccionario. Comprueba tu conexión e inténtalo de nuevo.',ready:'resultados. Pronunciaciones del diccionario; comprueba tu acento.'};
let worker,sequence=0,timer;
function fail(){clearTimeout(timer);worker?.terminate();worker=null;status.textContent=messages.error;results.setAttribute('aria-busy','false');}
form.hidden=false;
form.addEventListener('submit',event=>{
 event.preventDefault();clearTimeout(timer);results.replaceChildren();status.textContent=messages.loading;results.setAttribute('aria-busy','true');
 try{
  if(!worker){worker=new Worker('/cadence/search/romance-worker.mjs',{type:'module'});worker.onerror=fail;worker.onmessage=({data})=>{
   if(data.id!==sequence)return;clearTimeout(timer);results.replaceChildren();results.setAttribute('aria-busy','false');
   status.textContent=data.state==='ready'?`${data.total} ${messages.ready}`:messages[data.state]||messages.error;
   for(const match of data.results){const li=document.createElement('li'),word=document.createElement('span'),reading=document.createElement('small');word.textContent=match.word;reading.textContent=`/${match.reading}/`;li.append(word,reading);results.append(li);}
  };}
  worker.postMessage({id:++sequence,language:locale,word:form.elements.word.value,mode:form.elements.mode.value});timer=setTimeout(fail,30000);
 }catch{fail();}
});
for(const button of document.querySelectorAll('[data-romance-example]'))button.addEventListener('click',()=>{
 form.elements.word.value=button.dataset.romanceExample;
 if(button.dataset.romanceMode){
  form.elements.mode.value=button.dataset.romanceMode;
  form.scrollIntoView({block:'start',behavior:'instant'});
  form.elements.word.focus({preventScroll:true});
 }
 form.requestSubmit();
});
