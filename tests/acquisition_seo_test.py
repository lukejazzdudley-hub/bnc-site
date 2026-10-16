import html
import json
import pathlib
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
NEW = ['type-beat-songwriting-app', 'songwriting-app-android', 'song-structure', 'freestyle-rap-practice', 'languages', 'fr', 'es']

class AcquisitionSEO(unittest.TestCase):
    def test_intent_pages_have_static_content_and_matching_faqs(self):
        for slug in NEW:
            source = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertEqual(len(re.findall(r'<h1(?:\s[^>]*)?>', source)), 1)
            self.assertIn(f'rel="canonical" href="https://brandnamechanges.com/cadence/{slug}/"', source)
            self.assertGreater(len(re.sub('<[^>]+>', ' ', source)), 1500)
            for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S):
                data = json.loads(raw)
                for node in data if isinstance(data, list) else [data]:
                    if node.get('@type') == 'FAQPage':
                        for q in node['mainEntity']:
                            self.assertIn(q['name'], html.unescape(source))
                            self.assertIn(q['acceptedAnswer']['text'], html.unescape(source))
            self.assertNotRegex(source, r'<meta[^>]+noindex')

    def test_android_and_type_beat_intent_have_truthful_destinations(self):
        android = (ROOT / 'cadence/songwriting-app-android/index.html').read_text()
        self.assertLess(android.index('>Get Cadence on Google Play<'), android.index('>Download on the App Store<'))
        self.assertIn('GarageBand', android)
        beat = (ROOT / 'cadence/type-beat-songwriting-app/index.html').read_text()
        self.assertIn('Original four-bar exercise', beat)
        self.assertIn('A–B', beat)
        self.assertIn('licence', beat)
        self.assertNotIn('AggregateRating', beat)
        guide = (ROOT / 'cadence/resources/writing-rap-lyrics-over-a-beat/index.html').read_text()
        self.assertIn('/cadence/type-beat-songwriting-app/', guide)

    def test_localized_pages_have_full_navigation_and_reciprocity(self):
        for slug, label in [('fr', 'Français'), ('es', 'Español')]:
            source = (ROOT / f'cadence/{slug}/index.html').read_text()
            self.assertIn(f'<html lang="{slug}">', source)
            self.assertIn(label, source)
            self.assertIn('hreflang="fr"', source)
            self.assertIn('hreflang="es"', source)
            self.assertIn('hreflang="en"', source)
            self.assertIn('hreflang="x-default"', source)
            self.assertNotIn('Choose your country', source)
        for route in ['index.html', 'regions/gb/index.html']:
            self.assertIn('hreflang="fr"', (ROOT/'cadence'/route).read_text())

    def test_entry_points_and_sitemap_discover_new_pages(self):
        locations = [e.text for e in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
        for slug in NEW:
            self.assertIn(f'https://brandnamechanges.com/cadence/{slug}/', locations)
        for route in ['index.html', 'songwriting-app/index.html', 'resources/index.html']:
            source = (ROOT/'cadence'/route).read_text()
            self.assertIn('/cadence/type-beat-songwriting-app/', source)
            self.assertIn('/cadence/songwriting-app-android/', source)
            self.assertIn('/cadence/languages/', source)

    def test_crawl_graph_and_indexable_sitemap(self):
        from scripts.audit_crawl import audit
        self.assertEqual(audit()['errors'], [])
        urls = [e.text for e in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
        self.assertNotIn('https://brandnamechanges.com/cadence/feedback/', urls)
