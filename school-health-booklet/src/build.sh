#!/usr/bin/env bash
# Rebuild the booklet PDF and the preview sheets in ../output.
set -euo pipefail
cd "$(dirname "$0")"
[ -f fonts/Titr.ttf ] || ./fetch-font.sh
node render.js
tmp="$(mktemp -d)"
python3 sheets.py ../output/school-health-booklet-A4.pdf "$tmp" 70
mkdir -p ../output/preview
for f in "$tmp"/sheet-*.png; do n="$(basename "$f" .png)"; python3 -c "from PIL import Image; Image.open('$f').save('../output/preview/${n/sheet/pages}.jpg', quality=85)"; done
rm -rf "$tmp"
