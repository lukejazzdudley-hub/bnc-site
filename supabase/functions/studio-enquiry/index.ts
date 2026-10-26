import {createEnquiryHandler, type Enquiry} from './handler.ts';
const url=Deno.env.get('SUPABASE_URL')||'';
const role=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const salt=Deno.env.get('STUDIO_ENQUIRY_IP_SALT')||'';
const resendKey=Deno.env.get('STUDIO_ENQUIRY_RESEND_KEY')||'';
const sender=Deno.env.get('STUDIO_ENQUIRY_FROM')||'';
// TODO(Luke): configure the three STUDIO_ENQUIRY_* secrets and deploy only after
// review. No credentials are included in the static site or checked-in files.
const configured=()=>Boolean(url&&role&&salt&&resendKey&&sender);
Deno.serve(createEnquiryHandler({
 now:Date.now,
 allowLocal:Deno.env.get('STUDIO_ENQUIRY_ALLOW_LOCAL')==='true',
 async claimAttempt(request){
  if(!configured())throw new Error('enquiry_unconfigured');
  const address=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const hour=new Date().toISOString().slice(0,13);
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(salt),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`studio-enquiry:${hour}:${address}`));
  const bucket=[...new Uint8Array(signature)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
  const response=await fetch(`${url}/rest/v1/rpc/claim_studio_enquiry_attempt`,{method:'POST',headers:{apikey:role,Authorization:`Bearer ${role}`,'Content-Type':'application/json'},body:JSON.stringify({p_bucket:bucket}),signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new Error('rate_limit_unavailable');
  return await response.json()===true;
 },
 async send(data:Enquiry){
  if(!configured())throw new Error('enquiry_unconfigured');
  const text=[`Name: ${data.name}`,`Email: ${data.email}`,`Business: ${data.business}`,`Website: ${data.website||'Not supplied'}`,`Needs: ${data.needs.join(', ')}`,'',data.message].join('\n');
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${resendKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:sender,to:['brandnamechanges@gmail.com'],reply_to:data.email,subject:'New project enquiry — Brand Name Changes',text}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('email_delivery_failed');
  const receipt=await response.json();if(!receipt.id)throw new Error('email_receipt_missing');
 }
}));
