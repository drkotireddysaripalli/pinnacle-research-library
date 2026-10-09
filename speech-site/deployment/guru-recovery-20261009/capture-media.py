"""Read only article pages declaring media; retain observed publication media URLs."""
import concurrent.futures, datetime, hashlib, json, re, sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError

source, destination = map(Path,sys.argv[1:3])
assert not destination.exists(), 'Reuse the existing media capture'
rows=[r for r in json.loads(source.read_text(encoding='utf-8'))['records'] if r.get('public',{}).get('TotalImages')]

class Media(HTMLParser):
    def __init__(self, ident):
        super().__init__(convert_charrefs=True); self.ident=ident; self.images=[]; self.canonical=None
    def handle_starttag(self, tag, pairs):
        a=dict(pairs)
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='img':
            u=urlsplit(urljoin('https://www.pinnacleblooms.org',a.get('src') or ''))
            if u.scheme=='https' and u.hostname=='images.pinnacleblooms.org' and re.fullmatch(r'/Assets/PUBLISHIMAGE/Image/'+re.escape(self.ident)+r'(?:_[A-Za-z0-9]+)?\.(?:jpe?g|png|webp)',u.path,re.I):
                if u.geturl() not in [x['src'] for x in self.images]: self.images.append({'src':u.geturl(),'alt':a.get('alt') or ''})

def capture(row):
    url='https://www.pinnacleblooms.org'+row['paths'][0]
    result={'id':row['requestedId'],'sourceUrl':url,'fetchedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        try:
            with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153.0 Safari/537.36'}),timeout=25) as r: raw=r.read(2_000_001); status=r.status
        except HTTPError as e: raw=e.read(2_000_001);status=e.code
        result.update(status=status,sha256=hashlib.sha256(raw).hexdigest())
        if status==200 and len(raw)<=2_000_000:
            parser=Media(row['requestedId']); parser.feed(raw.decode('utf-8','replace')); result.update(images=parser.images,canonical=parser.canonical)
        else: result['images']=[]
    except Exception as e: result.update(images=[],error=type(e).__name__+': '+str(e)[:150])
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: result=list(pool.map(capture,rows))
destination.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(result),'http200':sum(r.get('status')==200 for r in result),'withObservedImages':sum(bool(r['images']) for r in result),'withoutMedia':[r['id'] for r in result if not r['images']]}))
