// Verify's child documents intentionally use a compact parent/section header.
// This same function runs in WebDriver and isolated local browser fixtures.
export function evidenceShell(document, pathname) {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer.evidence-footer');
  if (!header || !footer) return false;
  const links = [...header.querySelectorAll('a')];
  if (!pathname.startsWith('/verify/evidence/')) return links.length >= 4;
  const urls = links.map(a => a.href);
  const section = pathname === '/verify/evidence/recognition-register.html' ? 'appreciations' : 'records';
  return urls.includes('https://www.pinnacleblooms.org/verify/') &&
    urls.includes('https://www.pinnacleblooms.org/verify/#' + section) &&
    footer.querySelectorAll('a').length >= 4;
}
