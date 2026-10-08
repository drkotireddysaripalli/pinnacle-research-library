import { repairMaterialsMedia } from './materials-media-repair.mjs';
import { repairResponse } from './repair.mjs';
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originalPath = url.pathname;
    console.log(originalPath);

    // ✅ Always allow Cloudflare internal paths
if (url.pathname.startsWith("/cdn-cgi/")) {
  return fetch(request);
}

    /* =====================================================
       2. STATIC ASSETS → PASS THROUGH
    ===================================================== */
    if (
      originalPath.startsWith("/assets/") ||
      originalPath.endsWith(".css") ||
      originalPath.endsWith(".js") ||
      originalPath.endsWith(".png") ||
      originalPath.endsWith(".jpg") ||
      originalPath.endsWith(".jpeg") ||
      originalPath.endsWith(".webp") ||
      originalPath.endsWith(".svg") ||
      originalPath.endsWith(".ico") ||
      originalPath.endsWith(".woff") ||
      originalPath.endsWith(".woff2") ||
      originalPath.endsWith(".ttf") ||
      originalPath.endsWith(".eot") ||
      originalPath === "/robots.txt" ||
      originalPath === "/sitemap.xml"
    ) {
      return fetch(request);
    }

    /* =====================================================
       1. INTERNAL FETCH? → JUST SERVE IT
       (This prevents infinite loops)
    ===================================================== */
    if (request.headers.get("x-internal-rewrite") === "1") {
      return fetch(request);
    }

    

    /* =====================================================
       3. BLOCK DIRECT USER ACCESS
    ===================================================== */
    if (
      originalPath.endsWith(".desktop.html") ||
      originalPath.endsWith(".mobile.html")
    ) {
      return new Response("Not Found", { status: 404 });
    }

    /* =====================================================
       4. DEVICE DETECTION
    ===================================================== */
    const ua = request.headers.get("user-agent") || "";
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const variant = isMobile ? "mobile" : "desktop";

    /* =====================================================
       5. NORMALIZE PATH
    ===================================================== */
    let pathname = originalPath;
    if (pathname === "/") pathname = "/index";

    /* =====================================================
       6. INTERNAL REWRITE (MARKED!)
    ===================================================== */
    const internalUrl = new URL(request.url);
    internalUrl.pathname = `${pathname}.${variant}.html`;

    const internalRequest = new Request(internalUrl.toString(), {
      headers: {
        ...Object.fromEntries(request.headers),
        "x-internal-rewrite": "1"
      }
    });

    let response = await fetch(internalRequest);

    if (!response.ok) {
      return new Response("Not Found", { status: 404 });
    }

    response = repairMaterialsMedia(request, await repairResponse(response, url));

    /* =====================================================
       7. RETURN FINAL RESPONSE
    ===================================================== */
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        "Vary": "User-Agent",
        "X-Served-Device": variant,
        "Cache-Control": "public, max-age=600"
      }
    });
  }
};
