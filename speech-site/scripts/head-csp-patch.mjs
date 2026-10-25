import assert from 'node:assert/strict';import{createHash}from'node:crypto';
export const sha=b=>createHash('sha256').update(b).digest('hex');
export function patchHeadCsp(before){
 const start=before.indexOf('function applyPublicAdCall(');assert(start>=0);const end=before.indexOf('// deployment/shared-navigation.mjs',start);assert(end>start);const section=before.slice(start,end);
 const gate='request.method !== "GET" || u.hostname',marker='  headers.set("x-pinnacle-ad-call-coverage", "public-20261007");\n';assert.equal(section.split(gate).length,2);assert.equal(section.split(marker).length,2);
 const after=section.replace(gate,'!["GET", "HEAD"].includes(request.method) || u.hostname').replace(marker,marker+'  if (request.method === "HEAD") return new Response(null, { status: response.status, statusText: response.statusText, headers });\n');
 return before.slice(0,start)+after+before.slice(end);
}
