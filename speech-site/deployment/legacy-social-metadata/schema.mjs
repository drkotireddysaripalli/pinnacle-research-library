import {repairLegacyIdentity} from './organization.mjs';
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
    for(const patch of patches.sort((a,b)=>b.token.index-a.token.index)) text=text.slice(0,patch.token.index)+patch.value+text.slice(patch.token.index+patch.token[0].length);
    return text;
  } catch { return text; }
}

class LegacySchemaScript {
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
      const cleaned=await repairLegacyGraph(this.buffer);
      chunk.replace(cleaned===null?'':this.open+cleaned+'</script>', {html: true});
      this.buffer = '';
    }
  }
}

export async function repairLegacyGraph(text) {
  const normalized=text.trim().replaceAll('\r\n','\n');
  if (normalized.includes('"@type": "SpecialAnnouncement"') || normalized.includes('"@type": "CollectionPage"')) {
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized))),b=>b.toString(16).padStart(2,'0')).join('');
    // Exact malformed, expired shared COVID announcement and malformed dance
    // collection payload captured on 6 October. Do not reassert stale claims.
    if (['3b882bc81f30917b7b7971a18ef1717777912bb505f3cfb87aed8dbe2fbbd037','7181eeec2f921b7ece2f8451f343d6e61d16e806478213dc3ec3b8c675653b02'].includes(digest)) return null;
  }
  return repairSchemaText(await repairLegacyIdentity(text));
}

export function repairKnownLegacySchema(response) {
  // Entry's private WeakSet establishes the public-response/canonical guards.
  // An origin header can never opt a response into this transform.
  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest']) headers.delete(name);
  headers.set('x-pinnacle-legacy-schema', 'schema-entity-types-20261006');
  return new HTMLRewriter().on('script:not([src])', new LegacySchemaScript())
    .transform(new Response(response.body, {status: response.status, statusText: response.statusText, headers}));
}
