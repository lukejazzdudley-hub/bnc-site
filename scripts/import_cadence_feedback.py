#!/usr/bin/env python3
"""Import the original Cadence Google Forms CSV without duplicating rows."""

from __future__ import annotations

import argparse
import csv
from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import sys
from typing import Any, Sequence
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


EXPECTED_COLUMN_COUNT = 27
LONDON = ZoneInfo("Europe/London")
EMAIL_PATTERN = re.compile(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", re.IGNORECASE)

ANSWER_COLUMNS = {
    "currentProcess": 5,
    "creationFrequency": 6,
    "creationLocation": 7,
    "locationRestrictions": 8,
    "currentTools": 9,
    "cadenceSession": 10,
    "workflowImpact": 11,
    "friction": 12,
    "likedFeatures": 13,
    "dislikedFeatures": 14,
    "loopingFeedback": 15,
    "rhymeFeedback": 16,
    "missingFeatures": 17,
    "navigationReason": 19,
    "bugs": 20,
    "retentionTrigger": 21,
    "replacementPotential": 22,
    "recommendationTrigger": 23,
    "recommendationBlocker": 24,
}


def legacy_row_hash(row: dict[str, str]) -> str:
    """Return the stable, order-independent identity used for conflict-ignore."""
    canonical = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def parse_timestamp(value: str, row_number: int) -> str:
    try:
        local = datetime.strptime(value.strip(), "%m/%d/%Y %H:%M:%S").replace(tzinfo=LONDON)
    except ValueError as error:
        raise ValueError(f"row {row_number}: invalid month/day Timestamp") from error
    return local.isoformat(timespec="seconds")


def parse_identity(value: str, row_number: int) -> tuple[str, str, bool]:
    email_match = EMAIL_PATTERN.search(value)
    if not email_match:
        raise ValueError(f"row {row_number}: identity field has no valid email")
    email = email_match.group(0).lower()

    before_email = value[: email_match.start()]
    candidates = [segment.strip(" \t\r\n,;:+|—–-") for segment in before_email.splitlines()]
    candidates = [candidate for candidate in candidates if candidate]
    name = candidates[-1] if candidates else ""
    name = re.sub(r"^name\s*[:\-]?\s*", "", name, flags=re.IGNORECASE).strip()
    if not name:
        raise ValueError(f"row {row_number}: identity field has no name before email")
    if len(name) > 160:
        raise ValueError(f"row {row_number}: name is longer than 160 characters")

    remainder = value[email_match.end() :]
    wants_lifetime = bool(re.search(r"\byes\b", remainder, flags=re.IGNORECASE))
    if not wants_lifetime and not re.search(r"\bno\b", remainder, flags=re.IGNORECASE):
        wants_lifetime = bool(re.search(r"\byes\b", value, flags=re.IGNORECASE))
    return name, email, wants_lifetime


def normalize_platform(value: str) -> str:
    lowered = value.strip().lower()
    has_apple = "iphone" in lowered or "ios" in lowered or "ipad" in lowered
    has_android = "android" in lowered
    if has_apple and has_android:
        return "Both"
    if has_apple:
        return "iPhone"
    if has_android:
        return "Android"
    return "Other"


def navigation_score(value: str) -> int | None:
    match = re.search(r"(?<!\d)(10|[1-9])(?!\d)", value)
    return int(match.group(1)) if match else None


def parse_pricing(value: str) -> dict[str, str]:
    pricing = {
        "pricingMonthly": "",
        "pricingAnnual": "",
        "pricingLifetime": "",
        "pricingCurrency": "",
    }
    label_pattern = re.compile(
        r"\b(monthly|month|annual|annually|yearly|year|lifetime|one[ -]time)\b\s*:?",
        flags=re.IGNORECASE,
    )
    matches = list(label_pattern.finditer(value))
    numeric_pattern = re.compile(r"[£$€₹]?\s*\d+(?:[.,]\d+)?")
    first_number = numeric_pattern.search(value)
    uses_amount_first = bool(matches and first_number and first_number.start() < matches[0].start())

    if uses_amount_first:
        amount = r"([£$€₹]?\s*\d+(?:[.,]\d+)?)"
        amount_first_patterns = {
            "pricingMonthly": rf"{amount}\s*(?:/\s*|per\s+|a\s+)?(?:month|monthly)\b",
            "pricingAnnual": rf"{amount}\s*(?:/\s*|per\s+|a\s+)?(?:year|yearly|annual|annually)\b",
            "pricingLifetime": rf"{amount}\s*(?:/\s*|for\s+)?(?:lifetime|one[ -]time)\b",
        }
        for key, pattern in amount_first_patterns.items():
            match = re.search(pattern, value, flags=re.IGNORECASE)
            if match:
                pricing[key] = re.sub(r"\s+", "", match.group(1))
    else:
        for index, match in enumerate(matches):
            end = matches[index + 1].start() if index + 1 < len(matches) else len(value)
            segment_amount = value[match.end() : end].strip(" \t\r\n,;/.-")
            label = match.group(1).lower()
            if label in {"monthly", "month"}:
                key = "pricingMonthly"
            elif label in {"annual", "annually", "yearly", "year"}:
                key = "pricingAnnual"
            else:
                key = "pricingLifetime"
            if segment_amount and not pricing[key]:
                pricing[key] = segment_amount

    if "£" in value or re.search(r"\bGBP\b", value, flags=re.IGNORECASE):
        pricing["pricingCurrency"] = "GBP"
    elif "€" in value or re.search(r"\bEUR\b", value, flags=re.IGNORECASE):
        pricing["pricingCurrency"] = "EUR"
    elif "₹" in value or re.search(r"\bINR\b", value, flags=re.IGNORECASE):
        pricing["pricingCurrency"] = "INR"
    elif "$" in value or re.search(r"\bUSD\b", value, flags=re.IGNORECASE):
        pricing["pricingCurrency"] = "USD"
    return pricing


def normalize_legacy_row(
    row: dict[str, str],
    fieldnames: Sequence[str],
    *,
    row_number: int,
) -> dict[str, Any]:
    values = [(row.get(header) or "").strip() for header in fieldnames]
    name, email, wants_lifetime = parse_identity(values[2], row_number)
    timestamp = parse_timestamp(values[0], row_number)
    answers = {key: values[index] for key, index in ANSWER_COLUMNS.items()}
    answers.update(parse_pricing(values[25]))

    return {
        "source": "google_forms_import_v1",
        "schema_version": 1,
        "status": "imported",
        "name": name,
        "email": email,
        "wants_lifetime_access": wants_lifetime,
        "platform": normalize_platform(values[3]),
        "musical_identity": values[4] or "Not provided",
        "language": values[26] or "Not provided",
        "navigation_score": navigation_score(values[18]),
        "answers": answers,
        "consent_research": True,
        "consent_followup": False,
        "submitted_at": timestamp,
        "completed_at": timestamp,
        "original_submitted_at": timestamp,
        "legacy_payload": dict(row),
        "legacy_row_hash": legacy_row_hash(dict(row)),
    }


def parse_legacy_csv(source: Path) -> list[dict[str, Any]]:
    with source.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        fieldnames = reader.fieldnames or []
        if len(fieldnames) != EXPECTED_COLUMN_COUNT:
            raise ValueError(
                f"expected {EXPECTED_COLUMN_COUNT} Google Form columns, found {len(fieldnames)}",
            )
        if not fieldnames or fieldnames[0].strip() != "Timestamp":
            raise ValueError("first Google Form column must be Timestamp")

        normalized = []
        for row_number, row in enumerate(reader, start=2):
            if None in row:
                raise ValueError(f"row {row_number}: contains more values than headers")
            if not any((value or "").strip() for value in row.values()):
                continue
            normalized.append(
                normalize_legacy_row(row, fieldnames, row_number=row_number),
            )
    return normalized


def insert_rows(rows: list[dict[str, Any]], supabase_url: str, service_key: str) -> int:
    if not rows:
        return 0
    query = urlencode({"on_conflict": "legacy_row_hash", "select": "legacy_row_hash"})
    endpoint = f"{supabase_url.rstrip('/')}/rest/v1/cadence_beta_feedback_responses?{query}"
    request = Request(
        endpoint,
        data=json.dumps(rows, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
        method="POST",
        headers={
            "apikey": service_key,
            "authorization": f"Bearer {service_key}",
            "content-type": "application/json",
            "prefer": "resolution=ignore-duplicates,return=representation",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:  # noqa: S310 - fixed operator URL
            inserted = json.load(response)
    except HTTPError as error:
        raise RuntimeError(f"Supabase import failed with HTTP {error.code}") from error
    except URLError as error:
        raise RuntimeError("Supabase import could not reach the configured project") from error
    if not isinstance(inserted, list):
        raise RuntimeError("Supabase import returned an unexpected response")
    return len(inserted)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path, help="Google Forms response CSV")
    args = parser.parse_args(argv)

    supabase_url = os.environ.get("SUPABASE_URL", "").strip()
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not supabase_url or not service_key:
        parser.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    if not args.csv_path.is_file():
        parser.error("CSV path does not exist")

    try:
        rows = parse_legacy_csv(args.csv_path)
        inserted = insert_rows(rows, supabase_url, service_key)
    except (ValueError, RuntimeError) as error:
        print(f"Import stopped: {error}", file=sys.stderr)
        return 1

    print(f"Prepared {len(rows)} legacy responses; inserted {inserted}; duplicates skipped {len(rows) - inserted}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
