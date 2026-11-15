#!/usr/bin/env node
// Mechanical checks for a design variation. Catches layout faults and broken promises, not taste.
// Adapted from Ladenkit's scripts/sketch-check.js and contact-sheet.js for this Astro site.
// Needs the site running: `npm run build && npm run preview` (or `npm run dev`).
//
// Usage: node scripts/design-check.cjs [base-url] [--only /path,/path]
// Exit code 1 if anything fails, so an agent can loop until clean.
//
// Checked per page x width (375, 1280):
//   overflow    page wider than the viewport
//   overlap     two text boxes intersect (big type running into content); pairs inside rotated elements skipped
//   edge        text closer to the left/right edge than EDGE px; text in a horizontal scroller is exempt
//   top         first text closer to the top than TOP px
//   small       text below 14px, or below 16px when longer than 40 characters
//   dash        em dash in the page text (house style: no em-dash asides)
//   thirdparty  any request to a host other than the site's own (fonts, embeds, CDNs)
//   cookies     any cookie set
//   errors      page errors
//   motion      with motion on: [data-reveal] content still hidden on screen after load, or never revealed

const { chromium } = require('playwright');

// Keep in sync with "Token system" in .claude/skills/undulate-design/SKILL.md.
const EDGE = { 375: 32, 1280: 64 };
const TOP = { 375: 40, 1280: 64 };
const PAGES = ['/', '/projects/', '/projects/bananas-are-berries/', '/projects/future-boutique/', '/projects/open-air-festival/', '/projects/company-summer-party/', '/about/', '/impressum/'];

async function check(browser, base, route, width) {
  const origin = new URL(base).host;
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [], thirdparty = new Set();
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { const h = new URL(r.url()).host; if (h && h !== origin && !r.url().startsWith('data:')) thirdparty.add(h); });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const r = await page.evaluate(({ edge, top }) => {
    const vw = innerWidth;
    const leaves = [...document.querySelectorAll('body *')].filter(e =>
      getComputedStyle(e).visibility !== 'hidden' && !e.closest('[popover]:not(:popover-open), .visually-hidden') &&
      [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const boxes = leaves.map(e => {
      const range = document.createRange(); range.selectNodeContents(e);
      // per-line boxes: a wrapped inline element's bounding box would cover its neighbours on the first line
      return { e, b: range.getBoundingClientRect(), lines: [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 24) };
    }).filter(x => x.b.width > 0 && x.b.height > 0);
    const inScroller = e => { for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
      const o = getComputedStyle(n).overflowX; if ((o === 'auto' || o === 'scroll') && n.scrollWidth > n.clientWidth) return true; } return false; };
    const tilted = e => { for (let n = e; n && n !== document.body; n = n.parentElement) {
      const m = getComputedStyle(n).transform; if (m && m !== 'none') { const v = m.match(/-?[\d.e]+/g).map(Number); if (Math.abs(v[1]) > 0.001 || Math.abs(v[2]) > 0.001) return true; } } return false; };
    boxes.forEach(x => { x.scroller = inScroller(x.e); x.tilted = tilted(x.e); });
    const out = { overflow: document.documentElement.scrollWidth - vw, overlap: [], edge: [], top: [], small: [], dash: [] };
    for (let i = 0; i < boxes.length; i++) {
      const a = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const c = boxes[j];
        if (a.e.contains(c.e) || c.e.contains(a.e) || (a.tilted && c.tilted)) continue;
        const hit = a.lines.some(p => c.lines.some(q =>
          Math.min(p.right, q.right) - Math.max(p.left, q.left) > 2 && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > 2));
        if (hit) out.overlap.push(`"${a.t}" / "${c.t}"`);
      }
      if (!a.scroller && (a.b.left < edge - 0.5 || vw - a.b.right < edge - 0.5)) out.edge.push(`"${a.t}" ${Math.round(Math.min(a.b.left, vw - a.b.right))}px`);
      const fs = parseFloat(getComputedStyle(a.e).fontSize);
      if (fs < 14 || (fs < 16 && a.t.length > 40)) out.small.push(`"${a.t}" ${fs}px`);
      if ([...a.e.childNodes].some(n => n.nodeType === 3 && n.textContent.includes('—'))) out.dash.push(`"${a.t}"`);
      a.sy = a.b.top + scrollY;
    }
    const first = boxes.reduce((m, x) => Math.min(m, x.sy), Infinity);
    if (first < top) out.top.push(`first text at ${Math.round(first)}px`);
    return out;
  }, { edge: EDGE[width], top: TOP[width] });
  r.cookies = (await ctx.cookies()).map(c => c.name);
  r.thirdparty = [...thirdparty];
  if (errors.length) r.errors = errors;
  await ctx.close();

  // motion pass: same page with motion on, as a visitor sees it
  const live = await browser.newPage({ viewport: { width, height: 844 } });
  await live.goto(base + route, { waitUntil: 'networkidle' });
  await live.waitForTimeout(1200);
  const onLoad = await live.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => {
    const b = e.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0 && b.height > 0 && !e.classList.contains('is-visible');
  }).map(e => (e.innerText || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 24)));
  // Lenis ignores scrollTo, so scroll with the wheel in steps until the real bottom
  for (let guard = 0; guard < 200; guard++) {
    await live.mouse.wheel(0, 400);
    await live.waitForTimeout(80);
    if (await live.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2)) break;
  }
  await live.waitForTimeout(1000);
  const never = await live.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => e.getBoundingClientRect().height > 0 && !e.classList.contains('is-visible') && !e.closest('details:not([open])'))
    .map(e => (e.innerText || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 24)));
  await live.close();
  r.motion = [...onLoad.map(t => `hidden on load: "${t}"`), ...never.filter(t => !onLoad.includes(t)).map(t => `never revealed: "${t}"`)];
  return r;
}

(async () => {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const only = onlyIdx >= 0 ? args.splice(onlyIdx, 2)[1].split(',') : null;
  const base = (args[0] || 'http://localhost:4321').replace(/\/$/, '');
  const browser = await chromium.launch();
  let failed = 0;
  for (const route of only || PAGES) for (const w of [375, 1280]) {
    const r = await check(browser, base, route, w);
    const faults = Object.entries(r).filter(([, v]) => (Array.isArray(v) ? v.length : v > 0));
    if (faults.length) failed++;
    console.log(`${faults.length ? 'FAIL' : 'ok  '} ${route} ${w}` +
      faults.map(([k, v]) => `\n     ${k}: ${Array.isArray(v) ? `${v.length} · ${v.slice(0, 3).join(' · ')}` : v}`).join(''));
  }
  await browser.close();
  console.log(failed ? `\n${failed} checks failed` : '\nall clean');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
