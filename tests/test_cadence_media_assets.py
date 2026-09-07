import json
from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
MEDIA_NAMES = ("hero-device", "transcribe", "rhyme-families", "arrange-to-daw", "dry-wet", "theme-scroll", "feedback-handset")


def ffprobe_json(*arguments: str) -> dict:
    completed = subprocess.run(
        ["ffprobe", "-v", "error", *arguments, "-of", "json"],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


class CadenceMediaAssetTest(unittest.TestCase):
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
