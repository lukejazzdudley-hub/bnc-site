import {createHandler} from './handler.ts';
const url=Deno.env.get('SUPABASE_URL')||'';
const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
// Reuse the configured abuse-prevention secret with domain separation. This
// HMAC is an hourly abuse bucket only, never an analytics/session identifier.
const salt=Deno.env.get('FEEDBACK_IP_SALT')||'';
Deno.serve(createHandler(async(event,request)=>{
 if(!url||!key||!salt)throw new Error('Collection unavailable');
 const hour=new Date().toISOString().slice(0,13);
 const address=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const hmacKey=await crypto.subtle.importKey('raw',new TextEncoder().encode(salt),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const digest=await crypto.subtle.sign('HMAC',hmacKey,new TextEncoder().encode(`cadence-web-counts:${hour}:${address}`));
 const bucket=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
 const response=await fetch(`${url}/rest/v1/rpc/count_cadence_search_event`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({p_route:event.route,p_source:event.source,p_event:event.event,p_store:event.store,p_bucket:bucket})});
 if(!response.ok)throw new Error('Aggregate write failed');
}));
