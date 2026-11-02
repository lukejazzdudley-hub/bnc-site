"""Add attributed general-language frequency ordering; never change pronunciations.
Requires wordfreq==3.1.1 in an isolated authoring environment, not in the browser.
"""
import argparse
import hashlib
import json
from importlib.metadata import version
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def enrich(pack):
    from wordfreq import zipf_frequency
    if version('wordfreq') != '3.1.1':
        raise ValueError('Rebuild requires wordfreq==3.1.1')
    if pack.get('id') != 'es':
        raise ValueError('Only the Spanish public dictionary is supported')
    for row in pack['entries']:
        row[3] = zipf_frequency(row[0], 'es', wordlist='large')
    pack['version'] = 2
    pack['ranking'] = {
        'name': 'wordfreq', 'version': '3.1.1', 'metric': 'Zipf frequency',
        'attribution': 'Robyn Speer (2022), wordfreq; underlying corpus contributors credited in WORDFREQ-NOTICE.md.',
        'source': 'https://github.com/rspeer/wordfreq',
        'citation': 'https://doi.org/10.5281/zenodo.7199437',
        'license': 'CC-BY-SA-4.0',
        'notice': '/cadence/search/licenses/WORDFREQ-NOTICE.md',
        'changes': 'Frequency estimates joined to existing Spanish pronunciation entries by word using the wordfreq API. Missing estimates remain zero; no entries removed.',
        'limits': 'General-language usage through about 2021, not song lyrics, search demand, dialect-specific popularity or native editorial acceptance.'
    }
    return pack

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    target = args.root/'cadence/search/public-es.json'
    pack = enrich(json.loads(target.read_text()))
    raw = (json.dumps(pack, ensure_ascii=False, separators=(',', ':'))+'\n').encode()
    manifest_path = args.root/'cadence/search/public-romance-provenance.json'
    manifest = json.loads(manifest_path.read_text())
    manifest['dictionaries']['es'].update(sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw))
    manifest['spanish_ranking'] = pack['ranking']
    target.write_bytes(raw)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'entries':len(pack['entries']), 'with_frequency':sum(row[3]>0 for row in pack['entries']), 'bytes':len(raw)}))

if __name__ == '__main__':
    main()
