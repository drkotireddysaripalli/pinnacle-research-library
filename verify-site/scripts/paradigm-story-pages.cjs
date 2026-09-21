'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const fullStoryRoute = '/evidence/pinnacle-paradigm-shift.html';
const jsonRoute = '/evidence/paradigm-story.json';
const textRoute = '/evidence/paradigm-story.txt';
const artworkDescription = 'Poster with manually typeset text over AI-generated conceptual artwork. It does not depict a real patient or document a clinical outcome.';
const artworkCaption = 'Illustration of the care model. Read the comparison and sources alongside.';
const perspectiveNote = 'These nine perspectives explain the architecture of care supporting Pinnacle’s seven-stage developmental approach; they are not nine new clinical stages.';
const style = `
.ps-reference-page{max-width:1100px;padding-bottom:48px}
.ps-reference-page h1{max-width:23ch;font-size:clamp(32px,5vw,54px);line-height:1.15;margin:14px 0 20px}
.ps-reference-intro{max-width:72ch;margin-bottom:28px}
.ps-reference-intro .intro-copy{font-size:clamp(18px,2.3vw,23px);line-height:1.6}
.ps-reference-position,.ps-reference-context,.ps-reference-art-note{color:#4c626e;font-size:14px;line-height:1.7}
.ps-reference-layout{display:grid;gap:28px;align-items:start}
.ps-reference-figure{margin:0;min-width:0}
.ps-reference-poster{display:block;width:100%;max-width:432px;height:auto;margin-inline:auto;border:1px solid #d6e6e6;border-radius:14px}
.ps-reference-figure figcaption{max-width:432px;margin:12px auto 0}
.ps-reference-actions,.ps-reference-nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin-block:20px}
.ps-reference-actions a,.ps-reference-nav a{display:inline-flex;align-items:center;gap:7px;min-height:44px;color:#006d73}
.ps-reference-comparison{min-width:0}
.ps-reference-comparison h2,.ps-reference-sources h2,.ps-reference-context h2,.ps-reference-citation h2{font-size:22px;line-height:1.35}
.ps-reference-comparison dl{margin:0;display:grid;gap:18px}
.ps-reference-comparison dl>div{padding:20px;border:1px solid #c9dddf;border-radius:14px;background:#fff}
.ps-reference-comparison dl>div:nth-child(2){border-color:#82bcbb;background:#f4faf9}
.ps-reference-comparison dt{font-weight:700;color:#152953;font-size:16px;line-height:1.45}
.ps-reference-comparison dd{margin:10px 0 0;font-size:18px;line-height:1.7;color:#294756}
.ps-reference-meaning{padding:20px 0;color:#006d73;font-size:21px;font-weight:650;line-height:1.6}
.ps-reference-sources{padding-top:10px}
.ps-reference-sources ul{padding-left:20px;display:grid;gap:12px;line-height:1.6}
.ps-reference-sources a{color:#006d73;text-underline-offset:3px}
.ps-reference-source-note{font-size:15px;line-height:1.7;color:#405b67}
.ps-reference-context,.ps-reference-citation{margin-top:30px;padding-top:24px;border-top:1px solid #d9e7e8}
.ps-reference-citation p{line-height:1.75;overflow-wrap:anywhere}
.ps-reference-nav{margin-top:28px;padding-top:18px;border-top:1px solid #d9e7e8;justify-content:space-between}
.ps-reference-page a:focus-visible{outline:3px solid #007f86;outline-offset:4px}
@media(min-width:800px){.ps-reference-layout{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:40px}}
@media print{.ps-reference-layout{display:block}.ps-reference-poster{max-width:250px}.ps-reference-actions,.ps-reference-nav{display:none}.ps-reference-comparison dl>div{break-inside:avoid}}
`;

module.exports = ({e, icon, origin, date, organization, website, brand, head, pageHeader, footer, breadcrumb, crumbsHTML, write}) => {
  const readJSON = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const data = readJSON('content/paradigm-story.json');
  const manifest = readJSON('content/paradigm-story-assets.json');
  const assets = Array.isArray(manifest) ? manifest : manifest.cards || manifest.assets;
  const records = readJSON('dist/evidence/evidence.json').records;
  const recordById = new Map(records.map(record => [record.id, record]));
  const absolute = route => new URL(route, origin + '/').href;
  const routeFor = card => '/evidence/paradigm/' + card.id + '.html';
  const nameFor = card => card.title.join(' ');
  const safeAsset = value => typeof value === 'string' && /^\/images\/[a-zA-Z0-9_./-]+\.(?:jpe?g|webp|png)$/i.test(value) && !value.includes('..');
  const compact = value => String(value).replace(/\s+/g, ' ').trim();
  const descriptionFor = card => {
    let value = compact(card.lead);
    if (value.length < 110) value += ' Read the connected-care comparison and its source records.';
    return value.length <= 160 ? value : value.slice(0, 159).replace(/\s+\S*$/, '') + '…';
  };
  if (!Array.isArray(data.cards) || data.cards.length !== 9) throw Error('Paradigm reference pages require exactly nine cards.');
  if (!Array.isArray(assets)) throw Error('Paradigm poster manifest must contain a cards or assets array.');
  const ids = new Set();
  const items = data.cards.map((card, index) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id) || ids.has(card.id) || card.number !== index + 1) throw Error('Invalid paradigm card identity: ' + card.id);
    ids.add(card.id);
    if (!Array.isArray(card.title) || card.title.length !== 2 || card.title.some(line => typeof line !== 'string')) throw Error('Paradigm title requires two text lines: ' + card.id);
    const asset = assets.find(item => item.id === card.id);
    if (!asset || asset.number !== card.number || String(asset.artKey) !== String(card.artKey)) throw Error('Missing or mismatched paradigm poster: ' + card.id);
    if (![asset.poster, asset.preview, asset.art].every(safeAsset) || asset.width !== 1080 || asset.height !== 1920) throw Error('Invalid paradigm poster assets: ' + card.id);
    if (!Array.isArray(card.sourceIds) || !card.sourceIds.length) throw Error('Paradigm source records required: ' + card.id);
    const sources = card.sourceIds.map(id => {
      const record = recordById.get(id);
      if (!record) throw Error('Unknown paradigm source record: ' + id);
      return {id, title: record.title, route: '/evidence/records/' + id + '.html', url: absolute('/evidence/records/' + id + '.html')};
    });
    const route = routeFor(card), canonical = absolute(route), name = nameFor(card);
    const brandedTitle = name + ' | PinnacleAI®';
    const title = brandedTitle.length <= 70 ? brandedTitle : name;
    if (title.length > 70) throw Error('Paradigm page title exceeds 70 characters: ' + card.id);
    const citation = `${organization.name}. (${date}). ${name} Pinnacle Paradigm Shift, perspective ${card.number} of 9. Pinnacle Verify. ${canonical}`;
    return {card, asset, sources, route, canonical, name, title, description: descriptionFor(card), citation};
  });

  write('paradigm-story-pages.css', style.trim() + '\n');
  const routes = [];
  for (const [index, item] of items.entries()) {
    const {card, asset, sources, route, canonical, name, title, description, citation} = item;
    const crumbs = [['Verify Pinnacle', '/'], ['Pinnacle Paradigm Shift', fullStoryRoute], [name, route]];
    const workId = canonical + '#explanation', imageId = canonical + '#poster';
    const graph = [organization, website, brand,
      {'@type': 'WebPage', '@id': canonical + '#page', url: canonical, name: title, description, dateModified: date, inLanguage: 'en-IN', isPartOf: {'@id': website['@id']}, publisher: {'@id': organization['@id']}, mainEntity: {'@id': workId}, primaryImageOfPage: {'@id': imageId}, breadcrumb: {'@id': canonical + '#breadcrumb'}},
      {'@type': 'CreativeWork', '@id': workId, url: canonical, name, description: card.lead, abstract: card.connected, text: [card.lead, 'Disconnected care can mean: ' + card.disconnected, 'The PinnacleAI® approach: ' + card.connected, card.lifeMeaning, card.sourceNote, perspectiveNote, data.comparisonNote, data.evidenceNote].join('\n\n'), position: card.number, inLanguage: 'en-IN', dateModified: date, publisher: {'@id': organization['@id']}, author: {'@id': organization['@id']}, mainEntityOfPage: {'@id': canonical + '#page'}, isPartOf: {'@type': 'CreativeWork', '@id': absolute(fullStoryRoute) + '#approach', name: data.title, url: absolute(fullStoryRoute)}, citation: sources.map(source => source.url), image: {'@id': imageId}},
      {'@type': 'ImageObject', '@id': imageId, name: 'Pinnacle Paradigm Shift poster ' + card.number + ': ' + name, url: absolute(asset.poster), contentUrl: absolute(asset.poster), thumbnailUrl: absolute(asset.preview), width: asset.width, height: asset.height, description: artworkDescription, caption: artworkDescription, representativeOfPage: true},
      breadcrumb(crumbs, canonical)
    ].filter(Boolean);
    const previous = items[index - 1], next = items[index + 1];
    const navLink = (other, direction) => other ? `<a rel="${direction === 'Previous' ? 'prev' : 'next'}" href="${e(other.route)}">${direction === 'Previous' ? icon('arrow-left') : ''}<span>${direction} · ${e(other.name)}</span>${direction === 'Next' ? icon('chevron-right') : ''}</a>` : '';
    const body = `<main class="wrap record-page ps-reference-page">${crumbsHTML(crumbs)}
      <header class="ps-reference-intro"><p class="eyebrow">${e(data.title)} · ${String(card.number).padStart(2, '0')} / 09</p><h1>${card.title.map(e).join('<br>')}</h1><p class="intro-copy">${e(card.lead)}</p><p class="ps-reference-position">Perspective ${card.number} of nine. ${e(perspectiveNote)} <a href="${fullStoryRoute}">Read the complete approach</a>.</p></header>
      <div class="ps-reference-layout"><figure class="ps-reference-figure"><img class="ps-reference-poster" src="${e(asset.preview)}" width="${asset.width}" height="${asset.height}" alt="${e('Pinnacle Paradigm Shift poster ' + card.number + ': ' + name + ' Full comparison text follows.')}" loading="eager" decoding="async"><figcaption class="ps-reference-art-note">${e(artworkCaption)}</figcaption><div class="ps-reference-actions"><a href="${e(asset.poster)}" download="${e('pinnacle-' + card.id + '.' + asset.poster.split('.').pop())}">${icon('download')}Download poster · 1080 × 1920</a></div></figure>
      <div class="ps-reference-comparison"><h2>${e(card.eyebrow)}</h2><dl><div><dt>Disconnected care can mean</dt><dd>${e(card.disconnected)}</dd></div><div><dt>The PinnacleAI® approach</dt><dd>${e(card.connected)}</dd></div></dl><p class="ps-reference-meaning">${e(card.lifeMeaning)}</p><section class="ps-reference-sources" id="sources"><h2>Sources for this comparison</h2><p class="ps-reference-source-note">${e(card.sourceNote)}</p><ul>${sources.map(source => `<li><a href="${e(source.route)}">${e(source.title)} ${icon('arrow-up-right')}</a></li>`).join('')}</ul></section></div></div>
      <section class="ps-reference-context" id="evidence-context"><h2>Evidence and context</h2><p>${e(data.comparisonNote)}</p><p>${e(data.evidenceNote)}</p></section>
      <section class="ps-reference-citation" id="cite-this-page"><h2>Cite this explanation</h2><p>${e(citation)}</p><p>This is Pinnacle’s own source-linked explanation. For a specific finding, cite the original record linked above.</p><div class="ps-reference-actions"><a href="${textRoute}">${icon('file-text')}All nine explanations · text</a><a href="${jsonRoute}">${icon('files')}Story and source data · JSON</a></div></section>
      <nav class="ps-reference-nav" aria-label="Other paradigm perspectives">${navLink(previous, 'Previous')}<a href="${fullStoryRoute}">${icon('network')}Full Pinnacle Paradigm Shift</a>${navLink(next, 'Next')}</nav>
    </main>`;
    const pageHead = head(title, description, canonical, graph).replace('</head>', `<link rel="stylesheet" href="/paradigm-story-pages.css"><link rel="alternate" type="application/json" href="${jsonRoute}" title="Nine paradigm perspectives and sources"><link rel="alternate" type="text/plain" href="${textRoute}" title="Nine paradigm perspectives in plain text"></head>`);
    write(route.slice(1), '<!doctype html>\n<html lang="en-IN">' + pageHead + '<body>' + pageHeader + body + footer + '</body></html>\n');
    routes.push(route);
  }

  const missionSource = data.mission?.sourceId;
  if (missionSource && !recordById.has(missionSource)) throw Error('Unknown paradigm mission source record: ' + missionSource);
  const exportCards = items.map(({card, asset, sources, canonical, description, citation}) => ({...card, canonical, description, poster: absolute(asset.poster), preview: absolute(asset.preview), art: absolute(asset.art), width: asset.width, height: asset.height, artworkDescription, sources: sources.map(({id, title, url}) => ({id, title, url})), citation}));
  const exported = {...data, canonical: absolute(fullStoryRoute), structuredDataUrl: absolute(jsonRoute), plainTextUrl: absolute(textRoute), updated: date, publisher: organization.name, sourceType: 'First-party source-linked explanation of care-system architecture', perspectiveNote, mission: {...data.mission, ...(missionSource ? {source: absolute('/evidence/records/' + missionSource + '.html')} : {})}, cards: exportCards};
  const text = ['# ' + data.title, data.headline, data.description, perspectiveNote, data.comparisonNote,
    ...exportCards.map(card => ['## ' + String(card.number).padStart(2, '0') + ' · ' + card.title.join(' '), card.eyebrow, card.lead, 'Disconnected care can mean: ' + card.disconnected, 'The PinnacleAI® approach: ' + card.connected, 'What changes in the system: ' + card.lifeMeaning, 'Source context: ' + card.sourceNote, ...card.sources.map(source => source.title + ': ' + source.url), 'Reference page: ' + card.canonical, 'Poster: ' + card.poster, 'Poster preview: ' + card.preview, 'Artwork: ' + card.art, artworkDescription, 'Citation: ' + card.citation].join('\n\n')),
    '## Mission', [data.mission?.value, data.mission?.text].filter(Boolean).join(' · '), missionSource ? 'Mission source: ' + exported.mission.source : '', '## Evidence and context', data.evidenceNote, 'Full approach: ' + absolute(fullStoryRoute), 'Structured story and sources: ' + absolute(jsonRoute)
  ].filter(Boolean).join('\n\n') + '\n';
  write(jsonRoute.slice(1), JSON.stringify(exported, null, 2) + '\n');
  write(textRoute.slice(1), text);
  const index = '\n## Pinnacle Paradigm Shift — nine care-system perspectives\n' + items.map(item => `- [${String(item.card.number).padStart(2, '0')} · ${item.name}](${item.canonical}): ${item.card.lead}`).join('\n') + `\n- [All nine explanations and sources · JSON](${absolute(jsonRoute)})\n- [All nine explanations and sources · text](${absolute(textRoute)})\n`;
  return {routes, text, index};
};
