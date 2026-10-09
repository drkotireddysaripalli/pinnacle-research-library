// Offline build/test/search evidence view. Starts no crawl, API call or scheduler.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const results = path.join(here, 'results');
fs.mkdirSync(results, {recursive:true});
function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) return null;
  try {return JSON.parse(fs.readFileSync(file, 'utf8'));}
  catch (error) {throw new Error(relative + ': ' + error.message);}
}
const git = (...args) => {
  const run = spawnSync('git', args, {cwd:root, encoding:'utf8'});
  if (run.status !== 0) throw new Error(run.stderr || 'Git read failed');
  return run.stdout.trim();
};
const gsc = read('build-window/results/gsc-evidence.json');
const vendor = read('build-window/results/tool-evidence.json');
const frog = read('speech-site/deployment/knowledge-journey-frog-summary-20261008.json');
const install = read('build-window/results/frog-install.json');
const localFrog = read('build-window/results/frog-local-summary.json');
const discovery = read('speech-site/deployment/knowledge-journey-discovery-20261008.json');
const live = read('build-window/results/live-search-cohort.json');
const parity = read('build-window/results/parity-summary.json');
const joined = read('build-window/results/evidence-20261009/joined.json');
const handover = joined ? {
  state:'Imported private snapshot; export hashes verified before materialization',
  queueItems:joined.rows.length, savedSources:joined.sources.length,
  urls:Object.keys(joined.url_observations).length,
  queryPageSamples:joined.gsc_query_page.records.length,
  testingObservations:joined.testingbot.records.length,
  downstreamState:joined.receiving_team.state,
  source:'build-window/results/evidence-20261009/joined.json'
} : null;
const tools = [...(gsc?.tools || []), ...(vendor?.tools || [])];
if (handover) tools.push({name:'Private Windows handover',status:handover.state,
  checkedAt:joined.generated_at,source:handover.source,
  summary:`${handover.queueItems} queue items, ${handover.savedSources} saved sources and ${handover.urls} URL observations read by the existing offline join.`,
  details:[`${handover.queryPageSamples} dated GSC query/page samples; ${handover.testingObservations} dated testing observations, with their original scope.`,
    '183 transport blobs verified; 177 export hashes checked; 56 copied JSON paths relocated. Four original credential-free Frog profiles preserved.',
    `Receiving-team outcome evidence: ${handover.downstreamState}. Saved tests and search samples cannot establish qualified calls.`],
  nextAction:'Use this immutable evidence copy for assigned implementation; coordinate execution through the original queue.',owner:'Mac coordinator; Windows operational owner'});
if (frog) tools.push({name:'Screaming Frog', status:install?.activation==='Licensed' ? 'Native Mac licensed; saved completed crawl reused' : 'Saved completed crawl; native Mac CLI installed',
  checkedAt:frog.completedAt, source:'speech-site/deployment/knowledge-journey-frog-summary-20261008.json',
  summary:`${frog.http200}/${frog.pages} HTTP 200, ${frog.selfCanonical} self canonicals, ${frog.singleH1} single H1; ${frog.indexable} indexable and one intentional noindex.`,
  details:[`Mac ${install?.version || 'installation not recorded'}; CLI help ${install?.cliHelpExitCode === 0 ? 'passed' : 'not verified'}.`,
    'Existing six CSV exports are reused; this is a 12-URL cohort, not estate-wide acceptance.',
    localFrog ? `Native Mac headless check: ${localFrog.http200}/${localFrog.pages} local candidate URLs HTTP200; six CSV exports.` : 'Native local crawl not yet recorded.',
    `Four original Windows profiles are imported privately. Native activation: ${install?.activation || 'not verified'}; existing same-user entitlement, no purchase. Native GSC reads work independently.`],
  nextAction:'Use bounded list mode for changed route families; coordinate any licensed crawl with the existing Windows owner.', owner:'Mac tool coordinator; Windows crawl owner'});
if (discovery) tools.push({name:'IndexNow', status:'Dated submission receipt', checkedAt:discovery.at,
  source:'speech-site/deployment/knowledge-journey-discovery-20261008.json',
  summary:`${discovery.indexNow?.submitted ?? '?'} changed URLs submitted; ${discovery.indexNow?.failed ?? '?'} failed in this saved batch.`,
  details:['Accepted submission does not establish indexing. No new submission was performed by this build workspace.'],
  nextAction:'Submit materially changed eligible URLs through the existing release mechanism once.', owner:'Windows release owner'});
const tests = (parity?.suiteResults || []).map(r=>({name:r.name,status:r.status,source:r.source,
  checkedAt:r.startedAt,counts:r.counts,seconds:r.durationSeconds,log:r.log,skippedDependency:r.skippedDependency}));
for (const name of ['build','unit','contracts','ask-build','browser','browser-webkit','browser-all-enrolment','browser-enrolment-enrolment','browser-firefox-enrolment','browser-webkit-all-enrolment','browser-shop-shop','speed-enrolment']) {
  const receipt = read('build-window/results/' + name + '.json');
  if (!receipt) continue;
  const logName = name + '.log';
  const logPath = path.join(results, logName);
  const log = fs.existsSync(logPath) ? fs.readFileSync(logPath,'utf8') : '';
  const counts = {};
  for (const key of ['passed','failed','skipped']) {
    const match = [...log.matchAll(new RegExp('(\\d+) '+key+'(?:\\s|\\()', 'g'))].at(-1);
    if (match) counts[key] = Number(match[1]);
    else {
      const nodeLabel={passed:'pass',failed:'fail',skipped:'skipped'}[key];
      const nodeMatch=[...log.matchAll(new RegExp('(?:^|\\n)ℹ '+nodeLabel+' (\\d+)(?:\\n|$)','g'))].at(-1);
      if(nodeMatch) counts[key]=Number(nodeMatch[1]);
    }
  }
  tests.push({name,status:receipt.status,source:receipt.source,checkedAt:receipt.completedAt || receipt.startedAt,
    counts,seconds:receipt.completedAt ? (Date.parse(receipt.completedAt)-Date.parse(receipt.startedAt))/1000 : null,
    log:fs.existsSync(logPath) ? 'build-window/results/'+logName : 'build-window/results/'+name+'.json',scope:receipt.scope});
}
const data = {generatedAt:new Date().toISOString(), source:git('rev-parse','HEAD'), branch:git('branch','--show-current'),
  originMain:git('rev-parse','origin/main'), tools, tests, handover,
  liveCohort:live ? {checkedAt:live.checkedAt,pages:live.pages.map(p=>({url:p.url,status:p.status,canonical:p.canonical}))} : null,
  executionQueue:{owner:'Windows integration owner',path:'work/pinnacle-growth-system/queue.json',
    state:handover ? 'Verified private queue snapshot is readable here. The authoritative execution queue remains on Windows; this offline view starts no controller.' : 'Existing authoritative queue remains on Windows; this offline view is not a second execution queue.'},
  priorities:[
    'Confirm fresh failures before assigning a repair: all five sampled crawler-500 URLs currently pass public HTTP checks.',
    'Recover provable legacy Mirracles video identities through the Search Engineering assignment.',
    'Deliver the isolated native homepage through Page Engineering, preserving existing speech routing.',
    'Review completed crawls at their next meaningful boundary; inspect legacy sitemap warnings without resubmitting unchanged sitemaps.',
    'Measure settled search demand and actual accepted/qualified outcomes separately from taps and test success.'
  ],
  limits:['Local browser engines and viewports are emulated coverage; physical/cloud release acceptance stays in the existing coordinated suite.',
    'Ahrefs in-progress metrics and different crawl scopes cannot establish a completed health regression.',
    'Private queue, baseline and profiles are imported. Complete runtime release-union acceptance remains with the integration owner.']};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceLink = relative => '../../'+relative.split('/').map(encodeURIComponent).join('/');
const cards = tools.map(t=>`<article data-category="search"><div class="eyebrow">${esc(t.status)}</div><h2>${esc(t.name)}</h2><p>${esc(t.summary)}</p><ul>${(t.details||[]).map(d=>`<li>${esc(d)}</li>`).join('')}</ul><p class="next">${esc(t.nextAction)}</p><small>${esc(t.checkedAt)} · ${esc(t.owner)}</small></article>`).join('');
const rows = tests.map(t=>`<tr data-category="tests"><td><a href="${esc(sourceLink(t.log))}">${esc(t.name)}</a></td><td class="${t.status==='passed'?'pass':t.status==='failed'?'fail':'pending'}">${esc(t.status)}</td><td>${esc(JSON.stringify(t.counts))}</td><td>${t.seconds === null ? '—' : esc(t.seconds+'s')}</td><td><code>${esc(t.source?.slice(0,7))}</code><br><small>${esc(t.checkedAt)}</small>${t.skippedDependency?'<p>'+esc(t.skippedDependency)+'</p>':''}</td></tr>`).join('');
const commands = ['doctor','build','types','unit','contracts','ask-auth','ask-content','ask-build','browser-all enrolment','browser-firefox enrolment','browser-webkit-all enrolment','browser-shop shop','speed enrolment','frog-local','seo','preview'];
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pinnacle shared build window</title><style>
:root{color-scheme:light;font:16px/1.5 system-ui,sans-serif;color:#192b46;background:#f4f6fa}*{box-sizing:border-box}body{margin:0}header{background:#142b48;color:white;padding:2.4rem max(1rem,calc((100vw - 1200px)/2))}main{max-width:1200px;margin:auto;padding:1.3rem}h1{font-size:clamp(1.8rem,4vw,3rem);margin:.2rem 0}h2{font-size:1.25rem}p{max-width:85ch}a{color:#7d246f}header a{color:#ffd3f4}.meta,small,.eyebrow{font-size:.82rem}nav{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0}button{font:inherit;background:white;border:1px solid #aeb9c8;padding:.4rem .8rem;border-radius:.3rem;cursor:pointer}button[aria-pressed=true]{background:#792c70;color:white}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:1rem}article,section{background:white;border:1px solid #dce2eb;border-radius:.5rem;padding:1.1rem;margin-bottom:1rem}.eyebrow{text-transform:uppercase;color:#666}article ul{padding-left:1.2rem}.next{font-weight:600;border-top:1px solid #eee;padding-top:.7rem}.table{overflow:auto}table{border-collapse:collapse;min-width:740px;width:100%;font-size:.9rem}td,th{text-align:left;padding:.65rem;border-bottom:1px solid #e2e5eb;vertical-align:top}.pass{color:#176232}.fail{color:#a01f30}.pending{color:#78570a}code{font-size:.85rem;overflow-wrap:anywhere}.commands{display:flex;flex-wrap:wrap;gap:.5rem}.commands button{font-size:.82rem}.note{background:#fff3db;border-left:4px solid #ae7915;padding:1rem}[hidden]{display:none!important}</style>
<style>.meta,small,p,li{overflow-wrap:anywhere}article,section{min-width:0}</style><header><div class="eyebrow" style="color:#f5bae8">Mac + Windows · one canonical codebase</div><h1>Pinnacle shared build window</h1><p>Build, test and search evidence, with its actual source and date. Windows owns integration and release; Mac owns this local tool environment and assigned implementation branches.</p><div class="meta">${esc(data.branch)} · source ${esc(data.source)} · generated ${esc(data.generatedAt)}</div></header>
<main><nav aria-label="Evidence filters"><button data-filter="all" aria-pressed="true">Everything</button><button data-filter="search" aria-pressed="false">Search tools</button><button data-filter="tests" aria-pressed="false">Build & tests</button></nav>
<section><h2>Run from the repository root</h2><p>Select a command to copy it. The window itself performs no external actions. Browser commands choose a registered page, reuse a fingerprinted candidate and keep two local workers.</p><div class="commands">${commands.map(c=>`<button data-command="${esc('node build-window/workspace.mjs '+c)}">${esc(c)}</button>`).join('')}</div><p id="copy-status" role="status"></p></section>
<div class="grid" id="search-tools">${cards}</div><section data-category="tests"><h2>Executed checks</h2><p>Counts belong to the named run; inspect its log for explicit skips. Earlier unchanged-source receipts are retained.</p><div class="table"><table><thead><tr><th>Check / evidence</th><th>State</th><th>Counts</th><th>Time</th><th>Source / date</th></tr></thead><tbody>${rows}</tbody></table></div></section>
<section><h2>Next useful work</h2><ol>${data.priorities.map(p=>'<li>'+esc(p)+'</li>').join('')}</ol><p>${esc(data.executionQueue.state)}</p><a href="${sourceLink('speech-site/team-kt-20261009/README.md')}">Windows KT</a> · <a href="${sourceLink('speech-site/TESTINGBOT-TEST-SYSTEM.md')}">Existing test system</a> · <a href="dashboard.json">Local evidence JSON</a></section><div class="note">${data.limits.map(p=>'<p>'+esc(p)+'</p>').join('')}</div></main>
<script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('[data-category]').forEach(el=>el.hidden=button.dataset.filter!=='all'&&el.dataset.category!==button.dataset.filter)}));document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.command);document.getElementById('copy-status').textContent='Copied: '+button.dataset.command}catch{document.getElementById('copy-status').textContent=button.dataset.command}}));</script></html>`;
fs.writeFileSync(path.join(results,'dashboard.json'),JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(results,'dashboard.html'),html);
console.log(JSON.stringify({dashboard:path.join(results,'dashboard.html'),tools:tools.length,checks:tests.length,
  source:data.source,externalActions:0},null,2));
