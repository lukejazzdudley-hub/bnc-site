from html.parser import HTMLParser
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "cadence" / "feedback" / "index.html"
SCRIPT = ROOT / "cadence" / "feedback" / "feedback.js"
STYLES = ROOT / "cadence" / "feedback" / "feedback.css"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.labels_for: set[str] = set()
        self.controls: list[dict[str, str]] = []
        self.fieldsets = 0
        self.scripts: list[dict[str, str]] = []
        self.has_noscript = False
        self.form_actions: list[str] = []
        self.images: list[dict[str, str]] = []
        self.videos: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "label" and values.get("for"):
            self.labels_for.add(values["for"])
        if tag in {"input", "textarea", "select"}:
            self.controls.append(values)
        if tag == "fieldset" and values.get("data-step"):
            self.fieldsets += 1
        if tag == "script":
            self.scripts.append(values)
        if tag == "noscript":
            self.has_noscript = True
        if tag == "form":
            self.form_actions.append(values.get("action", ""))
        if tag == "img":
            self.images.append(values)
        if tag == "video":
            self.videos.append(values)


class FeedbackPageContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.assertTrue(PAGE.is_file(), "feedback page is missing")
        self.html = PAGE.read_text(encoding="utf-8")
        self.parser = PageParser()
        self.parser.feed(self.html)

    def test_page_has_four_semantic_stages_and_progress(self) -> None:
        self.assertEqual(self.parser.fieldsets, 4)
        self.assertIn("feedback-progress", self.parser.ids)
        self.assertIn("step-status", self.parser.ids)

    def test_every_visible_form_control_has_a_real_label(self) -> None:
        ignored_types = {"hidden", "submit", "button"}
        unlabeled = []
        for control in self.parser.controls:
            if control.get("type", "") in ignored_types:
                continue
            control_id = control.get("id", "")
            if not control_id or control_id not in self.parser.labels_for:
                unlabeled.append(control.get("name") or control_id or "anonymous")
        self.assertEqual(unlabeled, [])

    def test_accessible_error_recovery_and_submit_status_are_present(self) -> None:
        self.assertIn('id="error-summary"', self.html)
        self.assertIn('role="alert"', self.html)
        self.assertIn('tabindex="-1"', self.html)
        self.assertIn('aria-live="polite"', self.html)

    def test_privacy_notice_explains_private_evidence_and_deletion(self) -> None:
        lowered = self.html.lower()
        self.assertIn("not used publicly or in advertising", lowered)
        self.assertIn("hello@brandnamechanges.com", lowered)
        self.assertIn("supabase", lowered)
        self.assertIn("delete", lowered)

    def test_form_does_not_submit_to_a_third_party(self) -> None:
        self.assertEqual(self.parser.form_actions, [""])
        self.assertNotIn("docs.google.com", self.html)
        self.assertNotIn("forms.gle", self.html)

    def test_module_script_noscript_fallback_and_meaningful_media_label_exist(self) -> None:
        self.assertTrue(any(
            script.get("type") == "module" and script.get("src") == "feedback.js"
            for script in self.parser.scripts
        ))
        self.assertTrue(self.parser.has_noscript)
        self.assertTrue(self.parser.images or self.parser.videos)
        self.assertTrue(all(image.get("alt", "").strip() for image in self.parser.images))
        self.assertTrue(all(video.get("aria-label", "").strip() for video in self.parser.videos))

    def test_feedback_intro_uses_mobile_visible_scrubbed_3d_scene(self) -> None:
        self.assertIn('class="feedback-product"', self.html)
        self.assertIn("feedback-handset.mp4", self.html)
        self.assertIn("feedback-handset.webp", self.html)

        css = STYLES.read_text(encoding="utf-8")
        media_rule = re.search(r"\.feedback-product video\s*\{(?P<body>[^}]*)\}", css)
        self.assertIsNotNone(media_rule)
        assert media_rule is not None
        self.assertNotIn("mix-blend-mode", media_rule.group("body"))
        self.assertNotIn("mask-image", media_rule.group("body"))
        self.assertIn("data-scrub-video", self.html)
        self.assertIn('src="../media-policy.js"', self.html)
        self.assertNotIn("assets/cadence-editor.png", self.html)

    def test_page_contains_no_corrupt_replacement_characters(self) -> None:
        self.assertNotIn("\ufffd", self.html)

    def test_signed_resumable_uploads_use_the_supabase_sign_endpoint(self) -> None:
        script = SCRIPT.read_text(encoding="utf-8")
        self.assertIn("/storage/v1/upload/resumable/sign'", script)


if __name__ == "__main__":
    unittest.main()
