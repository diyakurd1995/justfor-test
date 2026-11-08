"""Rasterise the booklet PDF: per-page PNG previews and contact sheets.
    python3 sheets.py <pdf> <outdir> [dpi]
"""
import sys
from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image

pdf, out = Path(sys.argv[1]), Path(sys.argv[2])
dpi = float(sys.argv[3]) if len(sys.argv) > 3 else 60
out.mkdir(parents=True, exist_ok=True)
doc = pdfium.PdfDocument(str(pdf))
ims = []
for i in range(len(doc)):
    im = doc[i].render(scale=dpi / 72).to_pil().convert("RGB")
    ims.append(im)
    im.save(out / f"page-{i + 1:02d}.png")
w, h = ims[0].size
per = 6
for s in range(0, len(ims), per):
    grid = Image.new("RGB", (3 * w + 40, 2 * h + 30), "#888888")
    for k, im in enumerate(ims[s:s + per]):
        grid.paste(im, (10 + (k % 3) * (w + 10), 10 + (k // 3) * (h + 10)))
    grid.save(out / f"sheet-{s // per + 1}.png")
print(len(ims), "pages", w, "x", h)
