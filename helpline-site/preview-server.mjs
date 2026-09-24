import http from 'node:http';
import {readFile} from 'node:fs/promises';
import worker from './worker.mjs';

// Loopback preview only. Preserve production host validation by constructing the matching Worker Request.
const server = http.createServer(async (req, res) => {
  try {
    if(req.url==='/share-card.svg'){
      res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'no-store'});
      res.end(await readFile(new URL('./share-card.svg',import.meta.url)));return;
    }
    const path = req.url === '/' ? '/national-autism-helpline' : req.url;
    const response = await worker.fetch(new Request('https://www.pinnacleblooms.org' + path, { method: req.method }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Preview error');
  }
});
server.listen(8787, '127.0.0.1', () => console.log('Local preview: http://127.0.0.1:8787/national-autism-helpline'));
