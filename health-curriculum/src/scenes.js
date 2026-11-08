/*
 * Topic scenes for the school health & safety booklet.
 * Built on the character library in characters.js (ART.lib).
 */
(function (global) {
  'use strict';
  const { uid, svg, g, head, torso, arm, hand, glass, sparkle, SKIN, P } = global.ART.lib;

  const VB = '0 0 300 240';
  const bust = (o, face, armsBack, armsFront, extra) =>
    torso(o) + (armsBack || '') + head({ ...o, ...face }) + (extra || '') + (armsFront || '');
  const place = (x, y, s, body) => g(`translate(${x} ${y}) scale(${s})`, body);
  const DOWN_L = [[-56, 90], [-66, 160], [-62, 240]];
  const DOWN_R = [[56, 90], [66, 160], [62, 240]];
  const blob = (col, cx = 150, cy = 118, r = 104) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;

  const BOYS = {
    a: { skin: 'light', hair: 'dark', style: 'side', vest: true },
    b: { skin: 'medium', hair: 'black', style: 'neat', vest: false },
    c: { skin: 'light', hair: 'brown', style: 'spiky', vest: true, cloth: { vest: '#1F7A74', vestShade: '#17615C', vestTrim: '#3BA79F' } },
    d: { skin: 'tan', hair: 'dark', style: 'short', vest: true, cloth: { vest: '#7B3FA0', vestShade: '#62308A', vestTrim: '#A86BD0' } },
    e: { skin: 'light', hair: 'black', style: 'curly', vest: true, cloth: { vest: '#2F7D4A', vestShade: '#23633A', vestTrim: '#55B07A' } },
    f: { skin: 'medium', hair: 'dark', style: 'side', vest: true, cloth: { vest: '#C2541B', vestShade: '#A44415', vestTrim: '#F08A4B' } },
  };

  /* ---------- cover: three boys waving ---------- */
  function sceneCover() {
    let s = '';
    const wave = (o, side) => side < 0
      ? arm([[-56, 90], [-92, 40], [-96, -36]], o, 'open')
      : arm([[56, 90], [92, 40], [96, -36]], o, 'open');
    s += place(70, 112, 0.62, bust(BOYS.c, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', wave(BOYS.c, -1)));
    s += place(230, 112, 0.62, bust(BOYS.d, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', wave(BOYS.d, 1)));
    s += place(150, 96, 0.78, bust(BOYS.a, { eyes: 'open', mouth: 'smile', brows: 'raised' }, arm(DOWN_L, BOYS.a) + arm(DOWN_R, BOYS.a)));
    s += sparkle(28, 30, 8, P.yellow) + sparkle(276, 40, 7, P.yellow) + sparkle(150, 12, 6, '#FFFFFF');
    return svg('0 0 300 240', s);
  }

  /* ---------- 1. air pollution: boy wearing a mask ---------- */
  function sceneMask() {
    const o = BOYS.b;
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#DCE3EC"/>`;
    s += `<circle cx="240" cy="54" r="24" fill="#F3D27A" opacity=".55"/>`;
    s += `<g fill="#A9B6C6"><rect x="14" y="96" width="34" height="140"/><rect x="50" y="122" width="28" height="114"/><rect x="226" y="110" width="30" height="126"/><rect x="258" y="86" width="30" height="150"/></g>`;
    s += `<g fill="#C3CDD9">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${20 + (i % 2) * 14}" y="${106 + Math.floor(i / 2) * 22}" width="8" height="10"/>`).join('')}${[0, 1, 2, 3].map((i) => `<rect x="${264 + (i % 2) * 12}" y="${98 + Math.floor(i / 2) * 22}" width="7" height="10"/>`).join('')}</g>`;
    s += `<g fill="#FFFFFF" opacity=".6"><ellipse cx="70" cy="70" rx="46" ry="14"/><ellipse cx="226" cy="92" rx="52" ry="13"/><ellipse cx="150" cy="38" rx="40" ry="10"/></g>`;
    s += place(150, 92, 0.86, bust(o, { eyes: 'open', mouth: 'none', brows: 'normal', mask: true }, '', arm(DOWN_L, o) + arm(DOWN_R, o)));
    return svg(VB, s);
  }

  /* ---------- 2. earthquake: drop, cover, hold on ---------- */
  function sceneQuake() {
    const o = BOYS.f;
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#FFF0DC"/>`;
    s += `<rect x="6" y="206" width="288" height="30" rx="0" fill="#EBCFAE"/>`;
    // shake marks
    s += `<g fill="none" stroke="${P.orange}" stroke-width="4" stroke-linecap="round"><path d="M22 96 q-8 10 0 20 q8 10 0 20"/><path d="M278 96 q8 10 0 20 q-8 10 0 20"/><path d="M36 40 l10 6 M264 40 l-10 6"/></g>`;
    // boy crouched under the desk
    const armOver = arm([[-56, 90], [-84, 10], [6, -74]], o, 'fist');
    const armHold = arm([[56, 90], [104, 128], [126, 58]], o, 'fist');
    s += place(142, 146, 0.68, bust(o, { eyes: 'open', mouth: 'flat', brows: 'raised', look: [0, 1] }, '', armOver + armHold));
    // desk
    s += `<rect x="36" y="74" width="228" height="18" rx="5" fill="#B9733F"/><rect x="36" y="74" width="228" height="7" rx="3.5" fill="#D08B53"/>`;
    s += `<rect x="54" y="92" width="12" height="122" fill="#9A5E33"/><rect x="226" y="92" width="12" height="122" fill="#9A5E33"/>`;
    s += `<g transform="translate(200 46)"><rect x="0" y="0" width="30" height="24" rx="3" fill="${P.blue}"/><rect x="4" y="-6" width="22" height="6" rx="2" fill="${P.yellow}"/></g>`;
    s += `<g transform="translate(70 50) rotate(-8)"><rect x="0" y="0" width="34" height="22" rx="2" fill="#FFFFFF" stroke="#9DB3CC" stroke-width="2"/><path d="M5 7 h22 M5 13 h16" stroke="#9DB3CC" stroke-width="2"/></g>`;
    return svg(VB, s);
  }

  /* ---------- 4. brushing teeth ---------- */
  function sceneBrush() {
    const o = BOYS.e;
    let s = blob('#DCEFFF');
    const brush = `<rect x="-44" y="31" width="52" height="7" rx="3.5" fill="${P.blue}"/>` +
      `<rect x="4" y="25.5" width="18" height="7" rx="2" fill="#FFFFFF" stroke="#9CC9EA" stroke-width="1.6"/>` +
      `<path d="M7 25.5 v-3 M11 25.5 v-3 M15 25.5 v-3 M19 25.5 v-3" stroke="#9CC9EA" stroke-width="1.8"/>`;
    const foam = [[14, 41, 4], [20, 36, 3.2], [8, 45, 3], [24, 43, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#BFE3F7" stroke-width="1"/>`).join('');
    s += place(150, 90, 0.86, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, arm(DOWN_R, o), arm([[-56, 92], [-72, 150], [-40, 44]], o, null) + brush + foam + hand(-46, 50, -72, 'fist', SKIN[o.skin])));
    s += `<g transform="translate(232 150)"><rect x="0" y="0" width="22" height="58" rx="6" fill="#FFFFFF" stroke="${P.blue}" stroke-width="2.5"/><rect x="5" y="-10" width="12" height="12" rx="2" fill="${P.red}"/><path d="M4 22 h14 M4 30 h14" stroke="${P.blue}" stroke-width="2.5"/></g>`;
    s += sparkle(56, 52, 7, P.yellow) + sparkle(244, 70, 6, P.yellow);
    return svg(VB, s);
  }

  /* ---------- 5. healthy breakfast ---------- */
  function sceneBreakfast() {
    const o = BOYS.a;
    let s = blob('#E2F5E8');
    s += place(150, 84, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', arm([[56, 90], [70, 150], [60, 200]], o) + arm([[-56, 92], [-74, 150], [-44, 100]], o)));
    s += glass(86, 120, 26, 40, '#FFFFFF', -8);
    s += hand(102, 172, -80, 'fist', SKIN[o.skin]);
    s += `<rect x="0" y="198" width="300" height="42" fill="#F4C58B"/><rect x="0" y="198" width="300" height="6" fill="#E0A866"/>`;
    s += `<ellipse cx="170" cy="214" rx="78" ry="17" fill="#FFFFFF" stroke="#D6E4EE" stroke-width="2"/>`;
    s += `<rect x="108" y="196" width="50" height="22" rx="9" fill="#E3AE62"/><path d="M116 202 h34 M116 210 h34" stroke="#C98E45" stroke-width="2" stroke-linecap="round"/>`;
    s += `<rect x="160" y="200" width="28" height="18" rx="3" fill="#FFF3C4" stroke="#E8D28B" stroke-width="1.5"/>`;
    s += `<circle cx="204" cy="212" r="9" fill="${P.red}"/><circle cx="204" cy="212" r="5.5" fill="#F57F6E"/>`;
    s += `<circle cx="222" cy="206" r="8" fill="#5BB85F"/><circle cx="222" cy="206" r="5" fill="#BFE8B0"/>`;
    s += `<circle cx="232" cy="218" r="8" fill="#5BB85F"/><circle cx="232" cy="218" r="5" fill="#BFE8B0"/>`;
    return svg(VB, s);
  }

  /* ---------- 7. tablet at a safe distance ---------- */
  function sceneTablet() {
    const o = BOYS.d;
    let s = blob('#EFE3FA');
    const arms = arm([[-56, 92], [-70, 156], [-44, 150]], o, null) + arm([[56, 92], [70, 156], [44, 150]], o, null);
    const tablet = `<rect x="-44" y="104" width="88" height="66" rx="8" fill="#263238"/><rect x="-38" y="110" width="76" height="54" rx="3" fill="#7CC4F4"/>` +
      `<circle cx="-14" cy="132" r="9" fill="${P.yellow}"/><path d="M-36 160 L-14 140 L4 154 L20 138 L38 158 V164 H-38 Z" fill="#4CAF7A"/>`;
    const hands = hand(-46, 146, -10, 'fist', SKIN[o.skin]) + hand(46, 146, 190, 'fist', SKIN[o.skin]);
    s += place(150, 86, 0.84, bust(o, { eyes: 'open', look: [0, 3], mouth: 'closed', brows: 'normal' }, '', arms + tablet + hands));
    s += `<g transform="translate(236 30)"><circle r="26" fill="#FFFFFF"/><circle r="20" fill="none" stroke="${P.green}" stroke-width="5"/><path d="M0 -11 V0 L8 6" fill="none" stroke="${P.navy}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    return svg(VB, s);
  }

  /* ---------- 8. backpack worn on both shoulders ---------- */
  function sceneBackpack() {
    const o = BOYS.c;
    let s = blob('#FFEBD6');
    const pack = `<rect x="-76" y="66" width="152" height="180" rx="30" fill="#E8751A"/><rect x="-76" y="66" width="20" height="180" rx="10" fill="#C95F0E"/><rect x="56" y="66" width="20" height="180" rx="10" fill="#C95F0E"/>`;
    const straps = `<path d="M-30 64 C-38 90 -42 150 -40 240 M30 64 C38 90 42 150 40 240" fill="none" stroke="#B85510" stroke-width="13" stroke-linecap="round"/>` +
      `<rect x="-48" y="168" width="16" height="10" rx="2" fill="${P.yellow}"/><rect x="32" y="168" width="16" height="10" rx="2" fill="${P.yellow}"/>`;
    const arms = arm([[-56, 92], [-76, 152], [-44, 128]], o, 'fist') + arm([[56, 92], [76, 152], [44, 128]], o, 'fist');
    s += place(150, 88, 0.84, pack + torso(o) + straps + head({ ...o, eyes: 'open', mouth: 'smile', brows: 'raised' }) + arms);
    return svg(VB, s);
  }

  /* ---------- 9. crossing the street ---------- */
  function sceneCross() {
    const o = BOYS.e;
    let s = `<rect x="6" y="6" width="288" height="230" rx="26" fill="#E3F1FF"/>`;
    s += `<rect x="6" y="186" width="288" height="50" fill="#5B6573"/>`;
    for (let x = 14; x < 290; x += 34) s += `<rect x="${x}" y="194" width="20" height="36" rx="2" fill="#FFFFFF"/>`;
    // pedestrian light
    s += `<rect x="243" y="56" width="8" height="132" fill="#4A5563"/><rect x="226" y="28" width="42" height="78" rx="8" fill="#263238"/>`;
    s += `<circle cx="247" cy="48" r="13" fill="#3A3A3A"/><circle cx="247" cy="84" r="13" fill="#2ECC71"/>`;
    s += `<g fill="#FFFFFF"><circle cx="247" cy="76" r="2.6"/><path d="M245 80 h4 l3 8 l-3 0 l-2 -4 l-2 4 l-3 0 Z"/></g>`;
    s += `<g fill="#555"><circle cx="247" cy="41" r="2.6"/><rect x="244.5" y="45" width="5" height="11" rx="1.5"/></g>`;
    s += place(124, 92, 0.84, bust(o, { eyes: 'open', look: [-3.5, 0], mouth: 'closed', brows: 'normal', tilt: -4 }, '', arm(DOWN_R, o) + arm([[-56, 90], [-92, 42], [-90, -30]], o, 'open')));
    return svg(VB, s);
  }

  /* ---------- 10. first-aid kit ---------- */
  function sceneKit() {
    const o = BOYS.b;
    let s = blob('#FFE4E0');
    const kit = `<rect x="-24" y="102" width="48" height="12" rx="5" fill="none" stroke="#B3261E" stroke-width="6"/>` +
      `<rect x="-54" y="112" width="108" height="78" rx="10" fill="#E53935"/><rect x="-54" y="112" width="108" height="12" rx="6" fill="#C62828"/>` +
      `<path d="M-9 136 h18 v12 h12 v18 h-12 v12 h-18 v-12 h-12 v-18 h12 Z" fill="#FFFFFF"/>`;
    const arms = arm([[-56, 92], [-74, 150], [-54, 158]], o, null) + arm([[56, 92], [74, 150], [54, 158]], o, null);
    const hands = hand(-60, 156, -8, 'fist', SKIN[o.skin]) + hand(60, 156, 188, 'fist', SKIN[o.skin]);
    s += place(150, 84, 0.84, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised', bandage: true }, '', arms + kit + hands));
    s += sparkle(54, 46, 7, P.yellow) + sparkle(250, 58, 6, P.yellow);
    return svg(VB, s);
  }

  /* ---------- 11. online safety: laptop with a lock ---------- */
  function sceneLaptop() {
    const o = BOYS.a;
    let s = blob('#E3E8FF');
    s += place(150, 84, 0.84, bust(o, { eyes: 'open', look: [0, 3], mouth: 'closed', brows: 'normal' }, '', arm([[-56, 92], [-70, 150], [-40, 170]], o) + arm([[56, 92], [70, 150], [40, 170]], o)));
    s += `<rect x="0" y="206" width="300" height="34" fill="#C9D3F5"/>`;
    s += `<path d="M92 132 H208 L214 204 H86 Z" fill="#8FA1B3"/><path d="M98 138 H202 L206 198 H94 Z" fill="#A9B8C7"/>`;
    s += `<rect x="72" y="202" width="156" height="8" rx="4" fill="#6B7C8F"/>`;
    s += `<g transform="translate(150 168)"><path d="M0 -24 L20 -16 V-2 C20 12 10 20 0 24 C-10 20 -20 12 -20 -2 V-16 Z" fill="${P.blue}"/><rect x="-8" y="-4" width="16" height="13" rx="2.5" fill="#FFFFFF"/><path d="M-5 -4 V-9 a5 5 0 0 1 10 0 V-4" fill="none" stroke="#FFFFFF" stroke-width="3"/></g>`;
    s += sparkle(48, 46, 7, P.yellow) + sparkle(258, 40, 6, P.yellow);
    return svg(VB, s);
  }

  /* ---------- 12. no firecrackers ---------- */
  function sceneNoFirecracker() {
    const o = BOYS.f;
    let s = blob('#FFE8D9', 120, 120, 100);
    s += place(112, 94, 0.84, bust(o, { eyes: 'open', mouth: 'talk', brows: 'raised' }, '', arm(DOWN_R, o) + arm([[-56, 90], [-88, 40], [-84, -40]], o, 'open')));
    s += `<g transform="translate(236 128)"><circle r="50" fill="#FFFFFF"/>` +
      `<g transform="rotate(-30)"><rect x="-12" y="-28" width="24" height="56" rx="5" fill="#E53935"/><rect x="-12" y="-16" width="24" height="7" fill="${P.yellow}"/><rect x="-12" y="8" width="24" height="7" fill="${P.yellow}"/><path d="M0 -28 C0 -38 10 -40 8 -48" fill="none" stroke="#5D4037" stroke-width="3" stroke-linecap="round"/></g>` +
      sparkle(26, -46, 9, P.orange) +
      `<circle r="44" fill="none" stroke="${P.red}" stroke-width="9"/><line x1="-31" y1="-31" x2="31" y2="31" stroke="${P.red}" stroke-width="9" stroke-linecap="round"/></g>`;
    return svg(VB, s);
  }

  /* ---------- 13. turning off the tap ---------- */
  function sceneTap() {
    const o = BOYS.c;
    let s = blob('#DDF3FB', 140, 116, 104);
    s += `<g transform="translate(-14 0)"><rect x="150" y="210" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#BCD8EA" stroke-width="2"/>`;
    s += `<rect x="234" y="150" width="16" height="62" rx="5" fill="#A7B6C5"/><path d="M242 158 C242 140 222 136 204 142 L204 154 C218 150 230 152 230 164 Z" fill="#94A6B8"/>`;
    s += `<rect x="198" y="140" width="12" height="18" rx="4" fill="#8296AB"/>`;
    s += `<rect x="227" y="140" width="30" height="8" rx="4" fill="${P.blue}"/><rect x="238" y="132" width="8" height="12" rx="3" fill="${P.blue}"/>`;
    s += `<path d="M204 166 q-6 9 0 12 q6 -3 0 -12 Z" fill="#5DB4EC"/></g>`;
    s += place(122, 92, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed', look: [2, 0] }, '', arm(DOWN_L, o) + arm([[56, 90], [100, 140], [113, 58]], o, 'fist')));
    s += sparkle(40, 40, 7, P.yellow);
    return svg(VB, s);
  }

  /* ---------- 13b. switching off the light ---------- */
  function sceneSwitch() {
    const o = BOYS.d;
    let s = blob('#FFF5CC', 140, 116, 104);
    s += `<g transform="translate(240 70)"><rect x="-20" y="-28" width="40" height="56" rx="7" fill="#FFFFFF" stroke="#C7CFD8" stroke-width="2.5"/><rect x="-8" y="-16" width="16" height="32" rx="4" fill="#E6EBF0" stroke="#C7CFD8" stroke-width="2"/><rect x="-6" y="2" width="12" height="12" rx="3" fill="#9AA8B6"/></g>`;
    s += `<g transform="translate(244 160)"><path d="M0 -30 C-17 -30 -26 -17 -26 -5 C-26 7 -16 13 -12 22 H12 C16 13 26 7 26 -5 C26 -17 17 -30 0 -30 Z" fill="#E9EEF3" stroke="#9AA8B6" stroke-width="2.5"/><rect x="-11" y="22" width="22" height="12" rx="3" fill="#9AA8B6"/></g>`;
    s += place(124, 92, 0.84, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised', look: [3, -1] }, '', arm(DOWN_L, o) + arm([[56, 90], [104, 112], [130, -30]], o, 'open')));
    return svg(VB, s);
  }

  /* ---------- 14. recycling a bottle ---------- */
  function sceneRecycle() {
    const o = BOYS.e;
    let s = blob('#E3F5E4', 136, 118, 104);
    s += `<g transform="translate(238 170)"><rect x="-38" y="-48" width="76" height="12" rx="5" fill="#2E7D32"/><path d="M-34 -36 H34 L28 66 H-28 Z" fill="#43A047"/>` +
      `<g fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M-12 4 L-2 -12 L6 0"/><path d="M14 4 L6 20 H-8"/><path d="M-16 16 L-20 8"/></g>` +
      `<path d="M2 -16 l6 2 l-2 6 M10 22 l-6 4 l-2 -6 M-22 4 l-2 6 l6 2" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    s += `<g transform="translate(222 70) rotate(12)"><path d="M-9 -26 h18 v8 c8 4 10 10 10 16 v38 a6 6 0 0 1 -6 6 h-26 a6 6 0 0 1 -6 -6 v-38 c0 -6 2 -12 10 -16 Z" fill="#CFEFFF" stroke="#6FB7E0" stroke-width="2.4"/><rect x="-7" y="-34" width="14" height="9" rx="2" fill="${P.blue}"/><rect x="-19" y="6" width="38" height="12" fill="#6FB7E0" opacity=".7"/></g>`;
    s += place(120, 92, 0.84, bust(o, { eyes: 'open', mouth: 'smile', brows: 'raised', look: [3, -1] }, '', arm(DOWN_L, o) + arm([[56, 90], [110, 110], [116, 22]], o, 'fist')));
    return svg(VB, s);
  }

  /* ---------- 15. friends: high five ---------- */
  function sceneFriends() {
    const A = BOYS.a, B = BOYS.d;
    let s = blob('#FDE2EC', 150, 120, 108);
    s += place(92, 104, 0.72, bust(A, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', arm(DOWN_L, A) + arm([[56, 90], [70, 20], [80, -66]], A, 'open')));
    s += place(208, 104, 0.72, bust(B, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', arm(DOWN_R, B) + arm([[-56, 90], [-70, 20], [-80, -66]], B, 'open')));
    s += sparkle(150, 22, 12, P.yellow) + sparkle(126, 12, 5, P.orange) + sparkle(174, 12, 5, P.orange);
    return svg(VB, s);
  }

  /* ---------- 16. emotion faces ---------- */
  const FACE_SET = {
    happy:  { o: BOYS.a, f: { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, bg: '#FFF4CC', ring: '#F5B400' },
    sad:    { o: BOYS.b, f: { eyes: 'open', look: [0, 2.5], mouth: 'sad', brows: 'worried', tear: true }, bg: '#DCEBFF', ring: '#1F6FD1' },
    angry:  { o: BOYS.c, f: { eyes: 'open', mouth: 'angry', brows: 'angry', fever: true }, bg: '#FFE3DE', ring: '#D93B28' },
    scared: { o: BOYS.d, f: { eyes: 'open', mouth: 'scared', brows: 'raised', look: [-2, 0] }, bg: '#EFE3FA', ring: '#7B3FA0' },
    calm:   { o: BOYS.e, f: { eyes: 'sleep', mouth: 'soft', brows: 'relaxed' }, bg: '#DDF4E6', ring: '#2E9E5B' },
  };
  function face(kind) {
    const k = FACE_SET[kind];
    const cid = uid('fc');
    const inner = `<circle cx="60" cy="60" r="58" fill="${k.bg}"/>` + place(60, 62, 0.74, torso(k.o) + head({ ...k.o, ...k.f }));
    return svg('0 0 120 120', `<defs><clipPath id="${cid}"><circle cx="60" cy="60" r="58"/></clipPath></defs><g clip-path="url(#${cid})">${inner}</g><circle cx="60" cy="60" r="57" fill="none" stroke="${k.ring}" stroke-width="3.5"/>`);
  }

  /* ---------- 16. calm breathing ---------- */
  function sceneBreathe() {
    const o = BOYS.e;
    let s = blob('#FFF1CF');
    s += place(150, 90, 0.86, bust(o, { eyes: 'sleep', mouth: 'soft', brows: 'relaxed' }, '', arm(DOWN_L, o) + arm(DOWN_R, o)));
    s += `<g fill="none" stroke="#7CC4F4" stroke-width="4" stroke-linecap="round"><path d="M186 104 q16 -6 30 2 q10 6 20 -2"/><path d="M190 120 q18 -4 34 4"/><path d="M114 104 q-16 -6 -30 2 q-10 6 -20 -2"/><path d="M110 120 q-18 -4 -34 4"/></g>`;
    const heart = (x, y, sc, c) => `<path transform="translate(${x} ${y}) scale(${sc})" d="M0 6 C-6 -2 -14 0 -14 7 C-14 14 -6 18 0 24 C6 18 14 14 14 7 C14 0 6 -2 0 6 Z" fill="${c}"/>`;
    s += heart(58, 40, 1.1, '#F06292') + heart(246, 46, 0.9, '#FFB74D') + heart(264, 150, 0.7, '#F06292') + sparkle(40, 150, 6, P.yellow);
    return svg(VB, s);
  }

  /* ---------- 1b. planting a sapling ---------- */
  function scenePlant() {
    const o = BOYS.b;
    let s = blob('#E2F5E8');
    const arms = arm([[-56, 92], [-74, 150], [-44, 156]], o, null) + arm([[56, 92], [74, 150], [44, 156]], o, null);
    const pot = `<path d="M3 130 C1 104 -6 86 -2 62" fill="none" stroke="#5D8C3A" stroke-width="5" stroke-linecap="round"/>` +
      `<ellipse cx="-20" cy="92" rx="18" ry="9" transform="rotate(-25 -20 92)" fill="#5BB85F"/><ellipse cx="22" cy="80" rx="18" ry="9" transform="rotate(25 22 80)" fill="#4CAF50"/>` +
      `<ellipse cx="-14" cy="62" rx="14" ry="7" transform="rotate(-35 -14 62)" fill="#7ED36F"/><ellipse cx="12" cy="52" rx="13" ry="7" transform="rotate(30 12 52)" fill="#5BB85F"/>` +
      `<path d="M-46 126 H46 L36 196 H-36 Z" fill="#D9774A"/><rect x="-50" y="120" width="100" height="16" rx="5" fill="#C2643A"/><ellipse cx="0" cy="124" rx="44" ry="5" fill="#6D4C33"/>`;
    const hands = hand(-52, 150, -8, 'fist', SKIN[o.skin]) + hand(52, 150, 188, 'fist', SKIN[o.skin]);
    s += place(150, 84, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', arms + pot + hands));
    s += `<circle cx="252" cy="44" r="20" fill="${P.yellow}"/>` + sparkle(46, 52, 7, P.yellow);
    s += `<g fill="#FFFFFF" opacity=".95"><ellipse cx="62" cy="96" rx="22" ry="9"/><ellipse cx="78" cy="88" rx="14" ry="9"/></g>`;
    return svg(VB, s);
  }

  /* ---------- 16b. showing a drawing ---------- */
  function sceneDrawing() {
    const o = BOYS.f;
    let s = blob('#FFF1CF');
    const arms = arm([[-56, 92], [-80, 150], [-58, 112]], o, null) + arm([[56, 92], [80, 150], [58, 112]], o, null);
    const paper = `<g transform="rotate(-3)"><rect x="-66" y="96" width="132" height="98" rx="4" fill="#FFFFFF" stroke="#D5DEE8" stroke-width="2"/>` +
      `<circle cx="40" cy="120" r="11" fill="${P.yellow}"/><g stroke="${P.yellow}" stroke-width="3" stroke-linecap="round"><path d="M40 102 v-4 M56 120 h4 M52 108 l3 -3 M52 132 l3 3 M24 108 l-3 -3"/></g>` +
      `<path d="M-50 150 L-30 132 L-10 150 Z" fill="${P.red}"/><rect x="-46" y="150" width="32" height="26" fill="${P.blue}"/><rect x="-35" y="160" width="10" height="16" fill="${P.yellow}"/>` +
      `<path d="M-64 178 Q-20 170 64 180 V192 H-64 Z" fill="#7ED36F"/>` +
      `<path d="M14 160 C10 154 2 156 2 162 C2 168 10 172 14 176 C18 172 26 168 26 162 C26 156 18 154 14 160 Z" fill="#F06292"/></g>`;
    const hands = hand(-64, 110, 10, 'fist', SKIN[o.skin]) + hand(64, 110, 170, 'fist', SKIN[o.skin]);
    s += place(150, 80, 0.84, bust(o, { eyes: 'happy', mouth: 'smile', brows: 'relaxed' }, '', arms + paper + hands));
    s += sparkle(40, 44, 7, P.yellow) + sparkle(262, 52, 6, P.orange);
    return svg(VB, s);
  }

  /* ---------- small check / cross marks ---------- */
  const mark = (ok) => svg('0 0 40 40', ok
    ? `<circle cx="20" cy="20" r="19" fill="${P.green}"/><path d="M11 20.5 L17.5 27 L29.5 14" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="20" cy="20" r="19" fill="${P.red}"/><path d="M13 13 L27 27 M27 13 L13 27" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>`);

  global.SCENES = {
    cover: sceneCover, mask: sceneMask, quake: sceneQuake, brush: sceneBrush, breakfast: sceneBreakfast,
    tablet: sceneTablet, backpack: sceneBackpack, cross: sceneCross, kit: sceneKit, laptop: sceneLaptop,
    noFirecracker: sceneNoFirecracker, tap: sceneTap, lightSwitch: sceneSwitch, recycle: sceneRecycle, friends: sceneFriends, breathe: sceneBreathe, plant: scenePlant, drawing: sceneDrawing,
    rest: () => global.ART.sceneRest(), wash: () => global.ART.sceneWash(), sneeze: () => global.ART.sceneSneeze(),
    drink: () => global.ART.sceneDrink(), tell: () => global.ART.sceneTell(), magnifier: () => global.ART.sceneMagnifier(),
    sickNose: () => global.ART.miniBust('nose'), sickFever: () => global.ART.miniBust('fever'),
  };
  global.FACE = face;
  global.MARK = mark;
})(window);
