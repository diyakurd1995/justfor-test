/*
 * Extra scenes and pictograms for the nine curriculum units.
 * Requires characters.js (ART.lib) and scenes.js (SCENES).
 */
(function (global) {
  'use strict';
  const { uid, svg, g, head, torso, arm, hand, sparkle, SKIN, P } = global.ART.lib;
  const VB = '0 0 300 240';
  const place = (x, y, s, body) => g(`translate(${x} ${y}) scale(${s})`, body);
  const blob = (col, cx = 150, cy = 118, r = 104) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
  const DOWN_L = [[-56, 90], [-66, 160], [-62, 240]];
  const DOWN_R = [[56, 90], [66, 160], [62, 240]];
  const BOYS = {
    a: { skin: 'light', hair: 'dark', style: 'side', vest: true },
    b: { skin: 'medium', hair: 'black', style: 'neat', vest: false },
    c: { skin: 'light', hair: 'brown', style: 'spiky', vest: true, cloth: { vest: '#1F7A74', vestShade: '#17615C', vestTrim: '#3BA79F' } },
    d: { skin: 'tan', hair: 'dark', style: 'short', vest: true, cloth: { vest: '#7B3FA0', vestShade: '#62308A', vestTrim: '#A86BD0' } },
    e: { skin: 'light', hair: 'black', style: 'curly', vest: true, cloth: { vest: '#2F7D4A', vestShade: '#23633A', vestTrim: '#55B07A' } },
    f: { skin: 'medium', hair: 'dark', style: 'side', vest: true, cloth: { vest: '#C2541B', vestShade: '#A44415', vestTrim: '#F08A4B' } },
    sport: { skin: 'tan', hair: 'black', style: 'spiky', vest: false, cloth: { shirt: '#FF8A3D', shirtShade: '#E26B1C', shirtLine: '#C7570F', collar: '#FFFFFF' } },
  };
  const bust = (o, face, front) => torso(o) + head({ ...o, ...face }) + (front || '');

  /* hair care: combing */
  function sceneComb() {
    const o = BOYS.d;
    let s = blob('#E9F3FF');
    s += `<g transform="translate(232 70)"><rect x="-26" y="-36" width="52" height="72" rx="10" fill="#FFFFFF" stroke="#B9D3EA" stroke-width="3"/><rect x="-20" y="-30" width="40" height="60" rx="6" fill="#D7ECFB"/><path d="M-10 -20 L6 -26 M-12 -8 L12 -18" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></g>`;
    const comb = `<g transform="translate(36 -60) rotate(-20)"><rect x="-26" y="-6" width="52" height="11" rx="3" fill="${P.orange}"/>` +
      [...Array(10)].map((_, i) => `<rect x="${-24 + i * 5}" y="4" width="2.6" height="10" rx="1" fill="${P.orange}"/>`).join('') + `</g>`;
    s += place(130, 92, 0.84, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised', look: [2, -1] }, arm(DOWN_L, o) + arm([[56, 90], [96, 40], [52, -42]], o, null) + comb + hand(50, -44, -110, 'fist', SKIN[o.skin])));
    s += sparkle(40, 44, 7, P.yellow) + sparkle(270, 140, 6, P.yellow);
    return svg(VB, s);
  }

  /* skin: cap in the sun */
  function sceneSun() {
    const o = BOYS.a;
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#FFF4D6"/>`;
    s += `<circle cx="244" cy="54" r="26" fill="${P.yellow}"/>` + [...Array(10)].map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return `<line x1="${244 + Math.cos(a) * 34}" y1="${54 + Math.sin(a) * 34}" x2="${244 + Math.cos(a) * 44}" y2="${54 + Math.sin(a) * 44}" stroke="${P.yellow}" stroke-width="5" stroke-linecap="round"/>`;
    }).join('');
    const tube = `<g transform="translate(-74 128) rotate(-12)"><rect x="-12" y="-30" width="24" height="56" rx="6" fill="#FFFFFF" stroke="${P.orange}" stroke-width="3"/><rect x="-7" y="-40" width="14" height="12" rx="3" fill="${P.orange}"/><circle cx="0" cy="0" r="7" fill="${P.yellow}"/></g>`;
    s += place(140, 96, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed', cap: '#1F6FD1', capBrim: '#164F99' }, arm(DOWN_R, o) + arm([[-56, 92], [-80, 150], [-70, 136]], o, null) + tube + hand(-66, 134, -60, 'fist', SKIN[o.skin])));
    return svg(VB, s);
  }

  /* calling 115 */
  function scenePhone() {
    const o = BOYS.c;
    let s = blob('#FFE4E0');
    const phone = `<rect x="-62" y="-26" width="18" height="40" rx="4" fill="#263238" transform="rotate(-14 -53 -6)"/><rect x="-59" y="-22" width="12" height="30" rx="2" fill="#7CC4F4" transform="rotate(-14 -53 -6)"/>`;
    s += place(150, 94, 0.84, bust(o, { eyes: 'open', mouth: 'talk', brows: 'raised', look: [1, 0] }, arm(DOWN_R, o) + arm([[-56, 92], [-92, 60], [-60, 14]], o, null) + phone + hand(-58, 18, -70, 'fist', SKIN[o.skin])));
    s += `<g transform="translate(236 46)"><path d="M-36 -24 h72 a10 10 0 0 1 10 10 v28 a10 10 0 0 1 -10 10 h-46 l-12 12 l2 -12 h-16 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 Z" fill="#FFFFFF" stroke="${P.red}" stroke-width="3"/>` +
      `<text x="0" y="8" text-anchor="middle" font-family="Titr" font-size="26" fill="${P.red}">۱۱۵</text></g>`;
    return svg(VB, s);
  }

  /* making way for an ambulance */
  function sceneAmbulance() {
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#E3F1FF"/>`;
    // boy on the pavement, giving way
    const o = BOYS.e;
    s += place(56, 66, 0.42, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised', look: [2, 0] }, arm(DOWN_L, o) + arm([[56, 90], [96, 60], [130, 20]], o, 'open')));
    s += `<rect x="6" y="120" width="288" height="86" fill="#5B6573"/><rect x="6" y="114" width="288" height="8" fill="#C7CFD8"/><rect x="6" y="206" width="288" height="30" fill="#C7CFD8"/>`;
    for (let x = 16; x < 290; x += 40) s += `<rect x="${x}" y="160" width="22" height="5" rx="2" fill="#FFFFFF"/>`;
    // car pulled over to the right edge (bottom lane, near the curb)
    s += `<g transform="translate(222 176)"><rect x="-34" y="-12" width="68" height="22" rx="8" fill="${P.orange}"/><path d="M-20 -12 L-12 -26 H14 L22 -12 Z" fill="#F7A25B"/><path d="M-14 -13 L-9 -23 H0 V-13 Z M4 -13 V-23 H12 L17 -13 Z" fill="#CFE9FB"/><circle cx="-20" cy="11" r="7" fill="#263238"/><circle cx="20" cy="11" r="7" fill="#263238"/></g>`;
    s += `<path d="M262 190 l10 8 M262 170 l12 -2" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    // ambulance in the middle lane
    s += `<g transform="translate(112 146)">` +
      `<rect x="-62" y="-34" width="96" height="48" rx="6" fill="#FFFFFF" stroke="#C7CFD8" stroke-width="2"/>` +
      `<path d="M34 -20 H52 L68 -2 V14 H34 Z" fill="#FFFFFF" stroke="#C7CFD8" stroke-width="2"/><path d="M38 -16 H50 L62 -2 H38 Z" fill="#9FD3F5"/>` +
      `<rect x="-62" y="-6" width="130" height="8" fill="#E53935"/>` +
      `<path d="M-24 -28 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 v-8 h8 Z" fill="#E53935"/>` +
      `<rect x="-6" y="-42" width="20" height="8" rx="3" fill="#1E88E5"/><rect x="-30" y="-42" width="20" height="8" rx="3" fill="#E53935"/>` +
      `<circle cx="-38" cy="16" r="10" fill="#263238"/><circle cx="-38" cy="16" r="4" fill="#B0BEC5"/><circle cx="44" cy="16" r="10" fill="#263238"/><circle cx="44" cy="16" r="4" fill="#B0BEC5"/>` +
      `<path d="M-20 -48 l-8 -10 M4 -50 v-12 M18 -46 l8 -10" stroke="${P.yellow}" stroke-width="4" stroke-linecap="round"/></g>`;
    s += `<path d="M196 140 h30 M200 150 h22" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
    s += `<rect x="6" y="104" width="288" height="10" fill="#9AA8B6"/>`;
    return svg(VB, s);
  }

  /* active play: football */
  function sceneFootball() {
    const o = BOYS.sport;
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#DFF5E7"/><rect x="6" y="176" width="288" height="60" fill="#8FD18A"/>`;
    const ball = `<g transform="translate(0 150)"><circle r="40" fill="#FFFFFF" stroke="#263238" stroke-width="3"/>` +
      `<path d="M0 -14 L13 -4 L8 12 H-8 L-13 -4 Z" fill="#263238"/>` +
      `<path d="M0 -14 V-38 M13 -4 L36 -12 M8 12 L22 32 M-8 12 L-22 32 M-13 -4 L-36 -12" stroke="#263238" stroke-width="3"/></g>`;
    const arms = arm([[-56, 92], [-76, 150], [-44, 150]], o, null) + arm([[56, 92], [76, 150], [44, 150]], o, null);
    s += place(150, 86, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, arms + ball + hand(-44, 146, -10, 'fist', SKIN[o.skin]) + hand(44, 146, 190, 'fist', SKIN[o.skin])));
    s += sparkle(46, 44, 8, P.yellow) + sparkle(254, 50, 7, P.orange);
    return svg(VB, s);
  }

  /* environment: holding the Earth */
  function sceneGlobe() {
    const o = BOYS.e;
    let s = blob('#DDF4E6');
    const globe = `<g transform="translate(0 146)"><circle r="50" fill="#4FA8E8"/>` +
      `<path d="M-30 -30 C-14 -40 2 -30 -6 -16 C-14 -4 -34 -6 -38 -16 Z M6 -6 C22 -12 34 0 30 14 C26 30 8 34 4 20 C0 10 -2 0 6 -6 Z M-34 12 C-26 10 -20 22 -26 30 C-34 26 -40 18 -34 12 Z" fill="#5BB85F"/>` +
      `<path d="M-30 -38 A50 50 0 0 1 26 -42" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".6"/></g>`;
    const arms = arm([[-56, 92], [-78, 150], [-50, 156]], o, null) + arm([[56, 92], [78, 150], [50, 156]], o, null);
    s += place(150, 84, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, arms + globe + hand(-54, 150, -10, 'fist', SKIN[o.skin]) + hand(54, 150, 190, 'fist', SKIN[o.skin])));
    s += `<g transform="translate(58 58)"><path d="M0 8 C-6 0 -14 2 -14 9 C-14 16 -6 20 0 26 C6 20 14 16 14 9 C14 2 6 0 0 8 Z" fill="#F06292"/></g>`;
    s += sparkle(250, 48, 8, P.yellow) + sparkle(36, 150, 6, P.yellow);
    return svg(VB, s);
  }

  /* environmental health: tidying the classroom */
  function sceneBroom() {
    const o = BOYS.b;
    let s = blob('#E3F1FF');
    s += `<g transform="translate(236 168)"><path d="M-26 -34 H26 L20 40 H-20 Z" fill="${P.green}"/><rect x="-30" y="-42" width="60" height="10" rx="4" fill="#23763F"/><path d="M-10 -20 V30 M0 -20 V30 M10 -20 V30" stroke="#FFFFFF" stroke-width="4" opacity=".7" stroke-linecap="round"/></g>`;
    const broom = `<line x1="-18" y1="36" x2="-82" y2="176" stroke="#A0693D" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M-104 166 L-62 176 L-70 214 L-118 202 Z" fill="${P.yellow}"/><path d="M-108 182 l42 10 M-111 192 l42 10" stroke="#D9A21C" stroke-width="2.5"/>`;
    s += place(130, 88, 0.84, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised' }, arm(DOWN_R, o) + arm([[-56, 92], [-72, 150], [-38, 78]], o, null) + broom + hand(-40, 82, -65, 'fist', SKIN[o.skin])));
    s += sparkle(40, 40, 7, P.yellow) + sparkle(262, 40, 6, P.yellow);
    return svg(VB, s);
  }

  /* renewable energy */
  function sceneRenewables() {
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#E3F4FF"/><rect x="6" y="186" width="288" height="50" fill="#9ED89A"/>`;
    s += `<circle cx="62" cy="52" r="24" fill="${P.yellow}"/>`;
    const turbine = (x, y, sc, rot) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-3 0 L-6 120 H6 L3 0 Z" fill="#E6ECF2" stroke="#B9C5D2" stroke-width="1.5"/>` +
      [0, 120, 240].map((a) => `<path d="M0 0 C6 -10 6 -50 0 -62 C-6 -50 -6 -10 0 0 Z" fill="#FFFFFF" stroke="#B9C5D2" stroke-width="1.5" transform="rotate(${a + rot})"/>`).join('') + `<circle r="6" fill="#B9C5D2"/></g>`;
    s += turbine(200, 72, 0.95, 10) + turbine(260, 98, 0.7, 40);
    s += `<g transform="translate(118 186)"><path d="M-46 0 L-36 -40 H44 L54 0 Z" fill="#1F4E8C" stroke="#9FC3EA" stroke-width="2"/>` +
      `<path d="M-41 -20 H49 M-6 -40 L-2 0 M20 -40 L26 0 M-26 -40 L-26 0" stroke="#9FC3EA" stroke-width="2"/><rect x="0" y="0" width="6" height="14" fill="#7A8794"/></g>`;
    const o = BOYS.f;
    s += place(48, 150, 0.4, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, arm(DOWN_L, o) + arm([[56, 90], [98, 40], [118, -30]], o, 'open')));
    s += `<path d="M84 52 h20 M80 66 h16" stroke="${P.yellow}" stroke-width="4" stroke-linecap="round"/>`;
    return svg(VB, s);
  }

  /* ---------- side-view posture pictograms (viewBox 0 0 120 120) ---------- */
  const SHIRT = '#4F86D9', PANTS = '#2B4C80', SKINC = SKIN.light.base, HAIRC = '#3E2C21';
  function figure(j, opt = {}) {
    const L = (a, b, c, w) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    let s = '';
    s += L(j.P, j.K, PANTS, 9) + L(j.K, j.A, PANTS, 8) + L(j.A, j.F, '#263238', 6);
    if (j.C) s += `<path d="M${j.N[0]} ${j.N[1]} Q${j.C[0]} ${j.C[1]} ${j.P[0]} ${j.P[1]}" fill="none" stroke="${SHIRT}" stroke-width="15" stroke-linecap="round"/>`;
    else s += L(j.N, j.P, SHIRT, 15);
    if (opt.bag) s += `<rect x="${opt.bag[0]}" y="${opt.bag[1]}" width="${opt.bag[2]}" height="${opt.bag[3]}" rx="4" fill="${P.orange}" transform="rotate(${opt.bag[4] || 0} ${opt.bag[0] + opt.bag[2] / 2} ${opt.bag[1] + opt.bag[3] / 2})"/>`;
    s += L(j.N, j.H, SKINC, 6);
    s += `<circle cx="${j.H[0]}" cy="${j.H[1]}" r="9.5" fill="${SKINC}"/>`;
    const ha = j.HA || 0;
    s += `<path d="M${j.H[0] - 9.5} ${j.H[1]} A9.5 9.5 0 0 1 ${j.H[0] + 9.5} ${j.H[1]} Z" fill="${HAIRC}" transform="rotate(${ha} ${j.H[0]} ${j.H[1]})"/>`;
    s += `<circle cx="${j.H[0] + 4 * Math.cos((ha * Math.PI) / 180) + 1}" cy="${j.H[1] + 2 + 4 * Math.sin((ha * Math.PI) / 180)}" r="1.4" fill="#2B1D16"/>`;
    s += L(j.S || j.N, j.E, SHIRT, 7) + L(j.E, j.W, SHIRT, 6) + `<circle cx="${j.W[0]}" cy="${j.W[1]}" r="3.4" fill="${SKINC}"/>`;
    return s;
  }
  const chair = `<path d="M26 40 V108 M26 76 H62 M58 76 V108" stroke="#A0693D" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  const desk = `<path d="M74 60 H114 M108 60 V108" stroke="#A0693D" stroke-width="4" stroke-linecap="round"/><rect x="84" y="52" width="16" height="7" rx="1.5" fill="${P.green}" transform="rotate(-8 92 56)"/>`;
  const ground = `<line x1="6" y1="110" x2="114" y2="110" stroke="#B9C5D2" stroke-width="3" stroke-linecap="round"/>`;
  const PICTO = {
    sitGood: () => ground + chair + desk + figure({ P: [36, 72], K: [62, 72], A: [64, 106], F: [72, 108], N: [36, 38], H: [38, 25], S: [36, 41], E: [46, 58], W: [72, 58] }),
    sitBad: () => ground + chair + desk + figure({ P: [46, 74], K: [72, 76], A: [80, 98], F: [86, 102], N: [58, 42], C: [36, 52], H: [70, 38], HA: 30, S: [56, 45], E: [62, 64], W: [80, 60] }),
    phoneGood: () => ground + chair + figure({ P: [36, 72], K: [62, 72], A: [64, 106], F: [72, 108], N: [36, 38], H: [38, 25], S: [36, 41], E: [52, 50], W: [60, 30] }) +
      `<rect x="58" y="16" width="8" height="16" rx="2" fill="#263238" transform="rotate(12 62 24)"/>`,
    phoneBad: () => ground + chair + figure({ P: [38, 72], K: [62, 72], A: [64, 106], F: [72, 108], N: [42, 40], C: [34, 54], H: [52, 34], HA: 40, S: [42, 43], E: [52, 64], W: [58, 60] }) +
      `<rect x="54" y="52" width="8" height="15" rx="2" fill="#263238" transform="rotate(-50 58 59)"/>`,
    liftGood: () => ground + `<rect x="64" y="84" width="26" height="24" rx="2" fill="#C98552"/><path d="M64 92 H90" stroke="#A86B3E" stroke-width="2"/>` +
      figure({ P: [38, 80], K: [58, 74], A: [54, 106], F: [62, 108], N: [44, 44], H: [48, 31], S: [44, 47], E: [56, 64], W: [66, 86] }),
    liftBad: () => ground + `<rect x="66" y="84" width="26" height="24" rx="2" fill="#C98552"/><path d="M66 92 H92" stroke="#A86B3E" stroke-width="2"/>` +
      figure({ P: [34, 60], K: [36, 84], A: [38, 106], F: [46, 108], N: [66, 50], C: [50, 42], H: [78, 56], HA: 70, S: [64, 52], E: [70, 70], W: [72, 86] }),
    bagGood: () => ground + figure({ P: [56, 66], K: [57, 88], A: [57, 106], F: [65, 108], N: [56, 30], H: [58, 18], S: [56, 33], E: [60, 50], W: [62, 64] }, { bag: [38, 32, 13, 28] }),
    bagBad: () => ground + figure({ P: [52, 66], K: [55, 88], A: [56, 106], F: [64, 108], N: [68, 34], C: [56, 48], H: [76, 24], HA: 25, S: [66, 37], E: [72, 54], W: [74, 66] }, { bag: [30, 40, 22, 40, -15] }),
  };
  function picto(kind, ok) {
    const id = uid('pc');
    return svg('0 0 120 120', `<defs><clipPath id="${id}"><rect x="0" y="0" width="120" height="120" rx="14"/></clipPath></defs>` +
      `<g clip-path="url(#${id})"><rect width="120" height="120" fill="${ok ? '#E7F7EC' : '#FFECE8'}"/>${PICTO[kind]()}</g>` +
      `<rect x="1.5" y="1.5" width="117" height="117" rx="13" fill="none" stroke="${ok ? '#8FD3A5' : '#F3A497'}" stroke-width="3"/>`);
  }

  /* spine, side view (face to the right) */
  function sceneSpine() {
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#FFF3E3"/>`;
    s += `<circle cx="166" cy="20" r="0" fill="none"/>`;
    s += `<path d="M118 6 C170 -6 214 22 206 52 C202 66 194 70 190 74" fill="none" stroke="#E8C9A6" stroke-width="3" stroke-dasharray="6 5"/>`;
    const verts = [];
    const add = (n, y0, y1, xf, w, h, col) => { for (let i = 0; i < n; i++) { const y = y0 + ((i + 0.5) * (y1 - y0)) / n; verts.push([xf(y), y, w, h, col, xf]); } };
    add(7, 58, 100, (y) => 150 + 4.5 * Math.sin((Math.PI * (y - 58)) / 42), 20, 4.8, '#4F86D9');
    add(12, 102, 174, (y) => 150 - 6.5 * Math.sin((Math.PI * (y - 102)) / 72), 26, 5.2, '#2E9E5B');
    add(5, 176, 212, (y) => 150 + 4 * Math.sin((Math.PI * (y - 176)) / 36), 30, 6.2, '#F28A1B');
    verts.forEach(([x, y, w, h, col, xf]) => {
      const ang = (Math.atan2(xf(y + 1) - xf(y - 1), 2) * 180) / Math.PI;
      s += `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="2" fill="${col}" transform="rotate(${(-ang * 0.45).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    });
    s += `<path d="M134 214 C140 212 160 212 166 214 L158 234 C154 237 148 237 145 234 Z" fill="#8E44AD"/><path d="M146 236 L154 236 L150 242 Z" fill="#B07CC6"/>`;
    s += `<g font-family="Titr" font-size="13" fill="#7A5A33"><text x="236" y="40" text-anchor="middle">جلو</text><text x="64" y="40" text-anchor="middle">پشت</text></g>`;
    s += `<path d="M220 46 h30 l-6 -5 M250 46 l-6 5" fill="none" stroke="#C9A27A" stroke-width="2.5" stroke-linecap="round"/>`;
    return svg(VB, s);
  }

  Object.assign(global.SCENES, {
    comb: sceneComb, sun: sceneSun, phone: scenePhone, ambulance: sceneAmbulance, football: sceneFootball,
    globe: sceneGlobe, broom: sceneBroom, renewables: sceneRenewables, spine: sceneSpine,
  });
  global.PICTO = picto;
})(window);
