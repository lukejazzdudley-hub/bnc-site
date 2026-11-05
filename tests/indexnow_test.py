import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('notify',Path(__file__).resolve().parents[1]/'scripts/notify_indexnow.py')
notify=importlib.util.module_from_spec(spec)
spec.loader.exec_module(notify)
class IndexNowTest(unittest.TestCase):
    def test_only_public_canonical_sitemap_urls(self):
        for urls in [[],['https://evil.example/'],['https://brandnamechanges.com/cadence/?private=1'],['https://brandnamechanges.com/cadence/#pro'],['https://brandnamechanges.com/not-a-page/']]:
            with self.assertRaises(ValueError):notify.payload_for(urls)
    def test_deduplicates_and_token_matches_public_file(self):
        url='https://brandnamechanges.com/cadence/'
        result=notify.payload_for([url,url])
        self.assertEqual(result['urlList'],[url])
        self.assertEqual((notify.ROOT/(result['key']+'.txt')).read_text().strip(),result['key'])
