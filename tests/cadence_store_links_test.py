from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CADENCE_PAGE = ROOT / "cadence" / "index.html"
APPLE_APP_STORE_URL = "https://apps.apple.com/gb/app/cadence-lyrics-rhymes/id6778554520"
GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=io.cadenceapp.mobile"
LEGACY_TESTING_URL = "https://play.google.com/apps/testing/io.cadenceapp.mobile"
LEGACY_TESTFLIGHT_URL = "https://testflight.apple.com/join/RdX9wmAq"


class CadenceStoreLinksTest(unittest.TestCase):
    def test_android_ctas_use_the_public_google_play_listing(self) -> None:
        html = CADENCE_PAGE.read_text(encoding="utf-8")

        self.assertEqual(html.count(f'href="{GOOGLE_PLAY_URL}"'), 2)
        self.assertNotIn(LEGACY_TESTING_URL, html)
        self.assertEqual(html.count("Get it on</small>Google Play"), 2)

    def test_apple_ctas_use_the_public_app_store_listing(self) -> None:
        html = CADENCE_PAGE.read_text(encoding="utf-8")

        self.assertEqual(html.count(f'href="{APPLE_APP_STORE_URL}"'), 2)
        self.assertNotIn(LEGACY_TESTFLIGHT_URL, html)
        self.assertEqual(html.count("Download on the</small>App Store"), 2)
        self.assertIn('name="apple-itunes-app" content="app-id=6778554520"', html)

    def test_product_schema_links_both_public_storefronts(self) -> None:
        html = CADENCE_PAGE.read_text(encoding="utf-8")
        schema = html.split('<script type="application/ld+json">', 1)[1].split("</script>", 1)[0]

        self.assertIn(APPLE_APP_STORE_URL, schema)
        self.assertIn(GOOGLE_PLAY_URL, schema)

    def test_public_html_contains_no_cadence_testflight_acquisition_copy(self) -> None:
        failures = []
        for page in ROOT.rglob("*.html"):
            html = page.read_text(encoding="utf-8").lower()
            if "testflight.apple.com" in html or "through testflight" in html:
                failures.append(str(page.relative_to(ROOT)))

        self.assertEqual(failures, [])


if __name__ == "__main__":
    unittest.main()
