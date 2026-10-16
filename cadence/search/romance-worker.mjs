import {createRomanceIndex,searchRomance} from './romance.mjs';
let pending;
let active;
self.onmessage=async({data})=>{
 try {
  if(!['fr','es'].includes(data.language))throw new Error('Unsupported language');
  if(active&&active!==data.language)throw new Error('Restart worker for a language change');
  active=data.language;
  pending ||= fetch('/cadence/search/public-romance-provenance.json').then(r=>{if(!r.ok)throw new Error('Manifest unavailable');return r.json();}).then(async manifest=>{
   const d=manifest.dictionaries[data.language];
   const response=await fetch(d.url,{signal:AbortSignal.timeout(20000)});
   if(!response.ok||Number(response.headers.get('content-length'))>12000000)throw new Error('Dictionary unavailable');
   const reader=response.body.getReader();let size=0;const chunks=[];
   try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>12000000){await reader.cancel();throw new Error('Dictionary too large');}chunks.push(value);}}finally{reader.releaseLock();}
   const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
   const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
   if(hash!==d.sha256)throw new Error('Integrity mismatch');
   return createRomanceIndex(JSON.parse(new TextDecoder().decode(bytes)));
  }).catch(error=>{pending=null;throw error;});
  self.postMessage({id:data.id,...searchRomance(await pending,data.word,data.mode)});
 }catch{self.postMessage({id:data.id,state:'error',results:[]});}
};
