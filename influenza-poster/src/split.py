"""Cut the rendered poster into four A4 sheets (PNG + PDF) and write previews.

    python3 split.py [outDir]

Input (written by render.js):
  _full-raw.png                  full-page screenshot at 300 dpi (slightly larger than the poster)
  influenza-poster-A2-full.pdf   single 420×594 mm vector page
"""
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "output")
DPI = 300
W, H = 4960, 7016            # 2 × A4 at 300 dpi
TW, TH = W // 2, H // 2       # 2480 × 3508 = one A4 sheet

# Reading order of a Persian (RTL) poster: top-right first.
SHEETS = [
    ("sheet-1-top-right",    TW, 0),
    ("sheet-2-top-left",     0,  0),
    ("sheet-3-bottom-right", TW, TH),
    ("sheet-4-bottom-left",  0,  TH),
]

raw = OUT / "_full-raw.png"
full = Image.open(raw).convert("RGB").crop((0, 0, W, H))
full.save(OUT / "influenza-poster-full-300dpi.png", dpi=(DPI, DPI), optimize=True)
full.resize((1240, 1754), Image.LANCZOS).save(OUT / "preview.jpg", quality=90, dpi=(75, 75))

tiles_dir = OUT / "sheets-A4-png"
tiles_dir.mkdir(exist_ok=True)
for name, x, y in SHEETS:
    full.crop((x, y, x + TW, y + TH)).save(tiles_dir / f"{name}.png", dpi=(DPI, DPI), optimize=True)

# ---- vector PDF ----
# Chromium rounds the page up by a fraction of a point; the poster content itself is
# anchored at the top-left corner, so exact boxes are measured from there.
MM = 72 / 25.4
A2W, A2H = 420 * MM, 594 * MM          # 1190.55 × 1683.78 pt
A4W, A4H = A2W / 2, A2H / 2             #  595.28 ×  841.89 pt
src = OUT / "influenza-poster-A2-full.pdf"
reader = PdfReader(src)
assert len(reader.pages) == 1, "expected a single-page A2 PDF"
ph = float(reader.pages[0].mediabox.top)
top = ph                                 # content top edge in PDF coordinates


def set_box(page, x0, y0, x1, y1):
    box = RectangleObject([x0, y0, x1, y1])
    page.mediabox = box
    page.cropbox = box
    page.trimbox = box
    page.bleedbox = box


# exact A2 single page
w = PdfWriter()
set_box(w.add_page(reader.pages[0]), 0, top - A2H, A2W, top)
w.add_metadata({"/Title": "Influenza care poster – A2 (420 × 594 mm)"})
with open(src, "wb") as f:
    w.write(f)

# four exact A4 pages, each cropped to one quadrant of the same vector page
writer = PdfWriter()
for name, x, y in SHEETS:
    page = writer.add_page(PdfReader(src).pages[0])
    x0 = A4W if x else 0.0
    y1 = top - (A4H if y else 0.0)
    set_box(page, x0, y1 - A4H, x0 + A4W, y1)
writer.add_metadata({"/Title": "Influenza care poster – 4 × A4 sheets (1: top-right, 2: top-left, 3: bottom-right, 4: bottom-left)"})
with open(OUT / "influenza-poster-4xA4-sheets.pdf", "wb") as f:
    writer.write(f)
pw, qw, qh = A2W, A4W, A4H
raw.unlink()
print(f"A2 page: {A2W:.2f} × {A2H:.2f} pt  →  A4 sheet: {qw:.2f} × {qh:.2f} pt")
print("wrote", *sorted(p.relative_to(OUT).as_posix() for p in OUT.rglob("*") if p.is_file() and not p.name.startswith(".")), sep="\n  ")
