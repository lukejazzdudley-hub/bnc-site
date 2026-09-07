from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
MIGRATION = (
    ROOT
    / "supabase"
    / "migrations"
    / "20260907140000_cadence_beta_feedback.sql"
)


class FeedbackSchemaContractTest(unittest.TestCase):
    def test_feedback_migration_exists(self) -> None:
        self.assertTrue(MIGRATION.is_file(), "feedback migration is missing")

    def setUp(self) -> None:
        self.sql = MIGRATION.read_text(encoding="utf-8").lower()

    def test_private_tables_are_rls_protected_and_not_granted_to_clients(self) -> None:
        for table in (
            "cadence_beta_feedback_responses",
            "cadence_beta_feedback_uploads",
        ):
            self.assertIn(f"alter table public.{table} enable row level security", self.sql)
            self.assertRegex(
                self.sql,
                rf"revoke\s+all\s+on\s+table\s+public\.{table}\s+from\s+anon\s*,\s*authenticated",
            )
            self.assertIn(
                f"grant select, insert, update, delete on table public.{table} to service_role",
                self.sql,
            )

    def test_response_constraints_reject_invalid_scores_and_states(self) -> None:
        self.assertRegex(
            self.sql,
            r"navigation_score\s+smallint[\s\s]*check\s*\(navigation_score between 1 and 10\)",
        )
        for state in (
            "received",
            "awaiting_uploads",
            "complete",
            "complete_with_upload_errors",
            "imported",
        ):
            self.assertIn(f"'{state}'", self.sql)
        self.assertRegex(self.sql, r"legacy_row_hash\s+text\s+unique")

    def test_upload_rows_are_bounded_and_cascade_with_the_response(self) -> None:
        self.assertIn("file_size_bytes between 1 and 104857600", self.sql)
        self.assertRegex(
            self.sql,
            r"references\s+public\.cadence_beta_feedback_responses\s*\(id\)\s+on delete cascade",
        )
        self.assertIn("unique (response_id, storage_path)", self.sql)

    def test_storage_bucket_is_private_and_enforces_evidence_limits(self) -> None:
        self.assertIn("'cadence-feedback-evidence'", self.sql)
        self.assertRegex(self.sql, r"public\s*=\s*false")
        self.assertRegex(self.sql, r"file_size_limit\s*=\s*104857600")
        for mime in (
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/heic",
            "image/heif",
            "video/mp4",
            "video/quicktime",
            "video/webm",
        ):
            self.assertIn(f"'{mime}'", self.sql)

    def test_throttle_and_export_queries_have_indexes(self) -> None:
        self.assertRegex(
            self.sql,
            r"create index[^;]+cadence_beta_feedback_responses\s*\(ip_hash\s*,\s*submitted_at desc\)",
        )
        self.assertRegex(
            self.sql,
            r"create index[^;]+cadence_beta_feedback_responses\s*\(submitted_at desc\)",
        )


if __name__ == "__main__":
    unittest.main()
