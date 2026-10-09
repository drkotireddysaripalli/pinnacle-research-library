import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {startPreview,stopPreview} from './preview-process.mjs';

test('owned server starts directly and shutdown releases its listener',async()=>{
  const port=await new Promise(resolve=>{
    const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const p=server.address().port;server.close(()=>resolve(p));});
  });
  const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../speech-site');
  const child=startPreview({script:path.join(site,'scripts/serve-quality-preview.mjs'),cwd:site,port});
  let ready=false;
  try{
    for(let i=0;i<40;i++){
      try{const r=await fetch('http://127.0.0.1:'+port+'/',{signal:AbortSignal.timeout(250)});await r.body?.cancel();ready=true;break;}catch{}
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    assert.equal(ready,true,'owned server must actually listen');
    assert.equal(await stopPreview(child,port),true,'server and listener must close');
  }finally{if(child.exitCode===null&&child.signalCode===null)await stopPreview(child,port);}
});
