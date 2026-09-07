#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "usage: $0 FRAME_DIRECTORY OUTPUT_MP4 OUTPUT_WEBP" >&2
  exit 64
fi

frame_directory=$1
output_mp4=$2
output_webp=$3
frame_count=$(find "$frame_directory" -maxdepth 1 -type f -name 'frame-*.png' | wc -l | tr -d ' ')

if [[ "$frame_count" -eq 0 ]]; then
  echo "no Blender frames found in $frame_directory" >&2
  exit 66
fi

# Reframe the verified portrait handset as a compact landscape moment. The
# exact #0a0a0a matte matches the feedback page and removes any render box.
ffmpeg -y -loglevel error \
  -framerate 30 -start_number 1 -i "$frame_directory/frame-%04d.png" \
  -f lavfi -i color=c=0x0a0a0a:s=300x220:r=30 \
  -filter_complex '[0:v]crop=300:470:150:45,format=rgba,rotate=60*PI/180:ow=rotw(iw):oh=roth(ih):c=black@0,scale=290:200:force_original_aspect_ratio=decrease[fg];[1:v][fg]overlay=(W-w)/2:(H-h)/2:format=auto:shortest=1,format=yuv420p' \
  -frames:v "$frame_count" -an -c:v libx264 -preset slow -crf 20 \
  -movflags +faststart -g 6 -keyint_min 6 -sc_threshold 0 "$output_mp4"

ffmpeg -y -loglevel error -sseof -0.04 -i "$output_mp4" \
  -frames:v 1 -c:v libwebp -q:v 88 "$output_webp"
