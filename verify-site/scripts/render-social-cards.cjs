'use strict';

// Run with sharp and @napi-rs/canvas available on NODE_PATH.
// The catalogue is the copy source; the renderer never changes its wording.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'content');
const OUTPUT = path.join(DIST, 'images', 'social');
const CATALOGUE = path.join(CONTENT, 'social-cards.json');
const WIDTH = 1200;
const HEIGHT = 630;
const COLORS = {
  navy: '#10194e', teal: '#007f86', muted: '#43586a',
  purple: '#9356bf', cyan: '#2fc3d3', pink: '#e95a99', green: '#76b557',
};

function registerFont(relative, alias, fallback) {
  const file = path.join(ROOT, relative);
  if (fs.existsSync(file) && GlobalFonts.registerFromPath(file, alias)) return alias;
  const fallbackFile = path.join(process.env.WINDIR || 'C:/Windows', 'Fonts', fallback);
  if (fs.existsSync(fallbackFile) && GlobalFonts.registerFromPath(fallbackFile, alias)) return alias;
  throw new Error(`Cannot load a real font for ${alias}: ${file}`);
}

const HEAD = registerFont('dist/fonts/manrope-latin.woff2', 'PinnacleSocialHead', 'arialbd.ttf');
const BODY = registerFont('dist/fonts/dm-sans-latin.woff2', 'PinnacleSocialBody', 'arial.ttf');
const imageCache = new Map();
const iconCache = new Map();

async function image(file) {
  if (!imageCache.has(file)) imageCache.set(file, await loadImage(file));
  return imageCache.get(file);
}

function font(ctx, size, weight = 700, family = HEAD) {
  ctx.font = `${weight} ${size}px "${family}"`;
  // Explicitly select the variable font's real weight; the canvas shorthand alone
  // leaves these WOFF2 files at their default weight in the bundled runtime.
  ctx.fontVariationSettings = `"wght" ${weight}`;
}

function fittedSize(ctx, lines, maxWidth, preferred, min, family = HEAD, weight = 800) {
  for (let size = preferred; size >= min; size -= 0.5) {
    font(ctx, size, weight, family);
    if (lines.every(line => ctx.measureText(line).width <= maxWidth)) return size;
  }
  throw new Error(`Headline needs shorter catalogue lines: ${lines.join(' / ')}`);
}

function drawText(ctx, value, x, top, size, color, bounds, weight = 700, family = HEAD) {
  font(ctx, size, weight, family);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color;
  const measure = ctx.measureText(value);
  // Place the actual ink, not the font's invisible line box, at the requested top.
  const baseline = top + measure.actualBoundingBoxAscent;
  ctx.fillText(value, x, baseline);
  bounds.push({ value, x, y: top, width: measure.width,
    height: measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent, size });
}

function wrap(ctx, text, maxWidth, size, family = BODY, weight = 500) {
  font(ctx, size, weight, family);
  const result = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(next).width > maxWidth) {
      result.push(current);
      current = word;
    } else current = next;
  }
  if (current) result.push(current);
  return result;
}

function curve(ctx, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createLinearGradient(760, 230, 1135, 466);
  gradient.addColorStop(0, COLORS.purple);
  gradient.addColorStop(0.35, COLORS.cyan);
  gradient.addColorStop(0.70, COLORS.pink);
  gradient.addColorStop(1, COLORS.green);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(785, 209);
  ctx.bezierCurveTo(913, 110, 1148, 170, 1125, 322);
  ctx.bezierCurveTo(1102, 475, 858, 395, 792, 499);
  ctx.stroke();
  ctx.restore();
}

async function drawIcon(ctx, name) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Unsafe icon name: ${name}`);
  if (!iconCache.has(name)) {
    const svgFile = path.join(ROOT, 'assets', 'lucide', `${name}.svg`);
    if (!fs.existsSync(svgFile)) throw new Error(`Missing licensed source icon: ${svgFile}`);
    const svg = fs.readFileSync(svgFile, 'utf8')
      .replace(/currentColor/g, COLORS.teal)
      .replace(/stroke-width="2"/g, 'stroke-width="1.15"');
    const png = await sharp(Buffer.from(svg), { density: 600 }).resize(194, 194).png().toBuffer();
    iconCache.set(name, await loadImage(png));
  }
  ctx.save();
  const glow = ctx.createRadialGradient(969, 320, 20, 969, 320, 215);
  glow.addColorStop(0, '#edf9f7');
  glow.addColorStop(0.62, '#f3fafa');
  glow.addColorStop(1, '#ffffff');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(967, 320, 222, 216, -0.1, 0, Math.PI * 2);
  ctx.fill();
  curve(ctx, 0.42);
  ctx.drawImage(iconCache.get(name), 872, 222, 194, 194);
  ctx.restore();
}

function distFile(value) {
  if (typeof value !== 'string' || !value.startsWith('/images/') || value.includes('..')) {
    throw new Error(`Cover must be a local /images/ path: ${value}`);
  }
  const target = path.resolve(DIST, `.${value}`);
  if (!target.startsWith(DIST + path.sep)) throw new Error(`Cover outside dist: ${value}`);
  if (!fs.existsSync(target)) throw new Error(`Missing original cover: ${value}`);
  return target;
}

async function drawCover(ctx, value) {
  const cover = await image(distFile(value));
  const scale = Math.min(298 / cover.width, 388 / cover.height);
  const width = Math.round(cover.width * scale);
  const height = Math.round(cover.height * scale);
  const x = Math.round(971 - width / 2);
  const y = Math.round(324 - height / 2);
  curve(ctx, 0.35);
  ctx.save();
  ctx.shadowColor = 'rgba(19,37,72,0.14)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 1, y - 1, width + 2, height + 2);
  ctx.restore();
  // Read and place the supplied cover without editing or replacing the original.
  ctx.drawImage(cover, x, y, width, height);
  ctx.strokeStyle = 'rgba(18,39,65,0.10)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 0.5, y - 0.5, width + 1, height + 1);
}

async function render(card, logo, artwork) {
  if(card.customRenderer){if(card.customRenderer!=='render-scale-share-card.cjs'||!fs.existsSync(path.join(DIST,card.image)))throw Error('Run the named custom renderer first.');return card;}

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const bounds = [];
  const home = card.route === '/';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (home) {
    // The artwork is already text-free. Fade only the copy margin for legibility.
    ctx.drawImage(artwork, 0, 0, WIDTH, HEIGHT);
    const white = ctx.createLinearGradient(510, 0, 775, 0);
    white.addColorStop(0, 'rgba(255,255,255,1)');
    white.addColorStop(0.75, 'rgba(255,255,255,0.96)');
    white.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, 775, 548);
  } else if (card.cover) {
    await drawCover(ctx, card.cover);
  } else {
    await drawIcon(ctx, card.icon);
  }

  ctx.drawImage(logo, 59, 41, 282, 282 * logo.height / logo.width);
  if (!home) drawText(ctx, 'VERIFY', 1042, 64, 20, COLORS.teal, bounds, 800, BODY);

  const categorySize = fittedSize(ctx, [card.category], 690, 17, 14, BODY, 700);
  drawText(ctx, card.category, 64, 187, categorySize, COLORS.teal, bounds, 700, BODY);
  const titleSize = fittedSize(ctx, card.lines, 690, home ? 65 : 68, 44);
  const lineHeight = home ? 75 : 84;
  const titleTop = home ? 218 : 253;
  card.lines.forEach((line, index) => {
    drawText(ctx, line, 60, titleTop + index * lineHeight, titleSize,
      index === 1 ? COLORS.teal : COLORS.navy, bounds, 800);
  });

  const noteWidth = home ? 665 : 702;
  const noteLines = wrap(ctx, card.note, noteWidth, 21);
  if (noteLines.length > 2) throw new Error(`Note exceeds two lines: ${card.id}`);
  noteLines.forEach((line, index) => drawText(ctx, line, 64, 464 + index * 29, 21,
    COLORS.muted, bounds, 500, BODY));

  // A quiet full-width bar anchors the domain at a usable social-preview size.
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.fillRect(0, 548, WIDTH, 82);
  const line = ctx.createLinearGradient(64, 0, 1136, 0);
  line.addColorStop(0, COLORS.purple);
  line.addColorStop(0.25, COLORS.cyan);
  line.addColorStop(0.60, COLORS.pink);
  line.addColorStop(1, COLORS.green);
  ctx.fillStyle = line;
  ctx.globalAlpha = 0.58;
  ctx.fillRect(64, 549, 1072, 2);
  ctx.globalAlpha = 1;
  drawText(ctx, 'pinnacleblooms.org/verify', 64, 580, 23, COLORS.navy, bounds, 700, BODY);
  const footer = home ? 'CLARITY FOR FAMILIES' : 'ORIGINAL SOURCES · CLEAR CONTEXT';
  font(ctx, 15, 700, BODY);
  drawText(ctx, footer, 1136 - ctx.measureText(footer).width, 584, 15,
    COLORS.muted, bounds, 700, BODY);

  for (const text of bounds) {
    if (text.x < 40 || text.x + text.width > 1161 || text.y < 25 || text.y + text.height > 612) {
      throw new Error(`Text outside safe area on ${card.id}: ${text.value}`);
    }
  }
  const headlineBounds = bounds.filter(item => card.lines.includes(item.value));
  if (headlineBounds.some(item => item.y + item.height > 447)) {
    throw new Error(`Headline overlaps supporting note: ${card.id}`);
  }

  const bytes = await sharp(canvas.toBuffer('image/png'))
    .jpeg({ quality: 89, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  const metadata = await sharp(bytes).metadata();
  if (metadata.width !== WIDTH || metadata.height !== HEIGHT) throw new Error('Unexpected card dimensions');
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const filename = `${card.id}-${hash}.jpg`;
  const target = path.join(OUTPUT, filename);
  if (!fs.existsSync(target)) fs.writeFileSync(target, bytes);
  return {
    ...card,
    image: `/images/social/${filename}`,
    width: WIDTH,
    height: HEIGHT,
    alt: `${card.lines.join(' ')} ${card.category}. ${card.note}. Pinnacle Blooms Network.`,
  };
}

async function main() {
  if (!fs.existsSync(CATALOGUE)) throw new Error(`Create the approved catalogue first: ${CATALOGUE}`);
  const cards = JSON.parse(fs.readFileSync(CATALOGUE, 'utf8'));
  if (!Array.isArray(cards) || cards.length === 0) throw new Error('Catalogue must be a non-empty card array');
  const ids = new Set();
  const routes = new Set();
  for (const card of cards) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id) || ids.has(card.id)) throw new Error(`Invalid or duplicate id: ${card.id}`);
    if (!card.route.startsWith('/') || routes.has(card.route)) throw new Error(`Invalid or duplicate route: ${card.route}`);
    for (const key of ['title', 'category', 'note', 'icon', 'description']) {
      if (typeof card[key] !== 'string' || !card[key].trim()) throw new Error(`Missing ${key}: ${card.id}`);
    }
    if (!Array.isArray(card.lines) || card.lines.length < 2 || card.lines.length > 3 || card.lines.some(line => typeof line !== 'string' || !line.trim())) {
      throw new Error(`Expected two or three headline lines: ${card.id}`);
    }
    ids.add(card.id);
    routes.add(card.route);
  }
  fs.mkdirSync(OUTPUT, { recursive: true });
  const logo = await image(path.join(DIST, 'images', 'pinnacle-logo.webp'));
  const artwork = await image(path.join(ROOT, 'assets', 'social-artwork.webp'));
  const rendered = [];
  for (const card of cards) rendered.push(await render(card, logo, artwork));
  const manifest = { cards: rendered };
  fs.writeFileSync(path.join(CONTENT, 'social-images.json'), JSON.stringify(manifest, null, 2) + '\n');
  const sizes = rendered.map(card => fs.statSync(path.join(DIST, `.${card.image}`)).size);
  console.log(JSON.stringify({ count: rendered.length, dimensions: `${WIDTH}x${HEIGHT}`,
    smallestBytes: Math.min(...sizes), largestBytes: Math.max(...sizes),
    totalBytes: sizes.reduce((sum, bytes) => sum + bytes, 0),
    manifest: path.join(CONTENT, 'social-images.json') }, null, 2));
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
