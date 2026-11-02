import test from 'node:test';
import assert from 'node:assert/strict';
import {createRomanceIndex,searchRomance} from '../cadence/search/romance.mjs';
const index=createRomanceIndex({id:'fr',entries:[['amour',['u','ʁ'],0,10],['jour',['u','ʁ'],0,8],['bonjour',['u','ʁ'],0,4],['retour',['u','ʁ'],0,6],['séjour',['u','ʁ'],0,2]]});
test('prefix filters the complete candidate set before pagination',()=>{
 const result=searchRomance(index,'amour','perfect',1,0,{prefix:' RE '});
 assert.equal(result.total,1);assert.equal(result.results[0].word,'retour');
 assert.equal(searchRomance(index,'amour','perfect',100,0,{prefix:'xyz'}).total,0);
 assert.equal(searchRomance(index,'amour','perfect',100,0,{prefix:'se\u0301'}).results[0].word,'séjour');
});
test('alphabetical ordering is deterministic and keeps all matching words',()=>{
 const alpha=searchRomance(index,'amour','perfect',100,0,{sort:'alphabetical'});
 assert.deepEqual(alpha.results.map(r=>r.word),['bonjour','jour','retour','séjour']);
 assert.equal(searchRomance(index,'amour').results[0].word,'jour');
 assert.equal(alpha.total,searchRomance(index,'amour').total);
 assert.equal(searchRomance(index,'amour','perfect',1,1,{sort:'alphabetical'}).results[0].word,'jour');
});
test('malformed filters fail closed rather than silently changing a query',()=>{
 for(const options of [null,[],{sort:'bad'},{prefix:3},{prefix:'a'.repeat(61)},{prefix:'<script>'}])assert.equal(searchRomance(index,'amour','perfect',100,0,options).state,'invalid');
});
