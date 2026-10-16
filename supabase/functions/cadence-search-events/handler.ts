import {routes} from './routes.ts';
export interface SearchEvent {event:'view'|'store';route:string;source:string;store:'none'|'apple'|'google'}
const ORIGIN='https://brandnamechanges.com';
const SOURCES=new Set(['google','bing','other_search','referral','direct','campaign']);
export function normaliseEvent(raw:unknown):SearchEvent|null{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 const e=raw as Record<string,unknown>;
 if(Object.keys(e).sort().join(',')!=='event,route,source,store'||!['view','store'].includes(String(e.event))||typeof e.route!=='string'||e.route.length>160||!/^\/cadence\/(?:[a-z0-9-]+\/){0,3}$/.test(e.route)||!SOURCES.has(String(e.source))||!['none','apple','google'].includes(String(e.store)))return null;
 if(!routes.has(e.route))return null;
 if((e.event==='view')!==(e.store==='none'))return null;
 return e as unknown as SearchEvent;
}
export function createHandler(record:(e:SearchEvent,request:Request)=>Promise<void>){
 return async(request:Request):Promise<Response>=>{
  const headers={'Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
  const reply=(status:number)=>new Response(null,{status,headers});
  if(request.headers.get('Origin')!==ORIGIN)return reply(403);
  if(request.method==='OPTIONS')return reply(204);
  if(request.method!=='POST')return reply(405);
  if(Number(request.headers.get('Content-Length'))>1024)return reply(413);
  let text='';
  if(!request.body)return reply(400);
  const reader=request.body.getReader();let size=0;const chunks:Uint8Array[]=[];
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1024){await reader.cancel();return reply(413);}chunks.push(value);}}catch{return reply(400);}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}text=new TextDecoder().decode(bytes);
  let raw:unknown;try{raw=JSON.parse(text);}catch{return reply(400);}
  const e=normaliseEvent(raw);if(!e)return reply(400);
  try{await record(e,request);return reply(204);}catch{return reply(503);}
 };
}
