import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {workflowEvidence,workflowTrial} from '../content/resources/workflow-evidence.mjs';
const home=readFileSync(new URL('../cadence/index.html',import.meta.url),'utf8');
test('workflow proof reuses the three approved quotes without new endorsements',()=>{
 const quotes=[...workflowEvidence.html.matchAll(/<blockquote><p>(.*?)<\/p><\/blockquote>/g)].map(x=>x[1]);
 assert.equal(quotes.length,3);for(const quote of quotes)assert.ok(home.includes(quote));
 assert.match(workflowEvidence.html,/same three/);
 assert.match(workflowEvidence.html,/complimentary access/);
 assert.match(workflowEvidence.html,/not a controlled comparison/);
 assert.doesNotMatch(workflowEvidence.html,/@|AggregateRating|reviewRating/);
});
test('buyer guide publishes readable evidence and a genuinely blank scorecard',()=>{
 const html=readFileSync(new URL('../cadence/resources/choosing-a-songwriting-app/index.html',import.meta.url),'utf8');
 assert.ok(html.includes(workflowEvidence.heading));assert.ok(html.includes(workflowTrial.heading));
 const rows=readFileSync(new URL('../cadence/resources/songwriting-workflow-scorecard.tsv',import.meta.url),'utf8').trimEnd().split('\n');
 assert.equal(rows.length,7);
 for(const row of rows.slice(1)){const cells=row.split('\t');assert.equal(cells[0],'');assert.ok(cells[6]);assert.equal(cells[7]??'','');}
});
