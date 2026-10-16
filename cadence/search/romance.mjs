// Independent dictionary lookup for public CC BY-SA data, not the app engine.
const vowels = new Set(['a','e','i','o','u','y','ø','œ','ə','ɛ','ɔ','ɑ','ɐ','ɪ','ʊ']);
const normalise = value => value.normalize('NFC').trim().toLocaleLowerCase();
export function createRomanceIndex(pack) {
  if (!['fr','es'].includes(pack?.id) || !Array.isArray(pack.entries) || !pack.entries.length || pack.entries.length>250000) throw new Error('Invalid public dictionary');
  const words=new Map(), perfect=new Map(), assonance=new Map();
  for (const row of pack.entries) {
    if (!Array.isArray(row)||row.length!==4) throw new Error('Invalid entry');
    const [word,phones,start,frequency]=row;
    if(typeof word!=='string'||!Array.isArray(phones)||!phones.length||phones.length>100||phones.some(p=>typeof p!=='string'||p.length>8)||!Number.isInteger(start)||start<0||start>=phones.length||!vowels.has(phones[start][0])||!Number.isFinite(frequency)) throw new Error('Invalid pronunciation');
    const tail=phones.slice(start);
    const item={word,reading:phones.join(''),frequency,perfect:tail.join(' '),assonance:tail.filter(p=>vowels.has(p[0])).join(' ')};
    if(!words.has(word))words.set(word,[]);
    words.get(word).push(item);
    for(const [map,key] of [[perfect,item.perfect],[assonance,item.assonance]]){
      if(!map.has(key))map.set(key,[]);
      map.get(key).push(item);
    }
  }
  return {id:pack.id,words,perfect,assonance};
}
export function searchRomance(index,input,mode='perfect',limit=100){
  if(typeof input!=='string'||input.length>60||!['perfect','assonance'].includes(mode))return {state:'invalid',results:[]};
  const word=normalise(input);
  if(!/^[\p{L}\p{M}]+(?:[-'][\p{L}\p{M}]+)*$/u.test(word))return {state:'invalid',results:[]};
  const readings=index.words.get(word);
  if(!readings)return {state:'unknown',results:[]};
  const found=new Map();
  for(const reading of readings)for(const item of index[mode].get(reading[mode])||[]){
    if(item.word!==word&&(!found.has(item.word)||found.get(item.word).frequency<item.frequency))found.set(item.word,item);
  }
  const items=[...found.values()].sort((a,b)=>b.frequency-a.frequency||Math.abs(a.word.length-word.length)-Math.abs(b.word.length-word.length)||a.word.localeCompare(b.word,index.id));
  return {state:'ready',total:items.length,results:items.slice(0,Math.max(1,Math.min(limit,10000))).map(({word,reading})=>({word,reading}))};
}
