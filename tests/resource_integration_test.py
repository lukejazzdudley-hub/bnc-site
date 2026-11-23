import pathlib
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
SLUGS = [
    'best-songwriting-app-ios-android',
    'organize-song-drafts', 'how-to-write-a-song-hook',
    'types-of-rhyme', 'multi-word-rhymes', 'assonance-vs-consonance',
    'best-songwriting-apps-for-iphone', 'best-songwriting-apps-for-android',
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
        self.assertEqual(len(sitemap), 98)
        for code in ['', 'gb/', 'us/', 'ca/', 'au/', 'in/', 'za/']:
            self.assertIn('https://brandnamechanges.com/cadence/regions/' + code, sitemap)

    def test_existing_entry_points_link_to_hub(self):
        for slug in ['', 'songwriting-app', 'rap-writing-app', 'rhyme-finder',
                     'voice-memos-to-lyrics', 'springtime-showers']:
            html = (ROOT / 'cadence' / slug / 'index.html').read_text()
            self.assertIn('href="/cadence/resources/"', html)

    def test_localised_mobile_comparisons_have_reciprocal_alternates(self):
        routes = {
            'es': '/cadence/es/mejores-apps-para-escribir-canciones/',
            'fr': '/cadence/fr/meilleures-applications-ecrire-chansons/',
            'pt-BR': '/cadence/pt/melhores-apps-para-compor-musicas/',
        }
        base = 'https://brandnamechanges.com'
        sitemap = (ROOT / 'sitemap.xml').read_text()
        for language, route in routes.items():
            with self.subTest(language=language):
                html = (ROOT / route.lstrip('/') / 'index.html').read_text()
                self.assertIn(f'<html lang="{language}">', html)
                self.assertIn(f'rel="canonical" href="{base}{route}"', html)
                self.assertIn(f'<loc>{base}{route}</loc>', sitemap)
                for alternate, destination in routes.items():
                    self.assertIn(f'hreflang="{alternate}" href="{base}{destination}"', html)
                self.assertEqual(html.count('hreflang='), len(routes))
                product_page = ROOT / 'cadence' / language.split('-')[0] / 'index.html'
                self.assertIn(f'href="{route}"', product_page.read_text())
