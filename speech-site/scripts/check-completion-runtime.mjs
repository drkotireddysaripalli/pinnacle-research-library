// Three affected reading templates, no form/phone/sign-in actions or lab repeat.
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve(import.meta.dirname,'../../../website-completion-20261007');
const browser=await chromium.launch({headless:true});
const result={at:new Date().toISOString(),source:'911f5b53df98b955bb9c5acd38c83f4af2c3d959',kind:'390-pixel browser runtime regression; no physical/field performance claim',cases:[]};
try{
 for(const [id,p]of [['materials','/ma/therapy-materials-medicine-ball'],['abilities','/abilities/imitation'],['blog','/b/understanding-managing-spitting-saliva-tantrums']]){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await context.route(/google-analytics\.com|analytics\.google\.com|ob\.aseasky\.link/,r=>r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('https://www.pinnacleblooms.org'+p,{waitUntil:'domcontentloaded',timeout:45000});await page.waitForTimeout(4500);
  const state=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(n=>n.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth,layoutMarker:!!document.querySelector('[data-pinnacle-reading-layout]'),jsonLdValid:[...document.querySelectorAll('script[type="application/ld+json"]')].every(n=>{try{JSON.parse(n.textContent);return true;}catch{return false;}}),counterGuards:[...document.scripts].filter(s=>s.textContent.includes("document.getElementById('votesupdate') &&")).length}));
  const row={id,url:response.url(),status:response.status(),errors,...state};row.passed=row.status===200&&errors.length===0&&!row.overflow&&row.jsonLdValid&&row.counterGuards===1;
  result.cases.push(row);await page.screenshot({path:path.join(out,id+'-runtime-final-390.png')});await context.close();
 }
}finally{await browser.close();}
result.passed=result.cases.every(c=>c.passed);
await fs.writeFile(path.join(out,'runtime-final-proof.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
if(!result.passed)process.exitCode=1;
