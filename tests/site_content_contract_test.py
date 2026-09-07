from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PAGES = sorted(ROOT.rglob("*.html"))


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and "href" in values:
            self.links.append(values["href"])


def route_file(path: str) -> Path:
    normalized = path.rstrip("/")
    if not normalized:
        return ROOT / "index.html"
    direct = ROOT / normalized.lstrip("/")
    if direct.is_dir():
        return direct / "index.html"
    if direct.suffix:
        return direct
    return direct.with_suffix(".html")


class SiteContentContractTest(unittest.TestCase):
    def test_public_pages_have_no_dead_or_missing_internal_links(self) -> None:
        failures = []
        for page in PUBLIC_PAGES:
            parser = LinkParser()
            parser.feed(page.read_text(encoding="utf-8"))
            for href in parser.links:
                if href == "#":
                    failures.append(f"{page.name}: dead # link")
                    continue
                parsed = urlsplit(href)
                if parsed.scheme or href.startswith("//"):
                    continue
                if not parsed.path:
                    if parsed.fragment and parsed.fragment not in parser.ids:
                        failures.append(f"{page.name}: missing fragment #{parsed.fragment}")
                    continue
                target = route_file(parsed.path)
                if not target.is_file():
                    failures.append(f"{page.name}: missing {parsed.path}")
                    continue
                if parsed.fragment:
                    target_parser = LinkParser()
                    target_parser.feed(target.read_text(encoding="utf-8"))
                    if parsed.fragment not in target_parser.ids:
                        failures.append(f"{page.name}: missing {href}")
        self.assertEqual(failures, [])

    def test_cadence_page_contains_no_authoring_placeholders(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8").lower()
        self.assertNotIn("todo:", html)
        self.assertNotIn("drop your app store screenshots", html)
        self.assertNotIn("screenshots placeholder", html)

    def test_cadence_commerce_copy_defers_to_live_storefront_truth(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8").lower()
        self.assertNotIn("includes a free trial", html)
        self.assertNotIn("$5", html)
        self.assertNotIn("$35", html)
        self.assertNotIn("$80", html)
        self.assertIn("local storefront", html)
        self.assertIn("three free notes", html)
        self.assertIn("quarterly", html)

    def test_cadence_feature_copy_matches_the_current_catalogue(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8").lower()
        self.assertIn("27 theme families", html)
        self.assertIn("on-device transcription", html)
        self.assertIn("draft demo", html)
        self.assertIn("beta feedback", html)

    def test_support_copy_handles_both_platforms_and_the_in_app_delete_route(self) -> None:
        html = (ROOT / "support.html").read_text(encoding="utf-8").lower()
        self.assertIn("operating-system version", html)
        self.assertIn("settings", html)
        self.assertIn("delete account", html)
        self.assertIn("/cadence/feedback/", html)

    def test_terms_do_not_omit_the_quarterly_plan(self) -> None:
        html = (ROOT / "terms.html").read_text(encoding="utf-8").lower()
        self.assertIn("quarterly", html)

    def test_public_pages_have_no_corrupt_replacement_characters(self) -> None:
        corrupt = [str(page.relative_to(ROOT)) for page in PUBLIC_PAGES if "\ufffd" in page.read_text(encoding="utf-8")]
        self.assertEqual(corrupt, [])

    def test_privacy_policy_covers_beta_feedback_and_optional_evidence(self) -> None:
        privacy = (ROOT / "privacy.html").read_text(encoding="utf-8")
        self.assertIn("Cadence beta feedback", privacy)
        self.assertIn("optional screenshots or screen recordings", privacy)
        self.assertIn("not use that evidence publicly or in advertising", privacy)


if __name__ == "__main__":
    unittest.main()
