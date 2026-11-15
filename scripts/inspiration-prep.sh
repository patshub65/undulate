#!/usr/bin/env bash
# Prepare inspiration screenshots for an agent: resize, cut tall pages into overlapping slices,
# encode as WebP. Image token cost depends on pixel size, not file format, and a very tall
# screenshot gets shrunk until it is unreadable, so slicing is what keeps detail per token.
#
# Usage: scripts/inspiration-prep.sh <folder>      e.g. design/inspiration/all
# For every <name>.png|jpg in <folder> writes <folder>/prepared/<name>-01.webp, -02.webp, ...
# Desktop shots (wider than 1000px) become 1000px wide, slices 1150px tall (about 1.15 MP).
# Phone shots become 600px wide, slices 1500px tall. Slices overlap by 96px so nothing is cut in half unseen.
# Needs ffmpeg; uses cwebp when installed, else ffmpeg's libwebp encoder.
set -euo pipefail
DIR="${1:?folder}"; OUT="$DIR/prepared"; OVERLAP=96
mkdir -p "$OUT"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
shopt -s nullglob nocaseglob
for f in "$DIR"/*.png "$DIR"/*.jpg "$DIR"/*.jpeg; do
  name=$(basename "${f%.*}")
  read -r W H < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$f" | tr x ' ')
  if [ "$W" -gt 1000 ]; then TW=1000; SLICE=1150; else TW=600; SLICE=1500; fi
  TH=$(( H * TW / W ))
  rm -f "$OUT/$name"-*.webp
  i=0; y=0
  while :; do
    i=$((i + 1)); h=$SLICE
    [ $((y + h)) -gt "$TH" ] && h=$((TH - y))
    ffmpeg -v error -y -i "$f" -vf "scale=${TW}:${TH}:flags=lanczos,crop=${TW}:${h}:0:${y}" "$TMP/s.png"
    dest="$OUT/$(printf '%s-%02d.webp' "$name" "$i")"
    if command -v cwebp >/dev/null; then cwebp -quiet -q 82 "$TMP/s.png" -o "$dest"
    else ffmpeg -v error -y -i "$TMP/s.png" -c:v libwebp -quality 82 "$dest"; fi
    [ $((y + h)) -ge "$TH" ] && break
    y=$((y + SLICE - OVERLAP))
  done
  echo "$name: ${W}x${H} -> ${TW}px wide, $i slice(s)"
done
