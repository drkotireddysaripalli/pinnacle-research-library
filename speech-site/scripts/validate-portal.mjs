import fs from 'node:fs';
import assert from 'node:assert/strict';
import nav from '../src/data/portal-navigation.json' with {type:'json'};
const html=fs.readFileSync('dist/index.html','utf8');
const checks=[];
function check(name,value){assert(value,name);checks.push(name);}
const hrefs=new Set([...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&')));
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
function full(u){return u.startsWith('/')?'https://www.pinnacleblooms.org'+u:u;}
const links=[...nav.main,...nav.mobileExtras,...nav.therapy.flatMap(x=>[{url:x.url},...x.links]),...nav.footerColumns.flat().flatMap(x=>x.links),...nav.community,...nav.locations,...nav.legal];
check('Complete documented portal navigation is present',links.every(x=>hrefs.has(full(x.url))));
check('All six therapy menus have native disclosure controls',(html.match(/class="portal-therapy-menu"/g)||[]).length===6);
check('Header and footer navigation are server rendered',html.includes('aria-label="Complete site navigation"')&&html.includes('aria-label="Research Studies"'));
check('Legacy speech section targets retained',['what-section','why-section','Advantages-section','ChildrenServices-section','assessment-section','admission-section','procedure-section','Cost-section'].every(x=>ids.has(x)));
check('New speech submenu targets exist',nav.therapy.find(x=>x.label==='Speech Therapy').links.filter(x=>x.url.includes('#')).every(x=>ids.has(x.url.split('#')[1])));
check('No duplicate HTML IDs',ids.size===[...html.matchAll(/\bid="([^"]+)"/g)].length);
check('Official Pinnacle TV channel preserved',hrefs.has('https://www.youtube.com/channel/UCAAuGmvPSBRiCnDlEcXYwEQ'));
check('Footer portal destinations preserved',['https://materials.pinnacleblooms.org/','https://interventions.pinnacleblooms.org/','https://pediatricians.pinnacleblooms.org/'].every(x=>hrefs.has(x)));
check('Full action strip retained',html.includes('Join Certified Course')&&hrefs.has(full('/certified-courses')));
const result={checkedAt:new Date().toISOString(),checksPassed:checks.length,documentedLinkEntries:links.length,checks};
fs.writeFileSync('PORTAL-VALIDATION-20260927.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
