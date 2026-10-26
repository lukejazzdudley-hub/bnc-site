import {readEnquiry, validateEnquiry} from '../../../work-with-us/enquiry-model.mjs';
export type Enquiry = { name:string; email:string; business:string; website?:string; needs:string[]; message:string; company_fax?:string; started_at?:string };
export type Dependencies = {now:()=>number; allowLocal:boolean; claimAttempt:(request:Request)=>Promise<boolean>; send:(data:Enquiry)=>Promise<void>};
const production=['https://brandnamechanges.com','https://www.brandnamechanges.com'];
const local=['http://localhost:8000','http://127.0.0.1:8000'];
const MAX_BODY=16384;
export function createEnquiryHandler(deps:Dependencies){return async(request:Request):Promise<Response>=>{
 const origin=request.headers.get('Origin')||'';
 const allowed=[...production,...(deps.allowLocal?local:[])].includes(origin);
 const cors:Record<string,string>={'Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if(allowed)Object.assign(cors,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Accept, Content-Type'});
 const json=request.headers.get('Accept')?.includes('application/json');
 const reply=(status:number,code:string,errors?:Record<string,string>)=>{
  const ok=status>=200&&status<300;
  if(!json&&allowed&&request.method==='POST')return new Response(null,{status:303,headers:{...cors,Location:`${origin}/contact/${ok?'thanks':'error'}/`}});
  return Response.json({ok,...(ok?{}:{code}),...(errors?{errors}:{})},{status,headers:cors});
 };
 if(!allowed)return Response.json({ok:false,code:'origin_not_allowed'},{status:403,headers:cors});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return reply(405,'method_not_allowed');
 if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/x-www-form-urlencoded'))return reply(415,'unsupported_content_type');
 const statedLength=Number(request.headers.get('Content-Length')||0);
 if(statedLength>MAX_BODY)return reply(413,'body_too_large');
 let text='';
 try{
  const reader=request.body?.getReader();if(!reader)return reply(400,'invalid_body');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BODY){await reader.cancel();return reply(413,'body_too_large');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 }catch{return reply(400,'invalid_body');}
 const data=readEnquiry(new URLSearchParams(text)) as Enquiry;
 if(data.company_fax)return reply(200,'ok'); // Give bots no feedback; never send their payload.
 const errors=validateEnquiry(data);if(Object.keys(errors).length)return reply(400,'invalid_fields',errors);
 // Timing is an optional progressive signal, never the authorization boundary.
 // Native forms have no JS timestamp; durable rate limiting still applies.
 if(data.started_at){const timestamp=Number(data.started_at),age=deps.now()-timestamp;
  if(!Number.isFinite(timestamp)||age<2000||age>24*60*60*1000)return reply(400,'too_fast');
 }
 try{
  if(!await deps.claimAttempt(request))return reply(429,'rate_limited');
  await deps.send({...data,name:data.name.trim(),business:data.business.trim(),email:data.email.trim(),message:data.message.trim()});
  return reply(200,'ok');
 }catch{return reply(503,'delivery_unavailable');}
};}
