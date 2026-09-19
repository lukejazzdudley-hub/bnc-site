import struct
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class ShareCardTest(unittest.TestCase):
    def test_share_image_is_branded_landscape_png(self):
        page = (ROOT / 'cadence/index.html').read_text()
        image = ROOT / 'assets/cadence/share-card-v1.png'
        self.assertIn('https://brandnamechanges.com/assets/cadence/share-card-v1.png', page)
        self.assertNotIn('content="https://brandnamechanges.com/assets/cadence/screens/library.webp"', page)
        self.assertIn('name="twitter:image"', page)
        data = image.read_bytes()
        self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
        self.assertEqual(struct.unpack('>II', data[16:24]), (1200, 630))
        self.assertLess(len(data), 2_000_000)
