// Existing call-wrapper policy, shared with the registered public-page delivery.
function augmentDirective(csp, directive, sources) {
  const parts = csp.split(";").map((part) => part.trim()).filter(Boolean);
  const index = parts.findIndex((part) => part === directive || part.startsWith(`${directive} `));
  if (index < 0) {
    parts.push(`${directive} ${sources.join(" ")}`);
  } else {
    const existing = new Set(parts[index].split(/\s+/));
    for (const source of sources) existing.add(source);
    parts[index] = [...existing].join(" ");
  }
  return `${parts.join("; ")};`;
}
export function augmentCsp(headers) {
  const csp = headers.get("content-security-policy");
  if (!csp) return;
  let next = augmentDirective(csp, "script-src", [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://googleads.g.doubleclick.net"
  ]);
  if (/(?:^|;)\s*script-src-elem(?:\s|;)/i.test(next)) {
    next = augmentDirective(next, "script-src-elem", [
      "https://www.googletagmanager.com",
      "https://www.googleadservices.com",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://googleads.g.doubleclick.net"
    ]);
  }
  next = augmentDirective(next, "img-src", [
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://www.google.co.in"
  ]);
  next = augmentDirective(next, "connect-src", [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://pagead2.googlesyndication.com",
    "https://www.google.com",
    "https://www.google.co.in",
    "https://ad.doubleclick.net",
    "https://*.google-analytics.com"
  ]);
  next = augmentDirective(next, "frame-src", ["https://www.googletagmanager.com"]);
  headers.set("content-security-policy", next);
}
