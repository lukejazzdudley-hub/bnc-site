import unittest,json,hashlib,re,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class GrowthContracts(unittest.TestCase):
 def test_public_pack_integrity_and_native_discovery(self):
  p=json.loads((ROOT/'cadence/search/public-romance-provenance.json').read_text())
  for lang,slug in [('fr','dictionnaire-rimes'),('es','diccionario-rimas')]:
   b=(ROOT/f'cadence/search/public-{lang}.json').read_bytes()
   self.assertEqual(hashlib.sha256(b).hexdigest(),p['dictionaries'][lang]['sha256'])
   html=(ROOT/f'cadence/{lang}/{slug}/index.html').read_text()
   self.assertIn(f'<html lang="{lang}">',html)
   self.assertEqual(len(re.findall('<h1>',html)),1)
   self.assertIn('CC BY-SA 4.0',html)
   for code in ['en','fr','es','x-default']:self.assertIn(f'hreflang="{code}"',html)
 def test_all_acquisition_pages_include_single_optional_module(self):
  for e in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc'):
   route=e.text.split('brandnamechanges.com',1)[1]
   if not route.startswith('/cadence/'):continue
   html=(ROOT/route.lstrip('/')/'index.html').read_text()
   self.assertEqual(html.count('src="/cadence/search/measurement.mjs"'),1,route)
 def test_navigation_asset_preserves_real_animation(self):
  from PIL import Image
  with Image.open(ROOT/'assets/cadence/cadence-mark.webp') as a,Image.open(ROOT/'assets/cadence/cadence-mark-nav.webp') as b:
   self.assertEqual(a.n_frames,b.n_frames)
   self.assertEqual(b.size,(64,64))
  self.assertLess((ROOT/'assets/cadence/cadence-mark-nav.webp').stat().st_size,65000)
 def test_measurement_tables_are_private(self):
  sql=(ROOT/'supabase/migrations/20261016030000_cadence_search_counts.sql').read_text()
  for table in ['cadence_search_daily','cadence_search_abuse_buckets']:self.assertIn(f'alter table public.{table} enable row level security',sql)
  self.assertIn('from public,anon,authenticated',sql)
  self.assertNotIn('grant select on public.cadence_search_daily to anon',sql)
