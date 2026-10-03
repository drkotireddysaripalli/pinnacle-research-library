import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
export default defineConfig({
 site:'https://pinnacleblooms.org', srcDir:'./ask-runtime', publicDir:'./ask-public', outDir:'./dist-ask',
 output:'server', trailingSlash:'ignore', session:false,
 adapter:cloudflare({configPath:'./wrangler.ask.jsonc',imageService:'cloudflare-binding'}),
 build:{assets:'ask/_assets'}, image:{endpoint:{route:'/ask/_image'}},
 vite:{plugins:[{name:'ask-shared-font-origin',enforce:'pre',transform(code,id){if(id.endsWith('.css'))return code.replaceAll("url('/pinnacle-pages-fonts/","url('https://www.pinnacleblooms.org/pinnacle-pages-fonts/");}}],build:{minify:true},ssr:{noExternal:['sanitize-html']}}
});
