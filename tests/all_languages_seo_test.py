import json
import pathlib
import re
import subprocess
import unittest
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOMAIN = 'https://brandnamechanges.com'


class AllLanguageCoverage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.packs = json.loads(subprocess.check_output([
            'node', '--input-type=module', '-e',
            "import {languagePacks} from './content/language-packs.mjs'; console.log(JSON.stringify(languagePacks))",
        ], cwd=ROOT))

    def test_exact_release_catalog(self):
        self.assertEqual({p['id'] for p in self.packs}, {
            'fr','es','pt','pt-pt','de','it','ru','ar','hi','ko','he','ja',
            'tr','id','ms','pl','tl','vi','yo','pcm',
        })
        self.assertEqual(len(self.packs), 20)
        self.assertEqual(len({p['slug'] for p in self.packs}), 20)

    def test_every_pack_is_discoverable_without_javascript(self):
        hub = (ROOT / 'cadence/languages/index.html').read_text()
        sitemap = {n.text for n in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')}
        routes = (ROOT / 'supabase/functions/cadence-search-events/routes.ts').read_text()
        for pack in self.packs:
            for route in [f"/cadence/{pack['route']}/", f"/cadence/languages/{pack['slug']}/"]:
                with self.subTest(route=route):
                    self.assertIn(f'href="{route}"', hub)
                    self.assertIn(DOMAIN + route, sitemap)
                    self.assertIn('"' + route + '"', routes)
                    page = (ROOT / route.lstrip('/') / 'index.html').read_text()
                    self.assertIn(f'rel="canonical" href="{DOMAIN}{route}"', page)
                    self.assertEqual(len(re.findall('<h1[ >]', page)), 1)

    def test_localized_product_cluster_and_direction(self):
        for pack in self.packs:
            page = (ROOT / 'cadence' / pack['route'] / 'index.html').read_text()
            self.assertIn(f'<html lang="{pack["locale"]}"', page)
            if pack['id'] in {'he', 'ar'}:
                self.assertIn('dir="rtl"', page)
            for alternate in self.packs:
                if pack['id'] == 'pcm' or alternate['id'] == 'pcm':
                    continue
                self.assertIn(f'hreflang="{alternate["googleHreflang"]}" href="{DOMAIN}/cadence/{alternate["route"]}/"', page)
            if pack['id'] != 'pcm':
                self.assertIn('hreflang="en"', page)
                self.assertIn('hreflang="x-default"', page)
            else:
                self.assertNotIn('<link rel="alternate"', page)
            # Schema must describe visible answers, rather than hidden keyword text.
            for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page, re.S):
                nodes = json.loads(raw)
                for node in nodes if isinstance(nodes, list) else [nodes]:
                    if node.get('@type') == 'FAQPage':
                        for item in node['mainEntity']:
                            self.assertIn(item['name'], page)
                            self.assertIn(item['acceptedAnswer']['text'], page)

    def test_guides_have_pack_specific_advice_and_real_workflow_links(self):
        for pack in self.packs:
            page = (ROOT / 'cadence/languages' / pack['slug'] / 'index.html').read_text()
            self.assertIn(pack['listeningNote'].replace('’', '’'), page)
            for anchor in ['languages','beat-loop','voice-memos','arrange-draft']:
                self.assertIn('/cadence/guide/#' + anchor, page)
            self.assertIn('not a translation of every app screen', page)
            self.assertIn('three free notes', page)
            self.assertNotIn('<link rel="alternate"', page)

    def test_google_alternate_codes_do_not_invent_supported_languages(self):
        page = (ROOT / 'cadence/index.html').read_text()
        self.assertIn('hreflang="pt-BR"', page)
        self.assertIn('hreflang="pt-PT"', page)
        self.assertIn('hreflang="tl"', page)
        self.assertNotIn('hreflang="pcm"', page)
        self.assertNotIn('hreflang="fil"', page)
        self.assertNotIn('hreflang="en-NG"', page)


if __name__ == '__main__':
    unittest.main()
