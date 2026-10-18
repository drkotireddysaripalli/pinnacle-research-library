// A disconnected local browser is not proof that its remote slot was released.
// Only the exact session created by this runner may be stopped.
const active=new Set(['START','RUNNING','WAITING','QUEUED','PENDING']);
export function providerIsClosed(p){
 return typeof p?.completed_at==='string'&&Number.isFinite(Date.parse(p.completed_at))&&typeof p.state==='string'&&!active.has(p.state.toUpperCase());
}
export function canAllocateAfterReport(report){
 return !!report?.finishedAt&&report.sessions?.length>0&&report.sessions.every(s=>!!s.sessionId&&s.closed===true);
}
export async function confirmProviderClosure({api,sessionId,wait=ms=>new Promise(r=>setTimeout(r,ms)),redact=String}){
 if(!/^[A-Za-z0-9-]{8,160}$/.test(sessionId||''))throw Error('Invalid exact owned provider session');
 const trace={readbacks:[],stopRequested:false,stopAccepted:false};let provider;
 const read=async()=>{
  const r=await api('/tests/'+sessionId);const p=r.test||r;
  if(p.session_id!==sessionId&&String(p.id)!==sessionId)throw Error('Provider identity does not match the owned session');
  provider=p;trace.readbacks.push({id:p.id,state:p.state??null,completedAt:p.completed_at??null});return providerIsClosed(p);
 };
 try{
  if(await read())return {closed:true,provider,trace};
  if(active.has(String(provider.state).toUpperCase())){
   trace.stopRequested=true;
   try{const stopped=await api('/tests/'+sessionId+'/stop','PUT');trace.stopAccepted=stopped.success===true;}catch(e){trace.stopError=redact(e.message);}
  }
  for(const delay of[500,1500]){await wait(delay);if(await read())return {closed:true,provider,trace};}
 }catch(e){trace.error=redact(e.message);}
 return {closed:false,provider,trace};
}
