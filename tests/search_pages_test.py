import json
import pathlib
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
SLUGS = ['songwriting-app', 'rap-writing-app', 'voice-memos-to-lyrics', 'springtime-showers', 'rhyme-finder']

class SearchPages(unittest.TestCase):
    def test_editorial_design_and_artist_positioning(self):
        for slug in SLUGS:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn('class="atmosphere" aria-hidden="true"', html)
            self.assertIn('/cadence/search/atmosphere.mjs', html)
            self.assertIn('Tools for your writing. Not writing in your place.', html)
            self.assertIn('loading="lazy"', html)
        for slug in ['songwriting-app', 'rap-writing-app']:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn('Writing workflow comparison', html)
            self.assertIn('scope="row"', html)
            self.assertIn('not a feature rating of individual products', html)

    def test_background_respects_motion_and_does_not_track(self):
        source = (ROOT / 'cadence/search/atmosphere.mjs').read_text()
        self.assertIn('prefers-reduced-motion: reduce', source)
        self.assertIn('pointer: fine', source)
        self.assertIn('cancelAnimationFrame', source)
        self.assertNotIn('fetch(', source)
        self.assertNotIn('localStorage', source)

    def test_established_transparent_brand_animation(self):
        for slug in SLUGS:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn('data-animated-mark', html)
            self.assertIn('/assets/cadence/cadence-mark.webp', html)
            self.assertIn('prefers-reduced-motion: reduce', html)
            self.assertIn('/cadence/media-policy.js', html)
            self.assertNotIn('<img src="/assets/cadence/app-icon.webp"', html)

    def test_metadata_and_internal_assets(self):
        for slug in SLUGS:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn(f'https://brandnamechanges.com/cadence/{slug}/', html)
            self.assertEqual(len(re.findall('<h1>', html)), 1)
            for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html):
                self.assertEqual(len(json.loads(raw)), 2)
            for url in re.findall(r'(?:href|src)="(/[^"#]*)"', html):
                path = ROOT / url.lstrip('/')
                self.assertTrue(path.exists() or path.with_suffix('.html').exists(), url)

    def test_sitemap_contains_every_search_page(self):
        urls = [e.text for e in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
        for slug in SLUGS:
            self.assertIn(f'https://brandnamechanges.com/cadence/{slug}/', urls)
        self.assertEqual(len(set(urls)), len(urls))

    def test_no_autoplay_or_sensitive_query_logging(self):
        for slug in SLUGS:
            self.assertNotIn('autoplay', (ROOT / 'cadence' / slug / 'index.html').read_text())
        source = (ROOT / 'cadence/search/tool.mjs').read_text()
        self.assertNotIn('localStorage', source)
        self.assertNotIn('fetch(', source)
        self.assertNotIn('innerHTML', source)

    def test_dictionary_provenance(self):
        import hashlib
        data = (ROOT / 'cadence/search/dictionary.json').read_bytes()
        provenance = json.loads((ROOT / 'cadence/search/dictionary-provenance.json').read_text())
        self.assertEqual(hashlib.sha256(data).hexdigest(), provenance['sha256'])
        self.assertLess(len(data), 4500000)
