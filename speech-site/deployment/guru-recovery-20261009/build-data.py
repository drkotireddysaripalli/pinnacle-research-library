"""Build a public-only article projection from the bounded existing API capture."""
import hashlib, html, json, re, sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin

ORIGIN = 'https://www.pinnacleblooms.org'
ALLOWED = set('p div span br strong b em i u s strike ul ol li blockquote h2 h3 h4 h5 h6 table thead tbody tfoot tr td th caption figure figcaption a img hr sup sub pre code'.split())
VOID = {'br','img','hr'}
DROP = {'script','style','noscript','template','form','button','input','select','textarea','object','embed','svg','math'}

def safe_url(value, media=False):
    try:
        if not isinstance(value, str) or not value.strip():
            return None
        value = html.unescape(str(value or '')).strip()
        if re.search(r'[\x00-\x20\x7f]', value):
            return None
        u = urlsplit(urljoin(ORIGIN, value))
        if u.username or u.password or u.scheme not in ('https', 'http') or not u.hostname:
            return None
        if u.hostname in ('localhost','127.0.0.1','0.0.0.0','::1'):
            return None
        if u.scheme == 'http' and (u.hostname == 'pinnacleblooms.org' or u.hostname.endswith('.pinnacleblooms.org')):
            return 'https:' + u.geturl()[5:]
        return u.geturl() if u.scheme == 'https' or not media else None
    except ValueError:
        return None

class PublicHTML(HTMLParser):
    """Preserve visible source text and passive formatting; omit executable markup."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts, self.text, self.stack, self.suppressed = [], [], [], []
        self.media = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if self.suppressed:
            if tag not in VOID and tag not in ('input','embed'):
                self.suppressed.append(tag)
            return
        if tag in DROP:
            if tag not in ('input','embed'):
                self.suppressed.append(tag)
            return
        if tag == 'iframe':
            url = safe_url(attrs.get('src'))
            if url:
                self.parts.append('<p><a href="'+html.escape(url, quote=True)+'" rel="noopener noreferrer">Open the original embedded video</a></p>')
            self.suppressed.append(tag)
            return
        if tag == 'h1':
            tag = 'h2'
        if tag not in ALLOWED:
            return
        clean = []
        if tag == 'a':
            url = safe_url(attrs.get('href'))
            if url:
                clean = [('href', url), ('rel', 'noopener noreferrer')]
        elif tag == 'img':
            url = safe_url(attrs.get('src'), media=True)
            alt = attrs.get('alt') or ''
            if not url:
                if alt:
                    self.parts.append(html.escape(alt)); self.text.append(alt)
                return
            clean = [('src', url), ('alt', alt), ('loading','lazy'), ('decoding','async'), ('referrerpolicy','no-referrer')]
            self.media.append(url)
            for key in ('width','height'):
                if re.fullmatch(r'[1-9][0-9]{0,3}', attrs.get(key) or ''):
                    clean.append((key,attrs[key]))
        for key in ('colspan','rowspan'):
            if tag in ('td','th') and re.fullmatch(r'[1-9][0-9]?',attrs.get(key) or ''):
                clean.append((key,attrs[key]))
        if attrs.get('dir') in ('rtl','ltr','auto'):
            clean.append(('dir',attrs['dir']))
        self.parts.append('<'+tag+''.join(' '+k+'="'+html.escape(v,quote=True)+'"' for k,v in clean)+'>')
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.suppressed:
            if tag in self.suppressed:
                position = len(self.suppressed)-1-self.suppressed[::-1].index(tag)
                del self.suppressed[position:]
            return
        if tag == 'h1': tag = 'h2'
        if tag in self.stack:
            while self.stack:
                current = self.stack.pop(); self.parts.append('</'+current+'>')
                if current == tag: break

    def handle_data(self, data):
        if not self.suppressed:
            self.parts.append(html.escape(data)); self.text.append(data)

    def finish(self):
        while self.stack: self.parts.append('</'+self.stack.pop()+'>')
        return ''.join(self.parts)

def sanitize(value):
    parser = PublicHTML(); parser.feed(str(value or '')); parser.close()
    return parser.finish(), ''.join(parser.text), parser.media

def build(capture, media_rows):
    records, holds = {}, []
    media_by_id = {row['id']: row for row in media_rows}
    for row in capture['records']:
        value = row.get('public')
        if not value or not value.get('Title') or not value.get('Description'):
            holds.append({'id':row['requestedId'],'reason':row.get('error') or 'No complete public article'}); continue
        if value.get('RS') not in (None,'','ACTIVE','Active','PUBLISHED','Published'):
            holds.append({'id':row['requestedId'],'reason':'Publication state requires source review'}); continue
        body, text, media = sanitize(value['Description'])
        if not text.strip():
            holds.append({'id':row['requestedId'],'reason':'No source article text'}); continue
        date = str(value.get('CDT') or '')[:10]
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date): date = None
        paths = row['paths']
        image = safe_url(value.get('ImageUrl'), media=True)
        gallery = media_by_id.get(row['requestedId'])
        images = []
        if value.get('TotalImages'):
            if not gallery or gallery.get('status') != 200 or not gallery.get('images') or gallery['sourceUrl'] not in [ORIGIN+p for p in paths]:
                raise ValueError('Missing observed original gallery for '+row['requestedId'])
            if not re.match(r'/guru/'+re.escape(row['requestedId'])+r'/',urlsplit(gallery.get('canonical') or '').path):
                raise ValueError('Gallery page identity mismatch')
            for item in gallery['images']:
                image_url=safe_url(item['src'],media=True)
                if not image_url: raise ValueError('Unsafe observed gallery media')
                images.append({'src':image_url,'alt':item['alt']})
        elif image:
            images.append({'src':image,'alt':value['Title']})
        language='te' if re.search(r'[\u0c00-\u0c7f]',text) else 'und-Deva' if re.search(r'[\u0900-\u097f]',text) else 'en'
        records[row['requestedId']] = {
            'id': row['requestedId'], 'title': value['Title'], 'body': body,
            'canonicalPath': paths[0], 'paths': paths, 'published': date,
            'images': images, 'video': safe_url(value.get('VideoUrl')), 'language':language,
            **({'mediaSource':{k:gallery[k] for k in ('sourceUrl','fetchedAt','sha256')}} if gallery else {}),
            'source': {'url':row['sourceUrl'],'fetchedAt':row['fetchedAt'],'sha256':row['sha256']},
            'sourceTextSha256': hashlib.sha256(text.encode()).hexdigest(),
            'sourceTextLength':len(text), 'bodyMedia':media
        }
    return {'version':'guru-public-recovery-20261009','records':records,'holds':holds,
            'sourceInventorySha256':capture['inventorySha256']}

if __name__ == '__main__':
    capture_path, media_path, output = map(Path,sys.argv[1:4])
    result=build(json.loads(capture_path.read_text(encoding='utf-8')),json.loads(media_path.read_text(encoding='utf-8')))
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8',newline='\n')
    print(json.dumps({'articles':len(result['records']),'paths':sum(len(r['paths']) for r in result['records'].values()),'holds':result['holds'],'bytes':output.stat().st_size}))
