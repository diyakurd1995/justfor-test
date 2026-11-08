#!/usr/bin/env bash
# Downloads the B Titr font (Titr.bold.ttf from the @raha.group/persian-fonts npm package)
# into fonts/Titr.ttf. The font file itself is not committed to the repository.
set -euo pipefail
cd "$(dirname "$0")"
tmp="$(mktemp -d)"
( cd "$tmp" && npm pack @raha.group/persian-fonts@1.0.3 --silent >/dev/null && tar xzf ./*.tgz package/Titr.bold.ttf )
mkdir -p fonts
cp "$tmp/package/Titr.bold.ttf" fonts/Titr.ttf
rm -rf "$tmp"
echo "fonts/Titr.ttf ready"
