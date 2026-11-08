"""Overview image (all pages of one PDF on one sheet) for every unit in ../output.
    python3 previews.py
"""
import glob
from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image

out = Path(__file__).resolve().parent.parent / "output"
(out / "preview").mkdir(exist_ok=True)
for f in sorted(glob.glob(str(out / "*.pdf"))):
    d = pdfium.PdfDocument(f)
    ims = [d[i].render(scale=40 / 72).to_pil().convert("RGB") for i in range(len(d))]
    w, h = ims[0].size
    cols = 7
    rows = (len(ims) + cols - 1) // cols
    g = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 8) + 8), "#7A8794")
    for i, im in enumerate(ims):
        g.paste(im, (8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8)))
    name = Path(f).stem
    g.save(out / "preview" / f"{name}.jpg", quality=85)
    print(name, len(ims), "pages")
