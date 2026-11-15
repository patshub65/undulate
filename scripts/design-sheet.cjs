#!/usr/bin/env node
// Contact sheet comparing design variations: the first screen of each page, phone 390 at half size
// and desktop 1280 at quarter size. Adapted from Ladenkit's scripts/sketch-sheet.js.
// The sheet is the agent's at-a-glance record; the real review is live in the browser.
//
// Usage: node scripts/design-sheet.cjs <out.png> label=url [label=url ...] [--pages /,/projects/]
//   e.g. node scripts/design-sheet.cjs previews/r1.png 1-after-dark=https://design-1--site.netlify.app 2-sand=http://localhost:4322

const { chromium } = require('playwright');

(async () => {
  const args = process.argv.slice(2);
  const pi = args.indexOf('--pages');
  const pages = pi >= 0 ? args.splice(pi, 2)[1].split(',') : ['/', '/projects/bananas-or-berries/', '/projects/texture-studies/'];
  const [out, ...vs] = args;
  if (!out || !vs.length) { console.error('Usage: node scripts/design-sheet.cjs <out.png> label=url [label=url ...] [--pages /,/projects/]'); process.exit(1); }
  const variants = vs.map(v => { const i = v.indexOf('='); return { label: v.slice(0, i), base: v.slice(i + 1).replace(/\/$/, '') }; });
  const browser = await chromium.launch();
  const shot = async (base, route, width) => {
    const p = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await p.goto(base + route, { waitUntil: 'networkidle' });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const png = (await p.screenshot()).toString('base64');
    await p.close();
    return { png, overflow, width, route };
  };
  const rows = [];
  for (const v of variants) {
    const cells = [];
    for (const route of pages) for (const w of [390, 1280]) cells.push(await shot(v.base, route, w));
    rows.push({ v, cells });
    console.log(v.label, cells.map(c => `${c.route} ${c.width}: overflow ${c.overflow}`).join(' | '));
  }
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:32px;background:#e8e8e8;font:16px/24px system-ui,sans-serif;color:#111}
    h1{margin:0 0 24px;font-size:28px;line-height:40px}
    .row{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;margin-bottom:40px}
    .label{width:200px;flex:none}.label b{display:block;font-size:22px;line-height:32px}.label span{color:#555;font-size:13px;word-break:break-all}
    figure{margin:0;background:#fff;padding:8px}
    figcaption{font-size:13px;line-height:16px;margin-bottom:8px;color:#444}figcaption b{color:#b00020}
    .w390 img{width:195px;display:block}.w1280 img{width:320px;display:block}
  </style><h1>undulate · first screens · phone at half size, desktop at quarter size</h1>
  ${rows.map(({ v, cells }) => `<div class="row"><div class="label"><b>${esc(v.label)}</b><span>${esc(v.base)}</span></div>
    ${cells.map(c => `<figure class="w${c.width}"><figcaption>${esc(c.route)} ${c.width}${c.overflow > 0 ? ` <b>overflow ${c.overflow}px</b>` : ''}</figcaption><img src="data:image/png;base64,${c.png}"></figure>`).join('')}</div>`).join('')}`;
  const page = await browser.newPage({ viewport: { width: 2000, height: 800 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log(`sheet -> ${out}`);
})().catch(e => { console.error(e); process.exit(1); });
