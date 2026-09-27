import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.pinnacleblooms.org',
  output: 'static',
  trailingSlash: 'never',
  build: { assets: 'pinnacle-pages-assets', format: 'file' }
});
