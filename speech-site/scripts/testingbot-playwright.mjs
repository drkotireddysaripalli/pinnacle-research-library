// Optional Chrome/Windows TestingBot transport. The existing suite owns assertions.
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
const elementKey='element-6066-11e4-a52e-4f735466cecf';
const analyticsHost=/(^|\.)(?:google-analytics\.com|googletagmanager\.com|googleadservices\.com|googlesyndication\.com|doubleclick\.net|clickguard\.com|clarity\.ms|hotjar\.com|hotjar\.io|aseasky\.link)$/i;
const catalogueQuery='{products(first:50){nodes{variants(first:10){nodes{id sku availableForSale requiresShipping price{amount currencyCode}}}}}}';
export function permittedCatalogueRead(request) {
 const url=new URL(request.url());
 if(url.origin!=='https://pinnacleblooms.myshopify.com'||url.pathname!=='/api/2026-10/graphql.json'||url.search)return false;
 if(request.method()==='OPTIONS')return request.headers()['access-control-request-method']==='POST';
 if(request.method()!=='POST')return false;
 try{const raw=request.postData();if(!raw||raw.length>2048)return false;const data=JSON.parse(raw);return Object.keys(data).every(k=>['query','variables'].includes(k))&&typeof data.query==='string'&&data.query.replace(/\s+/g,'')===catalogueQuery.replace(/\s+/g,'')&&data.variables&&typeof data.variables==='object'&&!Array.isArray(data.variables)&&Object.keys(data.variables).length===0;}catch{return false;}
}
export function blockedTracking(url) {
 return analyticsHost.test(url.hostname)||['protect.pinnacleblooms.org','api.whatsapp.com'].includes(url.hostname)||url.hostname==='www.facebook.com'&&url.pathname==='/tr/'||['www.google.com','google.com','www.google.co.in','google.co.in'].includes(url.hostname)&&(/^\/(?:g\/collect|ccm\/collect)(?:\/|$)/.test(url.pathname)||url.pathname.startsWith('/pagead/'))||url.pathname==='/cdn-cgi/rum';
}
export function assertPlaywrightScope({matrixId,network,visual,build,tunnel}) {
  if(matrixId!=='chrome'||network||visual||build||tunnel)throw Error('Playwright transport is limited to public Chrome/Windows functional suites; use WebDriver for visual, network, tunnel/build and other devices');
}
function credentials(){
 let key=process.env.TESTINGBOT_KEY,secret=process.env.TESTINGBOT_SECRET;
 if(!key||!secret){
  if(process.platform!=='win32')throw Error('TestingBot credentials required');
  const file=path.join(os.homedir(),'.testingbot','pinnacle-credentials.clixml');
  const ps="$c=Import-Clixml -LiteralPath '"+file.replaceAll("'","''")+"'; @{key=$c.UserName;secret=$c.GetNetworkCredential().Password}|ConvertTo-Json -Compress";
  ({key,secret}=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']})));
 }
 return {key,secret};
}
export async function playwrightCommands({browser,context,page}) {
 const handles=new Map(),logs=[];let sequence=0,implicit=1000,pageLoad=60000,scriptTimeout=20000;
 const keep=element=>{const id='pw-'+(++sequence);handles.set(id,element);return {[elementKey]:id};};
 const handle=id=>{const h=handles.get(id);if(!h)throw Error('Unknown WebDriver-compatible element reference');return h;};
 page.on('console',message=>{if(message.type()==='error')logs.push({level:'SEVERE',message:message.text()});});
 page.on('pageerror',error=>logs.push({level:'SEVERE',message:'Uncaught '+error.name+': '+error.message}));
 const evaluate=async(script,args,asyncMode)=>{
  if(String(script).startsWith('tb:'))throw Error('TestingBot special visual/network commands require WebDriver transport');
  const result=await page.evaluateHandle(({script,args,asyncMode,scriptTimeout})=>new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('Browser script exceeded configured timeout')),scriptTimeout);
   const done=value=>{clearTimeout(timer);resolve(value);};
   try{const fn=new Function(script);if(asyncMode)fn.apply(null,[...args,done]);else Promise.resolve(fn.apply(null,args)).then(done,reject);}catch(e){clearTimeout(timer);reject(e);}
  }),{script,args,asyncMode,scriptTimeout});
  const element=result.asElement();if(element)return keep(element);
  try{return await result.jsonValue();}finally{await result.dispose();}
 };
 return async(suffix,method='GET',body)=>{
  if(suffix==='/timeouts'&&method==='POST'){implicit=body.implicit??implicit;pageLoad=body.pageLoad??pageLoad;scriptTimeout=body.script??scriptTimeout;page.setDefaultTimeout(implicit);page.setDefaultNavigationTimeout(pageLoad);return null;}
  // WebDriver-style calibration operates on actual CSS viewport, not a claim
  // that Playwright changes the host OS display or physical screen dimensions.
  if(suffix==='/window/rect'){
   if(method==='POST')await page.setViewportSize({width:Math.round(body.width),height:Math.round(body.height)});
   const view=page.viewportSize();return {x:0,y:0,...view};
  }
  if(suffix==='/url'&&method==='POST'){for(const h of handles.values())try{await h.dispose()}catch{};handles.clear();await page.goto(body.url,{waitUntil:'load',timeout:pageLoad});return null;}
  if(suffix==='/url'&&method==='GET')return page.url();
  if(suffix==='/execute/async')return evaluate(body.script,body.args||[],true);
  if(suffix==='/execute/sync')return evaluate(body.script,body.args||[],false);
  if(suffix==='/element'&&method==='POST'){
   if(body.using!=='css selector')throw Error('Unsupported element locator');
   const element=await page.waitForSelector(body.value,{state:'attached',timeout:Math.max(1,implicit)});if(!element)throw Error('Missing element');return keep(element);
  }
  const click=suffix.match(/^\/element\/([^/]+)\/click$/);
  if(click&&method==='POST'){await handle(click[1]).click({timeout:pageLoad});return null;}
  if(suffix==='/actions'&&method==='POST'){
   for(const device of body.actions){if(device.type!=='pointer'||device.parameters?.pointerType!=='mouse')throw Error('Unsupported action device');for(const action of device.actions){if(action.type!=='pointerMove'||!action.origin?.[elementKey])throw Error('Unsupported pointer action');const box=await handle(action.origin[elementKey]).boundingBox();if(!box)throw Error('Pointer target is not visible');await page.mouse.move(box.x+box.width/2+(action.x||0),box.y+box.height/2+(action.y||0),{steps:Math.max(1,Math.ceil((action.duration||0)/50))});}}
   return null;
  }
  if(suffix==='/screenshot'&&method==='GET')return (await page.screenshot({type:'png',fullPage:false})).toString('base64');
  if(suffix==='/log'&&method==='POST'){if(body.type!=='browser')throw Error('Unsupported log kind');return logs.splice(0);}
  if(suffix===''&&method==='DELETE'){for(const h of handles.values())try{await h.dispose()}catch{};await context.close();await browser.close();return null;}
  throw Error('Unsupported WebDriver-compatible command '+method+' '+suffix);
 };
}
export async function openTestingBotPlaywright({client,config,device,options}) {
 const secure=credentials(),uniqueBuild=options.build+'-pw-'+Date.now();let browser;
 try{
  browser=await chromium.connect({wsEndpoint:'wss://cloud.testingbot.com/playwright?capabilities='+encodeURIComponent(JSON.stringify({browserName:'chrome',browserVersion:device.version,platform:'WIN11','tb:options':{...options,...secure,build:uniqueBuild}})),timeout:180000});
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},serviceWorkers:'block'}),blocked={analytics:0,writes:0,permittedCatalogueReads:0};
  await context.route('**/*',route=>{
   const request=route.request(),url=new URL(request.url());
   if(blockedTracking(url)){blocked.analytics++;return route.abort();}
   if(permittedCatalogueRead(request)){blocked.permittedCatalogueReads++;return route.continue();}
   if(!['GET','HEAD'].includes(request.method())){blocked.writes++;return route.abort();}
   return route.continue();
  });
  const page=await context.newPage();let match;
  for(let attempt=0;attempt<3&&!match;attempt++){
   const recent=await client.api('/tests?limit=10');match=(recent.data||[]).find(r=>r.build===uniqueBuild);
   if(!match&&attempt<2)await new Promise(resolve=>setTimeout(resolve,500));
  }
  if(!match?.session_id)throw Error('Connected provider session identity was not returned');
  const wd=await playwrightCommands({browser,context,page});
  return {wd,sessionId:match.session_id,capabilities:{browserName:'chrome',browserVersion:browser.version(),platformName:match.os||'WIN11',transport:'playwright-websocket',viewportMode:'CSS viewport; OS window resize not claimed'},blocked,uniqueBuild};
 }catch(error){if(browser)try{await browser.close()}catch{};throw Error(client.redact(String(error.message).replace(/wss:\/\/cloud\.testingbot\.com\/playwright\?[^\s]+/g,'[TestingBot WebSocket endpoint redacted]')));}
}
