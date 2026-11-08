// Renders every unit (units/uNN.js) to its own A4 PDF and checks each page.
//   node render.js [unitNumber ...]      e.g. node render.js 01 04
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, 'unit.html');
const OUT = path.resolve(__dirname, '..', 'output');
const NAMES = {
  '01': 'سرفصل-۱-خودمراقبتی', '02': 'سرفصل-۲-بهداشت-محیط-و-سرویس-بهداشتی', '03': 'سرفصل-۳-تغذیه-و-سبک-زندگی-فعال',
  '04': 'سرفصل-۴-اورژانس-۱۱۵', '05': 'سرفصل-۵-خواب-خوب-و-کافی', '06': 'سرفصل-۶-کمک‌های-اولیه',
  '07': 'سرفصل-۷-محیط-زیست-و-بازیافت', '08': 'سرفصل-۸-نشستن-درست-و-حالت-بدن', '09': 'سرفصل-۹-مصرف-بهینه-انرژی',
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const units = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(NAMES).filter((u) => fs.existsSync(path.join(__dirname, 'units', `u${u}.js`)));
  const browser = await chromium.launch();
  let failed = 0;
  for (const u of units) {
    const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('file://' + SRC + '?u=' + u);
    await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
    await page.emulateMedia({ media: 'print' });
    if (errors.length) throw new Error(`unit ${u}: ` + errors.join('; '));
    const rep = await page.evaluate(() => {
      const mm = 96 / 25.4;
      const pages = [...document.querySelectorAll('.page')];
      const res = { count: pages.length, rows: [], problems: [] };
      pages.forEach((pg, i) => {
        const label = `p${i + 1} ${pg.dataset.kind || 's' + pg.dataset.sec + '/' + pg.dataset.page}`;
        const pr = pg.getBoundingClientRect();
        const c = pg.querySelector('.content');
        if (c) {
          const cr = c.getBoundingClientRect();
          const kids = [...c.querySelector('.inner').children];
          const used = kids.reduce((s, k) => s + k.getBoundingClientRect().height, 0);
          const spare = (cr.height - used) / mm;
          res.rows.push(`${label} z${c.dataset.zoom} +${spare.toFixed(0)}`);
          let bottom = 0;
          kids.forEach((k) => { bottom = Math.max(bottom, k.getBoundingClientRect().bottom); });
          if (bottom > cr.bottom + 1 || spare < (kids.length - 1) * 3) res.problems.push(`${label}: content too tall (spare ${spare.toFixed(1)}mm)`);
          c.querySelectorAll('.inner *').forEach((el) => {
            if (el.closest('svg') && el.tagName !== 'svg') return;
            const r = el.getBoundingClientRect();
            if (r.width && (r.left < cr.left - 1 || r.right > cr.right + 1)) res.problems.push(`${label}: sticks out (${el.className || el.tagName} "${el.textContent.trim().slice(0, 20)}")`);
          });
        }
        pg.querySelectorAll('p, span, b, li, h1, td, th, .slogan, .by2').forEach((el) => {
          if (el.closest('svg')) return;
          const r = el.getBoundingClientRect();
          const m = 6 * mm;
          if (r.width && (r.left < pr.left + m - 0.5 || r.right > pr.right - m + 0.5 || r.bottom > pr.bottom - m + 0.5))
            res.problems.push(`${label}: "${el.textContent.trim().slice(0, 25)}" too close to page edge`);
        });
      });
      res.text = document.getElementById('book').innerText;
      res.title = document.title;
      return res;
    });
    const probs = [...new Set(rep.problems)];
    console.log(`unit ${u}: ${rep.count} pages | ${rep.rows.join(' | ')}`);
    probs.forEach((p) => console.log('   ✗ ' + p));
    if (probs.length) failed++;
    fs.writeFileSync(path.join(OUT, `.text-u${u}.txt`), rep.text);
    const pdf = path.join(OUT, `${NAMES[u]}.pdf`);
    await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.close();
  }
  await browser.close();
  console.log(failed ? `${failed} unit(s) with layout problems` : 'All units OK.');
  process.exitCode = failed ? 2 : 0;
})();
