"""Capture only explicitly inventoried public Guru articles, without auth or writes."""
import concurrent.futures, datetime, hashlib, json, re, sys
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

inventory, destination = map(Path, sys.argv[1:3])
assert not destination.exists(), 'Reuse the existing capture; do not repeat unchanged reads'
cohort = {}
for row in json.loads(inventory.read_text(encoding='utf-8')):
    u = urlsplit(row['url'])
    match = re.fullmatch(r'/guru/(\d+)/[^/]+/?', u.path)
    if u.scheme == 'https' and u.hostname == 'www.pinnacleblooms.org' and match:
        cohort.setdefault(match[1], []).append(u.path.rstrip('/'))

PUBLIC_FIELDS = ('Id', 'Title', 'Description', 'ImageUrl', 'VideoUrl', 'TotalImages',
                 'CDT', 'UDT', 'RS', 'F25', 'LanguageId')

def capture(item):
    ident, paths = item
    url = 'https://psapi.pinnacleblooms.org/api/getgurudatabyid?id=' + ident
    result = {'requestedId': ident, 'paths': sorted(set(paths)), 'sourceUrl': url,
              'fetchedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        with urlopen(Request(url, headers={'Accept': 'application/json',
                                         'User-Agent': 'Pinnacle-owned-public-repair/1.0'}), timeout=30) as r:
            raw = r.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError('Public article response exceeds bounded size')
            result.update(status=r.status, sha256=hashlib.sha256(raw).hexdigest())
            current = json.loads(raw).get('Current')
            if not isinstance(current, dict):
                result['error'] = 'Public endpoint supplied no Current article'
            elif str(current.get('Id')) != ident and str(current.get('F25')) != ident:
                result['error'] = 'Public identity does not match requested record'
            else:
                result['public'] = {k: current.get(k) for k in PUBLIC_FIELDS}
    except Exception as e:
        result['error'] = type(e).__name__ + ': ' + str(e)[:180]
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    records = list(pool.map(capture, cohort.items()))
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(json.dumps({'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'inventorySha256': hashlib.sha256(inventory.read_bytes()).hexdigest(),
    'observedPaths': sum(len(v) for v in cohort.values()), 'records': records}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'ids': len(records), 'paths': sum(len(v) for v in cohort.values()),
    'success': sum('public' in r for r in records), 'errors': [
        {'id': r['requestedId'], 'error': r['error']} for r in records if 'error' in r]}))
