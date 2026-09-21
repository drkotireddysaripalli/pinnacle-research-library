'use strict';
// Imagegen supplies the text-free scenes. Exact brand copy is typeset here.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('sharp');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const ROOT=path.resolve(__dirname,'..'),DIST=path.join(ROOT,'dist'),OUT=path.join(DIST,'images/paradigm');
const data=require('../content/paradigm-story.json');
const C={navy:'#111c50',teal:'#00848a',muted:'#526777',purple:'#8d3bab',red:'#de3555',line:'#cddfe3'};
if(!GlobalFonts.registerFromPath(path.join(DIST,'fonts/anek-latin.woff2'),'PinnacleAnek'))throw Error('Anek Latin unavailable');
const font=(ctx,size,weight=650)=>{ctx.font=`${Math.round(weight/100)*100} ${size}px "PinnacleAnek"`;ctx.fontVariationSettings=`"wght" ${weight}`;ctx.textBaseline='top';};
const wrap=(ctx,value,width,size,weight=650)=>{font(ctx,size,weight);const lines=[];let line='';for(const word of value.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
function draw(ctx,value,x,y,width,size,color,weight=650,maxLines=6){const lines=wrap(ctx,value,width,size,weight);if(lines.length>maxLines)throw Error('Copy exceeds reserved area: '+value);ctx.fillStyle=color;lines.forEach((line,i)=>ctx.fillText(line,x,y+i*size*1.22));return y+lines.length*size*1.22;}
function rule(ctx,y){const g=ctx.createLinearGradient(55,0,1025,0);['#12b5c6','#8251cf','#e755a4','#f3cf3b','#6fb638'].forEach((c,i)=>g.addColorStop(i/4,c));ctx.fillStyle=g;ctx.fillRect(55,y,970,3);}
function fit(ctx,lines,width,preferred,min){for(let size=preferred;size>=min;size-=1){font(ctx,size,800);if(lines.every(s=>ctx.measureText(s).width<=width))return size;}throw Error('Headline too long: '+lines.join(' / '));}
function comparison(ctx,value,x,width,weight){for(let size=42;size>=36;size--){if(wrap(ctx,value,width,size,weight).length<=4)return draw(ctx,value,x,1392,width,size,C.navy,weight,4);}throw Error('Shorten comparison copy: '+value);}
async function main(){
 fs.mkdirSync(OUT,{recursive:true});const logo=await loadImage(path.join(DIST,'images/pinnacle-logo.webp'));const cards=[],catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'content/social-cards.json'),'utf8'));
 for(const card of data.cards){
  const key=card.artKey,artFile=path.join(ROOT,'assets/paradigm-art',key+'.webp');if(!fs.existsSync(artFile))throw Error('Missing generated artwork '+key);
  const art=await loadImage(artFile),canvas=createCanvas(1080,1920),ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1080,1920);
  ctx.drawImage(logo,54,42,390,390*logo.height/logo.width);
  draw(ctx,'PinnacleAI®',765,61,270,38,C.teal,800,1);draw(ctx,'PARADIGM SHIFT',765,107,270,24,C.muted,700,1);
  draw(ctx,'Because every child deserves a wonderful life.',55,204,970,32,C.navy,650,1);rule(ctx,259);
  draw(ctx,'0'+card.number+' / 09',56,292,165,31,C.purple,800,1);
  const label=card.eyebrow.replace(/^FROM /,'');draw(ctx,label,242,298,784,24,C.teal,750,2);
  const size=fit(ctx,card.title,970,88,62);card.title.forEach((line,i)=>draw(ctx,line,55,363+i*107,970,size,i?C.teal:C.navy,800,1));
  ctx.drawImage(art,0,581,1080,720);
  // A visible paired comparison explains the system, not the child as a before/after.
  ctx.fillStyle='#f5f6f9';ctx.beginPath();ctx.roundRect(55,1307,468,310,20);ctx.fill();
  ctx.fillStyle='#edf8f6';ctx.beginPath();ctx.roundRect(541,1307,484,310,20);ctx.fill();
  draw(ctx,'DISCONNECTED CARE CAN MEAN',77,1331,423,25,C.muted,750,1);
  draw(ctx,'THE PINNACLEAI® APPROACH',565,1331,433,26,C.teal,800,1);
  const left=comparison(ctx,card.posterDisconnected,77,416,650);
  const right=comparison(ctx,card.posterConnected,565,429,700);
  if(Math.max(left,right)>1603)throw Error('Comparison overflow '+card.id);
  const end=draw(ctx,card.posterMeaning,57,1630,968,43,C.teal,750,2);if(end>1744)throw Error('Meaning overflow '+card.id);
  rule(ctx,1761);
  draw(ctx,'Explore the approach. Check the evidence.',55,1791,785,33,C.navy,750,1);
  draw(ctx,'pinnacleblooms.org/verify',55,1838,765,34,C.teal,750,1);
  draw(ctx,'9100 181 181',55,1880,730,31,C.navy,800,1);
  const qr=path.join(ROOT,'assets/paradigm-qr',key+'.png');if(fs.existsSync(qr))ctx.drawImage(await loadImage(qr),869,1778,144,144);
  const jpeg=await sharp(canvas.toBuffer('image/png')).jpeg({quality:91,mozjpeg:true,chromaSubsampling:'4:4:4'}).toBuffer();
  const hash=crypto.createHash('sha256').update(jpeg).digest('hex').slice(0,12),stem=card.id+'-'+hash;
  const poster='/images/paradigm/'+stem+'.jpg',preview='/images/paradigm/'+stem+'-540.webp',artPath='/images/paradigm/'+key+'-art.webp';
  fs.writeFileSync(path.join(DIST,poster),jpeg);
  await sharp(jpeg).resize(540,960).webp({quality:87,effort:5}).toFile(path.join(DIST,preview));
  await sharp(artFile).resize(900,600).webp({quality:84,effort:5}).toFile(path.join(DIST,artPath));
  cards.push({id:card.id,number:card.number,artKey:key,poster,preview,art:artPath,width:1080,height:1920,bytes:jpeg.length,previewBytes:fs.statSync(path.join(DIST,preview)).size});
  const social={id:'paradigm-'+card.id,route:'/evidence/paradigm/'+card.id+'.html',title:card.title.join(' '),lines:card.title,category:'PINNACLE PARADIGM SHIFT · '+key+' / 09',note:card.posterConnected,icon:'network',description:card.lead,cover:poster};
  const found=catalog.findIndex(c=>c.route===social.route);if(found<0)catalog.push(social);else catalog[found]=social;
 }
 fs.writeFileSync(path.join(ROOT,'content/paradigm-story-assets.json'),JSON.stringify({generated:'2026-09-21',cards},null,2)+'\n');
 fs.writeFileSync(path.join(ROOT,'content/social-cards.json'),JSON.stringify(catalog,null,2)+'\n');
 console.log(JSON.stringify({cards:cards.length,dimensions:'1080x1920',posterBytes:cards.reduce((s,c)=>s+c.bytes,0),previewBytes:cards.reduce((s,c)=>s+c.previewBytes,0)}));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
