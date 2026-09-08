#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "usage: $0 BASE_DIRECTORY BLEND_FILE NAME:MOTION [...]" >&2
  exit 64
fi

base=$1
scene=$2
shift 2
renderer="$base/input/render_cadence_phone_video.py"

for pair in "$@"; do
  name=${pair%%:*}
  motion=${pair##*:}
  source="$base/output/$name.mp4"
  frame_dir="$base/frames/$name"
  output="$base/output/blender-phone-$name.mp4"
  poster="$base/output/blender-phone-$name.webp"
  frames=$(ffprobe -v error -show_entries stream=nb_frames -of default=nw=1:nk=1 "$source")

  mkdir -p "$frame_dir"
  CADENCE_SCREEN_MOVIE="$source" \
  CADENCE_PHONE_FRAME_DIR="$frame_dir" \
  CADENCE_FRAME_COUNT="$frames" \
  CADENCE_PHONE_MOTION="$motion" \
    blender --background "$scene" --python "$renderer" > "$base/output/blender-phone-$name.log" 2>&1
  test -s "$frame_dir/frame-0001.png"

  ffmpeg -y -loglevel error -framerate 30 -start_number 1 -i "$frame_dir/frame-%04d.png" \
    -f lavfi -i color=c=black:s=480x900:r=30 \
    -filter_complex "[0:v]colorkey=0x050507:0.025:0.012[fg];[1:v][fg]overlay=0:0:format=auto:shortest=1,format=yuv420p" \
    -frames:v "$frames" -an -c:v libx264 -preset slow -crf 20 -movflags +faststart \
    -g 6 -keyint_min 6 -sc_threshold 0 "$output"
  ffmpeg -y -loglevel error -sseof -0.04 -i "$output" -frames:v 1 -c:v libwebp -q:v 88 "$poster"

  ffprobe -v error -show_entries stream=codec_name,width,height,nb_frames -of default=nw=1 "$output"
done
