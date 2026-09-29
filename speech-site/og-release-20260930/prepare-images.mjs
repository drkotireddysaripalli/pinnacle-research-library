import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const dir=path.resolve('og-release-20260930'),mf=path.join(dir,'manifest.json');
const manifest=JSON.parse(await fs.readFile(mf,'utf8'));
await fs.mkdir(path.join(dir,'images'),{recursive:true});
await fs.mkdir(path.join(dir,'thumbnails'),{recursive:true});
for(const e of manifest.assets){
 const input=path.join(dir,e.original),output=path.join(dir,e.replacement);
 const original=await sharp(input).metadata();
 assert.equal(original.width,1920);assert.equal(original.height,1008);
 await sharp(input).resize(1200,630).jpeg({quality:92,chromaSubsampling:'4:4:4',mozjpeg:true}).toFile(output);
 const bytes=await fs.readFile(output);
 e.sha256=crypto.createHash('sha256').update(bytes).digest('hex');
 e.width=1200;e.height=630;e.bytes=bytes.length;
 e.generator='OpenAI Images API via approved skill CLI';e.model='gpt-image-2';
 await sharp(output).resize(400,210).jpeg({quality:92}).toFile(path.join(dir,'thumbnails',e.id+'.jpg'));
}
await fs.writeFile(mf,JSON.stringify(manifest,null,2)+'\n');
const labels={'occupational':'Occupational Therapy','aba':'ABA Therapy','special-education':'Special Education','autism':'Autism Therapy','centres':'Find a Centre'};
const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pinnacle OG image replacements · 30 September 2026</title><style>body{font-family:system-ui;background:#fff;color:#091650;margin:32px auto;max-width:1280px;padding:0 20px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px}img{width:100%;height:auto;border:1px solid #e0e5eb;border-radius:12px}h1{font-size:28px}h2{font-size:20px}a{color:inherit}p{line-height:1.5}</style><h1>Five updated Pinnacle social images</h1><p>1200 × 630 JPEGs. Complete branded creatives generated with gpt-image-2 through the approved API fallback. Select an image to open the full file.</p><main>'+manifest.assets.map(e=>'<section><h2>'+labels[e.id]+'</h2><a href="'+e.replacement+'"><img src="'+e.replacement+'" width="1200" height="630" alt="'+labels[e.id]+' branded social image"></a><p>Phone: 9100 181 181 · PinnacleAI GPT-OS · Class B SaMD · Verify</p></section>').join('')+'</main></html>';
await fs.writeFile(path.join(dir,'review.html'),html);
console.log(JSON.stringify(manifest.assets.map(({id,width,height,bytes,sha256})=>({id,width,height,bytes,sha256})),null,2));
