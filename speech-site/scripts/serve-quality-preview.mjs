// Isolated loopback-only test preview; leaves the owner's Astro preview running.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {brotliCompress} from 'node:zlib';
import {promisify} from 'node:util';

const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8','.xml':'application/xml'};
const brotli=promisify(brotliCompress);
const server=http.createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const target=path.resolve(root,'.'+pathname),relative=path.relative(root,target);
    if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);res.end();return;}
    let file=target;
    if(pathname==='/')file=path.join(root,'index.html');
    else if(!path.extname(pathname))file=target+'.html';
    const bytes=await fs.readFile(file),type=mime[path.extname(file)]||'application/octet-stream',compressible=/^(?:text\/|application\/(?:json|javascript|xml))/.test(type),useBrotli=compressible&&bytes.length>1024&&/\bbr\b/.test(req.headers['accept-encoding']||'');
    const body=useBrotli?await brotli(bytes):bytes;
    res.writeHead(200,{'content-type':type,'content-length':String(body.length),'cache-control':'no-store',...(useBrotli?{'content-encoding':'br','vary':'accept-encoding'}:{})});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end();}
});
server.listen(Number(process.env.QUALITY_PREVIEW_PORT || 4340),'127.0.0.1');
process.on('SIGTERM',()=>server.close());
process.on('SIGINT',()=>server.close());
