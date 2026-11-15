// Generates labelled placeholder images for every image path referenced in
// src/content that doesn't exist yet. Real images uploaded via Keystatic
// simply replace them. Run: npm run placeholders
import { readFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const contentDir = join(root, 'src/content');

const sizes = {
  flyer: [1080, 1350],
  portrait: [1200, 1500],
  logo: [800, 800],
  hero: [2400, 1400],
  cover: [1600, 1000],
  photo: [1600, 1066],
};
const palette = ['#2b2a33', '#5b3a5e', '#1f4d4a', '#6b4b2a', '#33415c', '#5c2a2a'];

const files = readdirSync(contentDir, { recursive: true })
  .map(String)
  .filter((f) => /\.(ya?ml|mdoc)$/.test(f))
  .map((f) => join(contentDir, f));

let made = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const [, ref] of text.matchAll(/["']?(\.\.\/[^\s"']+\.(?:png|jpe?g|webp))["']?/g)) {
    const target = resolve(dirname(file), ref);
    if (existsSync(target)) continue;
    const kind = Object.keys(sizes).find((k) => target.includes(k)) ?? 'photo';
    const [w, h] = sizes[kind];
    const label = ref.split('/').slice(-3).join(' / ').replace(/\.\w+$/, '');
    const bg = palette[[...label].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="${bg}"/>
      <g fill="none" stroke="#ffffff22" stroke-width="2">
        ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${(h / 12) * i + 40} Q ${w / 4} ${(h / 12) * i - 30}, ${w / 2} ${(h / 12) * i + 40} T ${w} ${(h / 12) * i + 40}"/>`).join('')}
      </g>
      <text x="50%" y="50%" fill="#ffffffcc" font-family="sans-serif" font-size="${Math.round(w / 22)}" text-anchor="middle">PLACEHOLDER · ${kind}</text>
      <text x="50%" y="${h / 2 + w / 16}" fill="#ffffff88" font-family="sans-serif" font-size="${Math.round(w / 40)}" text-anchor="middle">${label}</text>
    </svg>`;
    mkdirSync(dirname(target), { recursive: true });
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(target);
    made++;
    console.log('created', target.replace(root + '/', ''), `(${basename(file)})`);
  }
}
console.log(`${made} placeholder image(s) created.`);
