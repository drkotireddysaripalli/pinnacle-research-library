// The existing published GTM loader uses this first-party protection origin.
// Add no wildcard, new vendor or unrelated permission to current public CSP.
const origin='https://www.pinnacleblooms.org',protect='https://protect.pinnacleblooms.org';
const paths=new Set(['/','/centers','/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/autism-therapy','/speech-aba-autism-assessments','/enroll-autism-speech-aba-therapies-india','/speech-therapy/service-information','/speech-therapy/first-visit-guide','/speech-therapy/teacher-observation-guide']);
export function protectionCsp(request,response){
 const u=new URL(request.url);
 if(u.origin!==origin||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!response.headers.get('content-type')?.includes('text/html')||response.headers.has('set-cookie')||/private|no-store/i.test(response.headers.get('cache-control')||'')||!(paths.has(u.pathname)||/^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(u.pathname)))return response;
 const policy=response.headers.get('content-security-policy');if(!policy)return response;
 let changed=false;const next=policy.split(';').map(part=>{const tokens=part.trim().split(/\s+/);if(!['script-src','script-src-elem','connect-src'].includes(tokens[0])||tokens.includes("'none'")||tokens.includes(protect))return part;changed=true;return part.trim()+' '+protect;}).join(';');
 if(!changed)return response;const h=new Headers(response.headers);h.set('content-security-policy',next);h.set('x-pinnacle-protection-csp','existing-protect-origin-v1');return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});
}
