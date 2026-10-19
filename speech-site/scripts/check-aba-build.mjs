import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const outputArg=process.argv.indexOf('--output'),output=outputArg>=0?path.resolve(root,process.argv[outputArg+1]||''):null;
if(outputArg>=0&&!process.argv[outputArg+1])throw Error('--output requires a file.');
const canonicalPath='/best-aba-therapy-center-india-proven-improvement-rate',canonical='https://www.pinnacleblooms.org'+canonicalPath;
const aba=await fs.readFile(path.join(dist,canonicalPath.slice(1)+'.html'),'utf8');
assert(aba.includes(`<link rel="canonical" href="${canonical}">`),'ABA canonical is missing.');
assert(aba.includes('aba-social-life-first-20260930'),'Approved complete poster is missing.');
assert(!aba.includes('aba-therapy-complete-poster-20261010'),'Corrupt poster remains referenced.');
for(const value of ['tel:+919100181181','data-cta="hero-assessment"','href="#centres"','id="centres"'])assert(aba.includes(value),value);
const graphs=[...aba.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{const value=JSON.parse(match[1]);return value['@graph']||[value];});
const schemaTypes=[...new Set(graphs.flatMap(node=>Array.isArray(node['@type'])?node['@type']:[node['@type']]).filter(Boolean))].sort();
for(const type of ['BreadcrumbList','FAQPage','Organization','Service','WebPage'])assert(schemaTypes.includes(type),`Missing ${type} schema.`);
const sitemap=await fs.readFile(path.join(dist,'pinnacle-pages-data','speech-sitemap.xml'),'utf8');
assert(sitemap.includes(`<loc>${canonical}</loc><lastmod>2026-10-19</lastmod>`),'Sitemap has no dated canonical ABA URL.');
const htmlFiles=[];async function visit(directory){for(const entry of await fs.readdir(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())await visit(target);else if(entry.name.endsWith('.html'))htmlFiles.push(target);}}await visit(dist);
const contextual=[],legacy=[];
for(const file of htmlFiles){const html=await fs.readFile(file,'utf8'),relative=path.relative(dist,file).replaceAll('\\','/'),main=html.match(/<main\b[\s\S]*?<\/main>/)?.[0]||'';
  if(main.includes(`href="${canonicalPath}`)||main.includes(`href="${canonical}`))contextual.push(relative);
  if(/href=["'](?:https:\/\/www\.pinnacleblooms\.org)?\/(?:t\/)?aba-therapy(?:[/?#"'])/.test(html))legacy.push(relative);
}
assert.deepEqual(legacy,[],'Internal links still point to an ABA redirect alias.');
for(const file of ['index.html','autism-therapy.html','speech-aba-autism-assessments.html','centers.html'])assert(contextual.includes(file),`${file} lacks a contextual canonical ABA link.`);
const centreLinks=contextual.filter(file=>file.startsWith('centers/')).length;assert(centreLinks>=50,'Too few centre-to-ABA contextual links.');
await assert.rejects(fs.access(path.join(dist,'aba-therapy.html')),'A competing indexable /aba-therapy file exists.');
const report={at:new Date().toISOString(),canonical,schemaTypes,sitemapLastmod:'2026-10-19',contextualInboundCount:contextual.length,centreContextualInboundCount:centreLinks,requiredContextualSources:['index.html','autism-therapy.html','speech-aba-autism-assessments.html','centers.html'],legacyInternalLinks:legacy,competingAliasFile:false,approvedPoster:true};
if(output){await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report));
