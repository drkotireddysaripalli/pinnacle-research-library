import {repairContentLinks} from './links';
export async function rpc(env:any,name:string,body:any={}){
 if(!env.SUPABASE_URL||!env.SUPABASE_KEY)throw new Error('Public content connection is unavailable');
 const cacheable=name!=='ask_public_search';
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(name+JSON.stringify(body)));
 const key=new Request('https://pinnacleblooms.org/ask/__rpc/astro-20261003-v3-reading-paths/'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join(''));
 const cache=cacheable?(caches as any).default:null;
 if(cache){const saved=await cache.match(key);if(saved)return saved.json();}
 const response=await fetch(env.SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:env.SUPABASE_KEY,authorization:'Bearer '+env.SUPABASE_KEY,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(9000)});
 if(!response.ok)throw new Error('Public content lookup unavailable ('+response.status+')');
 const data=await response.json();
 if(cache)await cache.put(key,new Response(JSON.stringify(data),{headers:{'content-type':'application/json','cache-control':'public,max-age=60'}}));
 return data;
}
// Older published answers store resources as {count, items}; newer records
// use arrays. Normalise at the content boundary for HTML and machine exports.
export function resourceItems(value:any):Record<string,any>[] {
 const items=Array.isArray(value)?value:Array.isArray(value?.items)?value.items:[];
 return items.filter((item:any)=>item!==null&&typeof item==='object'&&!Array.isArray(item));
}
export async function answer(env:any,slug:string,lang='en'){
 if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,240}$/.test(slug))return null;
 const actual=lang==='te'&&!slug.endsWith('-te')?slug+'-te':slug;
 const a=await rpc(env,'ask_portal_answer',{p_slug:actual,p_lang:lang});
 if(!a||typeof a.slug!=='string')return null;
 return {...a,answer_md:repairContentLinks(a.answer_md||''),related_materials:resourceItems(a.related_materials),related_techniques:resourceItems(a.related_techniques)};
}
export const directory=(env:any,kind:string,lang='en',page=1)=>rpc(env,'ask_portal_directory',{p_kind:kind,p_lang:lang,p_page:page});
export const collection=(env:any,kind:string,value:string,lang='en',page=1)=>rpc(env,'ask_portal_collection',{p_kind:kind,p_value:value,p_lang:lang,p_page:page});
export async function search(env:any,q:string){const data=await rpc(env,'ask_public_search',{p_q:q,p_k:12});if(Array.isArray(data))return data;if(Array.isArray(data?.results))return data.results;throw new Error('Invalid public search response');}
