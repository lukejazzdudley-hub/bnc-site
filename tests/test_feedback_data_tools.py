import csv
import io
import json
from pathlib import Path
import tempfile
import unittest


LEGACY_HEADERS = [
    "Timestamp",
    "Evidence",
    "Identity and lifetime access",
    "Platform",
    "Musical identity",
    "Current process",
    "Creation frequency",
    "Creation location",
    "Location restrictions",
    "Current tools",
    "Cadence session",
    "Workflow impact",
    "Friction",
    "Liked features",
    "Disliked features",
    "Looping feedback",
    "Rhyme feedback",
    "Missing features",
    "Navigation score",
    "Navigation reason",
    "Bugs",
    "Retention trigger",
    "Replacement potential",
    "Recommendation trigger",
    "Recommendation blocker",
    "Pricing",
    "Language",
]


def fixture_csv() -> str:
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    writer.writerow(LEGACY_HEADERS)
    writer.writerow([
        "8/11/2026 16:32:25",
        "",
        "Asha Writer\nasha@example.com\nYes",
        "IPhone",
        "Singer-songwriter",
        "I start in Notes,\nthen move to Voice Memos.",
        "A few times a week",
        "At home",
        "No",
        "Notes, Voice Memos, YouTube",
        "I drafted a verse and recorded a hook.",
        "It kept the idea together.",
        "Finding the library took a moment.",
        "Rhymes and recording",
        "Nothing yet",
        "Useful for the hook",
        "Useful, especially near rhymes",
        "A faster beat import",
        "8",
        "Most controls were where I expected.",
        "No",
        "A faster way back to recent songs",
        "It could replace Notes and Voice Memos.",
        "Reliable import and sync",
        "Losing a recording",
        "Monthly: £5\nYearly: £35\nLifetime: £80",
        "English",
    ])
    return stream.getvalue()


class FeedbackDataToolsTest(unittest.TestCase):
    def test_google_csv_maps_all_legacy_fields_and_month_first_timestamp(self) -> None:
        from scripts.import_cadence_feedback import parse_legacy_csv

        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "responses.csv"
            source.write_text(fixture_csv(), encoding="utf-8")
            rows = parse_legacy_csv(source)

        self.assertEqual(len(rows), 1)
        row = rows[0]
        self.assertEqual(row["original_submitted_at"], "2026-08-11T16:32:25+01:00")
        self.assertEqual(row["submitted_at"], row["original_submitted_at"])
        self.assertEqual(row["name"], "Asha Writer")
        self.assertEqual(row["email"], "asha@example.com")
        self.assertTrue(row["wants_lifetime_access"])
        self.assertEqual(row["platform"], "iPhone")
        self.assertEqual(row["navigation_score"], 8)
        self.assertEqual(row["language"], "English")
        self.assertEqual(row["answers"]["currentProcess"], "I start in Notes,\nthen move to Voice Memos.")
        self.assertEqual(row["answers"]["pricingMonthly"], "£5")
        self.assertEqual(row["answers"]["pricingAnnual"], "£35")
        self.assertEqual(row["answers"]["pricingLifetime"], "£80")
        self.assertEqual(row["answers"]["pricingCurrency"], "GBP")
        self.assertEqual(row["source"], "google_forms_import_v1")
        self.assertEqual(row["status"], "imported")
        self.assertTrue(row["consent_research"])
        self.assertFalse(row["consent_followup"])
        self.assertEqual(len(row["legacy_payload"]), 27)

    def test_legacy_hash_is_stable_and_sensitive_to_answer_changes(self) -> None:
        from scripts.import_cadence_feedback import legacy_row_hash

        first = {"b": "two", "a": "one\nline"}
        reordered = {"a": "one\nline", "b": "two"}
        changed = {"a": "one\nline", "b": "different"}
        self.assertEqual(legacy_row_hash(first), legacy_row_hash(reordered))
        self.assertNotEqual(legacy_row_hash(first), legacy_row_hash(changed))
        self.assertEqual(len(legacy_row_hash(first)), 64)

    def test_pricing_parser_separates_single_line_plan_answers(self) -> None:
        from scripts.import_cadence_feedback import parse_pricing

        parsed = parse_pricing("Monthly 5 Annual 35 Lifetime 80")
        self.assertEqual(parsed["pricingMonthly"], "5")
        self.assertEqual(parsed["pricingAnnual"], "35")
        self.assertEqual(parsed["pricingLifetime"], "80")

        amount_first = parse_pricing("5/month. 35/year. 80/lifetime")
        self.assertEqual(amount_first["pricingMonthly"], "5")
        self.assertEqual(amount_first["pricingAnnual"], "35")
        self.assertEqual(amount_first["pricingLifetime"], "80")

    def test_invalid_legacy_identity_fails_before_remote_write(self) -> None:
        from scripts.import_cadence_feedback import normalize_legacy_row

        values = [""] * 27
        values[0] = "8/11/2026 16:32:25"
        values[2] = "A name without an email"
        row = dict(zip(LEGACY_HEADERS, values, strict=True))
        with self.assertRaisesRegex(ValueError, "email"):
            normalize_legacy_row(row, LEGACY_HEADERS, row_number=2)

    def test_export_allowlist_removes_internal_security_and_transport_fields(self) -> None:
        from scripts.export_cadence_feedback import safe_export_row

        source = {
            "id": "response-id",
            "name": "Asha Writer",
            "email": "asha@example.com",
            "answers": {"friction": "Nothing"},
            "ip_hash": "secret-ip-hash",
            "invitation_token_hash": "secret-invite-hash",
            "completion_token_hash": "secret-completion-hash",
            "user_agent": "private transport detail",
            "legacy_row_hash": "deduplication-internal",
        }
        exported = safe_export_row(source)
        self.assertEqual(exported["name"], "Asha Writer")
        self.assertEqual(exported["answers"], {"friction": "Nothing"})
        self.assertFalse({
            "ip_hash",
            "invitation_token_hash",
            "completion_token_hash",
            "user_agent",
            "legacy_row_hash",
        } & exported.keys())

    def test_json_export_is_utf8_and_contains_only_safe_rows(self) -> None:
        from scripts.export_cadence_feedback import write_export

        rows = [{"id": "one", "name": "Zoë", "answers": {"likedFeatures": "Rhymes"}}]
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "feedback.json"
            write_export(rows, destination)
            decoded = json.loads(destination.read_text(encoding="utf-8"))
        self.assertEqual(decoded, rows)


if __name__ == "__main__":
    unittest.main()
