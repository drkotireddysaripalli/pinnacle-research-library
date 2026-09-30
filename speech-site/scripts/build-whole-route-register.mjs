import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Read sitemap documents only. Do not fetch individual child, staff or Ask pages,
// submit URLs, alter index eligibility, or publish the raw estate URL inventory.
const base = 'https://www.pinnacleblooms.org';
const stamp = process.argv[3] || new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('-','');
const privateDir = path.resolve('audits', `whole-portal-register-${stamp}`);
await fs.mkdir(privateDir, { recursive: true });
const checkedAt = new Date().toISOString();
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const xmlDecode = s => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const locs = xml => [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map(m => xmlDecode(m[1].trim()));
const sameEstate = u => ['www.pinnacleblooms.org', 'pinnacleblooms.org'].includes(new URL(u).hostname);
const documents = [];
const pages = new Map();
const visited = new Set();
const queue = [];
const enqueue = (url, advertisedBy) => { if (!visited.has(url)) { visited.add(url); queue.push({ url, advertisedBy }); } };
const fetchDocument = async url => {
  if (!sameEstate(url)) throw new Error('Unexpected external sitemap host');
  const response = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'PinnaclePortalInventory/1.0', 'Accept': 'application/xml,text/xml,text/plain' } });
  return { status: response.status, body: await response.text(), finalUrl: response.url };
};
const robots = await fetchDocument(`${base}/robots.txt`);
documents.push({ url: `${base}/robots.txt`, kind: 'robots', status: robots.status, sha256: sha(robots.body) });
enqueue(`${base}/sitemap.xml`, 'domain sitemap index');
if (robots.status === 200) for (const match of robots.body.matchAll(/^\s*Sitemap:\s*(\S+)/gim)) enqueue(match[1], 'robots.txt');
while (queue.length) {
  const batch = queue.splice(0, 4);
  const results = await Promise.allSettled(batch.map(async item => {
    const result = await fetchDocument(item.url);
    const entries = result.status === 200 ? locs(result.body) : [];
    const isIndex = /<sitemapindex\b/i.test(result.body);
    documents.push({ ...item, kind: isIndex ? 'index' : 'urlset', status: result.status, locEntries: entries.length, uniqueExactLocs: new Set(entries).size, repeatedLocsWithinDocument: entries.length - new Set(entries).size, finalUrl: result.finalUrl, sha256: sha(result.body) });
    if (result.status !== 200) return;
    if (isIndex) for (const url of entries) enqueue(url, item.url);
    else for (const url of entries) {
      if (!pages.has(url)) pages.set(url, { url, sitemapSources: [] });
      pages.get(url).sitemapSources.push(item.url);
    }
  }));
  results.forEach((result, i) => { if (result.status === 'rejected') documents.push({ ...batch[i], kind: 'unavailable', status: null, error: String(result.reason).slice(0, 180) }); });
}

const readJSON = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const releaseReceipt = process.argv[2] || 'deployment/centre-batch-live-v132-20261001.json';
const release = await readJSON(releaseReceipt);
const managed = new Set(release.shells.map(row => row.path));
const centresData = await readJSON('src/data/centre-directory.json');
const centres = Array.isArray(centresData) ? centresData : (centresData.centres || centresData.centers || centresData.items);
if (!Array.isArray(centres) || centres.length !== 62) throw new Error('Expected the established 62-entry centre directory');
const navigation = await readJSON('src/data/portal-navigation.json');
const cards = await readJSON('src/data/verify-cards.json');
const navOccurrences = [];
function collect(value, section) {
  if (Array.isArray(value)) return value.forEach(v => collect(v, section));
  if (!value || typeof value !== 'object') return;
  if (typeof value.url === 'string') navOccurrences.push({ url: value.url, label: value.label || value.title || value.id || '', section });
  for (const [key, child] of Object.entries(value)) if (key !== 'url') collect(child, section);
}
for (const [section, content] of Object.entries(navigation)) if (Array.isArray(content)) collect(content, section);
for (const card of cards) navOccurrences.push({ url: `/verify/evidence/records/${card.id}.html`, label: card.title, section: 'verifyFooterCards' });
for (const [url, label] of [
  ['/', 'Home'], ['/verify/', 'Verify evidence hub'], ['/verify/#organization', 'Organisation source identity'], ['/verify/evidence/cite.html', 'Citations and downloads'],
  ['/verify/evidence/pinnacleai-regulatory-journey.html', 'PinnacleAI regulatory journey'],
  ['/national-autism-helpline', 'National Autism Helpline'], ['/centers', 'Find a centre'], ['/sitemap', 'Human sitemap'],
  ['tel:+919100181181', 'National phone'], ['https://wa.me/919100181181', 'WhatsApp'], ['mailto:care@pinnacleblooms.org', 'Care email'],
  ['https://www.bhclpl.org', 'Legal operator website'], ['https://www.trustpilot.com/review/pinnacleblooms.org', 'Trustpilot review destination']
]) navOccurrences.push({ url, label, section: 'sharedShellDirectLinks' });

const sourceFamily = source => {
  const p = new URL(source).pathname;
  if (p.startsWith('/ask/')) return 'ask';
  if (p.includes('national-autism-helpline')) return 'helpline';
  if (p.startsWith('/verify/')) return 'verify';
  if (p.startsWith('/pinnacleai/')) return 'pinnacleai';
  if (p.startsWith('/speech-therapy/')) return 'managed_services';
  return p.split('/').at(-1).replace('.xml', '');
};
const familyPriority = ['managed_services', 'pinnacleai', 'centres', 'verify', 'helpline', 'bots', 'staff', 'core', 'ask'];
const familyOf = sources => [...new Set(sources.map(sourceFamily))].sort((a, b) => (familyPriority.indexOf(a) < 0 ? 100 : familyPriority.indexOf(a)) - (familyPriority.indexOf(b) < 0 ? 100 : familyPriority.indexOf(b)) || a.localeCompare(b))[0];
const nextByFamily = {
  core: 'Inspect current body, user job, source and backlinks/Search Console before preserve/repair/merge/redirect decisions.',
  centres: 'Match branch address, Google identity, photos and enquiry choice; migrate one reviewed exact canonical in the common system. Confirm current operational facts separately.',
  staff: 'Verify current public role, qualifications/registration where relevant, consent and source owner before expanding or promoting profile.',
  bots: 'Sample distinct audience value, source accuracy, canonical and overlap with Ask before an eligibility or content change.',
  miracles: 'Review child privacy, consent and publication eligibility privately before amplification; no patient details fetched by this inventory.',
  ask: 'Sample usefulness, source quality, duplication, canonical/index status and privacy privately before any mass change or promotion.',
  verify: 'Maintain exact source, dates, scope and claim status in the Verify source; update only for material evidence or a verified defect.',
  helpline: 'Measure query/answer-box visibility and actual phone path; preserve operator and availability facts in the helpline owner source.',
  pinnacleai: 'Preserve distinct released module narrative and evidence; implement concrete reviewed example only where a specific audience gap exists.',
  managed_services: 'Preserve released therapy/guide purpose and canonical; review only material facts, a concrete defect or audience evidence.'
};
const defaults = family => family.startsWith('faq-') ? 'Verify English source baseline, translated-answer parity, natural language, canonical and hreflang before amplification.' : 'Identify exact source, audience role and index eligibility before changing this retained URL.';
const rows = [...pages.values()].map(row => {
  let parsed;
  try { parsed = new URL(row.url); } catch { return { ...row, id: `URL-${sha(row.url).slice(0, 12)}`, family: 'invalid_loc', state: 'needs_sitemap_correction', canonicalVerified: false, nextCondition: 'Review malformed loc in its actual sitemap source.' }; }
  const family = familyOf(row.sitemapSources);
  const isManaged = parsed.origin === base && !parsed.search && !parsed.hash && managed.has(parsed.pathname);
  const centre = centres.find(c => c.profileUrl === row.url);
  return { ...row, id: centre ? `CENTRE-${centre.id}` : `URL-${sha(row.url).slice(0, 12)}`, family, state: isManaged ? 'released_managed_portfolio' : ['miracles', 'ask'].includes(family) ? 'retained_pending_private_eligibility_review' : family === 'verify' ? 'retained_evidence_source' : family === 'helpline' ? 'retained_separate_service_source' : 'retained_pending_content_verification', canonicalVerified: isManaged, individualPageFetchedThisInventory: false, sourceOwner: isManaged ? 'current portal implementation owner' : family === 'verify' ? 'Verify source in current owner workspace' : 'actual legacy/service source; confirm before edit', releaseEvidence: isManaged ? releaseReceipt : '', nextCondition: isManaged ? 'Preserve release; observe actual discovery/citation/call outcomes; reopen only for a concrete defect or evidence change.' : nextByFamily[family] || defaults(family) };
}).sort((a, b) => a.family.localeCompare(b.family) || a.url.localeCompare(b.url));
const rowByUrl = new Map(rows.map(row => [row.url, row]));
const navRows = navOccurrences.map(row => {
  const absolute = new URL(row.url, base);
  const internal = ['www.pinnacleblooms.org', 'pinnacleblooms.org'].includes(absolute.hostname);
  const lookup = new URL(absolute); lookup.hash = '';
  const sitemapRow = rowByUrl.get(lookup.href);
  const isManaged = internal && managed.has(absolute.pathname);
  return { ...row, absoluteUrl: absolute.href, internal, pagePath: internal ? absolute.pathname : '', hasFragment: !!absolute.hash, sitemapListedExactUrl: !!sitemapRow, state: isManaged ? 'released_managed_page; fragment_not_rechecked_here' : ['tel:', 'mailto:'].includes(absolute.protocol) ? 'retained_contact_utility' : internal && absolute.pathname.startsWith('/verify/') ? 'retained_evidence_link' : internal ? 'retained_legacy_destination; role_and_fragment_review_pending' : 'retained_external_destination; identity_review_as_needed', nextCondition: isManaged ? 'Preserve approved page; validate anchor only when affected by edits.' : internal ? 'Verify exact destination role/content/anchor in its source before edits; absence from sitemap alone is not a defect.' : 'Preserve useful official/contact/platform role; do not imply platform endorsement.' };
});
const csv = values => { const keys = [...new Set(values.flatMap(v => Object.keys(v)))]; const quote = value => `"${String(Array.isArray(value) ? value.join(' | ') : value ?? '').replaceAll('"', '""')}"`; return [keys.map(quote).join(','), ...values.map(v => keys.map(k => quote(v[k])).join(','))].join('\n') + '\n'; };
await fs.writeFile(path.join(privateDir, 'whole-route-register.json'), JSON.stringify({ checkedAt, method: 'Sitemap-only inventory; page eligibility is unverified except existing managed release evidence.', rows }, null, 2) + '\n');
await fs.writeFile(path.join(privateDir, 'whole-route-register.csv'), csv(rows));
await fs.writeFile(`reviews/PORTAL-NAVIGATION-REGISTER-${stamp}.csv`, csv(navRows));
const families = [...new Set(documents.filter(d => d.kind === 'urlset').map(d => sourceFamily(d.url)))].sort().map(family => ({ family, uniqueExactUrlsAssignedThisWorkFamily: rows.filter(row => row.family === family).length, uniqueExactUrlsListedByFamilySitemaps: rows.filter(row => row.sitemapSources.some(source => sourceFamily(source) === family)).length, states: Object.fromEntries([...new Set(rows.filter(row => row.family === family).map(row => row.state))].map(state => [state, rows.filter(row => row.family === family && row.state === state).length])), nextCondition: nextByFamily[family] || defaults(family) }));
documents.sort((a, b) => a.url.localeCompare(b.url));
const summary = {
  checkedAt, sitemapDocumentCount: documents.filter(d => d.kind !== 'robots').length,
  urlsetCount: documents.filter(d => d.kind === 'urlset' && d.status === 200).length,
  sitemapLocOccurrences: documents.filter(d => d.kind === 'urlset').reduce((sum, d) => sum + (d.locEntries || 0), 0),
  uniqueExactSitemapUrls: rows.length, duplicateLocOccurrences: documents.filter(d => d.kind === 'urlset').reduce((sum, d) => sum + (d.locEntries || 0), 0) - rows.length,
  duplicateWithinDocuments: documents.filter(d => d.kind === 'urlset').reduce((sum, d) => sum + (d.repeatedLocsWithinDocument || 0), 0),
  overlapAcrossDocuments: documents.filter(d => d.kind === 'urlset').reduce((sum, d) => sum + (d.uniqueExactLocs || 0), 0) - rows.length,
  managedPublicPages: managed.size, centreDirectoryEntries: centres.length,
  centreRebuildsReleased: centres.filter(c=>!new URL(c.profileUrl).hash&&managed.has(new URL(c.profileUrl).pathname)).length,
  remainingStandaloneCentreRebuilds: centres.filter(c=>!new URL(c.profileUrl).hash&&!managed.has(new URL(c.profileUrl).pathname)).length,
  contactFragmentEntries: centres.filter(c=>new URL(c.profileUrl).hash).length,
  navigationOccurrences: navRows.length, navigationUniqueAbsoluteHrefs: new Set(navRows.map(r => r.absoluteUrl)).size,
  navigationInternalPagePaths: new Set(navRows.filter(r => r.internal).map(r => r.pagePath)).size,
  managedPagesAbsentFromFetchedSitemaps: [...managed].filter(p => !rows.some(r => r.canonicalVerified && new URL(r.url).pathname === p)),
  documents, families,
  limits: ['Counts are sitemap listings, not indexed pages, rankings, AI citations or outcomes.', 'URLs may occur in multiple sitemap families. Each is assigned one deterministic work family; listed family counts can overlap.', 'No individual legacy, Ask, staff or child-story page fetched by this inventory.', 'Exact hosts and query variants remain separate; no canonical identity inferred.', 'Raw URL inventory stays in ignored audits directory; only aggregate summary and known public navigation are checked in.', 'No submission, noindex, redirect, removal or production code deployment performed by this register.']
};
await fs.writeFile(`reviews/WHOLE-PORTAL-SITEMAP-SUMMARY-${stamp}.json`, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ checkedAt, sitemapDocumentCount: summary.sitemapDocumentCount, urlsets: summary.urlsetCount, listedOccurrences: summary.sitemapLocOccurrences, uniqueExactUrls: rows.length, managedPublicPages: managed.size, navigationOccurrences: navRows.length, managedMissing: summary.managedPagesAbsentFromFetchedSitemaps, failures: documents.filter(d => d.status !== 200).map(d => ({ url: d.url, status: d.status })) }, null, 2));
