'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('sharp');const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const head='PinnacleScaleHead',body='PinnacleScaleBody';
if(!GlobalFonts.registerFromPath(path.join(dist,'fonts/manrope-latin.woff2'),head)||!GlobalFonts.registerFromPath(path.join(dist,'fonts/dm-sans-latin.woff2'),body))throw Error('Real brand fonts required');
async function main(){
 const c=createCanvas(1200,630),ctx=c.getContext('2d'),bounds=[];
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1200,630);
 const art=await loadImage(path.join(root,'assets/scale-story-artwork.webp'));
 ctx.drawImage(art,175,0,1050,552);
 const fade=ctx.createLinearGradient(540,0,750,0);fade.addColorStop(0,'#ffffff');fade.addColorStop(.56,'rgba(255,255,255,.95)');fade.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=fade;ctx.fillRect(0,0,750,505);
 const logo=await loadImage(path.join(dist,'images/pinnacle-logo.webp'));ctx.drawImage(logo,57,34,285,285*logo.height/logo.width);
 function text(value,x,y,size,color='#111d50',weight=800,family=head,maxWidth=680){ctx.font=`${weight} ${size}px "${family}"`;ctx.fontVariationSettings=`"wght" ${weight}`;ctx.textBaseline='alphabetic';const m=ctx.measureText(value);if(m.width>maxWidth)throw Error('Text too wide: '+value+' width='+m.width+' font='+ctx.font);ctx.fillStyle=color;ctx.fillText(value,x,y+m.actualBoundingBoxAscent);bounds.push({value,x,y,width:m.width,height:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent});}
 text('PINNACLEAI® · SCALE & MISSION',61,169,18,'#00828a',700,body);
 text('Built at scale.',57,212,54);
 text('Focused on your child.',57,278,47,'#00828a');
 text('400B',59,361,67);text('for',300,382,23,'#596a78',500,body);text('900M',369,361,67,'#00828a');
 text('PinnacleAI® points',63,432,21,'#111d50',700,body,275);
 text('Children, parents & families',373,434,18,'#111d50',700,body,310);
 text('Pinnacle aggregate estimate',63,465,17,'#485e6b',500,body,280);
 text('Mission population',373,465,17,'#485e6b',500,body,300);
 ctx.fillStyle='rgba(255,255,255,.98)';ctx.fillRect(0,503,1200,127);
 text('2.7B+ structured events',64,521,21,'#111d50',700,body,340);
 text('31M+ defined services',437,521,21,'#00828a',700,body,300);
 text('10.4M calculated reports',798,521,21,'#111d50',700,body,340);
 const line=ctx.createLinearGradient(64,0,1136,0);for(const [p,color]of[[0,'#9356bf'],[.25,'#2fc3d3'],[.6,'#e95a99'],[1,'#76b557']])line.addColorStop(p,color);ctx.fillStyle=line;ctx.fillRect(64,560,1072,2);
 text('pinnacleblooms.org/verify',64,586,21,'#111d50',700,body,560);
 text('FIGURES · SOURCES · COUNTING BASIS',782,590,15,'#485e6b',700,body,355);
 for(const b of bounds)if(b.x<40||b.x+b.width>1165||b.y+b.height>615)throw Error('Text out of safe bounds: '+b.value);
 const bytes=await sharp(c.toBuffer('image/png')).jpeg({quality:89,mozjpeg:true,chromaSubsampling:'4:4:4'}).toBuffer();
 const hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12),image='/images/social/pinnacle-scale-and-mission-'+hash+'.jpg';fs.writeFileSync(path.join(dist,image),bytes);
 const card={route:'/evidence/scale-and-mission.html',id:'pinnacle-scale-and-mission',title:'Built at scale. Focused on your child.',lines:['Built at scale.','Focused on your child.'],category:'PINNACLEAI® · SCALE & MISSION',note:'400B: Pinnacle aggregate estimate. 900M: mission population. Read the figures and counting basis.',icon:'network',description:'PinnacleAI® scale and mission: current figures, report calculations, independent report findings and their sources.',image,width:1200,height:630,alt:'Pinnacle Blooms Network. Built at scale. Focused on your child. 400B PinnacleAI® points: Pinnacle aggregate estimate. 900M children, parents and families: mission population. 2.7B+ structured events, 31M+ defined services and 10.4M calculated report outputs. Illustrative mother and child.'};
 const p=path.join(root,'content/social-images.json'),manifest=JSON.parse(fs.readFileSync(p));manifest.cards=manifest.cards.filter(c=>c.route!==card.route);manifest.cards.push(card);fs.writeFileSync(p,JSON.stringify(manifest,null,2)+'\n');
 // Register this custom layout so a general catalogue refresh cannot silently substitute another image.
 const catalogue=path.join(root,'content/social-cards.json'),cards=JSON.parse(fs.readFileSync(catalogue));const entry={...card,customRenderer:'render-scale-share-card.cjs'};cards.splice(cards.findIndex(c=>c.route===card.route)<0?cards.length:cards.findIndex(c=>c.route===card.route),cards.some(c=>c.route===card.route)?1:0,entry);fs.writeFileSync(catalogue,JSON.stringify(cards,null,2)+'\n');
 fs.writeFileSync(path.join(root,'assets/scale-story-card-layout.json'),JSON.stringify({width:1200,height:630,image,bounds},null,2)+'\n');
 console.log(JSON.stringify({image,bytes:bytes.length,width:1200,height:630}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
