"""Read-only app-label drift check for the public guide, not a device UI test."""
import argparse,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def check(app_root,evidence):
 errors=[]
 for relative,tokens in evidence['files'].items():
  target=app_root/relative
  if not target.is_file():errors.append(f'Missing source: {relative}');continue
  text=target.read_text()
  for token in tokens:
   if token not in text:errors.append(f'Review guide: {relative} no longer contains {token!r}')
 return errors
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--app-root',type=Path,required=True);a=p.parse_args()
 evidence=json.loads((ROOT/'docs/seo/growth/feature-guide-evidence.json').read_text());errors=check(a.app_root,evidence)
 print('\n'.join(errors) if errors else f'Guide source-label check passed for {len(evidence["files"])} files; device review is separate.')
 raise SystemExit(bool(errors))
