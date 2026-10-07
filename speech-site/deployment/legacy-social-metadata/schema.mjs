import {repairLegacyIdentity} from './organization.mjs';
import {isMissingMedia} from './media.mjs';
// Correct observed term spellings and named legacy entity data types only.
// Preserve numeric tokens, visible text, navigation and commerce records.
export const SCHEMA_LIMIT = 256 * 1024;

export function repairSchemaText(text) {
  if (text.length > SCHEMA_LIMIT) return text;
  try {
    JSON.parse(text); // Syntax validation only: never reserialize numeric values.
    const tokens=[...text.matchAll(/"(?:\\[\s\S]|[^"\\])*"|[{}\[\]:,]|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/g)];
    let index=0, safe=true;
    const schemaContext=node=>node?.kind==='string' && /^https?:\/\/schema\.org\/?$/.test(node.value);
    function read() {
      const token=tokens[index++], raw=token[0];
      if(raw==='{' || raw==='[') {
        const node={kind:raw==='{'?'object':'array',properties:new Map(),children:[]};
        const close=raw==='{'?'}':']';
        while(tokens[index][0]!==close) {
          if(raw==='{') {
            const key=tokens[index++],name=JSON.parse(key[0]);index++; // colon
            const value=read();
            if(node.properties.has(name)) safe=false; // Ambiguous duplicate keys bypass.
            node.properties.set(name,{key,value});node.children.push(value);
          } else node.children.push(read());
          if(tokens[index][0]===',') index++;
        }
        index++;return node;
      }
      return {kind:raw.startsWith('"')?'string':'primitive',value:raw.startsWith('"')?JSON.parse(raw):raw,token};
    }
    const tree=read(),roots=tree.kind==='array'?tree.children:[tree];
    if(!roots.every(root=>root.kind==='object' && schemaContext(root.properties.get('@context')?.value))) return text;
    const patches=[];
    function visit(node) {
      if(node.kind==='object') {
        const props=node.properties,context=props.get('@context');
        if(context && !schemaContext(context.value)) safe=false;
        const type=props.get('@type')?.value;
        const image=props.get('image');
        if(image?.value.kind==='string'&&isMissingMedia(image.value.value)){
          let start=image.key.index,end=image.value.token.index+image.value.token[0].length;
          const after=text.slice(end).match(/^\s*,/),before=text.slice(0,start).match(/,\s*$/);
          if(after)end+=after[0].length;else if(before)start-=before[0].length;
          patches.push({start,end,value:''});
        }
        if(type?.kind==='string' && type.value==='Webpage') patches.push({token:type.token,value:'"WebPage"'});
        const old=props.get('xPath');
        if(type?.value==='SpeakableSpecification' && old?.value.kind==='array' &&
            old.value.children.every(child=>child.kind==='string') && !props.has('xpath')) patches.push({token:old.key,value:'"xpath"'});
        const namedEntity=(key,name,entityType)=>{
          const value=props.get(key)?.value;
          if(value?.kind==='string'&&value.value===name)patches.push({token:value.token,value:JSON.stringify({'@type':entityType,name})});
        };
        if(type?.value==='Book'){
          namedEntity('author','Dr. Sreeja Reddy Saripalli','Person');
          namedEntity('publisher','notionpress','Organization');
        }
        if(['Webpage','WebPage'].includes(type?.value))namedEntity('publisher','Pinnacle','Organization');
      }
      for(const child of node.children||[]) visit(child);
    }
    visit(tree);
    if(!safe) return text;
    // Splice only identified string tokens; all other bytes (including large
    // integers, whitespace, escapes and clinical/identity values) stay exact.
    for(const patch of patches.sort((a,b)=>(b.start??b.token.index)-(a.start??a.token.index))) {const start=patch.start??patch.token.index,end=patch.end??(start+patch.token[0].length);text=text.slice(0,start)+patch.value+text.slice(end);}
    return text;
  } catch { return text; }
}

class LegacySchemaScript {
  constructor(requestUrl) { this.requestUrl=requestUrl; }
  element(element) {
    this.pass = (element.getAttribute('type') || '').trim().toLowerCase() !== 'application/ld+json';
    this.buffer = '';
    if (!this.pass) {
      const escape = value => value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
      this.open = '<script'+[...element.attributes].map(([key,value])=>' '+key+'="'+escape(value)+'"').join('')+'>';
      this.streaming = false;
      element.removeAndKeepContent();
    }
  }
  async text(chunk) {
    if (this.pass) return;
    if (this.streaming) {
      if (chunk.lastInTextNode) chunk.after('</script>', {html:true});
      return;
    }
    this.buffer += chunk.text;
    if (this.buffer.length > SCHEMA_LIMIT) {
      chunk.replace(this.open+this.buffer+(chunk.lastInTextNode?'</script>':''), {html: true});
      this.buffer = ''; this.streaming = true;
    } else if (!chunk.lastInTextNode) chunk.remove();
    else {
      const cleaned=await repairLegacyGraph(this.buffer,this.requestUrl);
      chunk.replace(cleaned===null?'':this.open+cleaned+'</script>', {html: true});
      this.buffer = '';
    }
  }
}

async function repairPhysiotherapyCollection(text, normalized) {
  const canonical='https://www.pinnacleblooms.org/physiotherapy', identities=[];
  // The captured origin template varies only these two top-level URL strings.
  // Entry has already checked the public response and its canonical/query choice.
  const template=normalized.replace(/^([ \t]*"(?:id|url)"[ \t]*:[ \t]*)("(?:\\[\s\S]|[^"\\])*")/gm,(_,prefix,token)=>{
    identities.push(JSON.parse(token).replace(/&(?:amp;)+/gi,'&'));
    return prefix+JSON.stringify('http://www.pinnacleblooms.org/physiotherapy');
  });
  if(identities.length!==2 || identities[0]!==identities[1])return text;
  try {
    const url=new URL(identities[0]);
    if(!['http:','https:'].includes(url.protocol)||url.hostname!=='www.pinnacleblooms.org'||url.pathname!=='/physiotherapy'||url.port||url.username||url.password||url.hash)return text;
  } catch {return text;}
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(template))),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!=='bf6caa0a32cf9863d60110e924e8f72d3b59c78793311de1a69419790cda9f86')return text;
  const data=JSON.parse(normalized.replace('//begin bracket for multiple entries under image','').replace('//end bracket for ImageGallery > image(s)','').replace('//end bracket for mainEntityOfPage',''));
  data['@context']='https://schema.org';data['@id']=canonical;data.url=canonical;delete data.id;
  return JSON.stringify(data);
}

async function repairPhysiotherapyWebPage(text, requestUrl) {
  const canonical='https://www.pinnacleblooms.org/physiotherapy';
  const tracking=new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
  let request;
  try { request=new URL(requestUrl); } catch { return text; }
  if(request.origin!=='https://www.pinnacleblooms.org'||request.pathname.replace(/\/$/,'')!=='/physiotherapy')return text;
  if(![...request.searchParams.keys()].every(key=>tracking.has(key)))return text;
  try { JSON.parse(text); } catch { return text; }
  const identities=[];
  const template=text.trim().replaceAll('\r\n','\n').replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g,(_,prefix,token)=>{
    identities.push(JSON.parse(token).replace(/&(?:amp;)+/gi,'&'));
    return prefix+JSON.stringify(canonical.replace('https:','http:'));
  });
  for(const value of identities){
    let url;try { url=new URL(value); } catch { return text; }
    if(!['http:','https:'].includes(url.protocol)||url.hostname!=='www.pinnacleblooms.org'||url.pathname!=='/physiotherapy'||url.port||url.username||url.password||url.hash||(url.search&&url.search!==request.search))return text;
  }
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(template))),b=>b.toString(16).padStart(2,'0')).join('');
  const counts={'a4c150bfb94f1dd5d52a9dfdf8ce60a04bddca94d456f6dc2c7494c20828de45':1,'f0e1af01086fa25851391c2cbaa1f86441c6f6494d5c0ccb91853cd06468b05b':2};
  if(counts[digest]!==identities.length)return text;
  // Exact observed WebPage payloads only; retain every non-identity byte.
  return text.replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g,(_,prefix)=>prefix+JSON.stringify(canonical));
}

export async function repairLegacyGraph(text, requestUrl) {
  if(text.length>SCHEMA_LIMIT)return text;
  const normalized=text.trim().replaceAll('\r\n','\n');
  if(requestUrl && new URL(requestUrl).pathname==='/therapeuticai-effectiveness-study' && normalized.includes('"@type": "MedicalStudy"')) {
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized))),b=>b.toString(16).padStart(2,'0')).join('');
    if(digest==='5de8875439e3d8882ca65217746eb6a79851944fd349c7bc0750dd8e09be6821'){
      const repaired=text.replace(/}\s*},\s*"softwareRequirements"/,'},\n    "softwareRequirements"');
      try{if(JSON.parse(repaired)['@type']==='MedicalStudy')text=repaired;}catch{return text;}
    }
  }
  // Exact Navaratri article: the origin placed unescaped CSS backslashes into
  // JSON. Escape those bytes for JSON rather than changing its article/CSS.
  // Unknown articles, changed content and private responses are not rewritten.
  if(requestUrl && /^\/guru\/6385\//i.test(new URL(requestUrl).pathname) && normalized.includes('"@type": "NewsArticle"')) {
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized))),b=>b.toString(16).padStart(2,'0')).join('');
    if(digest==='da6310191ba09480105f13f63e404b78b06a36ce60088249d6afcf9aa86caa0b') {
      const repaired=text.replace(/(?<!\\)\\%/g,'\\\\%');
      try { if(JSON.parse(repaired)['@type']==='NewsArticle')text=repaired; } catch { return text; }
    }
  }
  if (normalized.includes('"@type": "JobPosting"')) {
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized))),b=>b.toString(16).padStart(2,'0')).join('');
    // Exact shared five-job graph captured on therapy/story pages on 6 October.
    // Every job expires on 31 December 2025. Retire only this obsolete payload;
    // changed vacancies, mixed graphs and other JobPosting scripts pass through.
    if(digest==='eee6f24856abce7f793489c5335315d223fb8d25b33260dd420a25a91f6b9ebe')return null;
  }
  if (normalized.includes('"@type": "SpecialAnnouncement"') || normalized.includes('"@type": "CollectionPage"')) {
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized))),b=>b.toString(16).padStart(2,'0')).join('');
    // Exact malformed, expired shared COVID announcement and malformed dance
    // collection payload captured on 6 October. Do not reassert stale claims.
    if (['3b882bc81f30917b7b7971a18ef1717777912bb505f3cfb87aed8dbe2fbbd037','7181eeec2f921b7ece2f8451f343d6e61d16e806478213dc3ec3b8c675653b02'].includes(digest)) return null;
    if(normalized.includes('"@type": "CollectionPage"'))text=await repairPhysiotherapyCollection(text,normalized);
  }
  return repairPhysiotherapyWebPage(repairSchemaText(await repairLegacyIdentity(repairObservedCollection(text,requestUrl))),requestUrl);
}

// The residual service collections contain these three literal JavaScript
// comments in JSON-LD. Correct only the observed object structure and its own
// public URL; preserve all descriptions, images, dates and numeric values.
export function repairObservedCollection(text,requestUrl) {
  if(text.length>SCHEMA_LIMIT||!requestUrl)return text;
  const comments=['//begin bracket for multiple entries under image','//end bracket for ImageGallery > image(s)','//end bracket for mainEntityOfPage'];
  if(!comments.every(c=>text.includes(c)))return text;
  try{
    const u=new URL(requestUrl),clean=comments.reduce((s,c)=>s.replace(c,''),text),data=JSON.parse(clean);
    const tracking=new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
    // These templates HTML-escape ampersands even inside JSON-LD URL strings.
    // Compare the decoded identity only; keep every non-URL field unchanged.
    const identity=data.url?.replace(/&(?:amp|#0*38|#x0*26);/gi,'&');
    if(u.origin!=='https://www.pinnacleblooms.org'||data['@context']!=='http://schema.org'||data['@type']!=='CollectionPage'||
      u.hash||u.username||u.password||[...u.searchParams.keys()].some(k=>!tracking.has(k))||
      data.id!==data.url||new URL(identity).href!==u.href.replace(/^https:/,'http:')||
      Object.keys(data).sort().join(',')!=='@context,@type,description,id,mainEntityOfPage,url'||
      data.mainEntityOfPage?.['@type']!=='ImageGallery'||!Array.isArray(data.mainEntityOfPage.image)||
      !data.mainEntityOfPage.image.every(i=>i['@type']==='ImageObject'&&typeof i.url==='string'))return text;
    let result=clean.replace(/("@context"\s*:\s*)"http:\/\/schema.org"/,'$1"https://schema.org"');
    result=result.replace(/([{,]\s*)"id"(?=\s*:)/,'$1"@id"');
    result=result.replace(/("(?:@id|url)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g,(all,prefix,raw)=>
      JSON.parse(raw)===data.url?prefix+JSON.stringify(u.origin+u.pathname):all);
    return result;
  }catch{return text;}
}

export function repairKnownLegacySchema(response, requestUrl) {
  // Entry's private WeakSet establishes the public-response/canonical guards.
  // An origin header can never opt a response into this transform.
  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest']) headers.delete(name);
  headers.set('x-pinnacle-legacy-schema', 'schema-entity-types-20261006');
  return new HTMLRewriter().on('script:not([src])', new LegacySchemaScript(requestUrl))
    .transform(new Response(response.body, {status: response.status, statusText: response.statusText, headers}));
}
