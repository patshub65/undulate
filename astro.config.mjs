// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// The public site is fully static. Only the Keystatic admin (/keystatic)
// and its API run on demand, via the Netlify adapter.
export default defineConfig({
  site: process.env.SITE_URL || 'https://undulate.example',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), markdoc(), keystatic()],
});
