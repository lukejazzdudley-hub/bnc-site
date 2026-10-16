"""Summarise private aggregate exports; never infer installs or individual queries."""
import argparse,csv
from collections import defaultdict
from pathlib import Path

def summarise(rows):
 totals=defaultdict(lambda:{'views':0,'apple_store_clicks':0,'google_store_clicks':0})
 for r in rows:
  key=(r['route'],r['source']);n=int(r['count'])
  if n<0:raise ValueError('Negative count')
  if r['event']=='view' and r['store']=='none':totals[key]['views']+=n
  elif r['event']=='store' and r['store'] in ('apple','google'):totals[key][r['store']+'_store_clicks']+=n
  else:raise ValueError('Invalid aggregate dimensions')
 return [dict(route=k[0],source=k[1],**v) for k,v in sorted(totals.items())]

def main():
 p=argparse.ArgumentParser();p.add_argument('input',type=Path);p.add_argument('--output',required=True,type=Path);a=p.parse_args()
 root=Path(__file__).resolve().parents[1]
 if a.output.resolve().is_relative_to(root):p.error('Save private reports outside the public repository')
 with a.input.open() as f:rows=summarise(csv.DictReader(f))
 with a.output.open('x',newline='') as f:
  w=csv.DictWriter(f,fieldnames=['route','source','views','apple_store_clicks','google_store_clicks']);w.writeheader();w.writerows(rows)
 print(f'Wrote {len(rows)} route/source aggregates; no installs inferred')
if __name__=='__main__':main()
