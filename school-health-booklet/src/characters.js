/*
 * Vector illustrations for the influenza poster.
 * Every function returns an SVG string. Characters are drawn in a
 * "head-local" coordinate system (head centre at 0,0; head ≈ 100 units wide)
 * and placed in scenes with translate/scale.
 */
(function (global) {
  'use strict';

  let UID = 0;
  const uid = (p) => `${p || 'g'}${++UID}`;

  /* ---------- palette ---------- */
  const SKIN = {
    light:  { base: '#F8D7BC', shade: '#EDB995', deep: '#D49470', blush: '#F3A08A', lip: '#B9614F' },
    medium: { base: '#EFC29B', shade: '#DDA47B', deep: '#BF8058', blush: '#E98C72', lip: '#A9573F' },
    tan:    { base: '#DBA678', shade: '#C4885C', deep: '#A66A40', blush: '#D27A5F', lip: '#97503A' },
  };
  const HAIR = {
    black: { base: '#262120', hi: '#4E4540' },
    dark:  { base: '#3E2C21', hi: '#6E5039' },
    brown: { base: '#5C3A22', hi: '#91603A' },
  };
  const CLOTH = {
    shirt: '#A9D2F5', shirtShade: '#80B5E6', shirtLine: '#5E97CF', collar: '#F6FBFF',
    vest: '#2B4C80', vestShade: '#203B66', vestTrim: '#4F75B3',
  };
  const P = {
    navy: '#12355B', blue: '#1F6FD1', blueL: '#DCEBFF', teal: '#0E9F9A', tealL: '#D5F3F0',
    green: '#2E9E5B', greenL: '#DDF4E6', orange: '#F27A1A', orangeL: '#FFE8D3',
    yellow: '#FFC531', yellowL: '#FFF4CC', red: '#DE4330', redL: '#FFE9E3', white: '#FFFFFF',
  };
  const INK = '#2B1D16';

  /* ---------- small helpers ---------- */
  const svg = (vb, body, extra = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${body}</svg>`;
  const g = (t, body) => `<g transform="${t}">${body}</g>`;

  /* ---------- face parts ---------- */
  function eye(cx, cy, type, side, sk, look) {
    const [lx, ly] = look || [0, 0];
    const st = `fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round"`;
    if (type === 'happy')
      return `<path d="M${cx - 8.5} ${cy + 2.5} Q${cx} ${cy - 7} ${cx + 8.5} ${cy + 2.5}" ${st} stroke-width="3.2"/>`;
    if (type === 'sleep')
      return `<path d="M${cx - 9} ${cy} Q${cx} ${cy + 6.5} ${cx + 9} ${cy}" ${st} stroke-width="3"/>` +
        `<path d="M${cx + side * 9} ${cy} l${side * 3} 2.5" ${st} stroke-width="2"/>`;
    if (type === 'squeeze')
      return `<path d="M${cx + side * 8} ${cy - 5.5} L${cx - side * 6} ${cy} L${cx + side * 8} ${cy + 5.5}" ${st} stroke-width="3.2"/>`;

    const id = uid('eye');
    const almond = `M${cx - 10.5} ${cy + 1} C${cx - 7} ${cy - 8.5} ${cx + 7} ${cy - 8.5} ${cx + 10.5} ${cy} C${cx + 7} ${cy + 7.5} ${cx - 7} ${cy + 7.5} ${cx - 10.5} ${cy + 1} Z`;
    let s = `<clipPath id="${id}"><path d="${almond}"/></clipPath>`;
    s += `<path d="${almond}" fill="#FFFFFF"/>`;
    s += `<g clip-path="url(#${id})">`;
    s += `<circle cx="${cx + lx}" cy="${cy + 0.5 + ly}" r="6.6" fill="#6A4325"/>`;
    s += `<circle cx="${cx + lx}" cy="${cy + 0.5 + ly}" r="6.6" fill="none" stroke="#3A2312" stroke-width="1.3"/>`;
    s += `<circle cx="${cx + lx}" cy="${cy + 2.2 + ly}" r="3.6" fill="#8A5A33" opacity=".55"/>`;
    s += `<circle cx="${cx + lx}" cy="${cy + 0.5 + ly}" r="3.1" fill="#160E09"/>`;
    s += `<circle cx="${cx + lx + 2.3}" cy="${cy - 1.9 + ly}" r="2.1" fill="#FFFFFF"/>`;
    s += `<circle cx="${cx + lx - 2.2}" cy="${cy + 2.8 + ly}" r="0.95" fill="#FFFFFF" opacity=".85"/>`;
    if (type === 'tired') {
      s += `<path d="M${cx - 12} ${cy - 10} L${cx + 12} ${cy - 10} L${cx + 12} ${cy - 0.5} Q${cx} ${cy - 3.5} ${cx - 12} ${cy - 0.5} Z" fill="${sk.base}"/>`;
    }
    s += `</g>`;
    if (type === 'tired') {
      s += `<path d="M${cx - 10.5} ${cy + 0.5} Q${cx} ${cy - 3.6} ${cx + 10.5} ${cy - 0.5}" ${st} stroke-width="2.6"/>`;
      s += `<path d="M${cx - 9} ${cy - 4.5} Q${cx} ${cy - 8} ${cx + 9} ${cy - 5}" fill="none" stroke="${sk.deep}" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>`;
    } else {
      s += `<path d="M${cx - 10.8} ${cy + 1} C${cx - 7} ${cy - 9} ${cx + 7} ${cy - 9} ${cx + 10.8} ${cy - 0.3}" ${st} stroke-width="2.7"/>`;
      s += `<path d="M${cx + side * 10.6} ${cy + 0.2} l${side * 3.2} -2.4" ${st} stroke-width="2.1"/>`;
    }
    s += `<path d="M${cx - 7} ${cy + 6.3} Q${cx} ${cy + 8.4} ${cx + 7} ${cy + 6}" fill="none" stroke="${sk.deep}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`;
    return s;
  }

  function brow(cx, by, side, color, mode) {
    // inner end is the end closest to the nose (x → 0)
    const inner = cx - side * 9, outer = cx + side * 9;
    let yi = by + 1, yo = by + 1.5, ym = by - 3.5;
    if (mode === 'raised') { yi -= 4; yo -= 3; ym -= 4.5; }
    if (mode === 'worried') { yi -= 3.5; yo += 1.5; ym -= 1; }
    if (mode === 'scrunch') { yi += 3; yo -= 1; ym += 1; }
    if (mode === 'relaxed') { yi += 1; yo += 2; ym += 1.5; }
    if (mode === 'angry') { yi += 6; yo -= 3; ym += 1; }
    return `<path d="M${outer} ${yo} Q${cx} ${ym} ${inner} ${yi}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
  }

  function mouth(type, sk) {
    switch (type) {
      case 'smile':
        return `<path d="M-12 29 Q0 43 12 29 Q0 32.6 -12 29 Z" fill="#8E3B2F"/>` +
          `<path d="M-10.4 30 Q0 33.3 10.4 30 L9.4 32.3 Q0 35.4 -9.4 32.3 Z" fill="#FFFFFF"/>` +
          `<path d="M-6 37.3 Q0 34.6 6 37.3 Q0 40.2 -6 37.3 Z" fill="#E98073"/>` +
          `<path d="M-13.5 28.5 q1.5 -0.6 2.3 0.8 M13.5 28.5 q-1.5 -0.6 -2.3 0.8" fill="none" stroke="${sk.deep}" stroke-width="1.4" stroke-linecap="round"/>`;
      case 'closed':
        return `<path d="M-10 31 Q0 38.5 10 31" fill="none" stroke="${sk.lip}" stroke-width="2.8" stroke-linecap="round"/>`;
      case 'talk':
        return `<path d="M-8 30 Q0 28.5 8 30 Q7 39.5 0 40 Q-7 39.5 -8 30 Z" fill="#8E3B2F"/>` +
          `<path d="M-7 30.4 Q0 29.2 7 30.4 L6.6 32 Q0 31 -6.6 32 Z" fill="#FFFFFF"/>` +
          `<path d="M-4.5 37.6 Q0 34.8 4.5 37.6 Q0 40 -4.5 37.6 Z" fill="#E98073"/>`;
      case 'flat':
        return `<path d="M-7.5 34 Q0 35.6 7.5 33.6" fill="none" stroke="${sk.lip}" stroke-width="2.6" stroke-linecap="round"/>`;
      case 'soft':
        return `<path d="M-7.5 33 Q0 37.5 7.5 33" fill="none" stroke="${sk.lip}" stroke-width="2.6" stroke-linecap="round"/>`;
      case 'sad':
        return `<path d="M-9 37 Q0 29.5 9 37" fill="none" stroke="${sk.lip}" stroke-width="2.8" stroke-linecap="round"/>`;
      case 'angry':
        return `<path d="M-10 35.5 Q0 30 10 35.5 Q0 33.5 -10 35.5 Z" fill="#8E3B2F" stroke="${sk.lip}" stroke-width="2.4" stroke-linejoin="round"/>`;
      case 'scared':
        return `<path d="M-7 31 Q-3.5 28.5 0 31 Q3.5 28.5 7 31 Q7.5 41 0 41 Q-7.5 41 -7 31 Z" fill="#8E3B2F"/><path d="M-6 31.2 Q-3 29.4 0 31.2 Q3 29.4 6 31.2 L5.6 33 Q0 31.6 -5.6 33 Z" fill="#FFFFFF"/>`;
      default:
        return '';
    }
  }

  /* ---------- hair ---------- */
  const HAIR_PATH = {
    side: 'M-51 6 C-57 -16 -56 -46 -40 -62 C-24 -78 16 -82 38 -68 C54 -58 58 -34 52 6 C50 -6 48 -16 45 -22 C36 -29 22 -31 10 -30 C-4 -29 -18 -33 -28 -42 C-31 -34 -37 -28 -44 -24 C-47 -16 -49 -6 -51 6 Z',
    neat: 'M-51 6 C-57 -20 -54 -50 -36 -64 C-18 -79 18 -80 38 -66 C54 -55 58 -30 52 6 C50 -6 48 -18 44 -26 C34 -33 24 -30 14 -34 C4 -38 -6 -32 -16 -36 C-26 -39 -36 -32 -44 -26 C-48 -18 -50 -6 -51 6 Z',
    spiky: 'M-51 6 C-57 -18 -56 -44 -44 -58 Q-47 -70 -34 -71 Q-31 -83 -16 -79 Q-8 -89 5 -81 Q17 -89 25 -78 Q39 -80 40 -68 Q53 -64 50 -54 C58 -40 58 -20 52 6 C50 -6 48 -18 44 -26 C31 -35 15 -35 5 -31 C-9 -36 -29 -36 -44 -26 C-48 -18 -50 -6 -51 6 Z',
    short: 'M-50 2 C-55 -22 -52 -50 -34 -63 C-16 -76 18 -77 37 -64 C53 -52 56 -28 51 2 C49 -10 47 -20 43 -27 C30 -38 -30 -38 -43 -27 C-47 -20 -49 -10 -50 2 Z',
  };
  const HAIR_HI = {
    side: 'M-27 -45 C-12 -60 14 -64 38 -54 M-16 -40 C-2 -50 18 -50 32 -42',
    neat: 'M-30 -52 C-12 -66 16 -68 36 -56',
    spiky: 'M-30 -56 C-12 -68 16 -70 36 -58',
    short: 'M-30 -52 C-12 -64 16 -66 34 -55',
  };

  function hair(style, hr) {
    if (style === 'curly') {
      let s = `<path d="${HAIR_PATH.short}" fill="${hr.base}"/>`;
      const pts = [];
      for (let a = 190; a <= 350; a += 16) {
        const r = (a * Math.PI) / 180;
        pts.push([Math.cos(r) * 49, -20 + Math.sin(r) * 50]);
      }
      [[-38, -30], [-26, -36], [-13, -38], [0, -37], [13, -38], [26, -36], [38, -30]].forEach((p) => pts.push(p));
      pts.forEach(([x, y]) => (s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10.5" fill="${hr.base}"/>`));
      pts.forEach(([x, y], i) => {
        if (i % 2 === 0) s += `<path d="M${(x - 4).toFixed(1)} ${(y - 3).toFixed(1)} q4 -4 8 0" fill="none" stroke="${hr.hi}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
      });
      return s;
    }
    return `<path d="${HAIR_PATH[style]}" fill="${hr.base}"/>` +
      `<path d="${HAIR_HI[style]}" fill="none" stroke="${hr.hi}" stroke-width="3.2" stroke-linecap="round" opacity=".75"/>`;
  }

  /* ---------- head ---------- */
  const FACE = 'M-46 -12 C-47 20 -33 47 0 56 C33 47 47 20 46 -12 C46 -44 26 -57 0 -57 C-26 -57 -46 -44 -46 -12 Z';

  function head(o) {
    const sk = SKIN[o.skin || 'light'];
    const hr = HAIR[o.hair || 'dark'];
    const style = o.style || 'side';
    const fid = uid('face'), gid = uid('fg');
    let s = `<defs><clipPath id="${fid}"><path d="${FACE}"/></clipPath>` +
      `<radialGradient id="${gid}" cx="50%" cy="42%" r="62%"><stop offset=".62" stop-color="${sk.base}"/><stop offset="1" stop-color="${sk.shade}"/></radialGradient></defs>`;
    // ears
    [-1, 1].forEach((sd) => {
      s += `<ellipse cx="${sd * 46}" cy="5" rx="9.5" ry="12.5" fill="${sk.base}"/>`;
      s += `<path d="M${sd * 47} -2 C${sd * 52} 3 ${sd * 51} 10 ${sd * 46} 12" fill="none" stroke="${sk.deep}" stroke-width="2.2" stroke-linecap="round"/>`;
    });
    s += `<path d="${FACE}" fill="url(#${gid})"/>`;
    // hair shadow on the forehead
    if (style !== 'curly')
      s += `<g clip-path="url(#${fid})"><path d="${HAIR_PATH[style]}" transform="translate(0 5)" fill="${sk.shade}" opacity=".7"/></g>`;
    else
      s += `<g clip-path="url(#${fid})"><rect x="-50" y="-40" width="100" height="14" fill="${sk.shade}" opacity=".6"/></g>`;
    // cheeks
    const bo = o.fever ? 0.75 : 0.36, br = o.fever ? 9 : 7.5;
    s += `<ellipse cx="-27" cy="19" rx="${br}" ry="${br * 0.6}" fill="${sk.blush}" opacity="${bo}"/>`;
    s += `<ellipse cx="27" cy="19" rx="${br}" ry="${br * 0.6}" fill="${sk.blush}" opacity="${bo}"/>`;
    // eyes & brows
    const et = o.eyes || 'open';
    s += eye(-19, -1, et, -1, sk, o.look);
    s += eye(19, -1, et, 1, sk, o.look);
    s += brow(-19, -18, -1, hr.base, o.brows);
    s += brow(19, -18, 1, hr.base, o.brows);
    // nose
    s += `<path d="M-2.5 9 Q-6.5 18.5 -1.5 21 Q1.5 22.2 5 19.5" fill="none" stroke="${sk.deep}" stroke-width="2.3" stroke-linecap="round"/>`;
    s += mouth(o.mouth || 'smile', sk);
    if (o.tear) s += `<path d="M-24 8 q-5 9 0 12 q5 -3 0 -12 Z" fill="#5DB4EC" stroke="#3D93CF" stroke-width=".8"/>`;
    if (o.bandage) s += `<g transform="translate(-27 17) rotate(-25)"><rect x="-11" y="-4.5" width="22" height="9" rx="4.5" fill="#F3C892" stroke="#D9A066" stroke-width="1"/><rect x="-4" y="-4.5" width="8" height="9" fill="#E8B57C"/><circle cx="-1.5" cy="-1.5" r=".9" fill="#C98B4E"/><circle cx="1.5" cy="1.5" r=".9" fill="#C98B4E"/></g>`;
    if (o.mask) {
      s += `<path d="M-34 9 C-40 4 -44 2 -47 2 M-32 34 C-40 30 -46 16 -47 10 M34 9 C40 4 44 2 47 2 M32 34 C40 30 46 16 47 10" fill="none" stroke="#8FB9E0" stroke-width="2.6" stroke-linecap="round"/>`;
      s += `<path d="M-34 8 C-34 1 34 1 34 8 L32 34 C28 46 12 52 0 52 C-12 52 -28 46 -32 34 Z" fill="#EEF7FF" stroke="#8FB9E0" stroke-width="2.2"/>`;
      s += `<path d="M-29 19 H29 M-27 30 H27 M-22 40 H22" stroke="#C3DCF2" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    s += hair(style, hr);
    return `<g transform="rotate(${o.tilt || 0})">${s}</g>`;
  }

  /* ---------- body ---------- */
  function torso(o) {
    const sk = SKIN[o.skin || 'light'];
    const c = Object.assign({}, CLOTH, o.cloth || {});
    const sg = uid('shirt');
    let s = `<defs><linearGradient id="${sg}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${c.shirtShade}"/><stop offset=".22" stop-color="${c.shirt}"/><stop offset=".78" stop-color="${c.shirt}"/><stop offset="1" stop-color="${c.shirtShade}"/></linearGradient></defs>`;
    s += `<path d="M-13 30 L-13 70 Q0 78 13 70 L13 30 Z" fill="${sk.base}"/>`;
    s += `<path d="M-13 38 Q0 60 13 38 L13 30 L-13 30 Z" fill="${sk.shade}"/>`;
    s += `<path d="M-14 62 C-34 64 -56 70 -64 88 C-69 104 -70 150 -70 240 L70 240 C70 150 69 104 64 88 C56 70 34 64 14 62 Z" fill="url(#${sg})"/>`;
    if (o.vest) {
      s += `<path d="M-50 76 C-40 69 -28 66 -16 65 L0 108 L16 65 C28 66 40 69 50 76 C55 98 57 150 57 240 L-57 240 C-57 150 -55 98 -50 76 Z" fill="${c.vest}"/>`;
      s += `<path d="M-16 65 L0 108 L16 65" fill="none" stroke="${c.vestTrim}" stroke-width="5" stroke-linejoin="round"/>`;
      s += `<path d="M-50 76 C-55 98 -57 150 -57 240 L-44 240 C-46 160 -46 110 -42 80 Z" fill="${c.vestShade}" opacity=".7"/>`;
      s += `<path d="M50 76 C55 98 57 150 57 240 L44 240 C46 160 46 110 42 80 Z" fill="${c.vestShade}" opacity=".7"/>`;
    } else {
      s += `<path d="M0 74 L0 240" stroke="${c.shirtLine}" stroke-width="1.6"/>`;
      [100, 132, 164, 196].forEach((y) => (s += `<circle cx="0" cy="${y}" r="2.6" fill="${c.collar}" stroke="${c.shirtLine}" stroke-width="1"/>`));
      s += `<path d="M24 112 h20 v18 q-10 4 -20 0 Z" fill="none" stroke="${c.shirtLine}" stroke-width="1.6" stroke-linejoin="round"/>`;
    }
    // collar
    s += `<path d="M-14 59 L-1 77 L-26 82 C-25 72 -21 64 -14 59 Z" fill="${c.collar}" stroke="${c.shirtLine}" stroke-width="1.3" stroke-linejoin="round"/>`;
    s += `<path d="M14 59 L1 77 L26 82 C25 72 21 64 14 59 Z" fill="${c.collar}" stroke="${c.shirtLine}" stroke-width="1.3" stroke-linejoin="round"/>`;
    return s;
  }

  function hand(x, y, ang, type, sk) {
    let h = '';
    const f = `fill="${sk.base}"`;
    const ln = `fill="none" stroke="${sk.deep}" stroke-width="1.4" stroke-linecap="round"`;
    if (type === 'open') {
      h += `<rect x="13" y="-9.5" width="16" height="5" rx="2.5" ${f}/>`;
      h += `<rect x="14" y="-4" width="18" height="5" rx="2.5" ${f}/>`;
      h += `<rect x="14" y="1.5" width="17" height="5" rx="2.5" ${f}/>`;
      h += `<rect x="12" y="7" width="13" height="4.6" rx="2.3" ${f}/>`;
      h += `<ellipse cx="8" cy="0" rx="10" ry="10.5" ${f}/>`;
      h += `<rect x="1" y="-17" width="6" height="13" rx="3" ${f} transform="rotate(-35 4 -6)"/>`;
      h += `<path d="M7 -3 q3 3 0 6" ${ln}/>`;
    } else {
      h += `<rect x="-1" y="-10" width="21" height="20" rx="9" ${f}/>`;
      h += `<ellipse cx="12" cy="-9.5" rx="7.5" ry="4.2" ${f} transform="rotate(-18 12 -9.5)"/>`;
      h += `<path d="M17 -4 q3 1.5 0 3.5 M17 1.5 q3 1.5 0 3.5" ${ln}/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(${ang})">${h}</g>`;
  }

  // pts: [shoulder, elbow, wrist]
  function arm(pts, o, handType) {
    const sk = SKIN[o.skin || 'light'];
    const c = Object.assign({}, CLOTH, o.cloth || {});
    const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
    const [e, w] = pts.slice(-2);
    const dx = w[0] - e[0], dy = w[1] - e[1];
    const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    let s = `<path d="${d}" fill="none" stroke="${c.shirtShade}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="${d}" fill="none" stroke="${c.shirt}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" transform="translate(-1.5 -1.5)"/>`;
    s += `<path d="M${(w[0] - ux * 8).toFixed(1)} ${(w[1] - uy * 8).toFixed(1)} L${(w[0] - ux * 1).toFixed(1)} ${(w[1] - uy * 1).toFixed(1)}" stroke="${c.collar}" stroke-width="24" stroke-linecap="butt"/>`;
    s += `<path d="M${(w[0] - ux * 8).toFixed(1)} ${(w[1] - uy * 8).toFixed(1)} L${(w[0] - ux * 1).toFixed(1)} ${(w[1] - uy * 1).toFixed(1)}" stroke="${c.shirtLine}" stroke-width="24" stroke-linecap="butt" opacity=".25"/>`;
    if (handType) s += hand(w[0] - ux * 2, w[1] - uy * 2, ang, handType, sk);
    return s;
  }

  /* ---------- reusable props ---------- */
  function virusParticle(cx, cy, r, col, colL) {
    let s = '';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.2;
      const x1 = cx + Math.cos(a) * r * 0.9, y1 = cy + Math.sin(a) * r * 0.9;
      const x2 = cx + Math.cos(a) * r * 1.32, y2 = cy + Math.sin(a) * r * 1.32;
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${(r * 0.12).toFixed(1)}" stroke-linecap="round"/>`;
      s += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(r * 0.15).toFixed(1)}" fill="${col}"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
    s += `<circle cx="${cx - r * 0.12}" cy="${cy - r * 0.12}" r="${r * 0.78}" fill="${colL}" opacity=".55"/>`;
    s += `<circle cx="${cx + r * 0.25}" cy="${cy + r * 0.2}" r="${r * 0.14}" fill="${col}" opacity=".5"/>`;
    s += `<circle cx="${cx - r * 0.3}" cy="${cy + r * 0.3}" r="${r * 0.1}" fill="${col}" opacity=".5"/>`;
    s += `<circle cx="${cx - r * 0.35}" cy="${cy - r * 0.38}" r="${r * 0.16}" fill="#FFFFFF" opacity=".75"/>`;
    return s;
  }

  function glass(x, y, w, h, fill, rot) {
    const wl = `M${x + 2} ${y + h * 0.35} L${x + w - 2} ${y + h * 0.35} L${x + w - 4} ${y + h - 2} L${x + 4} ${y + h - 2} Z`;
    return `<g transform="rotate(${rot || 0} ${x + w / 2} ${y + h / 2})">` +
      `<path d="M${x} ${y} L${x + w} ${y} L${x + w - 3} ${y + h} L${x + 3} ${y + h} Z" fill="#EAF7FF" opacity=".75" stroke="#8FC3E6" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="${wl}" fill="${fill}" opacity=".85"/>` +
      `<path d="M${x + 5} ${y + 5} L${x + 7} ${y + h - 6}" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity=".9"/></g>`;
  }

  function sparkle(x, y, r, col) {
    return `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${col}"/>`;
  }

  /* =========================================================
   * SCENES (characters)
   * ========================================================= */

  // 1) Boy inspecting a (friendly, non-scary) virus particle with a magnifier
  function sceneMagnifier() {
    const o = { skin: 'light', hair: 'dark', style: 'side', vest: true };
    let s = `<ellipse cx="160" cy="214" rx="140" ry="16" fill="${P.blueL}"/>`;
    s += `<circle cx="140" cy="120" r="98" fill="${P.blueL}" opacity=".7"/>`;
    let b = torso(o);
    b += arm([[-56, 90], [-66, 160], [-60, 240]], o, null);
    b += head({ ...o, eyes: 'open', look: [3, -1.5], brows: 'raised', mouth: 'smile' });
    b += arm([[56, 90], [104, 150], [110, 78]], o, null);
    s += g('translate(122 92) scale(.86)', b);
    // magnifier handle + hand
    const sk = SKIN.light;
    s += `<line x1="219" y1="160" x2="246" y2="108" stroke="#7A4E2C" stroke-width="11" stroke-linecap="round"/>`;
    s += `<line x1="219" y1="160" x2="246" y2="108" stroke="#A06A3F" stroke-width="5" stroke-linecap="round" transform="translate(-1.5 -1)"/>`;
    s += g('translate(207 168) rotate(-62)', `<rect x="-2" y="-10.5" width="22" height="21" rx="9.5" fill="${sk.base}"/><ellipse cx="12" cy="-10" rx="7.5" ry="4.2" fill="${sk.base}" transform="rotate(-18 12 -10)"/><path d="M17 -4 q3 1.5 0 3.5 M17 1.5 q3 1.5 0 3.5" fill="none" stroke="${sk.deep}" stroke-width="1.4" stroke-linecap="round"/>`);
    // lens
    s += `<circle cx="266" cy="70" r="46" fill="#F2FBFF"/>`;
    s += virusParticle(266, 70, 19, P.teal, '#7FE0D6');
    s += `<circle cx="266" cy="70" r="46" fill="#BFE6FF" opacity=".25"/>`;
    s += `<circle cx="266" cy="70" r="46" fill="none" stroke="${P.navy}" stroke-width="9"/>`;
    s += `<path d="M237 50 A34 34 0 0 1 262 33" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
    s += sparkle(205, 30, 7, P.yellow) + sparkle(312, 128, 5, P.yellow);
    return svg('0 0 330 230', s);
  }

  // 2) Washing hands with soap
  function sceneWash() {
    const o = { skin: 'medium', hair: 'black', style: 'neat', vest: false };
    let s = '';
    // tiled wall
    s += `<rect x="18" y="12" width="264" height="206" rx="22" fill="${P.tealL}"/>`;
    for (let x = 18 + 44; x < 282; x += 44) s += `<line x1="${x}" y1="12" x2="${x}" y2="218" stroke="#FFFFFF" stroke-width="2" opacity=".8"/>`;
    for (let y = 12 + 44; y < 218; y += 44) s += `<line x1="18" y1="${y}" x2="282" y2="${y}" stroke="#FFFFFF" stroke-width="2" opacity=".8"/>`;
    let b = torso(o);
    b += head({ ...o, eyes: 'open', look: [0, 2.5], brows: 'normal', mouth: 'smile' });
    s += g('translate(150 78) scale(.84)', b);
    // gooseneck faucet at the back of the basin
    s += `<path d="M146 220 V180 C146 164 172 162 172 180 V186" fill="none" stroke="#9FB1C4" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="M144 218 V181 C144 168 160 165 166 170" fill="none" stroke="#E4ECF4" stroke-width="3" stroke-linecap="round"/>`;
    s += `<rect x="136" y="214" width="22" height="9" rx="4" fill="#8DA0B5"/>`;
    s += `<path d="M171 190 C171 196 169 202 166 208" fill="none" stroke="#7CC8F2" stroke-width="6" stroke-linecap="round" opacity=".9"/>`;
    let a = arm([[-56, 92], [-64, 146], [-14, 156]], o, 'fist');
    a += arm([[56, 92], [64, 146], [14, 156]], o, 'fist');
    s += g('translate(150 78) scale(.84)', a);
    // foam over hands
    const foam = [[150, 212, 12], [137, 207, 9.5], [163, 207, 9.5], [142, 219, 8.5], [158, 219, 8.5], [129, 215, 6.5], [171, 215, 6.5], [150, 199, 7]];
    foam.forEach(([x, y, r]) => (s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#BFE3F7" stroke-width="1.6"/>`));
    [[110, 190, 6], [96, 160, 4.5], [204, 132, 5], [214, 168, 4]].forEach(([x, y, r]) =>
      (s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".9" stroke="#9ED5F2" stroke-width="1.4"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#9ED5F2"/>`));
    // counter
    s += `<rect x="6" y="222" width="288" height="22" rx="8" fill="#FFFFFF" stroke="#BCD8EA" stroke-width="2"/>`;
    s += `<rect x="40" y="206" width="40" height="18" rx="7" fill="${P.green}"/>`;
    s += `<rect x="46" y="200" width="28" height="10" rx="5" fill="#7ED3A0"/>`;
    return svg('0 0 300 246', s);
  }

  // 3) Sneezing into a tissue
  function sceneSneeze() {
    const o = { skin: 'light', hair: 'brown', style: 'spiky', vest: true, cloth: { vest: '#1F7A74', vestShade: '#17615C', vestTrim: '#3BA79F' } };
    let s = `<circle cx="150" cy="118" r="102" fill="${P.greenL}"/>`;
    let b = torso(o);
    b += arm([[56, 90], [66, 160], [62, 240]], o, null);
    b += head({ ...o, eyes: 'squeeze', brows: 'scrunch', mouth: 'none', tilt: -6 });
    b += arm([[-56, 92], [-62, 150], [-24, 46]], o, null);
    // tissue + hand
    const sk = SKIN.light;
    b += `<path d="M-20 18 C-24 34 -18 44 -6 46 L10 44 C14 36 12 26 6 20 Z" fill="${sk.base}"/>`;
    b += `<path d="M-30 10 L-17 3 L-4 8 L8 1 L22 7 L28 20 L24 34 L12 41 L-1 38 L-14 43 L-26 36 L-31 22 Z" fill="#FFFFFF" stroke="#C7DDEE" stroke-width="2" stroke-linejoin="round"/>`;
    b += `<path d="M-18 14 L-6 22 M6 10 L12 22 M-22 28 L-10 30" stroke="#DCEAF5" stroke-width="2" stroke-linecap="round"/>`;
    [[-20, 22], [-17, 29.5], [-15, 37]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="7" ry="3.8" transform="rotate(-28 ${x} ${y})" fill="${sk.base}" stroke="${sk.deep}" stroke-width="1.3"/>`));
    s += g('translate(150 84) scale(.86)', b);
    // gentle motion lines
    s += `<path d="M196 92 q10 4 14 0 M200 108 q12 3 18 -1 M196 124 q10 4 15 1" fill="none" stroke="#9CC9E8" stroke-width="3" stroke-linecap="round"/>`;
    // tissue box
    s += `<rect x="224" y="186" width="62" height="40" rx="7" fill="${P.blue}"/>`;
    s += `<rect x="224" y="186" width="62" height="10" rx="5" fill="#3E86E0"/>`;
    s += `<path d="M240 188 C240 172 252 164 258 170 C262 160 274 166 270 188 Z" fill="#FFFFFF" stroke="#C7DDEE" stroke-width="1.5"/>`;
    s += `<path d="M236 210 h38" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
    return svg('0 0 300 236', s);
  }

  // 4) Resting in bed
  function sceneRest() {
    const o = { skin: 'tan', hair: 'dark', style: 'short' };
    let s = '';
    s += `<rect x="10" y="12" width="300" height="190" rx="24" fill="${P.blueL}"/>`;
    // window with moon
    s += `<rect x="34" y="30" width="78" height="62" rx="8" fill="#2E5C9A"/>`;
    s += `<rect x="40" y="36" width="66" height="50" rx="5" fill="#3F74BC"/>`;
    s += `<path d="M86 46 A14 14 0 1 0 92 72 A11 11 0 1 1 86 46 Z" fill="${P.yellow}"/>`;
    s += sparkle(56, 50, 4, '#FFFFFF') + sparkle(66, 72, 3, '#FFFFFF');
    s += `<rect x="72" y="36" width="3" height="50" fill="#2E5C9A"/>`;
    // bed
    s += `<rect x="270" y="70" width="22" height="122" rx="8" fill="#C98552"/>`;
    s += `<rect x="24" y="128" width="18" height="64" rx="7" fill="#C98552"/>`;
    s += `<rect x="30" y="140" width="252" height="34" rx="8" fill="#FFFFFF" stroke="#CFE0EE" stroke-width="2"/>`;
    s += `<rect x="30" y="166" width="252" height="16" rx="6" fill="#A86B3E"/>`;
    s += `<ellipse cx="238" cy="126" rx="46" ry="22" fill="#FFFFFF" stroke="#CFE0EE" stroke-width="2"/>`;
    // head on the pillow
    s += g('translate(236 100) scale(.6) rotate(72)', head({ ...o, eyes: 'sleep', brows: 'relaxed', mouth: 'closed' }));
    // blanket
    s += `<path d="M206 118 C188 106 150 110 112 118 C80 125 52 128 40 144 L40 176 L214 176 C222 160 220 132 206 118 Z" fill="${P.teal}"/>`;
    s += `<path d="M206 118 C188 106 150 110 112 118 C80 125 52 128 40 144 L40 154 C54 140 82 136 112 129 C148 121 186 118 210 128 Z" fill="#FFFFFF" opacity=".9"/>`;
    for (let x = 70; x < 210; x += 34) s += `<path d="M${x} 140 L${x - 8} 176" stroke="#53C6BE" stroke-width="7" opacity=".6"/>`;
    // little floating "z" shapes drawn as strokes (not text)
    s += `<path d="M170 64 h12 l-12 13 h12" fill="none" stroke="${P.blue}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M190 44 h9 l-9 10 h9" fill="none" stroke="${P.blue}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`;
    s += `<path d="M206 28 h7 l-7 8 h7" fill="none" stroke="${P.blue}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>`;
    return svg('0 0 320 212', s);
  }

  // 5) Drinking water
  function sceneDrink() {
    const o = { skin: 'light', hair: 'black', style: 'curly', vest: true, cloth: { vest: '#2F7D4A', vestShade: '#23633A', vestTrim: '#55B07A' } };
    let s = `<circle cx="140" cy="118" r="100" fill="${P.tealL}"/>`;
    let b = torso(o);
    b += arm([[56, 90], [66, 160], [62, 240]], o, null);
    b += head({ ...o, eyes: 'happy', brows: 'relaxed', mouth: 'closed' });
    b += arm([[-56, 92], [-64, 150], [-16, 74]], o, null);
    s += g('translate(140 84) scale(.86)', b);
    // glass at the lips
    s += glass(135, 106, 30, 44, '#5BB8EE', 24);
    s += hand(127, 147, -66, 'fist', SKIN.light);
    // water bottle and juice
    s += `<path d="M236 112 h22 v10 c10 6 12 14 12 24 v70 a8 8 0 0 1 -8 8 h-30 a8 8 0 0 1 -8 -8 v-70 c0 -10 2 -18 12 -24 Z" fill="#CFEFFF" stroke="#7FC4EA" stroke-width="2.5"/>`;
    s += `<path d="M228 160 h46 v44 h-46 Z" fill="#69C2EE" opacity=".8"/>`;
    s += `<rect x="234" y="100" width="26" height="14" rx="4" fill="${P.blue}"/>`;
    s += `<rect x="228" y="150" width="46" height="12" fill="#FFFFFF" opacity=".9"/>`;
    s += glass(26, 176, 30, 46, P.orange, 0);
    s += `<ellipse cx="150" cy="228" rx="140" ry="8" fill="${P.tealL}" opacity=".9"/>`;
    return svg('0 0 300 236', s);
  }

  // 6) Boy raising his hand to tell an adult
  function sceneTell() {
    const o = { skin: 'medium', hair: 'dark', style: 'side', vest: true, cloth: { vest: '#C2541B', vestShade: '#A44415', vestTrim: '#F08A4B' } };
    let s = `<circle cx="120" cy="128" r="100" fill="#FFF3D6"/>`;
    let b = torso(o);
    b += arm([[56, 90], [66, 160], [62, 240]], o, null);
    b += arm([[-56, 90], [-88, 40], [-84, -40]], o, 'open');
    b += head({ ...o, eyes: 'open', brows: 'raised', mouth: 'talk' });
    s += g('translate(126 98) scale(.84)', b);
    // speech bubble with an adult + phone pictogram
    s += `<path d="M186 22 h88 a14 14 0 0 1 14 14 v46 a14 14 0 0 1 -14 14 h-58 l-16 16 l2 -16 h-16 a14 14 0 0 1 -14 -14 v-46 a14 14 0 0 1 14 -14 Z" fill="#FFFFFF" stroke="${P.red}" stroke-width="3"/>`;
    s += `<circle cx="212" cy="46" r="10" fill="${P.navy}"/><path d="M196 82 c0 -16 7 -24 16 -24 s16 8 16 24 Z" fill="${P.navy}"/>`;
    s += `<circle cx="236" cy="58" r="6.5" fill="${P.orange}"/><path d="M226 82 c0 -10 4 -16 10 -16 s10 6 10 16 Z" fill="${P.orange}"/>`;
    s += `<rect x="254" y="38" width="22" height="40" rx="5" fill="${P.red}"/><rect x="258" y="44" width="14" height="24" rx="2" fill="#FFFFFF"/><path d="M265 50 v12 M259 56 h12" stroke="${P.red}" stroke-width="3" stroke-linecap="round"/>`;
    return svg('0 0 300 236', s);
  }

  /* =========================================================
   * Symptom mini-busts (circular)
   * ========================================================= */
  function miniBust(kind) {
    const presets = {
      fever: { skin: 'light', hair: 'dark', style: 'side', vest: true, eyes: 'tired', brows: 'worried', mouth: 'flat', fever: true },
      cough: { skin: 'medium', hair: 'black', style: 'neat', vest: false, eyes: 'squeeze', brows: 'scrunch', mouth: 'talk' },
      nose: { skin: 'tan', hair: 'dark', style: 'short', vest: true, eyes: 'tired', brows: 'worried', mouth: 'flat', cloth: { vest: '#1F7A74', vestShade: '#17615C', vestTrim: '#3BA79F' } },
      head: { skin: 'light', hair: 'brown', style: 'spiky', vest: false, eyes: 'squeeze', brows: 'scrunch', mouth: 'flat' },
      tired: { skin: 'medium', hair: 'dark', style: 'curly', vest: true, eyes: 'tired', brows: 'relaxed', mouth: 'flat', cloth: { vest: '#2F7D4A', vestShade: '#23633A', vestTrim: '#55B07A' } },
    };
    const o = presets[kind];
    const cid = uid('mb');
    let inner = `<circle cx="60" cy="60" r="58" fill="${P.orangeL}"/>`;
    let b = torso(o) + head(o);
    const sk = SKIN[o.skin];
    if (kind === 'cough') {
      b += `<path d="M-12 60 q12 8 24 0" fill="none" stroke="${P.red}" stroke-width="4" stroke-linecap="round" opacity=".55"/>`;
      b += `<path d="M-9 67 q9 6 18 0" fill="none" stroke="${P.red}" stroke-width="3" stroke-linecap="round" opacity=".4"/>`;
    }
    if (kind === 'nose') {
      b += `<circle cx="1" cy="18" r="6" fill="#E9735F" opacity=".55"/>`;
      b += `<path d="M-6 24 q-4 7 0 9 q4 -2 0 -9 Z" fill="#5DB4EC"/>`;
    }
    inner += g('translate(60 52) scale(.5)', b);
    let over = '';
    if (kind === 'fever') {
      over += `<g transform="translate(96 10) rotate(18)"><rect x="-6" y="0" width="12" height="38" rx="6" fill="#FFFFFF" stroke="${P.red}" stroke-width="2.6"/><circle cx="0" cy="40" r="8.5" fill="${P.red}"/><rect x="-2.3" y="14" width="4.6" height="24" fill="${P.red}"/></g>`;
      over += `<g transform="translate(16 22)"><circle r="13" fill="#FFFFFF"/><g stroke="${P.blue}" stroke-width="3" stroke-linecap="round"><path d="M0 -9 V9 M-7.8 -4.5 L7.8 4.5 M-7.8 4.5 L7.8 -4.5"/></g></g>`;
    }
    if (kind === 'cough') {
      over += `<g fill="#FFFFFF" stroke="#8CC4EA" stroke-width="2"><circle cx="96" cy="64" r="7"/><circle cx="106" cy="56" r="8.5"/><circle cx="108" cy="70" r="6.5"/></g>`;
      over += `<path d="M84 60 l6 -2 M85 68 l6 1" stroke="#8CC4EA" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    if (kind === 'nose') {
      over += `<g transform="translate(88 6)"><rect x="0" y="12" width="28" height="18" rx="4" fill="${P.blue}"/><path d="M7 13 C7 2 15 -2 18 4 C21 -2 26 4 21 13 Z" fill="#FFFFFF" stroke="#BCD8EA" stroke-width="1.5"/></g>`;
    }
    if (kind === 'head') {
      over += `<path d="M86 10 l7 9 l-8 3 l8 10" fill="none" stroke="${P.red}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
      over += `<path d="M34 10 l-7 9 l8 3 l-8 10" fill="none" stroke="${P.red}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (kind === 'tired') {
      over += `<g transform="translate(86 8)"><rect x="-2" y="-2" width="36" height="20" rx="5" fill="#FFFFFF"/><rect x="0" y="0" width="28" height="16" rx="3.5" fill="#FFFFFF" stroke="${P.navy}" stroke-width="2.6"/><rect x="28" y="4.5" width="4" height="7" rx="1.2" fill="${P.navy}"/><rect x="3" y="3" width="6.5" height="10" rx="1.5" fill="${P.red}"/></g>`;
      inner += `<path d="M20 78 l6 -4 M16 86 l8 -2" stroke="${P.red}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
      inner += `<path d="M100 78 l-6 -4 M104 86 l-8 -2" stroke="${P.red}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    }
    return svg('0 0 120 120', `<defs><clipPath id="${cid}"><circle cx="60" cy="60" r="58"/></clipPath></defs><g clip-path="url(#${cid})">${inner}</g><circle cx="60" cy="60" r="57" fill="none" stroke="${P.orange}" stroke-width="3"/>${over}`, 'overflow="visible"');
  }

  /* =========================================================
   * ICONS (viewBox 0 0 100 100)
   * ========================================================= */
  const ring = (col) => `<circle cx="50" cy="50" r="48" fill="${col}"/>`;
  const noSign = (cx, cy, r) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${P.red}" stroke-width="${r * 0.22}"/><line x1="${cx - r * 0.7}" y1="${cy - r * 0.7}" x2="${cx + r * 0.7}" y2="${cy + r * 0.7}" stroke="${P.red}" stroke-width="${r * 0.22}" stroke-linecap="round"/>`;
  const xBadge = (cx, cy, r) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.red}"/><path d="M${cx - r * 0.42} ${cy - r * 0.42} L${cx + r * 0.42} ${cy + r * 0.42} M${cx + r * 0.42} ${cy - r * 0.42} L${cx - r * 0.42} ${cy + r * 0.42}" stroke="#FFFFFF" stroke-width="${r * 0.3}" stroke-linecap="round"/>`;
  const checkBadge = (cx, cy, r, col) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col || P.green}"/><path d="M${cx - r * 0.45} ${cy} L${cx - r * 0.1} ${cy + r * 0.38} L${cx + r * 0.5} ${cy - r * 0.38}" fill="none" stroke="#FFFFFF" stroke-width="${r * 0.28}" stroke-linecap="round" stroke-linejoin="round"/>`;

  const ICONS = {
    virus: (bg) => ring(bg || P.tealL) + virusParticle(50, 50, 21, P.teal, '#7FE0D6'),
    lungs: (bg) => ring(bg || P.blueL) +
      `<path d="M50 18 V44" stroke="#5B8FD6" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M50 44 Q44 50 40 48 M50 44 Q56 50 60 48" fill="none" stroke="#5B8FD6" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M42 34 C30 30 20 44 19 60 C18 74 26 82 36 80 C44 78 45 70 45 60 L45 40 Z" fill="#F49A8C"/>` +
      `<path d="M58 34 C70 30 80 44 81 60 C82 74 74 82 64 80 C56 78 55 70 55 60 L55 40 Z" fill="#F49A8C"/>` +
      `<path d="M30 52 q6 4 10 -2 M30 64 q6 4 10 -2 M70 52 q-6 4 -10 -2 M70 64 q-6 4 -10 -2" fill="none" stroke="#E07B6D" stroke-width="2.4" stroke-linecap="round"/>`,
    spread: (bg) => ring(bg || P.orangeL) +
      `<circle cx="27" cy="44" r="9" fill="${P.blue}"/><path d="M12 76 c0 -14 7 -22 15 -22 s15 8 15 22 Z" fill="${P.blue}"/>` +
      `<circle cx="73" cy="44" r="9" fill="${P.orange}"/><path d="M58 76 c0 -14 7 -22 15 -22 s15 8 15 22 Z" fill="${P.orange}"/>` +
      `<path d="M36 28 Q50 16 64 28" fill="none" stroke="${P.navy}" stroke-width="3.6" stroke-linecap="round"/><path d="M58 22 L65 29 L56 31" fill="none" stroke="${P.navy}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="44" cy="40" r="2.6" fill="${P.teal}"/><circle cx="50" cy="46" r="2" fill="${P.teal}"/><circle cx="56" cy="40" r="2.6" fill="${P.teal}"/>`,
    noTouch: (bg) => ring(bg || P.greenL) +
      `<circle cx="42" cy="50" r="26" fill="${SKIN.light.base}"/>` +
      `<circle cx="33" cy="45" r="3.4" fill="${INK}"/><circle cx="51" cy="45" r="3.4" fill="${INK}"/>` +
      `<path d="M42 50 q-3 6 1 7" fill="none" stroke="${SKIN.light.deep}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="M35 64 q7 4 14 0" fill="none" stroke="${SKIN.light.lip}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M16 42 C16 22 68 20 68 42 C60 32 30 30 16 42 Z" fill="${HAIR.dark.base}"/>` +
      `<g transform="translate(70 70) rotate(-40)"><rect x="-7" y="-4" width="14" height="22" rx="6" fill="${SKIN.medium.base}"/><rect x="-6" y="-16" width="5" height="14" rx="2.5" fill="${SKIN.medium.base}"/><rect x="0" y="-14" width="5" height="12" rx="2.5" fill="${SKIN.medium.base}"/><circle cx="-3" cy="-8" r="1.8" fill="#8BBF5A"/><circle cx="4" cy="2" r="1.6" fill="#8BBF5A"/></g>` +
      noSign(74, 26, 13),
    window: (bg) => ring(bg || P.greenL) +
      `<rect x="24" y="22" width="52" height="58" rx="4" fill="#FFFFFF" stroke="${P.navy}" stroke-width="3.5"/>` +
      `<rect x="28" y="26" width="44" height="50" fill="#BFE6FF"/>` +
      `<path d="M50 26 L36 32 L36 72 L50 76 Z" fill="#E7F6FF" stroke="${P.navy}" stroke-width="2.6" stroke-linejoin="round"/>` +
      `<path d="M50 26 L64 32 L64 72 L50 76 Z" fill="#E7F6FF" stroke="${P.navy}" stroke-width="2.6" stroke-linejoin="round"/>` +
      `<path d="M8 40 h20 q8 0 8 -6 M6 52 h30 M8 64 h22 q8 0 8 6" fill="none" stroke="${P.teal}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M66 40 h18 q8 0 8 -6 M64 52 h28 M66 64 h18 q8 0 8 6" fill="none" stroke="${P.teal}" stroke-width="4" stroke-linecap="round" opacity=".6"/>` +
      `<rect x="20" y="78" width="60" height="6" rx="3" fill="${P.navy}"/>`,
    cups: (bg) => ring(bg || P.greenL) +
      `<path d="M16 36 h26 l-3 40 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4 Z" fill="${P.blue}"/><path d="M42 44 q10 0 9 10 q-1 9 -11 9" fill="none" stroke="${P.blue}" stroke-width="4"/>` +
      `<path d="M56 36 h26 l-3 40 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4 Z" fill="${P.orange}"/>` +
      `<path d="M20 44 h18" stroke="#FFFFFF" stroke-width="3" opacity=".6" stroke-linecap="round"/><path d="M60 44 h18" stroke="#FFFFFF" stroke-width="3" opacity=".6" stroke-linecap="round"/>` +
      xBadge(50, 26, 12),
    vaccine: (bg) => ring(bg || P.greenL) +
      `<path d="M50 14 L80 24 V48 C80 66 66 80 50 86 C34 80 20 66 20 48 V24 Z" fill="${P.green}"/>` +
      `<path d="M50 20 L74 28 V48 C74 62 63 74 50 79 Z" fill="#FFFFFF" opacity=".18"/>` +
      `<rect x="40" y="34" width="20" height="34" rx="4" fill="#FFFFFF"/><rect x="38" y="28" width="24" height="8" rx="3" fill="${P.yellow}"/>` +
      `<rect x="40" y="50" width="20" height="18" rx="3" fill="#8FD8F5"/><path d="M50 52 v12 M44 58 h12" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>`,
    tellAdult: (bg) => ring(bg || P.tealL) +
      `<circle cx="36" cy="34" r="11" fill="${P.navy}"/><path d="M18 82 c0 -22 8 -34 18 -34 s18 12 18 34 Z" fill="${P.navy}"/>` +
      `<circle cx="66" cy="52" r="8" fill="${P.orange}"/><path d="M53 82 c0 -15 6 -22 13 -22 s13 7 13 22 Z" fill="${P.orange}"/>` +
      `<path d="M58 16 h26 a6 6 0 0 1 6 6 v12 a6 6 0 0 1 -6 6 h-12 l-8 7 l1 -7 h-7 a6 6 0 0 1 -6 -6 v-12 a6 6 0 0 1 6 -6 Z" fill="#FFFFFF" stroke="${P.teal}" stroke-width="3"/>` +
      `<circle cx="64" cy="28" r="2.6" fill="${P.teal}"/><circle cx="71" cy="28" r="2.6" fill="${P.teal}"/><circle cx="78" cy="28" r="2.6" fill="${P.teal}"/>`,
    home: (bg) => ring(bg || P.tealL) +
      `<path d="M50 16 L84 44 H74 V82 H26 V44 H16 Z" fill="${P.blue}" stroke-linejoin="round"/>` +
      `<path d="M50 16 L84 44 H74 L50 24 L26 44 H16 Z" fill="#1A5BB0"/>` +
      `<rect x="30" y="48" width="40" height="34" fill="#FFFFFF"/>` +
      `<path d="M50 74 C40 66 36 61 36 56 C36 51 40 48 44 48 C47 48 49 50 50 52 C51 50 53 48 56 48 C60 48 64 51 64 56 C64 61 60 66 50 74 Z" fill="${P.orange}"/>`,
    medicine: (bg) => ring(bg || P.tealL) +
      `<rect x="16" y="24" width="38" height="52" rx="4" fill="#FFFFFF" stroke="${P.navy}" stroke-width="3"/>` +
      `<path d="M24 36 h22 M24 46 h22 M24 56 h14" stroke="#9DB3CC" stroke-width="3.2" stroke-linecap="round"/>` +
      checkBadge(44, 66, 10, P.green) +
      `<rect x="58" y="30" width="26" height="10" rx="3" fill="${P.orange}"/>` +
      `<rect x="56" y="40" width="30" height="40" rx="6" fill="${P.yellow}"/>` +
      `<rect x="61" y="50" width="20" height="20" rx="3" fill="#FFFFFF"/><path d="M71 53 v14 M64 60 h14" stroke="${P.red}" stroke-width="3.6" stroke-linecap="round"/>`,
    breath: (bg) => ring(bg || P.redL) +
      `<path d="M50 20 V44" stroke="#C9584A" stroke-width="5.5" stroke-linecap="round"/>` +
      `<path d="M42 34 C30 30 22 44 21 60 C20 74 28 82 37 80 C44 78 45 70 45 60 L45 40 Z" fill="#F49A8C"/>` +
      `<path d="M58 34 C70 30 78 44 79 60 C80 74 72 82 63 80 C56 78 55 70 55 60 L55 40 Z" fill="#F49A8C"/>` +
      `<path d="M8 50 q6 -6 12 0 M6 62 q6 -6 12 0 M82 50 q6 -6 12 0 M84 62 q6 -6 12 0" fill="none" stroke="${P.red}" stroke-width="3" stroke-linecap="round"/>`,
    chest: (bg) => ring(bg || P.redL) +
      `<path d="M50 54 C30 54 16 64 14 92 L86 92 C84 64 70 54 50 54 Z" fill="#7FB3E6"/>` +
      `<path d="M40 54 L50 66 L60 54" fill="#FFFFFF"/>` +
      `<circle cx="50" cy="32" r="16" fill="${SKIN.light.base}"/>` +
      `<path d="M34 30 C33 12 67 12 66 30 C58 22 42 22 34 30 Z" fill="${HAIR.dark.base}"/>` +
      `<path d="M43 35 q3 -2 6 0 M51 35 q3 -2 6 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="M45 42 q5 -2 10 0" fill="none" stroke="${SKIN.light.lip}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M62 64 L65 71 L72 69 L68 75 L74 80 L66 80 L65 87 L61 82 L57 87 L56 80 L48 80 L54 75 L50 69 L57 71 Z" fill="${P.red}" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>` +
      `<circle cx="61" cy="76" r="3" fill="${P.yellow}"/>`,
    dizzy: (bg) => ring(bg || P.redL) +
      `<circle cx="50" cy="56" r="27" fill="${SKIN.light.base}"/>` +
      `<path d="M23 50 C22 28 78 26 77 50 C68 38 32 38 23 50 Z" fill="${HAIR.dark.base}"/>` +
      `<path d="M34 56 q6 4 12 0 M54 56 q6 4 12 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M44 70 q6 -2 12 0" fill="none" stroke="${SKIN.light.lip}" stroke-width="2.6" stroke-linecap="round"/>` +
      sparkle(30, 22, 6.5, P.orange) + sparkle(50, 13, 7.5, P.yellow) + sparkle(70, 22, 6.5, P.orange) +
      `<path d="M34 75 q16 4 32 0" fill="none" stroke="${P.red}" stroke-width="0" />`,
    noDrink: (bg) => ring(bg || P.redL) +
      `<path d="M28 24 h34 l-4 56 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 Z" fill="#EAF7FF" stroke="#7FB8DE" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M33 70 h24 l-1 10 h-22 Z" fill="#8FD0F2"/>` +
      `<path d="M74 38 q8 12 0 16 q-8 -4 0 -16 Z" fill="#62B8EE"/>` +
      xBadge(70, 72, 12),
    clock: () =>
      `<circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="${P.green}" stroke-width="8"/>` +
      `<path d="M50 24 V50 L66 60" fill="none" stroke="${P.navy}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M50 6 A44 44 0 0 1 89 30" fill="none" stroke="${P.orange}" stroke-width="8" stroke-linecap="round"/>`,
    warning: () =>
      `<path d="M50 6 L96 88 H4 Z" fill="${P.yellow}" stroke="${P.navy}" stroke-width="5" stroke-linejoin="round"/>` +
      `<rect x="45" y="32" width="10" height="32" rx="5" fill="${P.navy}"/><circle cx="50" cy="75" r="6" fill="${P.navy}"/>`,
    soapHands: (bg) => ring(bg || '#FFFFFF') +
      `<g fill="${SKIN.medium.base}">` +
      `<rect x="35" y="26" width="8.5" height="30" rx="4.25"/><rect x="44.5" y="20" width="8.5" height="34" rx="4.25"/>` +
      `<rect x="54" y="23" width="8.5" height="32" rx="4.25"/><rect x="63" y="31" width="8" height="26" rx="4"/>` +
      `<rect x="20" y="50" width="9" height="24" rx="4.5" transform="rotate(-38 24.5 62)"/>` +
      `<path d="M34 48 H71 V66 C71 78 63 86 52 86 C41 86 34 78 34 66 Z"/></g>` +
      `<path d="M44 66 q8 4 16 0" fill="none" stroke="${SKIN.medium.deep}" stroke-width="2" stroke-linecap="round"/>` +
      [[78, 28, 7], [84, 46, 5], [22, 30, 6], [74, 70, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#4FB3EA" stroke-width="2.4"/>`).join('') +
      sparkle(26, 14, 5, P.yellow),
    freshAir: (bg) => ring(bg || '#FFFFFF') +
      `<path d="M14 40 h44 q14 0 14 -12 q0 -10 -10 -10 q-8 0 -8 8" fill="none" stroke="${P.teal}" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M14 56 h60 q12 0 12 10 q0 10 -10 10 q-8 0 -8 -8" fill="none" stroke="${P.blue}" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M14 72 h28" stroke="${P.green}" stroke-width="6" stroke-linecap="round"/>`,
    bed: (bg) => ring(bg || '#FFFFFF') +
      `<rect x="14" y="40" width="8" height="40" rx="3" fill="#C98552"/><rect x="18" y="60" width="66" height="14" rx="4" fill="#FFFFFF" stroke="#9DB3CC" stroke-width="2.5"/>` +
      `<rect x="78" y="52" width="8" height="28" rx="3" fill="#C98552"/>` +
      `<ellipse cx="32" cy="56" rx="10" ry="6" fill="#FFFFFF" stroke="#9DB3CC" stroke-width="2.5"/>` +
      `<path d="M40 50 h38 q4 0 4 10 h-42 Z" fill="${P.teal}"/>` +
      `<path d="M66 16 A12 12 0 1 0 74 38 A9 9 0 1 1 66 16 Z" fill="${P.yellow}"/>`,
  };

  global.ART = { sceneMagnifier, sceneWash, sceneSneeze, sceneRest, sceneDrink, sceneTell, miniBust, ICONS, P,
    lib: { uid, svg, g, head, torso, arm, hand, glass, sparkle, virusParticle, SKIN, HAIR, CLOTH, P, INK } };
})(window);
