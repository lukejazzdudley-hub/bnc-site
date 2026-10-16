import {createHandler,normaliseEvent} from './handler.ts';
function assert(x:unknown){if(!x)throw new Error('Assertion failed');}
const valid={event:'store',route:'/cadence/type-beat-songwriting-app/',source:'google',store:'google'};
Deno.test('rejects search text, arbitrary routes, unknown dimensions and oversized payloads',()=>{
 assert(normaliseEvent(valid));
 for(const patch of [{query:'my lyric'},{route:'/cadence/?email=private'},{route:'/evil'},{source:'user@example.com'},{store:'malicious'},{event:'recording'}])assert(!normaliseEvent({...valid,...patch}));
});
Deno.test('preflight, origin, method and failure behavior',async()=>{
 const calls:unknown[]=[];const handler=createHandler(async e=>{calls.push(e);});
 assert((await handler(new Request('https://x',{method:'OPTIONS',headers:{Origin:'https://brandnamechanges.com'}}))).status===204);
 assert((await handler(new Request('https://x',{method:'POST',body:JSON.stringify(valid),headers:{Origin:'https://evil.example'}}))).status===403);
 assert((await handler(new Request('https://x',{method:'GET',headers:{Origin:'https://brandnamechanges.com'}}))).status===405);
 assert((await handler(new Request('https://x',{method:'POST',body:JSON.stringify(valid),headers:{Origin:'https://brandnamechanges.com'}}))).status===204);
 assert(calls.length===1);
});
Deno.test('invalid and failed writes cannot report collection success',async()=>{
 const req=(body:string)=>new Request('https://x',{method:'POST',body,headers:{Origin:'https://brandnamechanges.com'}});
 assert((await createHandler(async()=>{})(req('{'))).status===400);
 assert((await createHandler(async()=>{})(req('x'.repeat(1025)))).status===413);
 assert((await createHandler(async()=>{throw new Error('offline');})(req(JSON.stringify(valid)))).status===503);
});
