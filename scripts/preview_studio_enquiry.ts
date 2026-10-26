// Local test transport only. No provider, credentials, data storage or outbound mail.
import {createEnquiryHandler} from '../supabase/functions/studio-enquiry/handler.ts';
const attempts=new Map<string,number>();
Deno.serve({hostname:'127.0.0.1',port:54329},createEnquiryHandler({now:Date.now,allowLocal:true,
 claimAttempt:async()=>{const hour=new Date().toISOString().slice(0,13);const count=(attempts.get(hour)||0)+1;attempts.clear();attempts.set(hour,count);return count<=50;},
 send:async data=>{if(!data.email.endsWith('@example.test'))throw new Error('preview_accepts_test_addresses_only');}
}));
