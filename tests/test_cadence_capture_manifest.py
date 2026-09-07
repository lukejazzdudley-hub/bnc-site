import hashlib
import json
from pathlib import Path
import struct
import tempfile
import unittest
import zlib

from scripts.cadence_capture_manifest import (
    build_entry,
    record_capture,
    validate_manifest,
    validate_theme_set,
)


def write_png(path: Path, width: int, height: int) -> None:
    def chunk(name: bytes, payload: bytes) -> bytes:
        body = name + payload
        return struct.pack(">I", len(payload)) + body + struct.pack(">I", zlib.crc32(body))

    rows = b"".join(b"\x00" + (b"\x00\x00\x00" * width) for _ in range(height))
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows))
        + chunk(b"IEND", b"")
    )


def metadata(theme: str = "arctic") -> dict[str, object]:
    return {
        "build": "abc123",
        "platform": "ios",
        "viewport": "390x844",
        "account": "cadence-demo",
        "project": "signal-in-the-gold",
        "screen": "editor",
        "theme": theme,
        "control_state": "current",
        "crop": "0,59,1170,2473",
        "status_chrome": False,
    }


class CaptureManifestTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.capture = self.root / "theme-arctic.png"
        write_png(self.capture, 117, 241)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def capture_entry(self, theme: str) -> dict[str, object]:
        source = self.root / f"theme-{theme}.png"
        write_png(source, 117, 241)
        return build_entry(source, metadata(theme))

    def test_theme_set_accepts_only_theme_file_and_checksum_differences(self) -> None:
        entries = [self.capture_entry(theme) for theme in ("arctic", "neon", "crimson")]

        validate_theme_set(entries, {"arctic", "neon", "crimson"}, self.root)

    def test_theme_set_rejects_screen_drift(self) -> None:
        entries = [self.capture_entry(theme) for theme in ("arctic", "neon", "crimson")]
        entries[1]["screen"] = "library"

        with self.assertRaisesRegex(ValueError, "screen"):
            validate_theme_set(entries, {"arctic", "neon", "crimson"}, self.root)

    def test_theme_set_rejects_status_chrome(self) -> None:
        entries = [self.capture_entry(theme) for theme in ("arctic", "neon", "crimson")]
        entries[2]["status_chrome"] = True

        with self.assertRaisesRegex(ValueError, "status_chrome"):
            validate_theme_set(entries, {"arctic", "neon", "crimson"}, self.root)

    def test_build_entry_uses_real_dimensions_checksum_and_basename(self) -> None:
        entry = build_entry(self.capture, metadata())

        self.assertEqual(entry["sha256"], hashlib.sha256(self.capture.read_bytes()).hexdigest())
        self.assertEqual((entry["width"], entry["height"]), (117, 241))
        self.assertEqual(entry["source_basename"], "theme-arctic.png")
        self.assertNotIn(str(self.root), json.dumps(entry))

    def test_record_replaces_the_same_theme_without_duplicating_it(self) -> None:
        manifest = self.root / "manifest.json"
        record_capture(manifest, self.capture, metadata())
        write_png(self.capture, 117, 241)
        record_capture(manifest, self.capture, metadata())

        entries = json.loads(manifest.read_text(encoding="utf-8"))["captures"]
        self.assertEqual(len(entries), 1)
        self.assertTrue(manifest.read_text(encoding="utf-8").endswith("\n"))

    def test_validate_manifest_can_check_metadata_without_private_sources(self) -> None:
        manifest = self.root / "manifest.json"
        for theme in ("arctic", "neon", "crimson"):
            source = self.root / f"theme-{theme}.png"
            write_png(source, 117, 241)
            record_capture(manifest, source, metadata(theme))

        validate_manifest(manifest, {"arctic", "neon", "crimson"})

    def test_validate_manifest_rejects_checksum_drift_when_sources_are_available(self) -> None:
        manifest = self.root / "manifest.json"
        for theme in ("arctic", "neon", "crimson"):
            source = self.root / f"theme-{theme}.png"
            write_png(source, 117, 241)
            record_capture(manifest, source, metadata(theme))
        (self.root / "theme-neon.png").write_bytes(b"changed")

        with self.assertRaisesRegex(ValueError, "checksum"):
            validate_manifest(manifest, {"arctic", "neon", "crimson"}, self.root)


if __name__ == "__main__":
    unittest.main()
