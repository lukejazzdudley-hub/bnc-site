"""Build public English frequency metadata. Run with wordfreq==3.1.1.

Output is adapted wordfreq data under CC BY-SA 4.0, not app engine data.
"""
import json
import sys
from pathlib import Path
from importlib.metadata import version
from wordfreq import zipf_frequency

if version('wordfreq') != '3.1.1':
    raise RuntimeError('Rebuild with wordfreq==3.1.1')
root = Path(__file__).resolve().parents[1]
pack = json.loads((root / 'cadence/search/pack-en.json').read_text())
words = sorted({entry[0].split('(')[0] for entry in pack['entries']})
scores = {word: zipf_frequency(word, 'en') for word in words}
Path(sys.argv[1]).write_text(json.dumps(scores, separators=(',', ':')) + '\n')
print(f'Built frequency scores for {len(scores)} English words')
