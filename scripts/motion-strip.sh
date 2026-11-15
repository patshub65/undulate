#!/usr/bin/env bash
# Turn a short screen recording into one PNG of frames in reading order (left to right, top to bottom),
# so an agent can see motion. Frames are 1/FPS seconds apart; the script prints the interval.
# Usage: scripts/motion-strip.sh <recording.mov|mp4> [frames-per-second, default 8]
# Writes <recording>.strip.png next to the recording. Uses ffmpeg only.
set -euo pipefail
IN="$1"; FPS="${2:-8}"
[ -f "$IN" ] || { echo "no such file: $IN"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
N=$(python3 -c "import math; print(max(1, min(48, math.ceil($DUR * $FPS))))")
COLS=6; ROWS=$(( (N + COLS - 1) / COLS ))
OUT="${IN%.*}.strip.png"
ffmpeg -v error -y -i "$IN" -frames:v 1 \
  -vf "fps=$FPS,scale=320:-2,tile=${COLS}x${ROWS}:padding=8:margin=8:color=white" \
  "$OUT"
echo "$OUT: $N frames, $(python3 -c "print(round(1000/$FPS))")ms apart, left to right, ${DUR}s recording"
