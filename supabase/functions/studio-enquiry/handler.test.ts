import {createEnquiryHandler} from './handler.ts';
function assert(value:unknown,message='Assertion failed'):void{if(!value)throw new Error(message);}
const now=1793020000000;
const fields={name:'Example Person',email:'person@example.test',business:'Fictional test',needs:'Website',message:'Please build a booking site.',company_fax:'',started_at:String(now-5000)};
function setup(options:{sendFails?:boolean;rate?:boolean}={}){const delivered:unknown[]=[];let claims=0;const handle=createEnquiryHandler({now:()=>now,allowLocal:true,claimAttempt:async()=>{claims++;return options.rate!==false;},send:async data=>{if(options.sendFails)throw new Error('provider failure');delivered.push(data);}});return {handle,delivered,claims:()=>claims};}
function request(body:Record<string,string>=fields,headers:Record<string,string>={}){return new Request('https://example.test/function',{method:'POST',headers:{Origin:'http://127.0.0.1:8000',Accept:'application/json','Content-Type':'application/x-www-form-urlencoded',...headers},body:new URLSearchParams(body)});}
Deno.test('valid submissions deliver once; native no-JS submissions redirect with no personal data',async()=>{
 const s=setup();const response=await s.handle(request());assert(response.status===200);assert(s.delivered.length===1);
 const native=await s.handle(request({...fields,started_at:''},{Accept:'text/html'}));assert(native.status===303);assert(native.headers.get('location')==='http://127.0.0.1:8000/contact/thanks/');assert(s.delivered.length===2);assert(s.claims()===2);
});
Deno.test('honeypot silently discards; timing and invalid fields never send',async()=>{
 const s=setup();assert((await s.handle(request({...fields,company_fax:'bot'}))).status===200);
 for(const invalid of ([{started_at:String(now)},{started_at:String(now+5000)},{started_at:'invalid'},{started_at:String(now-100000000)},{email:'bad'},{message:''},{needs:'Bad option'},{email:'ok@example.test\r\nBcc: x@y.test'},{website:'javascript:alert(1)'}] as Record<string,string>[]))assert((await s.handle(request({...fields,...invalid}))).status===400);
 assert(!s.delivered.length);assert(!s.claims());
});
Deno.test('origin, method, format and streaming body bounds fail closed',async()=>{
 const s=setup();assert((await s.handle(request(fields,{Origin:'https://evil.example'}))).status===403);
 assert((await s.handle(new Request('https://example.test',{method:'GET',headers:{Origin:'http://127.0.0.1:8000',Accept:'application/json'}}))).status===405);
 assert((await s.handle(request(fields,{'Content-Type':'application/json'}))).status===415);
 assert((await s.handle(request({...fields,message:'x'.repeat(20000)}))).status===413);
 assert(!s.delivered.length);
});
Deno.test('rate limit and provider failures never claim delivery; native errors are fixed redirects',async()=>{
 assert((await setup({rate:false}).handle(request())).status===429);
 const s=setup({sendFails:true});assert((await s.handle(request())).status===503);assert(!s.delivered.length);
 const native=await s.handle(request(fields,{Accept:'text/html'}));assert(native.status===303);assert(native.headers.get('Location')==='http://127.0.0.1:8000/contact/error/');
});
Deno.test('development origins are opt-in; production CORS is bounded',async()=>{
 const handle=createEnquiryHandler({now:()=>now,allowLocal:false,claimAttempt:async()=>true,send:async()=>{}});
 assert((await handle(request())).status===403);
 const production=await handle(request(fields,{Origin:'https://brandnamechanges.com'}));assert(production.headers.get('Access-Control-Allow-Origin')==='https://brandnamechanges.com');assert(production.status===200);
});
