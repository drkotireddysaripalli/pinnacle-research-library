'use strict';
const fs=require('node:fs'),path=require('node:path');
const cards=require('../content/social-images.json').cards;
const byRoute=new Map(cards.map(card=>[card.route,card]));
const origin='https://pinnacle-verify.saripalli.chatgpt.site';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function routeOf(url){return new URL(url).pathname.replace(/^\/verify(?=\/|$)/,'')||'/';}
function cardFor(url){const card=byRoute.get(routeOf(url));if(!card)throw Error('Missing share card: '+url);return card;}
function enhance(html,url){
 const card=cardFor(url),image=origin+card.image;
 const edition=card.id.endsWith('handbook-english')?'English':card.id.endsWith('handbook-telugu')?'Telugu':'';
 const title=card.title.replace(/[.]+$/,'')+(edition?' · '+edition:'');
 const description=title+'. '+card.note.replace(/[.]+$/,'')+'.';
 const meta=(kind,key,value)=>{const re=new RegExp('<meta '+kind+'="'+key+'" content="[^"]*">');const tag='<meta '+kind+'="'+key+'" content="'+e(value)+'">';html=re.test(html)?html.replace(re,tag):html.replace('</head>',tag+'</head>');};
 for(const key of ['og:image','og:image:secure_url'])meta('property',key,image);
 meta('property','og:image:alt',card.alt);meta('property','og:image:type','image/jpeg');
 meta('property','og:image:width',1200);meta('property','og:image:height',630);
 const isGuide=routeOf(url).startsWith('/guides/');
 if(!isGuide){meta('property','og:title',title+' | Pinnacle Verify');meta('property','og:description',description);}
 meta('name','twitter:image',image);meta('name','twitter:image:alt',card.alt);
 if(!isGuide){meta('name','twitter:title',title+' | Pinnacle Verify');meta('name','twitter:description',description);}
 // Bibliographic titles stay intact in the visible publication, citation tags and Article graph.
 if(routeOf(url).startsWith('/evidence/publications/'))html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+e(title+' | Pinnacle Research')+'</title>');
 const existingDescription=html.match(/<meta name="description" content="([^"]*)">/)?.[1];
 if(existingDescription&&!isGuide){
  let searchDescription=(existingDescription.length>160||existingDescription.includes('.. '))?description:existingDescription;
  if(searchDescription.length<110)searchDescription+=' Read the original sources and their evidence scope.';
  if(searchDescription!==existingDescription)meta('name','description',searchDescription);
 }
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(all,json)=>{
  const schema=JSON.parse(json),graph=schema['@graph'];
  const page=graph.find(x=>['WebPage','CollectionPage','AboutPage'].includes(x['@type'])&&x.url===url);
  const imageId=url+'#share-image';
  graph.push({'@type':'ImageObject','@id':imageId,url:image,contentUrl:image,width:1200,height:630,encodingFormat:'image/jpeg',name:card.title,caption:card.alt,description:'Pinnacle-branded editorial share card for this source page. Illustrative artwork is not a documented patient or outcome.',isPartOf:{'@id':page?.['@id']||url+'#page'}});
  if(page){page.image={'@id':imageId};page.primaryImageOfPage||={'@id':imageId};}
  return '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>';
 });
 return html;
}
const simple={'pinnacle-paradigm-shift':'/evidence/pinnacle-paradigm-shift.html','scale-for-every-child':'/evidence/scale-and-mission.html','scale-story-basis':'/evidence/scale-and-mission.html#scale-story-basis',research:'/evidence/research-library.html',centres:'/evidence/hfr-register.html',records:'/evidence/evidence-register.html','cite-and-reuse':'/evidence/cite.html'};
function shareTarget(url,id){
 const route=routeOf(url);
 if(route==='/evidence/research-library.html'&&byRoute.has('/evidence/publications/'+id+'.html'))return origin+'/evidence/publications/'+id+'.html';
 if(route!=='/')return null;
 if(simple[id])return origin+simple[id];
 let target;
 if(id==='scale'||id.startsWith('scale-'))target='/evidence/scale-register.html';
 if(['regulated-purpose','parents-in-licensed-use','data-scale','international-standards','population-scale','global-goals','global-principles','global-context'].includes(id)||id.startsWith('standard-'))target='/evidence/global-context.html';
 if(target){const dest=fs.readFileSync(path.join(__dirname,'../dist',target),'utf8');if(dest.includes('id="'+id+'"'))return origin+target+'#'+id;}
 return null;
}
module.exports={cards,cardFor,enhance,shareTarget};
