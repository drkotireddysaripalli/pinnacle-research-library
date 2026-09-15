"""Vendor a small, pinned subset of Lucide SVGs and all upstream license notices."""
import base64, hashlib, io, json, pathlib, tarfile, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
VERSION = '1.46.0'
INTEGRITY = 'kq1lP/78BxG28VG3Ut2FxMeQElereTrrRwTBeXH7+olxATGcDbsuKRB/v/VKLhPrEu8BvNi6Uh2GvbH3pQcYhg=='
NAMES = 'files building-2 file-cog shield flask-conical map-pin landmark book-open file-search badge-check file-clock circle-help file-text search external-link arrow-up-right mail phone download link printer house chart-no-axes-combined rotate-ccw users clipboard-list scan-eye circle-check circle-alert network arrow-left chevron-right plus'.split()
raw = urllib.request.urlopen(f'https://registry.npmjs.org/lucide-static/-/lucide-static-{VERSION}.tgz').read()
assert base64.b64encode(hashlib.sha512(raw).digest()).decode() == INTEGRITY
target = ROOT / 'assets' / 'lucide'
target.mkdir(parents=True, exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(raw), mode='r:gz') as archive:
    for name in NAMES:
        (target / f'{name}.svg').write_bytes(archive.extractfile(f'package/icons/{name}.svg').read())
    licenses = [m for m in archive.getmembers() if 'license' in m.name.lower() and m.isfile()]
    notices = '\n\n'.join(m.name + '\n' + archive.extractfile(m).read().decode() for m in licenses)
    assert notices
    (target / 'LICENSE.txt').write_text(notices, encoding='utf-8')
(target / 'provenance.json').write_text(json.dumps({'package': 'lucide-static', 'version': VERSION, 'source': 'https://lucide.dev', 'integrity': 'sha512-' + INTEGRITY, 'icons': NAMES}, indent=2), encoding='utf-8')
print(f'Verified and saved {len(NAMES)} Lucide icons with license notices.')
