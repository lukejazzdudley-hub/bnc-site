"""Build independent public dictionaries; never imports Cadence mobile packs.
Inputs are downloaded upstream files. Rebuild with --source-dir /tmp/...
"""
import argparse,csv,hashlib,json,re,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]


def clusters(text):
    result=[]
    for ch in unicodedata.normalize('NFC',text):
        if unicodedata.combining(ch) and result: result[-1]+=ch
        elif ch not in '/.ˈˌː ':result.append(ch)
    return result


def spanish_nuclei(word):
    text=re.sub(r'qu(?=[eiéí])','q',word)
    text=re.sub(r'gu(?=[eiéí])','g',text).replace('ü','u').replace('h','')
    groups=[]; previous=-2
    for i,ch in enumerate(text):
        if ch not in 'aeiouáéíóú': continue
        accented=ch in 'áéíóú'
        strong=ch in 'aeoáéó' or ch in 'íú'
        if groups and i==previous+1 and not (strong and groups[-1]['strong']) and ch not in 'íú' and not groups[-1]['hiatus']:
            groups[-1]['accent'] |= accented
            groups[-1]['strong'] |= strong
        else:groups.append({'accent':accented,'strong':strong,'hiatus':ch in 'íú','raw_start':sum(c in 'aeiouáéíóú' for c in text[:i])})
        previous=i
    if not groups:return None
    stress=next((i for i,g in enumerate(groups) if g['accent']),None)
    if stress is None:stress=max(0,len(groups)-(2 if re.search(r'[aeiouns]$',word) else 1))
    return len(groups),stress,groups[stress]['raw_start'],sum(c in 'aeiouáéíóú' for c in text)


def build(source):
    fr=[]
    for row in csv.DictReader((source/'Lexique4.1.tsv').open(),delimiter='\t'):
        word=row['1_Mot'].lower().replace('oeu','œu')
        try:frequency=float(row['11_FreqOrtho'])
        except (ValueError,KeyError):continue
        if frequency<0.2 or not re.fullmatch(r"[a-zàâäéèêëîïôöùûüÿçœæ]+(?:[-'][a-zàâäéèêëîïôöùûüÿçœæ]+)*",word):continue
        phones=clusters('pœʁ' if word=='peur' else row['3_Phono_IPA'])
        vowels=[i for i,p in enumerate(phones) if p[0] in 'aeiouyøœəɛɔɑɐɪʊ']
        if not vowels or any(p[0] not in 'abcdefghijklmnopqrstuvwxyzøœəɛɔɑɐɪʊʁɲŋʃʒɥɡɾ' for p in phones):continue
        fr.append([word,phones,vowels[-1],frequency])
    es=[]
    for line in ((source/'spa_latn_la_broad.tsv').read_text()+'\n'+(source/'spa_latn_ca_broad.tsv').read_text()).splitlines():
        if not line:continue
        word,ipa=line.split('\t')
        if word!=word.lower() or not re.fullmatch('[a-záéíóúüñ]+',word):continue
        phones=ipa.split();vowels=[i for i,p in enumerate(phones) if p in 'aeiou']
        nuclei=spanish_nuclei(word)
        # Reject ambiguous alignment instead of manufacturing a stress location.
        if not nuclei:continue
        if nuclei[3]==len(vowels):stress=nuclei[2]
        elif nuclei[0]==len(vowels):stress=nuclei[1]
        else:continue
        if any(p not in {'a','e','i','o','u','b','β','d','ð','ɡ','g','ɣ','p','t','k','f','s','x','h','m','n','ɲ','ŋ','l','ʎ','r','ɾ','j','w','ʝ','t͡ʃ','tʃ','z','ɟ͡ʝ','θ'} for p in phones):continue
        es.append([word,phones,vowels[stress],0])
    # Attested missing inflection, explicitly attributed to Wikcionario oldid=5657214.
    es.extend([['emociones',['e','m','o',c,'j','o','n','e','s'],5,0] for c in ['s','θ']])
    additions={'caminó':('kamino',5,'6023704'),'publicó':('puβ̞liko',6,'5973682'),'terminó':('t̪eɾmino',6,'6022566')}
    for word,(ipa,stress,revision_id) in additions.items():es.append([word,clusters(ipa),stress,0])
    revision=(source/'wikipron-commit.txt').read_text().strip()
    descriptors={}
    for lang,entries,origin in [('fr',fr,'Lexique 4.10; New, Pallier and collaborators'),('es',es,'Wiktionary contributors via WikiPron '+revision)]:
        entries=sorted({(x[0],tuple(x[1]),x[2]):x for x in entries}.values(),key=lambda x:(x[0],x[1]))
        payload={'id':lang,'version':1,'license':'CC-BY-SA-4.0','source':origin,'entries':entries}
        data=json.dumps(payload,ensure_ascii=False,separators=(',',':')).encode()+b'\n'
        target=ROOT/f'cadence/search/public-{lang}.json';target.write_bytes(data)
        descriptors[lang]={'url':f'/cadence/search/public-{lang}.json','sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'entries':len(entries),'source':origin,'license':'CC-BY-SA-4.0'}
    provenance={'dictionaries':descriptors,'inputs':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [source/'Lexique4.1.tsv',source/'spa_latn_la_broad.tsv',source/'spa_latn_ca_broad.tsv']},'spanish_stress':'Derived from orthographic accent/default stress only when orthographic nuclei align with IPA vowels; ambiguous forms excluded. Separate source pronunciations from Latin America and Spain are retained; not dialect-universal.','spanish_additions':{'emociones':{'source':'https://es.wiktionary.org/w/index.php?title=emociones&oldid=5657214','readings':['emoˈsjones','emoˈθjones'],'reason':'Common inflection absent from pinned WikiPron profiles; two attested standard readings retained.'}},'french_corrections':{'peur':{'IPA':'pœʁ','source':'https://fr.wiktionary.org/wiki/peur','reason':'Lexique 4.10 source pøʁ differs from cited dictionary reading; only this explicit form corrected.'}},'french':'Lexique word pronunciations; no automatic liaison, optional poetic schwa or Québec coverage.','review':'Source and automated linguistic checks; independent native-speaker acceptance pending.'}
    for word,(ipa,stress,revision_id) in additions.items():provenance['spanish_additions'][word]={'source':f'https://es.wiktionary.org/w/index.php?title={word}&oldid={revision_id}','reading':ipa,'reason':'Attested verb inflection absent from pinned profiles; stress contrast must be tested with both words present.'}
    (ROOT/'cadence/search/public-romance-provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(descriptors,indent=2,ensure_ascii=False))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--source-dir',type=Path,required=True);args=parser.parse_args();build(args.source_dir)
