"""Notify IndexNow once per changed Ask answer release, from public sitemap URLs.

Prepare is read-only; submit records every attempt before sending it and stops on
any non-200 response. Never silently retries an uncertain or rejected submission.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
from pathlib import Path
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ORIGIN = 'https://pinnacleblooms.org'
INDEX = ORIGIN + '/ask/sitemap.xml'
ENDPOINT = 'https://api.indexnow.org/indexnow'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
ROOT = Path(__file__).resolve().parents[1]

def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)

def get(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Pinnacle-Sitemap-Submission/1.0', 'Accept': 'application/xml,text/plain,*/*'})
    with urllib.request.urlopen(request, timeout=60) as response:
        if response.status != 200:
            raise RuntimeError(f'{url}: HTTP {response.status}')
        return response.read()

def digest(value):
    return hashlib.sha256('\n'.join(value).encode()).hexdigest()

def prepare(manifest):
    if manifest.exists():
        raise RuntimeError('Manifest already exists. Inspect it; do not replace a submitted release.')
    index_xml = get(INDEX)
    children = [item.text for item in ET.fromstring(index_xml).findall('s:sitemap/s:loc', NS)]
    expected_answers = {ORIGIN + f'/ask/sitemap-{number}.xml' for number in range(1, 6)}
    if not expected_answers.issubset(set(children)):
        raise RuntimeError('Answer sitemap inventory changed; inspect before submitting.')
    def read_map(url):
        xml = get(url)
        urls = [item.text for item in ET.fromstring(xml).findall('s:url/s:loc', NS)]
        if any((value != ORIGIN + '/ask' and not value.startswith(ORIGIN + '/ask/')) or '?' in value or '#' in value for value in urls):
            raise RuntimeError(f'Unexpected public URL in {url}')
        return {'sitemap': url, 'sha256': hashlib.sha256(xml).hexdigest(), 'count': len(urls), 'urls': urls}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        maps = list(pool.map(read_map, children))
    answers = sorted(set(url for item in maps if item['sitemap'] in expected_answers for url in item['urls']))
    previous = json.loads((ROOT / 'deployment/ask-answer-v14-indexnow-20261003.json').read_text(encoding='utf-8-sig'))
    excluded = sorted({item['url'] for item in previous['submissions'] if item.get('accepted') and item.get('responseCode') == 200} & set(answers))
    pending = [url for url in answers if url not in set(excluded)]
    data = {'preparedAt': now(), 'release': 'Ask answer v14 content / v15 cache repair', 'sitemapIndex': INDEX,
            'sitemaps': [{key: value for key, value in item.items() if key != 'urls'} for item in maps],
            'answerCount': len(answers), 'allPublicUrlCount': len({url for item in maps for url in item['urls']}),
            'alreadyAccepted': excluded, 'previousBatchId': previous['batchId'],
            'pendingCount': len(pending), 'pendingSha256': digest(pending), 'urls': pending}
    save(manifest, data)
    print(json.dumps({key: value for key, value in data.items() if key != 'urls'}), flush=True)

def submit(manifest):
    data = json.loads(manifest.read_text())
    urls = data['urls']
    if len(urls) != data['pendingCount'] or digest(urls) != data['pendingSha256']:
        raise RuntimeError('Manifest count or hash mismatch')
    key_location = ORIGIN + '/9eccddfeede58a1e7db0a8a2aa8286ab.txt'
    key = get(key_location).decode().strip()
    if key_location != ORIGIN + '/' + key + '.txt':
        raise RuntimeError('Public key file content mismatch')
    for start in range(0, len(urls), 10000):
        batch = urls[start:start + 10000]
        receipt_path = manifest.with_name(manifest.stem + f'-batch-{start // 10000 + 1}.json')
        if receipt_path.exists():
            old = json.loads(receipt_path.read_text())
            if old.get('httpStatus') == 200 and old.get('urlSha256') == digest(batch):
                print(json.dumps({'batch': start // 10000 + 1, 'alreadyAccepted': len(batch)}), flush=True)
                continue
            raise RuntimeError(f'Prior uncertain or rejected attempt requires inspection: {receipt_path}')
        receipt = {'startedAt': now(), 'endpoint': ENDPOINT, 'host': 'pinnacleblooms.org',
                   'manifest': manifest.name, 'offset': start, 'count': len(batch), 'urlSha256': digest(batch),
                   'keyVerified': True, 'status': 'attempt-started'}
        save(receipt_path, receipt)
        request = urllib.request.Request(ENDPOINT, data=json.dumps({'host': 'pinnacleblooms.org', 'key': key,
            'keyLocation': key_location, 'urlList': batch}).encode(), headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'Pinnacle-Sitemap-Submission/1.0'}, method='POST')
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                receipt.update(httpStatus=response.status, response=response.read().decode(), retryAfter=response.headers.get('Retry-After'))
        except urllib.error.HTTPError as error:
            receipt.update(httpStatus=error.code, response=error.read().decode(), retryAfter=error.headers.get('Retry-After'))
        except Exception as error:
            receipt.update(error=str(error), status='uncertain')
        receipt['completedAt'] = now()
        receipt['status'] = 'accepted' if receipt.get('httpStatus') == 200 else 'requires-inspection'
        receipt['meaning'] = 'Notification receipt only; not proof of crawling, indexing, ranking or AI citation.'
        save(receipt_path, receipt)
        print(json.dumps(receipt), flush=True)
        if receipt.get('httpStatus') != 200:
            raise RuntimeError('Stopped without retrying; inspect the response before continuing.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['prepare', 'submit'])
    parser.add_argument('manifest', type=Path)
    arguments = parser.parse_args()
    {'prepare': prepare, 'submit': submit}[arguments.mode](arguments.manifest.resolve())
