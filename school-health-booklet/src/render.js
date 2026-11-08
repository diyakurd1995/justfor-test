// Renders booklet.html → output/school-health-booklet-A4.pdf and checks every page.
//   node render.js [outDir]
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, 'booklet.html');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'output'));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + SRC);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  if (errors.length) throw new Error('Page errors: ' + errors.join('; '));

  const rep = await page.evaluate(() => {
    const mm = 96 / 25.4;
    const pages = [...document.querySelectorAll('.page')];
    const res = { count: pages.length, fontOk: document.fonts.check('20px Titr'), rows: [], problems: [] };
    pages.forEach((pg, i) => {
      const label = `p${i + 1} ${pg.dataset.topic || pg.dataset.kind}${pg.dataset.page ? '/' + pg.dataset.page : ''}`;
      const pr = pg.getBoundingClientRect();
      const c = pg.querySelector('.content');
      if (c) {
        const cr = c.getBoundingClientRect();
        let bottom = cr.top, minGap = Infinity;
        const kids = [...c.querySelector('.inner').children];
        kids.forEach((k) => { bottom = Math.max(bottom, k.getBoundingClientRect().bottom); });
        for (let j = 1; j < kids.length; j++) minGap = Math.min(minGap, kids[j].getBoundingClientRect().top - kids[j - 1].getBoundingClientRect().bottom);
        const used = kids.reduce((s, k) => s + k.getBoundingClientRect().height, 0);
        const spare = (cr.height - used) / mm;
        res.rows.push(`${label.padEnd(18)} zoom ${c.dataset.zoom}  spare ${spare.toFixed(1).padStart(5)}mm`);
        if (bottom > cr.bottom + 1 || spare < (kids.length - 1) * 3) res.problems.push(`${label}: content too tall (spare ${spare.toFixed(1)}mm)`);
      }
      // anything (except backgrounds) crossing the page edge or closer than 6mm to it
      pg.querySelectorAll('p, span, b, li, h1, td, th, .it, .step, .cp, .warn, .tip, .intro, .hero, .slogan, .by, .by2').forEach((el) => {
        if (el.closest('svg')) return;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const m = 6 * mm;
        if (r.left < pr.left + m - 0.5 || r.right > pr.right - m + 0.5 || r.bottom > pr.bottom - m + 0.5)
          res.problems.push(`${label}: "${el.textContent.trim().slice(0, 30)}" too close to page edge`);
      });
      if (c) {
        const cr = c.getBoundingClientRect();
        c.querySelectorAll('.inner *').forEach((el) => {
          if (el.closest('svg') && el.tagName !== 'svg') return;
          const r = el.getBoundingClientRect();
          if (r.width && (r.left < cr.left - 1 || r.right > cr.right + 1)) res.problems.push(`${label}: element sticks out of the column (${el.className || el.tagName})`);
        });
      }
      pg.querySelectorAll('.it p, .step p, .cp span, .ddc li span, .warn li, .bg p').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 1) res.problems.push(`${label}: horizontal overflow "${el.textContent.slice(0, 30)}"`);
      });
    });
    res.text = document.getElementById('book').innerText;
    return res;
  });
  console.log(`pages: ${rep.count}   Titr loaded: ${rep.fontOk}`);
  rep.rows.forEach((r) => console.log('  ' + r));
  if (rep.problems.length) { console.log('PROBLEMS:'); [...new Set(rep.problems)].forEach((p) => console.log('  ✗ ' + p)); }
  else console.log('Layout OK: no overflow, nothing within 6mm of a page edge.');
  fs.writeFileSync(path.join(OUT, '.booklet-text.txt'), rep.text);

  const pdf = path.join(OUT, 'school-health-booklet-A4.pdf');
  await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('wrote', pdf);
  await browser.close();
  if (rep.problems.length) process.exitCode = 2;
})();
