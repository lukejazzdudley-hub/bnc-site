import hashlib
import json
from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
MEDIA_NAMES = ("hero-device", "transcribe", "rhyme-families", "arrange-to-daw", "dry-wet", "theme-scroll")


def ffprobe_json(*arguments: str) -> dict:
    completed = subprocess.run(
        ["ffprobe", "-v", "error", *arguments, "-of", "json"],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


class CadenceMediaAssetTest(unittest.TestCase):
    def test_live_3d_assets_match_the_locked_manifest(self) -> None:
        manifest_path = ROOT / "assets" / "cadence" / "live-3d-manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        cadence_root = manifest_path.parent

        for group in ("assets", "v3Assets"):
            for relative_path, expected_hash in manifest[group].items():
                path = cadence_root / relative_path
                self.assertTrue(path.is_file(), relative_path)
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), expected_hash, relative_path)

        for relative_path, expected_hash in manifest["vendorAssets"].items():
            path = ROOT / relative_path
            self.assertTrue(path.is_file(), relative_path)
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), expected_hash, relative_path)

        for model in cadence_root.glob("cadence-phone-*.glb"):
            self.assertLess(model.stat().st_size, 250_000, model.name)

    def test_scrub_videos_are_seekable_web_encodes(self) -> None:
        for name in MEDIA_NAMES:
            path = ROOT / "assets" / "cadence" / f"{name}.mp4"
            details = ffprobe_json("-show_streams", "-show_format", str(path))
            video = [stream for stream in details["streams"] if stream["codec_type"] == "video"]
            audio = [stream for stream in details["streams"] if stream["codec_type"] == "audio"]
            self.assertEqual(len(video), 1, name)
            self.assertEqual(audio, [], name)
            self.assertEqual(video[0]["codec_name"], "h264", name)
            self.assertEqual(video[0]["pix_fmt"], "yuv420p", name)
            self.assertLessEqual(video[0]["width"], 1280, name)
            self.assertLessEqual(video[0]["height"], 1350, name)
            self.assertGreater(float(details["format"]["duration"]), 0, name)

            frames = ffprobe_json(
                "-skip_frame", "nokey", "-select_streams", "v:0",
                "-show_entries", "frame=best_effort_timestamp_time", "-show_frames", str(path),
            )["frames"]
            key_times = [float(frame["best_effort_timestamp_time"]) for frame in frames]
            gaps = [right - left for left, right in zip(key_times, key_times[1:])]
            self.assertTrue(gaps, name)
            self.assertLessEqual(max(gaps), 0.21, name)

    def test_every_scrub_video_has_a_webp_poster(self) -> None:
        for name in MEDIA_NAMES:
            poster = ROOT / "assets" / "cadence" / f"{name}.webp"
            self.assertTrue(poster.is_file(), name)
            self.assertGreater(poster.stat().st_size, 0, name)

    def test_feedback_handset_cutout_has_retina_dimensions_and_alpha(self) -> None:
        path = ROOT / "assets" / "cadence" / "feedback-handset-cutout.webp"
        self.assertTrue(path.is_file())
        stream = ffprobe_json("-select_streams", "v:0", "-show_streams", str(path))["streams"][0]

        self.assertEqual((stream["width"], stream["height"]), (480, 840))
        self.assertIn("a", stream["pix_fmt"])
