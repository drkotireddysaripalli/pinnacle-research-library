// Observed metadata only. Never fetch this origin or treat it as authenticated
// provenance, a paid click, a campaign label, or a genuine-family classification.
export function normaliseReferrerOrigin(value,ownOrigin='https://www.pinnacleblooms.org') {
 if(typeof value!=='string'||!value||value.length>8192||/[\u0000-\u0020\u007f\\]/.test(value))return null;
 try{
  const url=new URL(value);
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.port)return null;
  const host=url.hostname.toLowerCase().replace(/\.$/,'');
  if(host.length>253||!host.includes('.')||host.includes(':')||/^\d+(?:\.\d+){3}$/.test(host))return null;
  const labels=host.split('.');
  if(labels.some(label=>!label||label.length>63||!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))||!/^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/.test(labels.at(-1)))return null;
  const reserved=['localhost','local','internal','lan','home','invalid','test','example','onion','arpa','intranet','corp'];
  if(reserved.some(suffix=>host===suffix||host.endsWith('.'+suffix)))return null;
  const ownHost=new URL(ownOrigin).hostname.toLowerCase().replace(/\.$/,'').replace(/^www\./,'');
  if(host===ownHost||host.endsWith('.'+ownHost))return null;
  url.hostname=host;
  return url.origin;
 }catch{return null;}
}
export function originOnlyAcquisition(retained,referrer,landingPath,capturedAt=Date.now()) {
 // A valid retained source (including paid) wins, and its clock is not renewed.
 if(retained)return retained;
 const referrerOrigin=normaliseReferrerOrigin(referrer);
 return referrerOrigin?{schemaVersion:1,consent:'analytics_accepted',capturedAt,landingPath,fields:{},referrerOrigin}:null;
}
