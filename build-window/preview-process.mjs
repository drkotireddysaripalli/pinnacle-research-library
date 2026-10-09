import {spawn} from 'node:child_process';
import net from 'node:net';

// Own the server itself: Windows cannot forward SIGTERM through a wrapper.
export function startPreview({script,cwd,port,env=process.env,stdio='ignore'}) {
  return spawn(process.execPath,[script],{cwd,env:{...env,QUALITY_PREVIEW_PORT:String(port)},stdio,windowsHide:true});
}

export async function stopPreview(child,port) {
  let closed=child.exitCode!==null||child.signalCode!==null;
  if(!closed)closed=await new Promise(resolve=>{
    const timer=setTimeout(()=>resolve(false),5000);
    child.once('close',()=>{clearTimeout(timer);resolve(true);});
    child.kill('SIGTERM');
  });
  if(!closed)return false;
  // A successful parent exit alone is insufficient; require the listener gone.
  return new Promise(resolve=>{
    const socket=net.connect({host:'127.0.0.1',port:Number(port)});
    socket.setTimeout(1000);
    socket.once('connect',()=>{socket.destroy();resolve(false);});
    socket.once('error',error=>resolve(error.code==='ECONNREFUSED'));
    socket.once('timeout',()=>{socket.destroy();resolve(false);});
  });
}
