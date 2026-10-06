// Shared decorative artwork: same pixels and sizing, native offscreen loading.
// Used by both the Astro footer and the compatibility transform for released HTML.
export const FOOTER_ART_CSS = `.portal-footer-art--lazy{position:relative;isolation:isolate;overflow:hidden;background-image:none!important}.portal-footer-art--lazy>.portal-footer-art-image{position:absolute;z-index:-1;inset:0;width:100%;height:100%;max-width:none;object-fit:fill;pointer-events:none}@media(max-width:600px){.portal-footer-art--lazy>.portal-footer-art-image{width:auto;height:100%;max-width:none}}`;
export const FOOTER_ART_STYLE = `<style data-pinnacle-footer-art>${FOOTER_ART_CSS}</style>`;
export function footerArtImage(src) {
  if (!/^\/pinnacle-pages-assets\/portal-footer-shapes\.[\w.-]+\.webp$/.test(src)) return '';
  return `<img class="portal-footer-art-image" src="${src}" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low">`;
}
