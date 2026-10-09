'use strict';

// ---------- Hilfsfunktionen ----------
const $ = (s, el = document) => el.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const WD_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MON = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? null : n; };
const MEALS = { fruehstueck: 'Frühstück', mittag: 'Mittag', abend: 'Abend', snack: 'Snack', mealprep: 'Meal Prep' };
const SLOTS = ['fruehstueck', 'mittag', 'abend', 'snack'];

// ---------- Symbole ----------
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7.5c0-1.5 1-2 1-3.5M12 7.5c0-1.5 1-2 1-3.5M16 7.5c0-1.5 1-2 1-3.5"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  apple: '<path d="M12 7.5c-2-1.5-6.5-1-7 3.5S8 20.5 10 20.5c1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 5.5-5 5-9.5s-5-5-7-3.5z"/><path d="M12 7.5c0-2 1-3.5 3-4.5"/>',
  box: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M3 12h18M9 4h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dumbbell: '<path d="M6.5 8v8M3.5 10v4M17.5 8v8M20.5 10v4M6.5 12h11"/>',
  leaf: '<path d="M5 19c0-8 5-13.5 14.5-14.5C19.5 14 14 19 5 19z"/><path d="M5 19l8.5-8.5"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  paste: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  save: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6.2"/><circle cx="10" cy="20.5" r="1.2"/><circle cx="17" cy="20.5" r="1.2"/>',
  milk: '<path d="M8 3h8v3l2 3v12H6V9l2-3z"/><path d="M6 13h12"/>',
  fish: '<path d="M3 12c3-5 10-6 15 0-5 6-12 5-15 0z"/><path d="M18 12l3-3v6z"/><circle cx="8" cy="11" r=".6"/>',
  bread: '<path d="M5 10.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 19 10.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/>',
  wheat: '<path d="M12 21V8M12 8c-2.5 0-3.5-2.5-3.5-4.5 2 0 3.5 1 3.5 4.5zM12 8c2.5 0 3.5-2.5 3.5-4.5-2 0-3.5 1-3.5 4.5zM12 13c-2.5 0-3.5-2.5-3.5-4.5 2 0 3.5 1 3.5 4.5zM12 13c2.5 0 3.5-2.5 3.5-4.5-2 0-3.5 1-3.5 4.5z"/>',
  can: '<ellipse cx="12" cy="5.5" rx="6" ry="2"/><path d="M6 5.5v13c0 1.1 2.7 2 6 2s6-.9 6-2v-13M6 10h12"/>',
  nut: '<path d="M12 3c4 0 7 3 7 8s-3 10-7 10-7-5-7-10 3-8 7-8z"/><path d="M12 8v9"/>',
  snow: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2 3.8 16.8M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"/>',
  salt: '<path d="M9 3h6l1 5v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8z"/><path d="M8 8h8M11 5.5h.01M13 5.5h.01"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
};
const ico = (name, cls = '') => `<span class="ico ${cls}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg></span>`;
const MEAL_ICO = { fruehstueck: ['sun', 'gold'], mittag: ['bowl', ''], abend: ['moon', 'blue'], snack: ['apple', 'orange'], mealprep: ['box', 'plum'] };
const mealIco = (m, extra = '') => { const [n, c] = MEAL_ICO[m] || MEAL_ICO.mittag; return ico(n, `${c} ${extra}`); };
const SEC_ICO = { 'Obst & Gemüse': ['leaf', ''], 'Kühlregal': ['milk', 'blue'], 'Fisch & Fleisch': ['fish', 'orange'], 'Brot & Backwaren': ['bread', 'gold'],
  'Nudeln, Reis & Getreide': ['wheat', 'gold'], 'Hülsenfrüchte & Konserven': ['can', 'plum'], 'Nüsse & Samen': ['nut', 'orange'], 'Tiefkühl': ['snow', 'blue'], 'Gewürze, Öl & Vorrat': ['salt', ''], 'Sonstiges': ['bag', 'plum'] };
const cardHead = (icon, cls, title, sub = '', right = '') => `<div class="card-head">${ico(icon, cls)}<h2>${title}${sub ? `<small>${sub}</small>` : ''}</h2>${right}</div>`;

// ---------- Mengen und Zutaten ----------
const FRAC = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
const UNITS = { g: 'g', gr: 'g', gramm: 'g', kg: 'kg', ml: 'ml', l: 'l', liter: 'l', el: 'EL', tl: 'TL', msp: 'Msp', prise: 'Prise', prisen: 'Prise',
  bund: 'Bund', dose: 'Dose', dosen: 'Dose', pck: 'Pck', 'pck.': 'Pck', päckchen: 'Pck', packung: 'Pck', zehe: 'Zehe', zehen: 'Zehe',
  stück: '', stk: '', 'stk.': '', handvoll: 'Handvoll', scheibe: 'Scheibe', scheiben: 'Scheibe', stange: 'Stange', stangen: 'Stange',
  becher: 'Becher', glas: 'Glas', gläser: 'Glas', tasse: 'Tasse', tassen: 'Tasse', zweig: 'Zweig', zweige: 'Zweig', blatt: 'Blatt', blätter: 'Blatt', cm: 'cm' };
const PLURAL = { Dose: 'Dosen', Zehe: 'Zehen', Scheibe: 'Scheiben', Stange: 'Stangen', Tasse: 'Tassen', Prise: 'Prisen', Zweig: 'Zweige', Blatt: 'Blätter', Glas: 'Gläser' };

// „200 g rote Linsen, gewaschen“ -> { qty: 200, unit: 'g', name: 'rote Linsen', note: 'gewaschen' }
function parseIng(line) {
  let s = String(line).trim().replace(/^[-–*•·]\s*/, '');
  let qty = null, m;
  if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)\s*/))) qty = +m[1] + m[2] / m[3];
  else if ((m = s.match(/^(\d+)\/(\d+)\s*/))) qty = m[1] / m[2];
  else if ((m = s.match(/^(\d+(?:[.,]\d+)?)?\s*([½¼¾⅓⅔⅛])\s*/))) qty = (m[1] ? num(m[1]) : 0) + FRAC[m[2]];
  else if ((m = s.match(/^(\d+(?:[.,]\d+)?)(?:\s*(?:-|–|bis)\s*\d+(?:[.,]\d+)?)?\s*/))) qty = num(m[1]);
  if (m && qty != null) s = s.slice(m[0].length);
  let unit = '';
  const w = s.match(/^([A-Za-zÄÖÜäöüß.]+)\s+/);
  if (w && w[1].toLowerCase() in UNITS) { unit = UNITS[w[1].toLowerCase()]; s = s.slice(w[0].length); }
  let name = s.trim(), note = '';
  const p = name.search(/[,(]/);
  if (p > 0) { note = name.slice(p).replace(/^,\s*/, '').trim(); name = name.slice(0, p).trim(); }
  return { qty, unit, name: name || String(line).trim(), note };
}

function roundQty(q, unit) {
  if (unit === 'g' || unit === 'ml') return q >= 100 ? Math.round(q / 10) * 10 : q >= 20 ? Math.round(q / 5) * 5 : Math.max(1, Math.round(q));
  if (unit === 'kg' || unit === 'l') return Math.round(q * 100) / 100;
  if (q < 1) return Math.max(0.25, Math.round(q * 4) / 4);
  return Math.round(q * 2) / 2;
}
function fmtQty(q) {
  const whole = Math.floor(q + 1e-9), rest = Math.round((q - whole) * 100) / 100;
  const fr = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[rest];
  if (fr) return (whole || '') + fr;
  return String(Math.round(q * 100) / 100).replace('.', ',');
}
// Menge mit Einheit hübsch anzeigen, große g/ml-Mengen als kg/l
function amount(q, unit) {
  if (q == null) return unit || '';
  if (unit === 'g' && q >= 1000) { q /= 1000; unit = 'kg'; }
  if (unit === 'ml' && q >= 1000) { q /= 1000; unit = 'l'; }
  q = roundQty(q, unit);
  const u = q > 1 && PLURAL[unit] ? PLURAL[unit] : unit;
  return `${fmtQty(q)}${u ? ' ' + u : ''}`;
}
const noteText = (n) => (!n ? '' : n.startsWith('(') ? ' ' + n : ', ' + n);
const ingLine = (i, f = 1) => `${i.qty != null || i.unit ? amount(i.qty == null ? null : i.qty * f, i.unit) + ' ' : ''}${i.name}${noteText(i.note)}`;

// Gleiche Zutaten erkennen: „Zwiebeln“ = „Zwiebel“
function ingKey(name) {
  let k = name.toLowerCase().replace(/\s+/g, ' ').trim();
  if (k === 'eier') return 'ei';
  return k.replace(/([el])n$/, '$1');
}

// ---------- Supermarkt-Bereiche ----------
const SECTIONS = ['Obst & Gemüse', 'Kühlregal', 'Fisch & Fleisch', 'Brot & Backwaren', 'Nudeln, Reis & Getreide', 'Hülsenfrüchte & Konserven', 'Nüsse & Samen', 'Tiefkühl', 'Gewürze, Öl & Vorrat', 'Sonstiges'];
const SEC_RULES = [
  ['Tiefkühl', /\(tk\)|\btk\b|tiefkühl/],
  ['Hülsenfrüchte & Konserven', /dose|thunfisch|kokosmilch|passiert|tomatenmark|\bmais\b/],
  ['Fisch & Fleisch', /lachs|hähnchen|huhn|pute|garnele|fisch|rind|hack|schinken|forelle/],
  ['Kühlregal', /joghurt|skyr|quark|milch|käse|feta|ricotta|mozzarella|halloumi|parmesan|tofu|tempeh|^eier?\b|butter|sahne|hummus|kefir|miso/],
  ['Gewürze, Öl & Vorrat', /salz|pfeffer|öl$|öl |essig|balsamico|sojasauce|honig|sirup|senf|curry|pulver|kreuzkümmel|zimt|kurkuma|brühe|oregano|thymian|rosmarin|chili|muskat|masala|hefeflocken|stärke|vanille|backpulver/],
  ['Nüsse & Samen', /nuss|nüsse|mandel|cashew|kerne|samen|sesam|chia|lein|hanf|mus$|tahin|dattel|rosine/],
  ['Nudeln, Reis & Getreide', /nudel|pasta|spaghetti|reis|quinoa|bulgur|couscous|hafer|buchweizen|hirse|mehl|soba|polenta/],
  ['Brot & Backwaren', /brot|tortilla|wrap|brötchen|knäcke/],
  ['Hülsenfrüchte & Konserven', /linse|bohne|kichererbse|erbse/],
  ['Obst & Gemüse', /zwiebel|knoblauch|paprika|zucchini|spinat|brokkoli|möhre|karotte|apfel|äpfel|banane|beere|zitrone|limette|ingwer|avocado|gurke|salat|kartoffel|kürbis|pilz|champignon|lauch|petersilie|koriander|basilikum|minze|dill|schnittlauch|kohl|aubergine|sellerie|bete|fenchel|mango|birne|orange|rucola|granatapfel|tomate|radieschen|spargel|kräuter|wirsing|pastinake|obst|gemüse|traube|kiwi|pflaume|feige|edamame/],
];
const secOf = (i) => { const t = `${i.name} ${i.note}`.toLowerCase(); return (SEC_RULES.find(([, re]) => re.test(t)) || ['Sonstiges'])[0]; };

// ---------- Speicher ----------
const KEY = 'rezepte.v1';
const EMPTY = () => ({ v: 1, profile: { servings: 2, avoid: 'Tomaten (nur wenig), rohe Möhren' }, recipes: [], meta: {}, plan: {},
  shop: { checked: {}, home: {}, extra: [], recipes: [] }, lastBackup: null });
let db = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 1) return Object.assign(EMPTY(), d); } catch (e) {}
  return EMPTY();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('Speichern fehlgeschlagen'); } }

// ---------- Rezepte ----------
const BUILTIN = RECIPES.map((r) => ({ ...r, ingredients: r.ing.map(parseIng) }));
const allRecipes = () => db.recipes.concat(BUILTIN);
const byId = (id) => db.recipes.find((r) => r.id === id) || BUILTIN.find((r) => r.id === id) || null;
const metaOf = (id) => db.meta[id] || {};
const fitsSlot = (r, slot) => r.meals.includes(slot) || (r.meals.includes('mealprep') && (slot === 'mittag' || slot === 'abend'));
const SOURCE_TAG = { eigen: 'Meins', claude: 'Von Claude' };

function filteredRecipes(f, q) {
  q = (q || '').trim().toLowerCase();
  return allRecipes().filter((r) => {
    if (f.meal && !r.meals.includes(f.meal)) return false;
    if (f.time && r.time > f.time) return false;
    if (f.veg && !r.veg) return false;
    if (f.fav && !metaOf(r.id).fav) return false;
    if (f.mine && r.source === 'app') return false;
    if (q && !r.name.toLowerCase().includes(q) && !r.ingredients.some((i) => i.name.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => (metaOf(b.id).fav ? 1 : 0) - (metaOf(a.id).fav ? 1 : 0) || (metaOf(b.id).rating || 0) - (metaOf(a.id).rating || 0) || a.name.localeCompare(b.name, 'de'));
}

const nutri = (r) => [r.protein != null ? `${r.protein} g Protein` : '', r.fiber != null ? `${r.fiber} g Ballaststoffe` : ''].filter(Boolean).join(' · ');
function recipeRow(r, action = 'openRecipe', extra = '') {
  const m = metaOf(r.id);
  const tag = SOURCE_TAG[r.source] ? `<span class="tag">${SOURCE_TAG[r.source]}</span> ` : '';
  return `<button type="button" class="rrow" data-a="${action}" data-id="${r.id}" ${extra}>${mealIco(r.meals[0], 'sm')}
    <span class="rmain"><b>${esc(r.name)}</b><span class="meta">${tag}${r.time ? `${r.time} Min` : ''}${nutri(r) ? ' · ' + nutri(r) : ''}</span></span>
    <span class="rside">${m.fav ? '<span class="star on">★</span>' : ''}${m.rating ? `<span class="small muted">${m.rating}/5</span>` : ''}<span class="chev">›</span></span></button>`;
}

// ---------- Wochenplan ----------
function weekStart(off = 0) { const x = new Date(); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7) + off * 7); return x; }
const weekDays = (off) => Array.from({ length: 7 }, (_, i) => { const d = weekStart(off); d.setDate(d.getDate() + i); return d; });
function weekLabel(off) {
  const d = weekDays(off), a = d[0], b = d[6];
  const txt = a.getMonth() === b.getMonth() ? `${a.getDate()}.–${b.getDate()}. ${MON[b.getMonth()]}` : `${a.getDate()}. ${MON[a.getMonth()]} – ${b.getDate()}. ${MON[b.getMonth()]}`;
  return off === 0 ? `Diese Woche · ${txt}` : off === 1 ? `Nächste Woche · ${txt}` : off === -1 ? `Letzte Woche · ${txt}` : txt;
}
const weekEntries = (off) => weekDays(off).flatMap((d) => (db.plan[dayKey(d)] || []).map((e) => ({ ...e, day: dayKey(d) })));

// ---------- Einkaufsliste ----------
function shoppingItems() {
  const sources = weekEntries(ui.weekOff).map((e) => ({ rid: e.rid, servings: e.servings })).concat(db.shop.recipes);
  const map = new Map();
  for (const s of sources) {
    const r = byId(s.rid); if (!r) continue;
    const f = (s.servings || r.servings) / r.servings;
    for (const i of r.ingredients) {
      if (/^wasser$/i.test(i.name)) continue;
      const k = ingKey(i.name);
      if (!map.has(k)) map.set(k, { key: k, name: i.name, note: i.note.startsWith('(') ? i.note : '', sec: secOf(i), amounts: {}, loose: false, from: new Set() });
      const it = map.get(k);
      it.from.add(r.name);
      if (i.qty == null) { if (i.unit) it.amounts[i.unit] = it.amounts[i.unit] ?? null; else it.loose = true; continue; }
      let q = i.qty * f, u = i.unit;
      if (u === 'kg') { q *= 1000; u = 'g'; } if (u === 'l') { q *= 1000; u = 'ml'; }
      it.amounts[u] = (it.amounts[u] || 0) + q;
    }
  }
  return [...map.values()];
}
const itemAmount = (it) => Object.entries(it.amounts).map(([u, q]) => amount(q, u)).filter(Boolean).join(' + ');
const itemText = (it) => { const a = itemAmount(it); return `${a ? a + ' ' : ''}${it.name}${it.note ? ' ' + it.note : ''}`; };

// ---------- Anfragen für Claude ----------
const FORMAT = `Gib jedes Rezept genau in diesem Format zurück, als normalen Text ohne weitere Erklärungen:

REZEPT: Name des Gerichts
PORTIONEN: 2
ZEIT: 25
MAHLZEIT: Frühstück, Mittag, Abend, Snack oder Meal Prep (mehrere mit Komma)
VEGETARISCH: ja oder nein
PROTEIN: Gramm pro Portion (geschätzt, nur die Zahl)
BALLASTSTOFFE: Gramm pro Portion (geschätzt, nur die Zahl)
ZUTATEN:
- 200 g rote Linsen
- 1 Zwiebel
SCHRITTE:
1. Erster Schritt
2. Zweiter Schritt`;
function photoPrompt() {
  return `Auf dem Foto ist ein Rezept. Bitte lies es vollständig ab und übertrage es auf Deutsch.
Übernimm alle Zutaten mit genauen Mengen und Einheiten (g, ml, EL, TL, Stück, Dose …). Wenn eine Menge fehlt, schätze sie sinnvoll und schreibe „(geschätzt)“ dahinter. Zeit und Nährwerte bitte schätzen, falls sie nicht dastehen.

${FORMAT}`;
}
function ideaPrompt() {
  const i = ui.idea;
  const meal = { fruehstueck: 'zum Frühstück', mittag: 'fürs Mittagessen', abend: 'fürs Abendessen', snack: 'als Snack', mealprep: 'zum Vorkochen für mehrere Tage (Meal Prep)' }[i.meal] || 'für Frühstück, Mittag- oder Abendessen';
  const names = allRecipes().slice(0, 80).map((r) => r.name).join('; ');
  return `Bitte erfinde ${i.count} ${i.count === 1 ? 'gesundes Rezept' : 'gesunde, abwechslungsreiche Rezepte'} ${meal}.
- Viel Protein und viele Ballaststoffe, alltagstauglich, Zutaten aus dem normalen Supermarkt.
- Ich esse überwiegend vegetarisch, ab und zu Fisch oder Fleisch ist okay.
- Das mag ich nicht oder nur in kleinen Mengen: ${db.profile.avoid || 'nichts Bestimmtes'}.
- ${i.time ? `Höchstens ${i.time} Minuten Zubereitung.` : 'Zubereitungszeit egal.'}
- Mengen für ${db.profile.servings} ${db.profile.servings === 1 ? 'Portion' : 'Portionen'}.${i.wish.trim() ? `\n- Mein Wunsch: ${i.wish.trim()}` : ''}
- Diese Rezepte habe ich schon, bitte etwas anderes: ${names}

${FORMAT}`;
}

// Antwort von Claude einlesen
function parseClaude(text) {
  const t = String(text).replace(/\r/g, '').replace(/\*\*|__/g, '').replace(/^#+\s*/gm, '');
  const parts = t.split(/^\s*REZEPT\s*:/im).slice(1);
  const KEYS = { portionen: 'servings', zeit: 'time', mahlzeit: 'meals', mahlzeiten: 'meals', vegetarisch: 'veg', protein: 'protein', ballaststoffe: 'fiber', zutaten: 'ing', schritte: 'steps', zubereitung: 'steps', notiz: 'note', tipp: 'note' };
  return parts.map((p) => {
    const lines = p.split('\n');
    const r = { name: lines.shift().trim(), servings: 2, time: null, meals: [], veg: true, protein: null, fiber: null, ing: [], steps: [], note: '' };
    let mode = null;
    for (let line of lines) {
      line = line.trim(); if (!line || /^-{3,}$/.test(line)) continue;
      const m = line.match(/^([A-Za-zÄÖÜäöüß ]+?)\s*:\s*(.*)$/);
      const k = m && KEYS[m[1].trim().toLowerCase()];
      if (k) {
        const v = m[2].trim();
        if (k === 'ing' || k === 'steps') { mode = k; if (v) r[k].push(v); continue; }
        mode = k === 'note' ? 'note' : null;
        if (k === 'servings') r.servings = Math.max(1, Math.round(num(v.match(/\d+(?:[,.]\d+)?/)?.[0]) || 2));
        else if (k === 'time') r.time = Math.round(num(v.match(/\d+(?:[,.]\d+)?/)?.[0])) || null;
        else if (k === 'protein' || k === 'fiber') r[k] = Math.round(num(v.match(/\d+(?:[,.]\d+)?/)?.[0])) || null;
        else if (k === 'veg') r.veg = !/^nein|^no/i.test(v);
        else if (k === 'meals') r.meals = mealsFrom(v);
        else if (k === 'note') r.note = v;
        continue;
      }
      if (mode === 'ing') { if (!/:$/.test(line)) r.ing.push(line.replace(/^[-–*•·]\s*/, '')); }
      else if (mode === 'steps') r.steps.push(line.replace(/^(\d+[.)]|[-–*•·])\s*/, ''));
      else if (mode === 'note') r.note += (r.note ? '\n' : '') + line;
    }
    if (!r.meals.length) r.meals = ['mittag', 'abend'];
    return r;
  }).filter((r) => r.name && r.ing.length);
}
function mealsFrom(v) {
  v = v.toLowerCase(); const out = [];
  if (/früh/.test(v)) out.push('fruehstueck'); if (/mittag/.test(v)) out.push('mittag'); if (/abend/.test(v)) out.push('abend');
  if (/snack/.test(v)) out.push('snack'); if (/prep|vorkoch/.test(v)) out.push('mealprep');
  return out;
}
const fromParsed = (p, source) => ({ id: 'eigen-' + uid(), name: p.name, meals: p.meals, time: p.time, servings: p.servings, veg: p.veg,
  protein: p.protein, fiber: p.fiber, ingredients: p.ing.map(parseIng), steps: p.steps, note: p.note, source, created: new Date().toISOString() });

// ---------- UI-Zustand ----------
const ui = { tab: 'rezepte', view: null, f: { meal: '', time: 0, veg: false, fav: false, mine: false }, q: '', weekOff: 0,
  idea: { meal: 'abend', time: 30, count: 3, wish: '' }, importText: '', importFound: null, importSource: 'claude', pick: null, timer: null };
const TABS = [['rezepte', 'Rezepte', '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>'],
  ['woche', 'Woche', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
  ['einkauf', 'Einkauf', '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6.2"/><circle cx="10" cy="20.5" r="1.2"/><circle cx="17" cy="20.5" r="1.2"/>'],
  ['neu', 'Neu', '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'],
  ['mehr', 'Mehr', '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>']];

function go(tab, view = null) { ui.tab = tab; ui.view = view; render(); window.scrollTo(0, 0); }
function open(view) { view.from = ui.view; ui.view = view; render(); window.scrollTo(0, 0); }

function render() {
  const v = ui.view;
  let html;
  if (v?.name === 'recipe') html = viewRecipe();
  else if (v?.name === 'form') html = viewForm();
  else if (v?.name === 'cook') html = viewCook();
  else if (v?.name === 'import') html = viewImport();
  else html = { rezepte: viewRecipes, woche: viewWeek, einkauf: viewShop, neu: viewNew, mehr: viewMore }[ui.tab]();
  $('#app').innerHTML = html;
  $('#nav').innerHTML = TABS.map(([id, label, icon]) => `<button type="button" data-a="tab" data-tab="${id}" class="${ui.tab === id ? 'on' : ''}" aria-label="${label}"><svg viewBox="0 0 24 24">${icon}</svg><span>${label}</span></button>`).join('');
  $('#nav').hidden = v?.name === 'cook';
  if (v?.name === 'cook') updateTimer();
}
const header = (title, back, right = '', cls = '') => `<header class="top ${cls}">${back ? `<button type="button" class="back" data-a="${back}" aria-label="Zurück">‹</button>` : ''}<h1>${esc(title)}</h1>${right}</header>`;

// ---------- Ansicht: Rezepte ----------
function heroCard() {
  const now = new Date(), k = dayKey(now), h = now.getHours();
  const greet = h < 11 ? 'Guten Morgen' : h < 17 ? 'Hallo' : 'Guten Abend';
  const today = (db.plan[k] || []).slice().sort((a, b) => SLOTS.indexOf(a.meal) - SLOTS.indexOf(b.meal));
  const planned = weekEntries(0).length;
  const week = weekDays(0).map((d) => { const n = (db.plan[dayKey(d)] || []).length;
    return `<div class="hd ${dayKey(d) === k ? 'today' : ''}"><span>${['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()]}</span><i class="${n ? 'on' : ''}">${n || ''}</i></div>`; }).join('');
  const body = today.length
    ? `<p>Heute auf dem Plan:</p><div class="hero-meals">${today.map((e) => { const r = byId(e.rid); return r ? `<button type="button" class="hero-meal" data-a="openEntry" data-day="${k}" data-e="${e.id}"><span>${MEALS[e.meal]}</span><b>${esc(r.name)}</b></button>` : ''; }).join('')}</div>`
    : `<p>Für heute ist noch nichts geplant.</p><button type="button" class="hero-btn" data-a="tab" data-tab="woche">Woche planen</button>`;
  return `<div class="hero"><div class="hero-date">${WD_LONG[now.getDay()]}, ${now.getDate()}. ${MON[now.getMonth()]}${planned ? ` · ${planned} ${planned === 1 ? 'Gericht' : 'Gerichte'} diese Woche` : ''}</div>
    <h2>${greet}!</h2>${body}<div class="hero-week">${week}</div></div>`;
}
function viewRecipes() {
  const f = ui.f;
  const chip = (on, a, label, data = '') => `<button type="button" class="chip-btn ${on ? 'on' : ''}" data-a="${a}" ${data}>${label}</button>`;
  return `${header('Rezepte', null, '<button type="button" class="icon" data-a="newRecipe" aria-label="Neues Rezept">+</button>')}
    ${heroCard()}
    <div class="search"><input type="search" placeholder="Rezept oder Zutat suchen" value="${esc(ui.q)}" data-c="search"></div>
    <div class="chips scroll">${chip(!f.meal, 'fMeal', 'Alle', 'data-m=""')}${Object.entries(MEALS).map(([k, l]) => chip(f.meal === k, 'fMeal', l, `data-m="${k}"`)).join('')}</div>
    <div class="chips scroll">${chip(f.time === 20, 'fTime', '≤ 20 Min', 'data-t="20"')}${chip(f.time === 40, 'fTime', '≤ 40 Min', 'data-t="40"')}${chip(f.veg, 'fToggle', 'Vegetarisch', 'data-k="veg"')}${chip(f.fav, 'fToggle', '★ Favoriten', 'data-k="fav"')}${chip(f.mine, 'fToggle', 'Meine', 'data-k="mine"')}</div>
    <div id="rlist">${recipeList()}</div>`;
}
function recipeList() {
  const list = filteredRecipes(ui.f, ui.q);
  return list.length ? `<p class="small muted">${list.length} ${list.length === 1 ? 'Rezept' : 'Rezepte'}</p><div class="card list">${list.map((r) => recipeRow(r)).join('')}</div>`
    : `<p class="empty">Keine Rezepte gefunden.${ui.f.mine ? '<br>Eigene Rezepte legst du unter „Neu“ an.' : ''}</p>`;
}

function viewRecipe() {
  const r = byId(ui.view.id);
  if (!r) return `${header('Rezept', 'closeView')}<p class="empty">Rezept nicht gefunden.</p>`;
  const s = ui.view.servings || r.servings, f = s / r.servings, m = metaOf(r.id);
  const stars = [1, 2, 3, 4, 5].map((n) => `<button type="button" class="star ${m.rating >= n ? 'on' : ''}" data-a="rate" data-n="${n}" aria-label="${n} Sterne">★</button>`).join('');
  return `${header(r.name, 'closeView', `<button type="button" class="icon fav ${m.fav ? 'on' : ''}" data-a="fav" aria-label="Favorit">${m.fav ? '♥' : '♡'}</button>`, 'wrap')}
    <div class="card">
      <div class="chips">${r.meals.map((x) => `<span class="tag">${MEALS[x] || x}</span>`).join('')}${r.veg ? '<span class="tag">vegetarisch</span>' : ''}${SOURCE_TAG[r.source] ? `<span class="tag">${SOURCE_TAG[r.source]}</span>` : ''}</div>
      <div class="tiles">
        <div class="tile">${ico('clock', 'sm')}<b>${r.time ?? '–'}</b><span>Minuten</span></div>
        <div class="tile">${ico('dumbbell', 'sm orange')}<b>${r.protein ?? '–'}${r.protein != null ? '<small> g</small>' : ''}</b><span>Protein</span></div>
        <div class="tile">${ico('leaf', 'sm gold')}<b>${r.fiber ?? '–'}${r.fiber != null ? '<small> g</small>' : ''}</b><span>Ballaststoffe</span></div>
      </div>
      ${nutri(r) ? '<p class="small muted center">Nährwerte pro Portion, grob geschätzt</p>' : ''}
      <div class="row rate"><span class="small muted">Deine Bewertung</span><span class="stars">${stars}</span></div>
    </div>
    <div class="card">
      <div class="row"><h2>Zutaten</h2><div class="stepper"><button type="button" class="icon sm" data-a="servings" data-d="-1" aria-label="Weniger">−</button><b>${s} ${s === 1 ? 'Portion' : 'Portionen'}</b><button type="button" class="icon sm" data-a="servings" data-d="1" aria-label="Mehr">+</button></div></div>
      <ul class="ings">${r.ingredients.map((i) => `<li>${esc(ingLine(i, f))}</li>`).join('')}</ul>
    </div>
    ${r.steps.length ? `<div class="card"><h2>Zubereitung</h2><ol class="steps">${r.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div>` : ''}
    ${r.note ? `<div class="card"><h2>Notiz</h2><p>${esc(r.note).replace(/\n/g, '<br>')}</p></div>` : ''}
    <button type="button" class="btn primary" data-a="cook">Kochen starten</button>
    <div class="btnrow"><button type="button" class="btn" data-a="toPlan">Zum Wochenplan</button><button type="button" class="btn" data-a="toShop">Auf Einkaufsliste</button></div>
    ${r.source === 'app' ? `<button type="button" class="link" data-a="copyRecipe">Als eigenes Rezept kopieren und anpassen</button>`
      : `<div class="btnrow"><button type="button" class="btn" data-a="editRecipe">Bearbeiten</button><button type="button" class="btn danger" data-a="delRecipe">Löschen</button></div>`}`;
}

function viewForm() {
  const r = ui.view.id ? byId(ui.view.id) : { name: '', meals: ['abend'], time: '', servings: db.profile.servings, veg: true, protein: '', fiber: '', ingredients: [], steps: [], note: '' };
  const meal = (k, l) => `<label class="chip"><input type="checkbox" name="meals" value="${k}" ${r.meals.includes(k) ? 'checked' : ''}><span>${l}</span></label>`;
  return `${header(ui.view.id ? 'Rezept bearbeiten' : 'Neues Rezept', 'closeView')}
    <form id="rForm" class="card" onsubmit="return false">
      <label class="field"><span>Name</span><input name="name" value="${esc(r.name)}" placeholder="z. B. Linsen-Dal"></label>
      <fieldset><legend>Mahlzeit</legend><div class="chips">${Object.entries(MEALS).map(([k, l]) => meal(k, l)).join('')}</div></fieldset>
      <div class="grid2"><label class="field"><span>Zeit (Minuten)</span><input name="time" inputmode="numeric" value="${esc(r.time ?? '')}"></label>
        <label class="field"><span>Portionen</span><input name="servings" inputmode="numeric" value="${esc(r.servings)}"></label>
        <label class="field"><span>Protein pro Portion (g)</span><input name="protein" inputmode="numeric" value="${esc(r.protein ?? '')}" placeholder="optional"></label>
        <label class="field"><span>Ballaststoffe pro Portion (g)</span><input name="fiber" inputmode="numeric" value="${esc(r.fiber ?? '')}" placeholder="optional"></label></div>
      <label class="chip"><input type="checkbox" name="veg" ${r.veg ? 'checked' : ''}><span>Vegetarisch</span></label>
      <label class="field"><span>Zutaten (eine pro Zeile, z. B. „200 g rote Linsen“)</span><textarea name="ing" rows="8">${esc(r.ingredients.map((i) => ingLine(i)).join('\n'))}</textarea></label>
      <label class="field"><span>Zubereitung (ein Schritt pro Zeile)</span><textarea name="steps" rows="8">${esc(r.steps.join('\n'))}</textarea></label>
      <label class="field"><span>Notiz</span><textarea name="note" rows="2">${esc(r.note || '')}</textarea></label>
    </form>
    <button type="button" class="btn primary" data-a="saveRecipe">Speichern</button>`;
}

// ---------- Kochmodus ----------
function viewCook() {
  const v = ui.view, r = byId(v.id);
  if (!r) return '';
  const f = (v.servings || r.servings) / r.servings, n = r.steps.length, i = Math.min(v.step, n);
  const ingsPanel = `<ul class="ings check">${r.ingredients.map((x, k) => `<li><button type="button" class="ingck ${v.done?.[k] ? 'done' : ''}" data-a="ingDone" data-k="${k}">${esc(ingLine(x, f))}</button></li>`).join('')}</ul>`;
  let body;
  if (i === 0 || !n) body = `<h2>Zutaten bereitlegen</h2><p class="small muted">${v.servings || r.servings} Portionen · antippen zum Abhaken</p>${ingsPanel}`;
  else {
    const step = r.steps[i - 1];
    const mins = step.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*Min/i);
    body = `<p class="muted">Schritt ${i} von ${n}</p><p class="bigstep">${esc(step)}</p>
      ${mins ? `<button type="button" class="btn" data-a="timerStart" data-m="${mins[1]}">⏱ Timer ${mins[1]} Minuten</button>` : ''}
      <details class="card mini"><summary>Zutaten anzeigen</summary>${ingsPanel}</details>`;
  }
  return `<header class="top"><button type="button" class="back" data-a="closeCook" aria-label="Kochmodus beenden">✕</button><h1>${esc(r.name)}</h1></header>
    <div class="progress"><i style="width:${n ? (i / n) * 100 : 100}%"></i></div>
    <div class="card cook">${body}</div>
    <div id="timer"></div>
    <div class="btnrow">${i > 0 ? '<button type="button" class="btn" data-a="cookStep" data-d="-1">Zurück</button>' : ''}${i < n ? `<button type="button" class="btn primary" data-a="cookStep" data-d="1">${i === 0 ? 'Los geht’s' : 'Weiter'}</button>` : '<button type="button" class="btn primary" data-a="closeCook">Fertig, guten Appetit!</button>'}</div>
    <div class="row end"><button type="button" class="link" data-a="timerMenu">Eigener Timer</button></div>`;
}
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && ui.view?.name === 'cook') keepAwake(true); });

let actx;
function beep() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.45, 0.9, 1.35].forEach((t) => {
      const o = actx.createOscillator(), g = actx.createGain(), at = actx.currentTime + t;
      o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.35, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.35); o.start(at); o.stop(at + 0.36);
    });
  } catch (e) {}
  navigator.vibrate?.([300, 150, 300]);
}
function startTimer(min) {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume?.(); } catch (e) {}
  ui.timer = { end: Date.now() + min * 60000, min };
  updateTimer();
}
function updateTimer() {
  const el = $('#timer'); const t = ui.timer;
  if (t && Date.now() >= t.end) {
    ui.timer = null; beep();
    modal(`<h2>⏱ Zeit ist um!</h2><p>Dein ${t.min}-Minuten-Timer ist abgelaufen.</p><button type="button" class="btn primary" data-a="closeModal">OK</button>`);
  }
  if (!el) return;
  if (!ui.timer) { el.innerHTML = ''; return; }
  const left = Math.max(0, Math.round((ui.timer.end - Date.now()) / 1000));
  el.innerHTML = `<div class="timer"><b>${Math.floor(left / 60)}:${pad(left % 60)}</b><button type="button" class="btn small" data-a="timerAdd">+1 Min</button><button type="button" class="btn small" data-a="timerStop">Stopp</button></div>`;
}
setInterval(() => { if (ui.timer) updateTimer(); }, 1000);

// ---------- Ansicht: Woche ----------
function weekNav() {
  return `<div class="weeknav"><button type="button" class="icon" data-a="week" data-d="-1" aria-label="Vorige Woche">‹</button><b>${weekLabel(ui.weekOff)}</b><button type="button" class="icon" data-a="week" data-d="1" aria-label="Nächste Woche">›</button></div>`;
}
function viewWeek() {
  const today = dayKey(new Date());
  const days = weekDays(ui.weekOff).map((d) => {
    const k = dayKey(d);
    const list = (db.plan[k] || []).slice().sort((a, b) => SLOTS.indexOf(a.meal) - SLOTS.indexOf(b.meal));
    return `<div class="card day ${k === today ? 'hl' : k < today ? 'past' : ''}"><div class="row"><h3>${WD_LONG[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]}</h3><button type="button" class="icon sm" data-a="addToDay" data-day="${k}" aria-label="Gericht hinzufügen">+</button></div>
      ${list.length ? `<div class="list">${list.map((e) => { const r = byId(e.rid); return `<div class="row entry">${mealIco(e.meal, 'sm')}<button type="button" class="ex-row" data-a="openEntry" data-day="${k}" data-e="${e.id}"><span class="small muted">${MEALS[e.meal]}</span><br><b>${esc(r ? r.name : 'Gelöschtes Rezept')}</b> <span class="small muted">· ${e.servings} P.</span></button><button type="button" class="icon sm" data-a="delEntry" data-day="${k}" data-e="${e.id}" aria-label="Entfernen">✕</button></div>`; }).join('')}</div>` : '<p class="small muted">Noch nichts geplant</p>'}</div>`;
  }).join('');
  const n = weekEntries(ui.weekOff).length;
  return `${header('Wochenplan')}${weekNav()}
    <div class="btnrow"><button type="button" class="btn" data-a="autoFill">Automatisch füllen</button><button type="button" class="btn ${n ? 'primary' : ''}" data-a="tab" data-tab="einkauf">Einkaufsliste</button></div>
    ${days}
    ${n ? '<button type="button" class="link danger" data-a="clearWeek">Woche leeren</button>' : ''}`;
}

function pickerList() {
  const p = ui.pick;
  const list = filteredRecipes({ mine: p.mine }, p.q).filter((r) => fitsSlot(r, p.meal));
  return list.length ? `<div class="list">${list.map((r) => recipeRow(r, 'pickRecipe')).join('')}</div>` : '<p class="empty">Keine passenden Rezepte.</p>';
}
function openDayPicker(day) {
  const used = (db.plan[day] || []).map((e) => e.meal);
  ui.pick = { day, meal: ['abend', 'mittag', 'fruehstueck', 'snack'].find((m) => !used.includes(m)) || 'abend', servings: db.profile.servings, q: '', mine: false };
  renderPicker();
}
function renderPicker() {
  const p = ui.pick, d = new Date(p.day + 'T12:00');
  modal(`<h2>${WD_LONG[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]}</h2>
    <div class="chips">${SLOTS.map((m) => `<button type="button" class="chip-btn ${p.meal === m ? 'on' : ''}" data-a="pickMeal" data-m="${m}">${MEALS[m]}</button>`).join('')}</div>
    <div class="row"><span>Portionen</span><div class="stepper"><button type="button" class="icon sm" data-a="pickServ" data-d="-1">−</button><b>${p.servings}</b><button type="button" class="icon sm" data-a="pickServ" data-d="1">+</button></div></div>
    <div class="chips"><button type="button" class="chip-btn ${!p.mine ? 'on' : ''}" data-a="pickMine" data-v="">Alle Rezepte</button><button type="button" class="chip-btn ${p.mine ? 'on' : ''}" data-a="pickMine" data-v="1">Nur meine</button></div>
    <div class="search"><input type="search" placeholder="Suchen" value="${esc(p.q)}" data-c="pickSearch"></div>
    <div id="pickList">${pickerList()}</div>`);
}
function addEntry(day, rid, meal, servings) {
  (db.plan[day] = db.plan[day] || []).push({ id: uid(), rid, meal, servings });
  save();
}

// ---------- Ansicht: Einkauf ----------
function viewShop() {
  const items = shoppingItems();
  const home = items.filter((i) => db.shop.home[i.key]), rest = items.filter((i) => !db.shop.home[i.key]);
  const row = (it) => `<div class="row shop ${db.shop.checked[it.key] ? 'done' : ''}"><button type="button" class="ex-row sitem" data-a="checkItem" data-k="${esc(it.key)}"><span class="box">${db.shop.checked[it.key] ? '✓' : ''}</span><span class="stext"><b>${esc(itemText(it))}</b><span class="from">${esc([...it.from].join(', '))}</span></span></button><button type="button" class="btn small" data-a="homeItem" data-k="${esc(it.key)}">Hab ich</button></div>`;
  const groups = SECTIONS.map((s) => { const l = rest.filter((i) => i.sec === s); return l.length ? `<div class="card list">${cardHead(SEC_ICO[s][0], `sm ${SEC_ICO[s][1]}`, s, `${l.filter((i) => !db.shop.checked[i.key]).length} offen`)}${l.map(row).join('')}</div>` : ''; }).join('');
  const extra = db.shop.extra.map((x) => `<div class="row shop ${x.done ? 'done' : ''}"><button type="button" class="ex-row sitem" data-a="checkExtra" data-id="${x.id}"><span class="box">${x.done ? '✓' : ''}</span><b>${esc(x.text)}</b></button><button type="button" class="icon sm" data-a="delExtra" data-id="${x.id}" aria-label="Entfernen">✕</button></div>`).join('');
  const singles = db.shop.recipes.map((s, i) => { const r = byId(s.rid); return r ? `<div class="row"><span>${esc(r.name)} <span class="small muted">· ${s.servings} P.</span></span><button type="button" class="icon sm" data-a="delShopRecipe" data-i="${i}" aria-label="Entfernen">✕</button></div>` : ''; }).join('');
  const open = rest.filter((i) => !db.shop.checked[i.key]).length + db.shop.extra.filter((x) => !x.done).length;
  const total = rest.length + db.shop.extra.length, done = total - open;
  const progress = total ? `<div class="card progress-card"><div class="row"><div><b class="big">${done} von ${total}</b><span class="small muted"> erledigt</span></div>${ico('cart', 'sm')}</div>
    <div class="bar"><i style="width:${Math.round((done / total) * 100)}%"></i></div><p class="small muted">Aus dem Wochenplan${db.shop.recipes.length ? ' und einzelnen Rezepten' : ''}${home.length ? ` · ${home.length} schon zu Hause` : ''}</p></div>` : '';
  return `${header('Einkaufsliste')}${weekNav()}
    ${items.length || db.shop.extra.length ? progress : `<p class="empty">Noch nichts auf der Liste.<br>Plane Gerichte im Wochenplan oder tippe bei einem Rezept auf „Auf Einkaufsliste“.</p>`}
    ${groups}
    <div class="card">${cardHead('pen', 'sm plum', 'Eigene Einträge')}${extra ? `<div class="list">${extra}</div>` : ''}
      <div class="addrow"><input id="extraIn" placeholder="z. B. Spülmittel" enterkeyhint="done" data-k="extra"><button type="button" class="btn small primary" data-a="addExtra">Hinzufügen</button></div></div>
    ${home.length ? `<div class="card list">${cardHead('bag', 'sm', 'Schon zu Hause')}${home.map((it) => `<div class="row shop done"><span><b>${esc(itemText(it))}</b></span><button type="button" class="btn small" data-a="homeItem" data-k="${esc(it.key)}">Doch kaufen</button></div>`).join('')}</div>` : ''}
    ${singles ? `<div class="card list">${cardHead('bowl', 'sm orange', 'Zusätzliche Rezepte')}${singles}</div>` : ''}
    ${items.length || db.shop.extra.length ? `<div class="btnrow"><button type="button" class="btn" data-a="shareShop">Liste teilen</button><button type="button" class="btn" data-a="resetShop">Neu beginnen</button></div>` : ''}`;
}

// ---------- Ansicht: Neu ----------
function viewNew() {
  const i = ui.idea;
  const c = (a, on, label, data) => `<button type="button" class="chip-btn ${on ? 'on' : ''}" data-a="${a}" ${data}>${label}</button>`;
  return `${header('Neues Rezept')}
    <div class="card">${cardHead('camera', 'gold', 'Rezept aus einem Foto', 'Mengen werden automatisch erkannt')}
      <ol class="how"><li>Tippe auf „Anfrage kopieren“.</li><li>Öffne die Claude-App, füge die Anfrage ins Textfeld ein und hänge das Foto an (über das + oder die Büroklammer).</li><li>Kopiere Claudes Antwort und füge sie hier unter „Antwort einfügen“ ein.</li></ol>
      <div class="btnrow"><button type="button" class="btn primary" data-a="copyPrompt" data-p="photo">Anfrage kopieren</button><a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Claude öffnen</a></div></div>
    <div class="card">${cardHead('bulb', 'blue', 'Neue Ideen von Claude', 'Passend zu deinem Geschmack')}
      <p class="small muted">Mahlzeit</p><div class="chips">${c('ideaMeal', !i.meal, 'Egal', 'data-m=""')}${SLOTS.map((m) => c('ideaMeal', i.meal === m, MEALS[m], `data-m="${m}"`)).join('')}${c('ideaMeal', i.meal === 'mealprep', 'Meal Prep', 'data-m="mealprep"')}</div>
      <p class="small muted">Zeit</p><div class="chips">${[[20, '≤ 20 Min'], [30, '≤ 30 Min'], [45, '≤ 45 Min'], [0, 'egal']].map(([t, l]) => c('ideaTime', i.time === t, l, `data-t="${t}"`)).join('')}</div>
      <p class="small muted">Wie viele?</p><div class="chips">${[1, 3, 5].map((n) => c('ideaCount', i.count === n, n, `data-n="${n}"`)).join('')}</div>
      <label class="field"><span>Wunsch (optional)</span><input value="${esc(i.wish)}" placeholder="z. B. mit Kichererbsen, etwas Herbstliches" data-c="ideaWish"></label>
      <div class="btnrow"><button type="button" class="btn primary" data-a="copyPrompt" data-p="idea">Anfrage kopieren</button><a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Claude öffnen</a></div></div>
    <div class="card list">
      <button type="button" class="rrow" data-a="openImport">${ico('paste', 'sm')}<span class="rmain"><b>Antwort von Claude einfügen</b><span class="meta">Rezept aus Foto oder Ideen speichern</span></span><span class="chev">›</span></button>
      <button type="button" class="rrow" data-a="newRecipe">${ico('pen', 'sm plum')}<span class="rmain"><b>Rezept selbst eintippen</b><span class="meta">Zutaten und Schritte von Hand</span></span><span class="chev">›</span></button>
    </div>`;
}

function viewImport() {
  const found = ui.importFound;
  return `${header('Antwort einfügen', 'closeView')}
    <div class="card"><p class="small muted">Füge hier die komplette Antwort von Claude ein. Die App erkennt Name, Zutaten mit Mengen und Schritte automatisch.</p>
      <button type="button" class="btn" data-a="pasteClip">Aus Zwischenablage einfügen</button>
      <label class="field"><textarea rows="9" data-c="importText" placeholder="REZEPT: …">${esc(ui.importText)}</textarea></label>
      <button type="button" class="btn primary" data-a="parseImport">Einlesen</button></div>
    ${found ? (found.length ? `<div class="card"><h2>${found.length === 1 ? '1 Rezept gefunden' : `${found.length} Rezepte gefunden`}</h2>
      ${found.map((r, k) => `<label class="pickrow"><input type="checkbox" data-c="importPick" data-k="${k}" ${r.keep !== false ? 'checked' : ''}><span><b>${esc(r.name)}</b><br><span class="small muted">${r.ing.length} Zutaten · ${r.steps.length} Schritte${r.time ? ` · ${r.time} Min` : ''}${r.protein ? ` · ${r.protein} g Protein` : ''}</span></span></label>`).join('')}
      <button type="button" class="btn primary" data-a="saveImport">Ausgewählte speichern</button></div>`
      : '<p class="empty">Kein Rezept erkannt. Hat Claude das Format mit „REZEPT:“, „ZUTATEN:“ und „SCHRITTE:“ benutzt? Sonst schreib Claude einfach: „Bitte genau im vorgegebenen Format.“</p>') : ''}`;
}

// ---------- Ansicht: Mehr ----------
function viewMore() {
  const own = db.recipes.length;
  return `${header('Mehr')}
    <div class="card">${cardHead('user', '', 'Mein Profil')}
      <div class="row"><span>Standard-Portionen</span><div class="stepper"><button type="button" class="icon sm" data-a="profServ" data-d="-1">−</button><b>${db.profile.servings}</b><button type="button" class="icon sm" data-a="profServ" data-d="1">+</button></div></div>
      <label class="field"><span>Mag ich nicht / vertrage ich nicht (für Claudes Ideen)</span><textarea rows="2" data-c="avoid">${esc(db.profile.avoid)}</textarea></label></div>
    <div class="card">${cardHead('save', 'blue', 'Daten sichern')}
      <p class="small muted">Alles ist nur auf diesem iPhone gespeichert (${own} eigene ${own === 1 ? 'Rezept' : 'Rezepte'}). Sichere ab und zu eine Datei, z. B. in iCloud Drive.${db.lastBackup ? ` Letzte Sicherung: ${new Date(db.lastBackup).toLocaleDateString('de-DE')}.` : ''}</p>
      <button type="button" class="btn" data-a="exportJson">Daten sichern</button>
      <label class="btn">Sicherung laden<input type="file" accept="application/json,.json" data-c="importJson" hidden></label></div>
    <div class="card">${cardHead('phone', 'gold', 'Als App installieren')}<p class="small">In Safari unten auf <b>Teilen</b> tippen, dann <b>Zum Home-Bildschirm</b>. Danach funktioniert die App auch offline.</p></div>
    <div class="card">${cardHead('info', 'plum', 'Hinweis')}<p class="small muted">Protein und Ballaststoffe sind grobe Schätzungen pro Portion und nur zur Orientierung gedacht.</p></div>
    <button type="button" class="link danger" data-a="wipe">Alle Daten löschen</button>`;
}

// ---------- Modal, Toast, Zwischenablage ----------
function modal(html) { $('#modal').innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><button type="button" class="close" data-a="closeModal" aria-label="Schließen">✕</button>${html}</div>`; $('#modal').hidden = false; document.body.classList.add('noscroll'); }
function closeModal() { const r = ui.ask; ui.ask = null; r?.(false); $('#modal').hidden = true; $('#modal').innerHTML = ''; document.body.classList.remove('noscroll'); ui.pick = null; }
function ask(msg, ok = 'Ja') {
  return new Promise((resolve) => {
    modal(`<p class="ask">${esc(msg)}</p><div class="btnrow"><button type="button" class="btn" data-a="askNo">Abbrechen</button><button type="button" class="btn primary" data-a="askYes">${esc(ok)}</button></div>`);
    ui.ask = resolve;
  });
}
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2600); }
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch (e) { modal(`<h2>Bitte kopieren</h2><p class="small muted">Text antippen, „Alles auswählen“ und „Kopieren“.</p><textarea rows="10" readonly>${esc(text)}</textarea>`); }
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function dayChoices() {
  return Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
}

// ---------- Aktionen ----------
const cur = () => byId(ui.view?.id);
const A = {
  tab: (d) => go(d.tab),
  closeView: () => { ui.view = ui.view?.from || null; render(); window.scrollTo(0, 0); },
  closeModal,
  askYes: () => { const r = ui.ask; ui.ask = null; closeModal(); r?.(true); },
  askNo: () => closeModal(),
  // Rezepte
  fMeal: (d) => { ui.f.meal = d.m; render(); },
  fTime: (d) => { ui.f.time = ui.f.time === +d.t ? 0 : +d.t; render(); },
  fToggle: (d) => { ui.f[d.k] = !ui.f[d.k]; render(); },
  openRecipe: (d) => open({ name: 'recipe', id: d.id }),
  servings: (d) => { const r = cur(); ui.view.servings = Math.max(1, (ui.view.servings || r.servings) + +d.d); render(); },
  fav: () => { const id = ui.view.id; db.meta[id] = { ...metaOf(id), fav: !metaOf(id).fav }; save(); render(); },
  rate: (d) => { const id = ui.view.id, n = +d.n; db.meta[id] = { ...metaOf(id), rating: metaOf(id).rating === n ? 0 : n }; save(); render(); },
  newRecipe: () => open({ name: 'form' }),
  editRecipe: () => open({ name: 'form', id: ui.view.id }),
  copyRecipe: () => {
    const r = cur(); const copy = { ...structuredClone({ ...r, ing: undefined }), id: 'eigen-' + uid(), source: 'eigen', name: r.name };
    db.recipes.unshift(copy); db.meta[copy.id] = { ...metaOf(r.id) }; save();
    ui.view = { name: 'form', id: copy.id, from: { name: 'recipe', id: copy.id, from: ui.view.from } }; render(); window.scrollTo(0, 0);
  },
  delRecipe: async () => {
    const id = ui.view.id;
    if (!(await ask('Rezept wirklich löschen? Es wird auch aus dem Wochenplan entfernt.', 'Löschen'))) return;
    db.recipes = db.recipes.filter((r) => r.id !== id);
    Object.keys(db.plan).forEach((k) => { db.plan[k] = db.plan[k].filter((e) => e.rid !== id); });
    db.shop.recipes = db.shop.recipes.filter((s) => s.rid !== id);
    delete db.meta[id]; save(); toast('Rezept gelöscht'); go('rezepte');
  },
  saveRecipe: () => {
    const f = $('#rForm'), g = (n) => f.elements[n].value.trim();
    if (!g('name')) return toast('Bitte einen Namen eingeben');
    const ing = g('ing').split('\n').map((x) => x.trim()).filter(Boolean);
    if (!ing.length) return toast('Bitte mindestens eine Zutat eingeben');
    const meals = [...f.querySelectorAll('input[name="meals"]:checked')].map((x) => x.value);
    const data = { name: g('name'), meals: meals.length ? meals : ['abend'], time: Math.round(num(g('time'))) || null, servings: Math.max(1, Math.round(num(g('servings')) || 1)),
      protein: num(g('protein')), fiber: num(g('fiber')), veg: f.elements.veg.checked, ingredients: ing.map(parseIng),
      steps: g('steps').split('\n').map((x) => x.trim().replace(/^\d+[.)]\s*/, '')).filter(Boolean), note: g('note') };
    let id = ui.view.id;
    if (id) Object.assign(db.recipes.find((r) => r.id === id), data);
    else { id = 'eigen-' + uid(); db.recipes.unshift({ id, source: 'eigen', created: new Date().toISOString(), ...data }); }
    save(); toast('Rezept gespeichert');
    ui.view = ui.view.id && ui.view.from?.name === 'recipe' ? ui.view.from : { name: 'recipe', id, from: null };
    render(); window.scrollTo(0, 0);
  },
  toPlan: () => {
    const r = cur();
    ui.pick = { rid: r.id, servings: ui.view.servings || db.profile.servings, meal: SLOTS.find((m) => fitsSlot(r, m)) || 'abend', day: dayKey(new Date()) };
    A.renderToPlan();
  },
  renderToPlan: () => {
    const p = ui.pick;
    modal(`<h2>Zum Wochenplan</h2><p class="small muted">Tag</p>
      <div class="chips">${dayChoices().map((d) => `<button type="button" class="chip-btn ${p.day === dayKey(d) ? 'on' : ''}" data-a="tpDay" data-k="${dayKey(d)}">${['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()]} ${d.getDate()}.</button>`).join('')}</div>
      <p class="small muted">Mahlzeit</p><div class="chips">${SLOTS.map((m) => `<button type="button" class="chip-btn ${p.meal === m ? 'on' : ''}" data-a="tpMeal" data-m="${m}">${MEALS[m]}</button>`).join('')}</div>
      <div class="row"><span>Portionen</span><div class="stepper"><button type="button" class="icon sm" data-a="tpServ" data-d="-1">−</button><b>${p.servings}</b><button type="button" class="icon sm" data-a="tpServ" data-d="1">+</button></div></div>
      <button type="button" class="btn primary" data-a="tpSave">Eintragen</button>`);
  },
  tpDay: (d) => { ui.pick.day = d.k; A.renderToPlan(); },
  tpMeal: (d) => { ui.pick.meal = d.m; A.renderToPlan(); },
  tpServ: (d) => { ui.pick.servings = Math.max(1, ui.pick.servings + +d.d); A.renderToPlan(); },
  tpSave: () => { const p = ui.pick; addEntry(p.day, p.rid, p.meal, p.servings); closeModal(); toast('Im Wochenplan eingetragen'); },
  toShop: () => { const r = cur(); db.shop.recipes.push({ rid: r.id, servings: ui.view.servings || r.servings }); save(); toast('Zutaten auf der Einkaufsliste'); },
  // Kochmodus
  cook: () => { open({ name: 'cook', id: ui.view.id, servings: ui.view.servings, step: 0, done: {} }); keepAwake(true); },
  closeCook: () => { keepAwake(false); A.closeView(); },
  cookStep: (d) => { ui.view.step = Math.max(0, ui.view.step + +d.d); render(); window.scrollTo(0, 0); },
  ingDone: (d) => { ui.view.done[d.k] = !ui.view.done[d.k]; render(); },
  timerStart: (d) => startTimer(+d.m),
  timerAdd: () => { if (ui.timer) { ui.timer.end += 60000; ui.timer.min += 1; updateTimer(); } },
  timerStop: () => { ui.timer = null; updateTimer(); },
  timerMenu: () => modal(`<h2>Timer stellen</h2><div class="chips">${[1, 3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 45].map((m) => `<button type="button" class="chip-btn" data-a="timerPick" data-m="${m}">${m} Min</button>`).join('')}</div>`),
  timerPick: (d) => { closeModal(); startTimer(+d.m); },
  // Woche
  week: (d) => { ui.weekOff += +d.d; render(); },
  addToDay: (d) => openDayPicker(d.day),
  pickMeal: (d) => { ui.pick.meal = d.m; renderPicker(); },
  pickServ: (d) => { ui.pick.servings = Math.max(1, ui.pick.servings + +d.d); renderPicker(); },
  pickMine: (d) => { ui.pick.mine = !!d.v; renderPicker(); },
  pickRecipe: (d) => { const p = ui.pick; addEntry(p.day, d.id, p.meal, p.servings); closeModal(); render(); toast('Eingetragen'); },
  openEntry: (d) => { const e = (db.plan[d.day] || []).find((x) => x.id === d.e); if (e && byId(e.rid)) open({ name: 'recipe', id: e.rid, servings: e.servings }); },
  delEntry: (d) => { db.plan[d.day] = (db.plan[d.day] || []).filter((x) => x.id !== d.e); save(); render(); },
  clearWeek: async () => {
    if (!(await ask('Alle Gerichte dieser Woche entfernen?', 'Leeren'))) return;
    weekDays(ui.weekOff).forEach((d) => delete db.plan[dayKey(d)]); save(); render();
  },
  autoFill: () => { ui.fill = ui.fill || { meals: ['mittag', 'abend'], mine: false, servings: db.profile.servings }; A.renderFill(); },
  renderFill: () => {
    const p = ui.fill;
    modal(`<h2>Woche automatisch füllen</h2><p class="small muted">Leere Plätze werden mit passenden Rezepten gefüllt. Schon Geplantes bleibt.</p>
      <p class="small muted">Welche Mahlzeiten?</p><div class="chips">${SLOTS.map((m) => `<button type="button" class="chip-btn ${p.meals.includes(m) ? 'on' : ''}" data-a="fillMeal" data-m="${m}">${MEALS[m]}</button>`).join('')}</div>
      <p class="small muted">Welche Rezepte?</p><div class="chips"><button type="button" class="chip-btn ${p.mine ? 'on' : ''}" data-a="fillMine" data-v="1">Nur meine</button><button type="button" class="chip-btn ${!p.mine ? 'on' : ''}" data-a="fillMine" data-v="">Meine + Vorschläge</button></div>
      <div class="row"><span>Portionen</span><div class="stepper"><button type="button" class="icon sm" data-a="fillServ" data-d="-1">−</button><b>${p.servings}</b><button type="button" class="icon sm" data-a="fillServ" data-d="1">+</button></div></div>
      <button type="button" class="btn primary" data-a="doFill">Füllen</button>`);
  },
  fillMeal: (d) => { const m = ui.fill.meals; ui.fill.meals = m.includes(d.m) ? m.filter((x) => x !== d.m) : m.concat(d.m); A.renderFill(); },
  fillMine: (d) => { ui.fill.mine = !!d.v; A.renderFill(); },
  fillServ: (d) => { ui.fill.servings = Math.max(1, ui.fill.servings + +d.d); A.renderFill(); },
  doFill: () => {
    const p = ui.fill; if (!p.meals.length) return toast('Bitte mindestens eine Mahlzeit wählen');
    const used = new Set(weekEntries(ui.weekOff).map((e) => e.rid));
    let added = 0, missing = false;
    const today = dayKey(new Date());
    for (const d of weekDays(ui.weekOff)) {
      const k = dayKey(d);
      if (k < today) continue;
      for (const meal of p.meals) {
        if ((db.plan[k] || []).some((e) => e.meal === meal)) continue;
        const pool = allRecipes().filter((r) => fitsSlot(r, meal) && (!p.mine || r.source !== 'app'));
        if (!pool.length) { missing = true; continue; }
        const fresh = pool.filter((r) => !used.has(r.id));
        // Favoriten und gut bewertete Rezepte kommen etwas häufiger dran
        const bag = (fresh.length ? fresh : pool).flatMap((r) => Array(1 + (metaOf(r.id).fav ? 2 : 0) + Math.max(0, (metaOf(r.id).rating || 0) - 3)).fill(r));
        const r = bag[Math.floor(Math.random() * bag.length)];
        used.add(r.id); addEntry(k, r.id, meal, p.servings); added++;
      }
    }
    closeModal(); render();
    toast(added ? `${added} Gerichte eingetragen` : missing ? 'Keine passenden eigenen Rezepte gefunden' : 'Die Woche ist schon voll');
  },
  // Einkauf
  checkItem: (d) => { db.shop.checked[d.k] = !db.shop.checked[d.k]; save(); render(); },
  homeItem: (d) => { if (db.shop.home[d.k]) delete db.shop.home[d.k]; else db.shop.home[d.k] = true; save(); render(); },
  addExtra: () => { const el = $('#extraIn'); const t = el.value.trim(); if (!t) return; db.shop.extra.push({ id: uid(), text: t, done: false }); save(); render(); $('#extraIn')?.focus(); },
  checkExtra: (d) => { const x = db.shop.extra.find((e) => e.id === d.id); x.done = !x.done; save(); render(); },
  delExtra: (d) => { db.shop.extra = db.shop.extra.filter((e) => e.id !== d.id); save(); render(); },
  delShopRecipe: (d) => { db.shop.recipes.splice(+d.i, 1); save(); render(); },
  shareShop: async () => {
    const items = shoppingItems().filter((i) => !db.shop.home[i.key] && !db.shop.checked[i.key]);
    const lines = SECTIONS.flatMap((s) => { const l = items.filter((i) => i.sec === s); return l.length ? [`${s}:`, ...l.map((i) => `- ${itemText(i)}`), ''] : []; });
    const ex = db.shop.extra.filter((x) => !x.done).map((x) => `- ${x.text}`);
    const text = ['Einkaufsliste', '', ...lines, ...(ex.length ? ['Sonstiges:', ...ex] : [])].join('\n').trim();
    if (navigator.share) { try { await navigator.share({ text }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    copyText(text, 'Liste kopiert');
  },
  resetShop: async () => {
    if (!(await ask('Neue Einkaufsliste beginnen? Haken, „Hab ich“-Markierungen, eigene Einträge und zusätzliche Rezepte werden entfernt. Der Wochenplan bleibt.', 'Neu beginnen'))) return;
    db.shop = { checked: {}, home: {}, extra: [], recipes: [] }; save(); render();
  },
  // Neu & Import
  ideaMeal: (d) => { ui.idea.meal = d.m; render(); },
  ideaTime: (d) => { ui.idea.time = +d.t; render(); },
  ideaCount: (d) => { ui.idea.count = +d.n; render(); },
  copyPrompt: (d) => { ui.importSource = d.p === 'photo' ? 'eigen' : 'claude'; copyText(d.p === 'photo' ? photoPrompt() : ideaPrompt(), 'Anfrage kopiert. Jetzt in Claude einfügen.'); },
  openImport: () => { ui.importFound = null; open({ name: 'import' }); },
  pasteClip: async () => {
    try { ui.importText = await navigator.clipboard.readText(); ui.importFound = null; render(); if (ui.importText.trim()) A.parseImport(); }
    catch (e) { toast('Bitte lange ins Feld tippen und „Einsetzen“ wählen'); }
  },
  parseImport: () => { ui.importFound = parseClaude(ui.importText); render(); },
  saveImport: () => {
    const keep = (ui.importFound || []).filter((r) => r.keep !== false);
    if (!keep.length) return toast('Nichts ausgewählt');
    const saved = keep.map((p) => fromParsed(p, ui.importSource));
    db.recipes.unshift(...saved); save();
    ui.importText = ''; ui.importFound = null;
    toast(saved.length === 1 ? 'Rezept gespeichert' : `${saved.length} Rezepte gespeichert`);
    if (saved.length === 1) { ui.tab = 'rezepte'; ui.view = { name: 'recipe', id: saved[0].id, from: null }; render(); window.scrollTo(0, 0); }
    else { ui.f = { meal: '', time: 0, veg: false, fav: false, mine: true }; ui.q = ''; go('rezepte'); }
  },
  // Mehr
  profServ: (d) => { db.profile.servings = Math.max(1, db.profile.servings + +d.d); save(); render(); },
  exportJson: () => {
    db.lastBackup = new Date().toISOString(); save();
    download(`rezepte-backup-${dayKey(new Date())}.json`, JSON.stringify(db, null, 1), 'application/json');
    render();
  },
  wipe: async () => {
    if (!(await ask('Wirklich ALLE Daten löschen (eigene Rezepte, Wochenplan, Einkaufsliste)? Tipp: vorher „Daten sichern“.', 'Alles löschen'))) return;
    db = EMPTY(); save(); go('rezepte');
  },
};

// Eingaben
const C = {
  search: (d, el) => { ui.q = el.value; $('#rlist').innerHTML = recipeList(); },
  pickSearch: (d, el) => { ui.pick.q = el.value; $('#pickList').innerHTML = pickerList(); },
  ideaWish: (d, el) => { ui.idea.wish = el.value; },
  importText: (d, el) => { ui.importText = el.value; },
  importPick: (d, el) => { ui.importFound[+d.k].keep = el.checked; },
  avoid: (d, el) => { db.profile.avoid = el.value; save(); },
  importJson: (d, el) => {
    const file = el.files[0]; if (!file) return;
    file.text().then(async (t) => {
      const data = JSON.parse(t);
      if (data?.v !== 1 || !Array.isArray(data.recipes)) throw new Error();
      if (!(await ask(`Sicherung mit ${data.recipes.length} eigenen Rezepten laden? Deine aktuellen Daten werden ersetzt.`, 'Laden'))) return;
      db = Object.assign(EMPTY(), data); save(); toast('Daten wiederhergestellt'); go('rezepte');
    }).catch(() => toast('Datei konnte nicht gelesen werden'));
  },
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-a]');
  if (t && A[t.dataset.a]) { if (t.tagName !== 'A') e.preventDefault(); A[t.dataset.a](t.dataset, t); return; }
  if (e.target.id === 'modal') closeModal();
});
const onInput = (e) => { const t = e.target.closest('[data-c]'); if (t && C[t.dataset.c]) C[t.dataset.c](t.dataset, t); };
document.addEventListener('input', (e) => { if (e.target.type !== 'checkbox' && e.target.type !== 'file') onInput(e); });
document.addEventListener('change', (e) => { if (e.target.type === 'checkbox' || e.target.type === 'file') onInput(e); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
  if (e.key === 'Enter' && e.target.id === 'extraIn') { e.preventDefault(); A.addExtra(); }
});

window.addEventListener('scroll', () => document.body.classList.toggle('scrolled', window.scrollY > 8), { passive: true });

// ---------- Start ----------
render();
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
