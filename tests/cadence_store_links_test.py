from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CADENCE_PAGE = ROOT / "cadence" / "index.html"
GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=io.cadenceapp.mobile"
LEGACY_TESTING_URL = "https://play.google.com/apps/testing/io.cadenceapp.mobile"


class CadenceStoreLinksTest(unittest.TestCase):
    def test_android_ctas_use_the_public_google_play_listing(self) -> None:
        html = CADENCE_PAGE.read_text(encoding="utf-8")

        self.assertEqual(html.count(f'href="{GOOGLE_PLAY_URL}"'), 2)
        self.assertNotIn(LEGACY_TESTING_URL, html)
        self.assertEqual(html.count("Get it on</small>Google Play"), 2)


if __name__ == "__main__":
    unittest.main()
