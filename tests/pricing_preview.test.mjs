import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {productFaqs} from '../content/regions.mjs';
test('future cloud pricing remains qualified in visible copy and structured answers',()=>{
 const faq=productFaqs.find(f=>f.question.includes('charge only'));
 assert.match(faq.answer,/planned pricing model, not the current release/);
 assert.match(faq.answer,/three-note free start and Pro feature limits still apply/);
 const html=readFileSync(new URL('../cadence/index.html',import.meta.url),'utf8');
 assert.ok(html.includes(faq.answer));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.ok(schemas.some(s=>s.mainEntity?.some(q=>q.name===faq.question&&q.acceptedAnswer.text===faq.answer)));
 assert.match(html,/Upcoming pricing change — not yet available/);
});
