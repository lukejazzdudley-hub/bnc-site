#!/usr/bin/env python3
"""Export private Cadence feedback without internal security metadata."""

from __future__ import annotations

import argparse
import csv
import json
import os
from pathlib import Path
import sys
from typing import Any, Iterable, Sequence
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


SAFE_FIELDS = (
    "id",
    "source",
    "schema_version",
    "status",
    "name",
    "email",
    "wants_lifetime_access",
    "platform",
    "musical_identity",
    "language",
    "navigation_score",
    "answers",
    "consent_research",
    "consent_followup",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "original_submitted_at",
    "submitted_at",
    "completed_at",
    "created_at",
    "updated_at",
    "legacy_payload",
)


def safe_export_row(row: dict[str, Any]) -> dict[str, Any]:
    return {field: row[field] for field in SAFE_FIELDS if field in row}


def fetch_rows(supabase_url: str, service_key: str) -> list[dict[str, Any]]:
    query = urlencode({"select": ",".join(SAFE_FIELDS), "order": "submitted_at.asc"})
    endpoint = f"{supabase_url.rstrip('/')}/rest/v1/cadence_beta_feedback_responses?{query}"
    request = Request(
        endpoint,
        headers={
            "apikey": service_key,
            "authorization": f"Bearer {service_key}",
            "accept": "application/json",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:  # noqa: S310 - fixed operator URL
            rows = json.load(response)
    except HTTPError as error:
        raise RuntimeError(f"Supabase export failed with HTTP {error.code}") from error
    except URLError as error:
        raise RuntimeError("Supabase export could not reach the configured project") from error
    if not isinstance(rows, list) or not all(isinstance(row, dict) for row in rows):
        raise RuntimeError("Supabase export returned an unexpected response")
    return [safe_export_row(row) for row in rows]


def write_export(rows: Iterable[dict[str, Any]], destination: Path) -> None:
    materialized = list(rows)
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.suffix.lower() == ".json":
        destination.write_text(
            json.dumps(materialized, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return
    if destination.suffix.lower() == ".csv":
        with destination.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=SAFE_FIELDS, extrasaction="ignore")
            writer.writeheader()
            for row in materialized:
                serialized = {
                    key: json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else value
                    for key, value in row.items()
                }
                writer.writerow(serialized)
        return
    raise ValueError("export path must end in .json or .csv")


def ensure_outside_repository(destination: Path) -> None:
    repository = Path(__file__).resolve().parents[1]
    resolved = destination.expanduser().resolve()
    if resolved == repository or repository in resolved.parents:
        raise ValueError("feedback exports must be written outside the Git repository")


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path, help="Destination .json or .csv outside Git")
    args = parser.parse_args(argv)

    supabase_url = os.environ.get("SUPABASE_URL", "").strip()
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not supabase_url or not service_key:
        parser.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

    try:
        ensure_outside_repository(args.output)
        rows = fetch_rows(supabase_url, service_key)
        write_export(rows, args.output.expanduser())
    except (ValueError, RuntimeError, OSError) as error:
        print(f"Export stopped: {error}", file=sys.stderr)
        return 1
    print(f"Exported {len(rows)} private responses to {args.output.expanduser()}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
