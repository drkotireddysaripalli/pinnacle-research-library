"""Build an offline candidate from saved PUBLIC records; never query operational data."""
from pathlib import Path
import base64, collections, hashlib, json, re, xml.etree.ElementTree as ET
from urllib.parse import urlsplit, unquote

HERE = Path(__file__).resolve().parent
SITE = HERE.parent.parent
WORK = SITE.parent.parent
SITEMAP = WORK / 'website-completion-20261007/after/video-map.xml'
PUBLIC = SITE / 'ask-public/knowledge-data'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'v': 'http://www.google.com/schemas/sitemap-video/1.1'}

def write(name, value):
    p = HERE / 'data' / (name + '.json')
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

def path(value):
    u = urlsplit(value)
    if u.scheme not in ('', 'https') or u.netloc not in ('', 'www.pinnacleblooms.org') or u.query or u.fragment:
        raise ValueError('Non-public archive URL')
    if not re.fullmatch(r'/mirracles/[0-9]+/[^/]*', unquote(u.path)):
        raise ValueError('Unexpected public archive path')
    return u.path

def ident(value):
    return path(value).split('/')[2]

root = ET.fromstring(SITEMAP.read_bytes())
assert len(root) == 19292, 'Reconcile changed public sitemap before rebuilding'
records, order = {}, []
for entry in root:
    location = path(entry.findtext('s:loc', namespaces=NS))
    key = ident(location)
    assert key not in records, 'Duplicate public numeric identity'
    video = entry.find('v:video', NS)
    fields = {} if video is None else {n.tag.split('}')[-1]: n.text or '' for n in video}
    category = fields.get('category', '').strip()
    category = None if category.lower() in ('', 'null', 'undefined') else category
    records[key] = {'id': key, 'path': location, 'aliases': [],
        'title': fields.get('title', '').strip(), 'description': fields.get('description', '').strip(),
        'poster': fields.get('thumbnail_loc') or None, 'player': fields.get('player_loc') or None,
        'published': fields.get('publication_date') or None, 'category': category,
        'inSitemap': True}
    order.append(key)

# Preserve older published links too. These are archive pages, not invented
# playable videos. Their absent date/player/category remains absent.
archive_paths = set()
source_chunks = sorted(PUBLIC.glob('mirracles-*.json'), key=lambda p: int(p.stem.split('-')[-1]))
for chunk in source_chunks:
    for item in json.loads(chunk.read_text(encoding='utf-8')):
        location = path(item['url']); key = ident(location); archive_paths.add(location)
        if key not in records:
            records[key] = {'id': key, 'path': location, 'aliases': [], 'title': item.get('title') or '',
                'description': '', 'poster': item.get('image'), 'player': None, 'published': None,
                'category': None, 'inSitemap': False}
        elif location != records[key]['path'] and location not in records[key]['aliases']:
            records[key]['aliases'].append(location)
        if not records[key]['title'] and item.get('title'):
            records[key]['title'] = item['title']

details = list(records.values())
for i in range(0, len(details), 500):
    chunk = details[i:i+500]
    write('details-' + str(i // 500), {r['id']: r for r in chunk})
    for r in chunk: r['chunk'] = i // 500
index = [{k: r[k] for k in ['id', 'path', 'title', 'poster', 'published', 'category', 'inSitemap', 'chunk']} for r in details]
alias_paths = {p: r['id'] for r in details for p in r['aliases']}
counts = collections.Counter(records[k]['category'] for k in order if records[k]['category'])
navigation = json.loads((SITE / 'src/data/portal-navigation.json').read_text(encoding='utf-8'))
write('catalogue', {'version': 'mirracles-library-20261008', 'order': order, 'records': index, 'aliasPaths': alias_paths,
    'categories': [{'key': k, 'label': k, 'count': v} for k, v in sorted(counts.items())],
    'navigation': {'main': [{'label': x['label'], 'url': x['url']} for x in navigation['main']],
                   'therapy': [{'label': x['label'], 'url': x['url']} for x in navigation['therapy']]}})
report = {'candidateOnly': True, 'source': str(SITEMAP.relative_to(WORK)),
    'sourceSha256': hashlib.sha256(SITEMAP.read_bytes()).hexdigest(), 'sitemapPages': len(order),
    'sourceVideoEntries': sum(bool(records[k]['player']) for k in order),
    'publicArchivePathsPreserved': len(archive_paths), 'totalNumericIdentities': len(records),
    'archiveOnlyIdentities': len(records)-len(order), 'categories': dict(sorted(counts.items())),
    'categoryPolicy': 'Exact nonempty source category values; no inferred therapy/topic mapping',
    'sourceChunks': [{'file': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in source_chunks],
    'sharedInputs': ['src/components/SiteHeader.astro', 'src/components/SiteFooter.astro', 'src/data/portal-navigation.json', 'src/data/site.ts']}
write('provenance', report)
(HERE / 'assets.mjs').write_text('// Generated offline by build-data.py.\nexport const css=' + json.dumps((HERE/'library.css').read_text(encoding='utf-8')) + ';\nexport const playerJs=' + json.dumps((HERE/'player.js').read_text(encoding='utf-8')) + ';\nexport const brandLogoBase64=' + json.dumps(base64.b64encode((SITE/'src/assets/pinnacle-blooms-network-lockup.png').read_bytes()).decode('ascii')) + ';\n', encoding='utf-8')
(HERE.parent / 'mirracles-library-assets.mjs').write_text((HERE / 'assets.mjs').read_text(encoding='utf-8'), encoding='utf-8')
(HERE.parent / 'mirracles-library.mjs').write_text((HERE / 'library.mjs').read_text(encoding='utf-8').replace("from './assets.mjs'", "from './mirracles-library-assets.mjs'"), encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k != 'sourceChunks'}, ensure_ascii=True))
