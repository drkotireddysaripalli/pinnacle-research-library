// Read saved anonymous public responses once; this script makes no network requests.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root='audits/policy-source-v135-20261001';
const labels={'privacy-policy':'Privacy Policy','terms-of-use':'Terms of Use','terms-of-service':'Terms of Service','cookie-policy':'Cookie Policy','copyright-and-intellectual':'Copyright & Intellectual Property','age-restriction-policy':'Age Restriction Policy','contact-information':'Contact Information','disclaimer-and-limitations-of-liabilities':'Disclaimer & Limitations of Liabilities','endorsement-and-testimonial':'Endorsement & Testimonials','governing-and-jurisdiction':'Governing Law & Jurisdiction','third-party-inegration':'Third-Party Integration Policy','refund-policy':'Refund Policy','staff-declaration':'Staff Conduct & HR Compliance Charter','ethics-charter':'Ethics Charter'};
(async()=>{
 const metadata=JSON.parse(fs.readFileSync(root+'/source-metadata.json','utf8'));
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
 await page.route('**/*',r=>r.abort());const policies=[];
 try{for(const [slug,label]of Object.entries(labels)){
  const source=metadata.pages.find(p=>p.id===slug);assert(source&&source.status===200,slug);
  const raw=fs.readFileSync(root+'/'+slug+'.html');assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),source.sha256);
  await page.setContent(raw.toString('utf8'),{waitUntil:'domcontentloaded'});
  const content=await page.evaluate(()=>{
   const original=document.querySelector('.body-content section.common-text-page')||document.querySelector('.body-content main.content');
   if(!original)throw new Error('No isolated policy body');
   const body=original.cloneNode(true);body.querySelectorAll('script,style,noscript,iframe,form,input,button,link,meta,img').forEach(e=>e.remove());
   const norm=s=>s.replace(/\s+/g,' ').trim();
   const textOf=node=>{const parts=[],walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const text=norm(walker.currentNode.textContent);if(text)parts.push(text);}return parts.join(' ');};
   const preservedText=textOf(body);
   const toc=[];let number=0;
   for(const el of [...body.querySelectorAll('*')]){
    for(const attr of [...el.attributes])if(!['href','colspan','rowspan','id','src','alt','width','height','scope'].includes(attr.name))el.removeAttribute(attr.name);
    if(el.tagName==='IMG'){el.loading='lazy';el.decoding='async';for(const attr of ['width','height'])if(el.hasAttribute(attr)&&!/^[0-9]+$/.test(el.getAttribute(attr)))el.removeAttribute(attr);}
    if(el.tagName==='A'){const href=el.getAttribute('href')||'';if(!/^(?:https?:|mailto:|tel:|\/|#)/i.test(href))el.removeAttribute('href');}
    if(/^H[1-6]$/.test(el.tagName)){
     const replacement=document.createElement(el.tagName==='H1'?'h2':el.tagName.toLowerCase());replacement.innerHTML=el.innerHTML;
     const id=el.id||'policy-section-'+(++number);replacement.id=id;toc.push({id,title:norm(el.textContent),level:el.tagName==='H1'?2:Number(el.tagName.slice(1))});el.replaceWith(replacement);
    }
   }
   let tableIndex=0;for(const table of [...body.querySelectorAll('table')]){const region=document.createElement('div');region.className='policy-table-region';region.tabIndex=0;region.setAttribute('role','region');region.setAttribute('aria-label','Policy table '+(++tableIndex));table.replaceWith(region);region.append(table);}
   // Retain all policy words and commitments; only scripts, styling and heading levels change.
   if(textOf(body)!==preservedText)throw new Error('Policy wording changed');
   const revision=(document.querySelector('.cm-section-main')?.textContent||preservedText).match(/LAST REVISION\s*:\s*([\d-]+)/i)?.[1]||null;
   const topLevel=Math.min(...toc.map(h=>h.level));
   return {html:body.innerHTML,text:preservedText,toc:toc.filter(h=>h.level===topLevel),printedRevision:revision,sourceBodyId:original.id||null};
  });
  const expected=fs.readFileSync(root+'/'+slug+'.body.txt','utf8').replace(/\s+/g,' ').trim();if(content.text!==expected){let at=0;while(content.text[at]===expected[at]&&at<Math.min(content.text.length,expected.length))at++;throw new Error(slug+' legal-text difference at '+at+': '+JSON.stringify({actual:content.text.slice(at-40,at+80),expected:expected.slice(at-40,at+80),lengths:[content.text.length,expected.length]}));}
  policies.push({slug,path:'/'+slug,label,title:label+' | Pinnacle Blooms Network',description:'Read Pinnacle Blooms Network’s '+label.toLowerCase()+', with readable sections and related policy links.',...content,sourceUrl:source.finalUrl,sourceRetrievedAt:source.checkedOn,sourceHtmlSha256:source.sha256,policyTextSha256:crypto.createHash('sha256').update(content.text).digest('hex'),legalApprovalVerified:false});
 }
 fs.writeFileSync('src/data/policy-content.json',JSON.stringify(policies,null,2)+'\n');console.log(JSON.stringify({policies:policies.length,wordingPreserved:true,networkRequests:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
