#!/usr/bin/env bash
# Rebuild all nine PDFs (or only the given units, e.g. ./build.sh 03 07) and the preview sheets.
set -euo pipefail
cd "$(dirname "$0")"
[ -f fonts/Titr.ttf ] || ./fetch-font.sh
node render.js "$@"
python3 previews.py
