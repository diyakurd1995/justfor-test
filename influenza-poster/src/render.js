// Renders poster.html to print files.
//   node render.js [outDir]
// Produces: full-poster PNG at 300 dpi (4960×7016 px) and a single-page A2 vector PDF,
// and prints a layout report (safe-zone check around every A4 sheet edge, overflow check).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, 'poster.html');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'output'));
const DPI = 300;
const DSF = DPI / 96;                 // CSS px → device px
const W_PX = 4960, H_PX = 7016;       // 2 × A4 (2480 × 3508 px @300dpi)
const SAFE = 12;                      // mm of empty background around each sheet edge

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1588, height: 2246 }, deviceScaleFactor: DSF });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + SRC);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  await page.evaluate(() => document.fonts.ready);
  if (errors.length) throw new Error('Page errors: ' + errors.join('; '));

  // ---------- layout checks ----------
  const report = await page.evaluate((SAFE) => {
    const mm = 96 / 25.4;
    const out = { violations: [], overflow: [], fontOk: document.fonts.check('20px Titr') };
    const bad = (r) => {
      const x0 = r.left / mm, x1 = r.right / mm, y0 = r.top / mm, y1 = r.bottom / mm;
      const hit = [];
      const e = 0.05; // mm tolerance for float rounding
      if (x0 < SAFE - e || x1 > 420 - SAFE + e || y0 < SAFE - e || y1 > 594 - SAFE + e) hit.push('outer edge');
      if (x1 > 210 - SAFE + e && x0 < 210 + SAFE - e) hit.push('vertical seam');
      if (y1 > 297 - SAFE + e && y0 < 297 + SAFE - e) hit.push('horizontal seam');
      return hit.length ? `${hit.join('+')} [x ${x0.toFixed(1)}–${x1.toFixed(1)}, y ${y0.toFixed(1)}–${y1.toFixed(1)}mm]` : null;
    };
    // every text run
    const walker = document.createTreeWalker(document.getElementById('poster'), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) { const b = bad(r); if (b) out.violations.push(`text "${n.textContent.trim().slice(0, 30)}": ${b}`); }
    }
    // cards, illustrations (faces), icons, emblem
    document.querySelectorAll('.card, [data-art], [data-mini], [data-icon], .emblem').forEach((el) => {
      const b = bad(el.getBoundingClientRect());
      if (b) out.violations.push(`${el.className || el.dataset.art || el.dataset.icon}: ${b}`);
    });
    // content overflow inside cards
    document.querySelectorAll('.card .body').forEach((el) => {
      const pad = parseFloat(getComputedStyle(el).paddingBottom);
      let bottom = 0;
      el.querySelectorAll('*').forEach((c) => { if (c.tagName !== 'svg' && c.closest('svg')) return; bottom = Math.max(bottom, c.getBoundingClientRect().bottom); });
      const spare = (el.getBoundingClientRect().bottom - pad - bottom) / mm;
      const name = el.parentElement.querySelector('h2').textContent;
      out.overflow.push(`${spare < -0.05 ? '✗ OVERFLOW' : 'ok'} – ${name}: spare ${spare.toFixed(1)}mm`);
      if (spare < -0.05) out.violations.push('overflow in ' + name);
    });
    // text clipped horizontally (nowrap labels)
    document.querySelectorAll('.lab, .fact, .title, .slogan1, .slogan2 .big, .cell, .hcell, .s1 .def').forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) out.violations.push('horizontal overflow: ' + el.textContent.trim());
    });
    out.text = document.getElementById('poster').innerText;
    return out;
  }, SAFE);

  console.log('Titr font loaded:', report.fontOk);
  report.overflow.forEach((l) => console.log('  ' + l));
  if (report.violations.length) { console.log('SAFE-ZONE VIOLATIONS:'); report.violations.forEach((v) => console.log('  ✗ ' + v)); }
  else console.log(`Safe zone OK: nothing within ${SAFE}mm of any sheet edge or seam.`);
  fs.writeFileSync(path.join(OUT, '.poster-text.txt'), report.text);

  // ---------- raster: full poster @300dpi ----------
  const png = path.join(OUT, '_full-raw.png');
  await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1588, height: 2246 }, animations: 'disabled' });
  console.log('wrote', png);

  // ---------- vector PDF: single A2 page ----------
  const pdf = path.join(OUT, 'influenza-poster-A2-full.pdf');
  await page.pdf({ path: pdf, width: '420mm', height: '594mm', printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
  console.log('wrote', pdf);

  await browser.close();
  if (report.violations.length) process.exitCode = 2;
})();
