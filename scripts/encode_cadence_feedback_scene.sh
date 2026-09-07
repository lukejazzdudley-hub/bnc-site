#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "usage: $0 SOURCE_PNG OUTPUT_WEBP" >&2
  exit 64
fi

source_png=$1
output_webp=$2

if [[ ! -s "$source_png" ]]; then
  echo "Blender cutout source is missing: $source_png" >&2
  exit 66
fi

ffmpeg -y -loglevel error -i "$source_png" -vf crop=480:840:256:120 \
  -frames:v 1 -c:v libwebp -lossless 1 -compression_level 6 "$output_webp"
