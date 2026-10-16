// Verify's child documents intentionally use a compact parent/section header.
// This same function runs in WebDriver and isolated local browser fixtures.
export function evidenceShell(document, pathname) {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer.evidence-footer');
  if (!header || !footer) return false;
  const links = [...header.querySelectorAll('a')];
  if (links.length >= 4) return true; // Preserve the established full-header contract.
  const compactRecords = /^\/verify\/evidence\/(?:records\/|publications\/|(?:recognition-register|research-library|scale-register|scale-and-mission)\.html$)/.test(pathname);
  const familyGuide = /^\/verify\/guides\/(?:te\/|hi\/)?(?:abilityscore|everyday-practice|licences-and-scope)\.html$/.test(pathname);
  const studyIndex = pathname === '/verify/evidence/study-index.html';
  if (!compactRecords && !familyGuide && !studyIndex) return false;
  const urls = links.map(a => a.href);
  const section = pathname === '/verify/evidence/recognition-register.html' ? 'appreciations' : studyIndex ? 'study-portfolio' : 'records';
  return urls.includes('https://www.pinnacleblooms.org/verify/') &&
    urls.includes('https://www.pinnacleblooms.org/verify/#' + section) &&
    footer.querySelectorAll('a').length >= 4;
}
