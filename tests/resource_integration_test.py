import pathlib
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
SLUGS = [
    'writing-rap-lyrics-over-a-beat', 'perfect-slant-multisyllabic-rhymes',
    'internal-rhymes-and-rhyme-schemes', 'syllables-stress-and-flow',
    'organise-voice-memos-into-songs', 'lyric-draft-to-recorded-demo',
    'choosing-a-songwriting-app', 'cadence-vs-bandlab',
    'cadence-vs-garageband', 'cadence-vs-song-cage',
]


class ResourceIntegration(unittest.TestCase):
    def test_hub_and_article_routes_exist_and_are_discoverable(self):
        hub = (ROOT / 'cadence/resources/index.html').read_text()
        sitemap = [x.text for x in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
        for slug in SLUGS:
            route = f'/cadence/resources/{slug}/'
            self.assertIn(route, hub)
            self.assertIn('https://brandnamechanges.com' + route, sitemap)
            html = (ROOT / route.lstrip('/') / 'index.html').read_text()
            self.assertEqual(len(re.findall(r'<h1(?:\s[^>]*)?>', html)), 1)
            self.assertIn('rel="canonical"', html)
            self.assertIn('/cadence/resources/', html)
            for url in re.findall(r'(?:href|src)="(/[^"#?]*)', html):
                path = ROOT / url.lstrip('/')
                self.assertTrue(path.exists() or path.with_suffix('.html').exists(), url)
        self.assertEqual(len(sitemap), len(set(sitemap)))
        self.assertEqual(len(sitemap), 23)

    def test_existing_entry_points_link_to_hub(self):
        for slug in ['', 'songwriting-app', 'rap-writing-app', 'rhyme-finder',
                     'voice-memos-to-lyrics', 'springtime-showers']:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn('href="/cadence/resources/"', html)
