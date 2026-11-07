#!/usr/bin/env bash
# Rebuild every print file in ../output from poster.html.
set -euo pipefail
cd "$(dirname "$0")"
[ -f fonts/Titr.ttf ] || ./fetch-font.sh
node render.js
python3 split.py
node guide.js
