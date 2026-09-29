from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src' / 'assets'
SOURCE = ASSETS / 'autism-life-journey-20260929.png'
LOGO = ASSETS / 'pinnacle-blooms-network-lockup.png'
OUTPUT = ASSETS / 'autism-therapy-share-20260929.jpg'
W, H = 1200, 630

def font(size, bold=False):
    return ImageFont.truetype(str(Path('C:/Windows/Fonts') / ('segoeuib.ttf' if bold else 'segoeui.ttf')), size=size)

def cover(image, width, height):
    scale=max(width/image.width,height/image.height)
    image=image.resize((round(image.width*scale),round(image.height*scale)),Image.Resampling.LANCZOS)
    left=(image.width-width)//2; top=(image.height-height)//2
    return image.crop((left,top,left+width,top+height))

base=cover(Image.open(SOURCE).convert('RGB'),W,H).convert('RGBA')
overlay=Image.new('RGBA',(W,H),(0,0,0,0)); draw=ImageDraw.Draw(overlay)

# Exact Pinnacle typography sits in a clean lower information plane.
for y in range(420,H):
    alpha=int(75+(y-420)/(H-420)*175)
    draw.rectangle((0,y,W,y+1),fill=(255,255,255,alpha))

draw.rounded_rectangle((32,24,366,135),radius=18,fill=(255,255,255,242),outline=(143,40,121,145),width=2)
logo=Image.open(LOGO).convert('RGBA'); logo.thumbnail((304,88),Image.Resampling.LANCZOS); overlay.alpha_composite(logo,(48,35))

draw.rounded_rectangle((892,28,1166,142),radius=18,fill=(255,255,255,241),outline=(143,40,121,180),width=2)
draw.text((914,46),'PINNACLE VERIFY',font=font(20,True),fill=(111,32,96,255))
draw.text((914,76),'Class B SaMD · MD-5',font=font(17),fill=(20,39,78,255))
draw.text((914,104),'BIS · 36 evidence records',font=font(16),fill=(20,39,78,255))

draw.text((46,464),'Autism Therapy for Children',font=font(37,True),fill=(20,39,78,255))
draw.text((46,508),"See the whole child.",font=font(37,True),fill=(143,40,121,255))
draw.text((48,565),'Build abilities for everyday life.',font=font(19,True),fill=(0,121,110,255))

draw.rounded_rectangle((830,492,1154,594),radius=20,fill=(227,17,94,246))
draw.text((866,507),'CALL PINNACLE',font=font(17,True),fill='white')
draw.text((857,540),'9100 181 181',font=font(30,True),fill='white')

Image.alpha_composite(base,overlay).convert('RGB').save(OUTPUT,'JPEG',quality=90,optimize=True,progressive=True)
print(f'Wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)')

