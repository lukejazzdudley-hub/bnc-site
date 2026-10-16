import html as html_module
import json
import pathlib
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOMAIN = 'https://brandnamechanges.com'
MARKETS = {'gb': 'en-GB', 'us': 'en-US', 'ca': 'en-CA', 'au': 'en-AU', 'in': 'en-IN', 'za': 'en-ZA'}


class InternationalSEO(unittest.TestCase):
    def test_regional_pages_have_reciprocal_alternates_and_self_canonicals(self):
        paths = ['cadence/index.html'] + [f'cadence/regions/{code}/index.html' for code in MARKETS]
        for path in paths:
            html = (ROOT / path).read_text()
            self.assertIn('hreflang="x-default" href="' + DOMAIN + '/cadence/"', html)
            self.assertIn('hreflang="en" href="' + DOMAIN + '/cadence/"', html)
            for code, language in MARKETS.items():
                self.assertIn(f'hreflang="{language}" href="{DOMAIN}/cadence/regions/{code}/"', html)
            expected = DOMAIN + '/' + path.removesuffix('index.html')
            self.assertIn(f'rel="canonical" href="{expected}"', html)
            self.assertNotIn('http-equiv="refresh"', html)

    def test_regions_are_useful_local_download_pages(self):
        hub = (ROOT / 'cadence/regions/index.html').read_text()
        descriptions = set()
        for code, language in MARKETS.items():
            html = (ROOT / f'cadence/regions/{code}/index.html').read_text()
            self.assertIn(f'<html lang="{language}">', html)
            self.assertIn(f'https://apps.apple.com/{code}/app/cadence-lyrics-rhymes/id6778554520', html)
            self.assertIn(f'&amp;hl=en&amp;gl={code.upper()}', html)
            self.assertIn(f'/cadence/regions/{code}/', hub)
            self.assertEqual(len(re.findall(r'<h1(?:\s[^>]*)?>', html)), 1)
            self.assertIn('American English', html)
            self.assertIn('Original writing exercise', html)
            self.assertIn('not a recording backup', html)
            self.assertNotIn('LocalBusiness', html)
            descriptions.add(re.search(r'<meta name="description" content="([^"]+)"', html)[1])
        self.assertEqual(len(descriptions), len(MARKETS))

    def test_visible_faqs_match_structured_answers(self):
        for path in ['cadence/index.html'] + [f'cadence/regions/{code}/index.html' for code in MARKETS] + [f'cadence/{slug}/index.html' for slug in ['songwriting-app', 'rap-writing-app', 'voice-memos-to-lyrics', 'springtime-showers', 'rhyme-finder']]:
            html = (ROOT / path).read_text()
            schemas = [json.loads(s) for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]
            nodes = [node for s in schemas for node in (s if isinstance(s, list) else [s])]
            faq = next(n for n in nodes if n.get('@type') == 'FAQPage')
            for question in faq['mainEntity']:
                self.assertIn(question['name'], html_module.unescape(html))
                self.assertIn(question['acceptedAnswer']['text'], html_module.unescape(html))

    def test_sitemap_and_entry_points_discover_regions(self):
        locations = [e.text for e in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
        for code in ['', *MARKETS]:
            route = '/cadence/regions/' + (code + '/' if code else '')
            self.assertIn(DOMAIN + route, locations)
        self.assertEqual(len(locations), len(set(locations)))
        for path in ['cadence/index.html', 'cadence/resources/index.html', 'cadence/songwriting-app/index.html']:
            self.assertIn('href="/cadence/regions/"', (ROOT / path).read_text())

    def test_brand_alias_keeps_product_identity_and_store_urls(self):
        html = (ROOT / 'cadence/index.html').read_text()
        self.assertIn('Flow by Cadence', html)
        self.assertIn('"alternateName":"Flow by Cadence"', html)
        self.assertIn('"name":"Cadence"', html)
        self.assertNotIn('https://flowbycadence.com/cadence/', html)


if __name__ == '__main__':
    unittest.main()
