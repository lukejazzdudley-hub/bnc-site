#!/usr/bin/env python3
"""Record and validate provenance for Cadence marketing captures."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
from typing import Any


INVARIANTS = (
    "build",
    "platform",
    "viewport",
    "account",
    "project",
    "screen",
    "control_state",
    "crop",
    "width",
    "height",
    "status_chrome",
)
REQUIRED_METADATA = (
    "build",
    "platform",
    "viewport",
    "account",
    "project",
    "screen",
    "theme",
    "control_state",
    "crop",
    "status_chrome",
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def media_dimensions(path: Path) -> tuple[int, int]:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "json",
        str(path),
    ]
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    streams = json.loads(result.stdout).get("streams", [])
    if len(streams) != 1:
        raise ValueError(f"expected one visual stream: {path}")
    width = int(streams[0]["width"])
    height = int(streams[0]["height"])
    if width <= 0 or height <= 0:
        raise ValueError(f"invalid dimensions: {path}")
    return width, height


def build_entry(source: Path, metadata: dict[str, Any]) -> dict[str, Any]:
    source = source.resolve()
    if not source.is_file():
        raise ValueError(f"missing capture: {source}")
    missing = [field for field in REQUIRED_METADATA if field not in metadata]
    if missing:
        raise ValueError(f"missing metadata: {', '.join(missing)}")
    if metadata["status_chrome"] is not False:
        raise ValueError("status_chrome must be false")
    if not all(str(metadata[field]).strip() for field in REQUIRED_METADATA if field != "status_chrome"):
        raise ValueError("capture metadata values must not be blank")

    width, height = media_dimensions(source)
    return {
        **metadata,
        "source_basename": source.name,
        "sha256": sha256_file(source),
        "width": width,
        "height": height,
    }


def validate_theme_set(
    entries: list[dict[str, Any]],
    required_themes: set[str],
    source_root: Path | None = None,
) -> None:
    by_theme: dict[str, dict[str, Any]] = {}
    for entry in entries:
        theme = str(entry.get("theme", ""))
        if not theme:
            raise ValueError("theme is missing")
        if theme in by_theme:
            raise ValueError(f"duplicate theme: {theme}")
        by_theme[theme] = entry
    if set(by_theme) != required_themes:
        raise ValueError(
            f"themes: expected {sorted(required_themes)}, got {sorted(by_theme)}"
        )

    baseline = entries[0]
    for entry in entries:
        if entry.get("status_chrome") is not False:
            raise ValueError("status_chrome must be false")
        for field in INVARIANTS:
            if field not in entry:
                raise ValueError(f"{field} is missing")
            if entry[field] != baseline[field]:
                raise ValueError(f"{field}: {entry[field]!r} != {baseline[field]!r}")
        if source_root is not None:
            path = source_root / str(entry["source_basename"])
            if not path.is_file() or sha256_file(path) != entry.get("sha256"):
                raise ValueError(f"checksum: {path}")


def record_capture(manifest: Path, source: Path, metadata: dict[str, Any]) -> None:
    entry = build_entry(source, metadata)
    payload: dict[str, Any] = {"schema_version": 1, "captures": []}
    if manifest.is_file():
        payload = json.loads(manifest.read_text(encoding="utf-8"))
        if payload.get("schema_version") != 1 or not isinstance(payload.get("captures"), list):
            raise ValueError(f"unsupported manifest: {manifest}")
    captures = [item for item in payload["captures"] if item.get("theme") != entry["theme"]]
    captures.append(entry)
    payload["captures"] = sorted(captures, key=lambda item: item["theme"])
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def validate_manifest(
    manifest: Path,
    required_themes: set[str],
    source_root: Path | None = None,
) -> None:
    payload = json.loads(manifest.read_text(encoding="utf-8"))
    if payload.get("schema_version") != 1 or not isinstance(payload.get("captures"), list):
        raise ValueError(f"unsupported manifest: {manifest}")
    validate_theme_set(payload["captures"], required_themes, source_root)


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description=__doc__)
    commands = root.add_subparsers(dest="command", required=True)

    record = commands.add_parser("record")
    record.add_argument("--manifest", type=Path, required=True)
    record.add_argument("--file", type=Path, required=True)
    for field in ("build", "platform", "viewport", "account", "project", "screen", "theme", "control-state", "crop"):
        record.add_argument(f"--{field}", required=True)

    validate = commands.add_parser("validate")
    validate.add_argument("--manifest", type=Path, required=True)
    validate.add_argument("--source-root", type=Path)
    validate.add_argument("--require-themes", nargs="+", required=True)
    return root


def main() -> int:
    arguments = parser().parse_args()
    if arguments.command == "record":
        metadata = {
            "build": arguments.build,
            "platform": arguments.platform,
            "viewport": arguments.viewport,
            "account": arguments.account,
            "project": arguments.project,
            "screen": arguments.screen,
            "theme": arguments.theme,
            "control_state": arguments.control_state,
            "crop": arguments.crop,
            "status_chrome": False,
        }
        record_capture(arguments.manifest, arguments.file, metadata)
        return 0
    validate_manifest(arguments.manifest, set(arguments.require_themes), arguments.source_root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
