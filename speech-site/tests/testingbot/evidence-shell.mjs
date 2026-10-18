// Verify's approved evidence navigation varies by document family.
// This function runs in WebDriver and isolated browser fixtures.
export function evidenceShell(document, pathname) {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer.evidence-footer');
  if (!footer) return false;
  const footerLinks = [...footer.querySelectorAll('a')].map(a => a.href);
  const origin = 'https://www.pinnacleblooms.org';
  const footerComplete = footerLinks.length >= 31 &&
    [origin + '/', 'tel:+919100181181', origin + '/verify/evidence/cite.html', origin + '/verify/evidence/privacy.html'].every(href => footerLinks.includes(href));
  if (!footerComplete) return false;
  if (pathname === '/verify/evidence/dataset-reuse-v1.html') {
    const breadcrumb = document.querySelector('main > p:first-of-type');
    const urls = [...(breadcrumb?.querySelectorAll('a') || [])].map(a => a.href);
    return urls.length === 2 && urls.includes(origin + '/verify/') && urls.includes(origin + '/verify/evidence/cite.html');
  }
  if (!header) return false;
  const links = [...header.querySelectorAll('a')];
  if (links.length >= 4) return true; // Established complete-header contract retained.
  const urls = links.map(a => a.href);
  if (pathname === '/verify/evidence/pinnacle-paradigm-shift.html') {
    const brand = header.querySelector('img.brand-header');
    return !!brand && /^https:\/\/www\.pinnacleblooms\.org\/verify\/images\/paradigm-finale\/brand-header-\d+\.webp$/.test(brand.src) &&
      urls.includes(origin + '/verify/') && urls.includes('tel:+919100181181');
  }
  const recordDocuments = new Set([
    'assurance-map', 'centre-entity-reference', 'cite', 'claim-ledger',
    'evidence-register', 'global-context', 'hfr-register',
    'hyderabad-telangana-andhra-pradesh-contact', 'organisation-profile',
    'pinnacleai-regulatory-journey', 'privacy',
    'recognition-register', 'research-library', 'scale-register', 'scale-and-mission'
  ]);
  const chapterDocuments = new Set([
    '01-life-in-view', '02-shared-starting-point', '03-plan-with-a-memory',
    '04-one-shared-direction', '05-practice-in-everyday-life',
    '06-feedback-that-shapes-care', '07-skills-with-a-purpose',
    '08-review-and-reassess', '09-independence-and-belonging'
  ]);
  const direct = pathname.match(/^\/verify\/evidence\/([^/]+)\.html$/)?.[1];
  const chapter = pathname.match(/^\/verify\/evidence\/paradigm\/([^/]+)\.html$/)?.[1];
  const compactRecords = /^\/verify\/evidence\/(?:records|publications)\/[^/]+\.html$/.test(pathname) || recordDocuments.has(direct) || chapterDocuments.has(chapter);
  const familyGuide = /^\/verify\/guides\/(?:te\/|hi\/)?(?:abilityscore|everyday-practice|licences-and-scope)\.html$/.test(pathname);
  const studyIndex = pathname === '/verify/evidence/study-index.html';
  const district = pathname === '/verify/evidence/district-register.html';
  if (!compactRecords && !familyGuide && !studyIndex && !district) return false;
  const section = district ? 'district-register' : pathname === '/verify/evidence/recognition-register.html' ? 'appreciations' : studyIndex ? 'study-portfolio' : 'records';
  return urls.includes(origin + '/verify/') && urls.includes(origin + '/verify/#' + section);
}
