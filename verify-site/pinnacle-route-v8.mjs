const ORIGIN = "https://pinnacle-verify.saripalli.chatgpt.site";
const PUBLIC = "https://www.pinnacleblooms.org/verify";
const PREFIX = "/verify";
export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    const isVerifyPath = incoming.pathname === PREFIX || incoming.pathname.startsWith(PREFIX + "/");
    if (!isVerifyPath) return fetch(request);
    if (incoming.pathname === PREFIX) return Response.redirect(PUBLIC + "/", 308);
    let tail = incoming.pathname.slice(PREFIX.length) || "/";
    if (tail.endsWith(".html")) tail = tail.slice(0, -5);
    const upstream = new URL(ORIGIN + tail);
    upstream.search = incoming.search;
    const headers = new Headers(request.headers);
    headers.set("Host", "pinnacle-verify.saripalli.chatgpt.site");
    headers.delete("cookie");
    headers.set("OAI-Sites-Authorization", "Bearer " + env.SITES_BYPASS_TOKEN);
    const init = { method: request.method, headers, redirect: "manual" };
    if (request.method !== "GET" && request.method !== "HEAD") init.body = request.body;
    const response = await fetch(upstream, init);
    const outputHeaders = new Headers(response.headers);
    outputHeaders.delete("content-length");
    outputHeaders.delete("location");
    outputHeaders.set("cache-control", "no-store");
    if (response.status === 200 && /^\/images\/[a-z0-9-]+\.webp$/.test(tail)) outputHeaders.set("content-type", "image/webp");
    const type = outputHeaders.get("content-type") || "";
    if (!/text\/html|text\/plain|application\/json|xml/i.test(type)) return new Response(response.body, { status: response.status, headers: outputHeaders });
    let body = await response.text();
    body = body.replaceAll(ORIGIN, PUBLIC).replaceAll('href="/', 'href="/verify/').replaceAll('src="/', 'src="/verify/').replaceAll('action="/', 'action="/verify/').replaceAll('url(/', 'url(/verify/').replaceAll('/verify/verify/', '/verify/');

    // Preserve responsive image candidates under the existing /verify/ route.
    body = body.replace(/\bsrcset="([^"]*)"/g, (_, candidates) =>
      'srcset="' + candidates.split(',').map(candidate =>
        candidate.replace(/^(\s*)\/(?!\/|verify(?:\/|$))/, '$1/verify/')
      ).join(',') + '"');
    return new Response(body, { status: response.status, headers: outputHeaders });
  }
};
