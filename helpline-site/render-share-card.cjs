// Deterministic share-card layout. Existing brand artwork is embedded unchanged.
// Run with Node.js and the sharp package available; the website has no dependency on sharp.
const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
(async()=>{
// SVG image decoding supports PNG reliably; format conversion preserves the original artwork.
const photo=(await sharp(path.join(__dirname,'assets/family-journey-1000.webp')).png().toBuffer()).toString('base64');
const logo=(await sharp(path.join(__dirname,'assets/logo.webp')).png().toBuffer()).toString('base64');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fff"/>
<image x="55" y="36" width="252" height="95" xlink:href="data:image/png;base64,${logo}"/>
<image x="567" y="97" width="615" height="410" xlink:href="data:image/png;base64,${photo}"/>
<g font-family="Arial, Helvetica, sans-serif">
<text x="60" y="217" font-size="53" font-weight="700" fill="#101f4d">National Autism</text>
<text x="60" y="282" font-size="62" font-weight="700" fill="#007f87">Helpline</text>
<text x="62" y="333" font-size="25" fill="#43566d">Free guidance. Anyone can call.</text>
<text x="62" y="374" font-size="25" font-weight="700" fill="#007f87">24 hours a day. 7 days a week.</text>
<rect x="60" y="411" width="438" height="87" rx="14" fill="#d91f3d"/>
<text x="279" y="469" text-anchor="middle" font-size="48" font-weight="700" fill="#fff">9100 181 181</text>
<text x="62" y="538" font-size="20" fill="#43566d">Across India · English · Telugu · Hindi</text>
<path d="M60 575H1140" stroke="#dce8e7" stroke-width="2"/>
<text x="62" y="609" font-size="18" fill="#101f4d">pinnacleblooms.org/national-autism-helpline</text>
<text x="1138" y="609" text-anchor="end" font-size="17" fill="#43566d">For your child. For the life ahead.</text>
</g></svg>`;
fs.writeFileSync(path.join(__dirname,'share-card.svg'),svg);
const info=await sharp(Buffer.from(svg)).jpeg({quality:88,mozjpeg:true}).toFile(path.join(__dirname,'assets/national-autism-helpline-share-20260924.jpg'));console.log(JSON.stringify(info));
})().catch(error=>{console.error(error.message);process.exitCode=1});
