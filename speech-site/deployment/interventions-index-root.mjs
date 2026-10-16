// Root-only correction for the existing published library; no item-route or source-admission changes.
const origin='https://interventions.pinnacleblooms.org';
const title='Pinnacle Blooms® Interventions Library';
const invalidPDF='https://images.pinnacleblooms.org/Assets/InterventionTechniquePdf/pdf/index.pdf';
// Existing links and labels from the saved public library root, not newly invented destinations.
const domains=[
 ['/sensory-processing','View Sensory Processing Interventions →'],
 ['/communication','View Communication Interventions →'],
 ['/social-emotional-development','View Social-Emotional Interventions →'],
 ['/behavior','View Behaviour Interventions →'],
 ['/daily-living-skills','View Daily Living Skills Interventions →'],
 ['/motor-skills','View Motor Skills Interventions →'],
 ['/play-cognitive','View Play and Cognitive Interventions →'],
 ['/school-academic','View School and Academic Interventions →'],
 ['/transitions-life-events','View Transitions and Life Events Interventions →'],
 ['/community-outings','View Community and Outings Interventions →'],
 ['/family-caregiver','View Family and Caregiver Interventions →'],
 ['/therapy-implementation','View Therapy Implementation Interventions →']
];
export function repairInterventionsIndexHTML(html){
 if(typeof html!=='string'||html.length>2*1024*1024)return null;
 const preview=/<h2\b[^>]*>\s*Preview of index Therapy Material\s*<\/h2>\s*<p\b[^>]*>\s*Below is a visual preview of index therapy material\.[^<]*<\/p>/gi;
 if([...html.matchAll(preview)].length!==1||[...html.matchAll(/<main\b[^>]*>/gi)].length!==1||[...html.matchAll(/<\/head\s*>/gi)].length!==1)return null;
 let removed=0;
 let fixed=html.replace(preview,'').replace(/<button\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/button\s*>/gi,button=>button.includes(invalidPDF)?(removed++,''):button);
 if(removed!==2||fixed.includes(invalidPDF))return null;
 const links=domains.filter(([path])=>html.includes('href="'+origin+path+'"')||html.includes("href='"+origin+path+"'"));
 if(links.length!==domains.length)return null;
 const hasCanonical=[...fixed.matchAll(/<link\b[^>]*>/gi)].some(([tag])=>/\brel\s*=\s*(?:"[^"]*\bcanonical\b[^"]*"|'[^']*\bcanonical\b[^']*'|canonical(?=[\s>]))/i.test(tag));
 if(!hasCanonical)fixed=fixed.replace(/<\/head\s*>/i,'<link rel="canonical" href="'+origin+'/"></head>');
 const heading=/<h1(?:\s|>)/i.test(fixed)?'':'<h1>'+title+'</h1>';
 const intro='<section data-pinnacle-interventions-index="true">'+heading+'<nav aria-label="Intervention domains"><ul>'+links.map(([path,label])=>'<li><a href="'+origin+path+'">'+label+'</a></li>').join('')+'</ul></nav></section>';
 return fixed.replace(/<main\b[^>]*>/i,tag=>tag+intro);
}
export async function repairInterventionsIndex(request,response){
 const u=new URL(request.url);
 if(u.origin!==origin||!['/','/index.html'].includes(u.pathname)||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type')||'')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const fixed=repairInterventionsIndexHTML(await response.clone().text());if(fixed===null)return response;
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','content-md5','digest'])headers.delete(k);
 headers.set('x-pinnacle-interventions-index','20261016');
 return new Response(fixed,{status:response.status,statusText:response.statusText,headers});
}
export function createInterventionsIndexWrapper(original){return {...original,async fetch(request,env,ctx){return repairInterventionsIndex(request,await original.fetch(request,env,ctx));}};}
