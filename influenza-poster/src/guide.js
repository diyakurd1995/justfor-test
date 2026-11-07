// Builds output/assembly-guide.png: how the four A4 sheets fit together.
//   node guide.js [outDir]      (run after render.js + split.py)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'output'));
const FONT = 'file://' + path.join(__dirname, 'fonts', 'Titr.ttf');
const IMG = 'file://' + path.join(OUT, 'preview.jpg');

const sheet = (n, label, pos) => `
  <div class="sh"><div class="img" style="background-position:${pos}"></div>
  <div class="tag"><b>${n}</b>${label}</div></div>`;

const html = `<!doctype html><html lang="fa"><head><meta charset="utf-8"><style>
@font-face{font-family:Titr;src:url('${FONT}')}
*{box-sizing:border-box;margin:0}
body{width:1600px;height:1250px;font-family:Titr;background:#F2F8FD;color:#12355B;direction:rtl;padding:40px 50px}
h1{font-size:46px;font-weight:normal;margin-bottom:8px}
.sub{font-size:22px;color:#3B5B80;margin-bottom:26px}
.wrap{display:flex;gap:46px;align-items:flex-start}
.grid{direction:ltr;display:grid;grid-template-columns:330px 330px;gap:22px}
.sh{position:relative;width:330px;height:467px;border-radius:6px;overflow:hidden;box-shadow:0 4px 14px rgba(18,53,91,.25);outline:3px dashed #E8690F;outline-offset:-3px}
.img{position:absolute;inset:0;background-image:url('${IMG}');background-size:660px 934px}
.tag{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);direction:rtl;background:rgba(18,53,91,.88);color:#fff;border-radius:18px;padding:14px 22px;font-size:24px;text-align:center;white-space:nowrap}
.tag b{display:block;font-size:56px;line-height:1.1;color:#FFC531;font-weight:normal}
ol{list-style:none;padding:0;font-size:25px;line-height:1.75;max-width:720px}
li{display:flex;gap:14px;margin-bottom:12px}
li i{flex:none;font-style:normal;width:40px;height:40px;border-radius:50%;background:#1F6FD1;color:#fff;display:grid;place-items:center;font-size:22px;line-height:1;margin-top:3px}
.note{margin-top:16px;background:#FFF4CC;border-radius:16px;padding:16px 22px;font-size:22px;line-height:1.7;max-width:720px}
</style></head><body>
<h1>راهنمای چاپ و چسباندن پوستر</h1>
<div class="sub">پوستر از چهار برگۀ A4 عمودی ساخته می‌شود (اندازۀ نهایی ۴۲ × ۵۹٫۴ سانتی‌متر).</div>
<div class="wrap">
  <div class="grid">
    ${sheet('۲', 'بالا، چپ', '0 0')}${sheet('۱', 'بالا، راست', '100% 0')}
    ${sheet('۴', 'پایین، چپ', '0 100%')}${sheet('۳', 'پایین، راست', '100% 100%')}
  </div>
  <div>
    <ol>
      <li><i>۱</i><span>هر برگه را جداگانه روی کاغذ A4 چاپ کنید؛ ترجیحاً با کاغذ ضخیم و چاپ رنگی.</span></li>
      <li><i>۲</i><span>در تنظیمات چاپ، اندازه را روی «اندازۀ واقعی» یا «۱۰۰٪» بگذارید.</span></li>
      <li><i>۳</i><span>اگر چاپگر حاشیۀ سفید گذاشت، حاشیه‌ها را با خط‌کش و کاتر ببرید.</span></li>
      <li><i>۴</i><span>برگه‌ها را مطابق شکل کنار هم بچینید و از پشت با چسب نواری به هم وصل کنید.</span></li>
    </ol>
    <div class="note">در طراحی، دور هر برگه ۱۲ میلی‌متر فقط پس‌زمینه است؛ بنابراین بریدن حاشیه یا کمی جابه‌جایی هنگام چسباندن به متن‌ها و تصویرها آسیبی نمی‌زند.</div>
  </div>
</div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1250 }, deviceScaleFactor: 1 });
  const tmp = path.join(OUT, '.guide.html');
  fs.writeFileSync(tmp, html);
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(OUT, 'assembly-guide.png') });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('wrote', path.join(OUT, 'assembly-guide.png'));
})();
