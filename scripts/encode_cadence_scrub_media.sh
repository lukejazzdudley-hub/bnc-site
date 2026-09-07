#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "usage: $0 INPUT OUTPUT_MP4 OUTPUT_POSTER" >&2
  exit 64
fi

input=$1
output=$2
poster=$3

ffmpeg -y -i "$input" -an \
  -vf "crop=iw:if(gt(ih\,iw)\,trunc(ih*0.934/2)*2\,ih):0:if(gt(ih\,iw)\,trunc(ih*0.066/2)*2\,0),fps=30,scale='min(1280,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart \
  -g 6 -keyint_min 6 -sc_threshold 0 "$output"
ffmpeg -y -sseof -0.04 -i "$output" -frames:v 1 \
  -c:v libwebp -q:v 88 "$poster"
