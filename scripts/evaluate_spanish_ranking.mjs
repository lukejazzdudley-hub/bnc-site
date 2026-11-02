// Engineering comparison. Human preference cells are deliberately blank.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createRomanceIndex,searchRomance} from '../cadence/search/romance.mjs';
const output=process.argv[2];
if(!output)throw new Error('Provide a private output directory');
const raw=readFileSync(new URL('../cadence/search/public-es.json',import.meta.url));
const pack=JSON.parse(raw);
const old=createRomanceIndex({...pack,entries:pack.entries.map(r=>[...r.slice(0,3),0])});
const next=createRomanceIndex(pack);
const queries=JSON.parse(readFileSync(new URL('../content/research/spanish-evaluation-queries.json',import.meta.url)));
const cases=[];
for(const [n,word] of queries.words.entries()) for(const mode of ['perfect','assonance']) {
 const before=searchRomance(old,word,mode),after=searchRomance(next,word,mode);
 if(before.state!==after.state||before.total!==after.total)throw new Error(`Coverage changed: ${word}/${mode}`);
 cases.push({case:n+1,word,mode,state:after.state,total:after.total??0,before:before.results.slice(0,10).map(x=>x.word),after:after.results.slice(0,10).map(x=>x.word)});
}
mkdirSync(output,{recursive:true});
writeFileSync(resolve(output,'dictionary-evaluation.json'),JSON.stringify({dictionarySha256:createHash('sha256').update(raw).digest('hex'),cases,summary:{queries:queries.words.length,modeCases:cases.length,unknownCases:cases.filter(x=>x.state==='unknown').length,changedTopTen:cases.filter(x=>JSON.stringify(x.before)!==JSON.stringify(x.after)).length},limits:queries.purpose},null,2)+'\n');
const blind=['case\tword\tmode\tA\tB\tpreferred_A_B_tie\trhyme_errors\tdialect\treviewer_notes'];
const key=[];
for(const row of cases){const flip=createHash('sha256').update(`${row.case}/${row.mode}`).digest()[0]%2===1;blind.push([row.case,row.word,row.mode,(flip?row.after:row.before).join(', '),(flip?row.before:row.after).join(', '),'','','',''].join('\t'));key.push({case:row.case,mode:row.mode,A:flip?'frequency':'baseline'});}
writeFileSync(resolve(output,'dictionary-blind-review.tsv'),blind.join('\n')+'\n');
writeFileSync(resolve(output,'dictionary-blind-key.json'),JSON.stringify(key,null,2)+'\n');
console.log(JSON.stringify({queries:queries.words.length,cases:cases.length,unknown:cases.filter(x=>x.state==='unknown').length,changedTopTen:cases.filter(x=>JSON.stringify(x.before)!==JSON.stringify(x.after)).length}));
