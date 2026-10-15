import assert from 'node:assert/strict';
export function r2MetadataPage(data,{pageSize=1000,inputCursor=null}={}){
  assert(Array.isArray(data.result),'R2 metadata result must be an array');
  assert(Number.isInteger(pageSize)&&pageSize>0&&data.result.length<=pageSize,'R2 page size contract changed');
  const info=data.result_info||{},cursor=info.cursor||null;
  assert(cursor===null||typeof cursor==='string','Invalid R2 continuation cursor');
  if(typeof info.is_truncated==='boolean'){
    if(info.is_truncated)assert(cursor&&cursor!==inputCursor,'Missing or repeated R2 cursor');
    return{truncated:info.is_truncated,nextCursor:info.is_truncated?cursor:null,evidence:'explicit-truncation-flag'};
  }
  assert(info.is_truncated===undefined&&!cursor&&data.result.length<pageSize,'Missing complete pagination evidence');
  // The endpoint honours per_page and omits result_info for short final pages.
  // A full page without a continuation contract is deliberately rejected.
  return{truncated:false,nextCursor:null,evidence:'short-terminal-page-without-cursor'};
}
