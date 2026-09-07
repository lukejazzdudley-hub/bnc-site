from html.parser import HTMLParser
from pathlib import Path
import re
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


class CadenceExperienceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.h1_count = 0
        self.proof_chapters = 0
        self.videos: list[dict[str, str]] = []
        self.local_media: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag == "h1":
            self.h1_count += 1
        if tag == "article" and "data-product-proof" in values:
            self.proof_chapters += 1
        if tag == "video":
            self.videos.append(values)
        if tag in {"img", "source", "video"}:
            for source in (values.get("src"), values.get("data-src"), values.get("poster")):
                if source and not urlsplit(source).scheme and not source.startswith("data:"):
                    self.local_media.append(source)


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

    def test_cadence_experience_pairs_the_story_with_product_proof(self) -> None:
        page = ROOT / "cadence" / "index.html"
        parser = CadenceExperienceParser()
        parser.feed(page.read_text(encoding="utf-8"))

        self.assertEqual(parser.h1_count, 1)
        self.assertGreaterEqual(parser.proof_chapters, 4)
        self.assertGreaterEqual(len(parser.videos), 4)

        for video in parser.videos:
            self.assertIn("muted", video)
            self.assertIn("playsinline", video)
            self.assertEqual(video.get("preload"), "none")
            self.assertTrue(video.get("poster"))
            self.assertTrue(video.get("aria-label"))

    def test_cadence_product_videos_are_scroll_scrubbed_not_looped(self) -> None:
        parser = CadenceExperienceParser()
        parser.feed((ROOT / "cadence" / "index.html").read_text(encoding="utf-8"))

        for video in parser.videos:
            self.assertIn("data-scrub-video", video)
            self.assertIn("data-src", video)
            self.assertNotIn("src", video)
            self.assertNotIn("loop", video)
            self.assertNotIn("data-autoplay", video)

    def test_product_media_has_no_fake_controls_or_overlay_caption(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("data-media-toggle", html)
        self.assertNotIn("Springtime Showers</strong><span>13 songs", html)
        self.assertNotIn("cadence-studio-word", html)
        self.assertNotIn("rhyme-key", html)
        self.assertNotIn("mix-annotation", html)

    def test_product_media_is_integrated_without_a_decorative_box(self) -> None:
        css = (ROOT / "cadence" / "cadence.css").read_text(encoding="utf-8")
        rule = re.search(r"\.cadence-media-stage\s*\{(?P<body>[^}]*)\}", css)

        self.assertIsNotNone(rule)
        assert rule is not None
        self.assertRegex(rule.group("body"), r"border:\s*0")
        self.assertRegex(rule.group("body"), r"border-radius:\s*0")
        self.assertRegex(rule.group("body"), r"background:\s*transparent")
        self.assertRegex(css, r"\.cadence-media-stage::before,\s*\.cadence-media-stage::after\s*\{[^}]*content:\s*none")

    def test_product_video_layers_do_not_escape_their_mobile_layout(self) -> None:
        css = (ROOT / "cadence" / "cadence.css").read_text(encoding="utf-8")
        hero_rule = re.search(r"\.cadence-hero-object video\s*\{(?P<body>[^}]*)\}", css)
        phone_rule = re.search(r"\.cadence-phone video,\s*\.cadence-phone img\s*\{(?P<body>[^}]*)\}", css)

        self.assertIsNotNone(hero_rule)
        self.assertIsNotNone(phone_rule)
        assert hero_rule is not None
        assert phone_rule is not None
        combined = hero_rule.group("body") + phone_rule.group("body")
        self.assertNotIn("mix-blend-mode", combined)
        self.assertNotIn("mask-image", combined)
        self.assertNotIn("filter:", combined)

    def test_cadence_media_references_are_local_and_resolve(self) -> None:
        page = ROOT / "cadence" / "index.html"
        parser = CadenceExperienceParser()
        parser.feed(page.read_text(encoding="utf-8"))

        missing = []
        for source in parser.local_media:
            resolved = (page.parent / source).resolve()
            if not resolved.is_file():
                missing.append(source)
        self.assertEqual(missing, [])

    def test_theme_story_uses_one_scrubbed_handset_and_no_rejected_cards(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
        section = html.split('<section class="cadence-themes"', 1)[1].split("</section>", 1)[0]

        self.assertEqual(section.count("<video"), 1)
        self.assertIn("theme-scroll.mp4", section)
        self.assertIn("data-scrub-video", section)
        self.assertNotIn("theme-card", section)
        for rejected in ("theme-arctic.webp", "theme-neon.webp", "theme-crimson.webp"):
            self.assertNotIn(rejected, html)

    def test_cadence_navigation_uses_locked_mark_not_square_app_icon(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
        nav = html.split('<header class="nav cadence-nav">', 1)[1].split("</header>", 1)[0]

        self.assertIn('class="cadence-mark"', nav)
        self.assertIn("cadence-mark.webp", nav)
        self.assertIn("cadence-mark-static.webp", nav)
        self.assertIn("data-animated-mark", nav)
        self.assertNotIn("app-icon.webp", nav)

    def test_beta_store_ctas_have_a_44_pixel_touch_target(self) -> None:
        css = (ROOT / "cadence" / "cadence.css").read_text(encoding="utf-8")
        rules = re.findall(r"\.cadence-store-button\s*\{(?P<body>[^}]*)\}", css)

        self.assertTrue(rules)
        self.assertTrue(any(re.search(r"min-height:\s*(?:4[4-9]|[5-9]\d)px", rule) for rule in rules))

    def test_mobile_page_has_no_fixed_cta_over_product_proof(self) -> None:
        html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")

        self.assertNotIn("cadence-mobile-cta", html)

    def test_locked_mark_assets_are_local(self) -> None:
        for name in ("cadence-mark.webp", "cadence-mark-static.webp"):
            self.assertTrue((ROOT / "assets" / "cadence" / name).is_file(), name)

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
