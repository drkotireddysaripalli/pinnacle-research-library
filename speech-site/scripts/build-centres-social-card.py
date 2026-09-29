from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src' / 'assets'
CENTRE_ASSETS = ASSETS / 'centre-directory'
OUTPUT = ASSETS / 'centres-share-20260929.jpg'
W, H = 1200, 630

def font(size, bold=False):
    name = 'segoeuib.ttf' if bold else 'segoeui.ttf'
    return ImageFont.truetype(str(Path('C:/Windows/Fonts') / name), size=size)

def cover(path, width, height, focus_y=0.5):
    image = Image.open(path).convert('RGB')
    scale = max(width / image.width, height / image.height)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (image.width - width) // 2)
    top = max(0, round((image.height - height) * focus_y))
    return image.crop((left, top, left + width, top + height))

centres = json.loads((ROOT / 'src' / 'data' / 'centre-directory.json').read_text(encoding='utf-8'))
count = len(centres)
base = Image.new('RGB', (W, H), '#ffffff')
draw = ImageDraw.Draw(base)

# Luminous brand pathway behind the information plane.
for radius, colour, x, y in [
    (310, '#f8e6f4', 430, 600),
    (220, '#e4f8f3', 615, 25),
    (145, '#fff1d9', 50, 35),
]:
    draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=colour)

photos = [
    ('jayanagar-exterior-41.jpg', (725, 24, 1174, 256), 0.45),
    ('gurunanak-interior-1-2.jpg', (660, 274, 948, 606), 0.48),
    ('suchitra-interior-5-2.jpg', (970, 274, 1174, 606), 0.5),
]
for filename, box, focus in photos:
    x1, y1, x2, y2 = box
    image = cover(CENTRE_ASSETS / filename, x2-x1, y2-y1, focus)
    mask = Image.new('L', image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width-1, image.height-1), radius=30, fill=255)
    shadow = Image.new('RGBA', base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1+7, y1+9, x2+7, y2+9), radius=30, fill=(28, 31, 74, 45))
    base = Image.alpha_composite(base.convert('RGBA'), shadow.filter(ImageFilter.GaussianBlur(9))).convert('RGB')
    base.paste(image, (x1, y1), mask)

draw = ImageDraw.Draw(base)
logo = Image.open(ASSETS / 'pinnacle-blooms-network-lockup.png').convert('RGBA')
logo.thumbnail((330, 94), Image.Resampling.LANCZOS)
base.paste(logo, (52, 42), logo)
draw = ImageDraw.Draw(base)

draw.text((54, 176), 'Find a Pinnacle centre.', font=font(42, True), fill='#14274e')
draw.text((54, 230), 'Begin closer to home.', font=font(42, True), fill='#8f2879')
draw.multiline_text((56, 302), f'{count} published listings\nAddresses · maps · centre photos\nNational guidance and enrolment', font=font(22, True), fill='#08796e', spacing=12)

draw.rounded_rectangle((52, 476, 552, 588), radius=22, fill='#e3115e')
draw.text((82, 493), 'CALL PINNACLE', font=font(18, True), fill='white')
draw.text((82, 526), '9100 181 181', font=font(34, True), fill='white')

draw.rounded_rectangle((642, 24, 708, 90), radius=33, fill='#ffffff', outline='#8f2879', width=3)
draw.ellipse((659, 41, 691, 73), outline='#8f2879', width=3)
draw.ellipse((669, 51, 681, 63), fill='#e3115e')

base.save(OUTPUT, 'JPEG', quality=90, optimize=True, progressive=True)
print(f'Wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)')
