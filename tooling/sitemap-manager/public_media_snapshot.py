"""Bounded anonymous HTML snapshots for public resource media associations."""
from __future__ import annotations

import argparse
import concurrent.futures
import csv
import datetime as dt
import gzip
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

import catalogue_v2 as c

MAX_BODY = 4 * 1024 * 1024
VIDEO_HOSTS = {'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com',
               'player.vimeo.com', 'iframe.videodelivery.net', 'videodelivery.net'}


def source_image(address):
    """Keep rendition URL separate from the source in documented CF syntax.

    https://developers.cloudflare.com/images/optimization/features/#url-interface
    """
    parsed = urllib.parse.urlsplit(address)
    prefix = '/cdn-cgi/image/'
    if not parsed.path.startswith(prefix):
        return address
    tail = parsed.path[len(prefix):]
    if '/' not in tail:
        return address
    options, source = tail.split('/', 1)
    if not options or '=' not in options:
        return address
    if source.startswith(('https://', 'http://')):
        return source + ('?' + parsed.query if parsed.query else '')
    path = '/' + source.lstrip('/')
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path, parsed.query, ''))


class MediaHTML(HTMLParser):
    def __init__(self, page_url):
        super().__init__(convert_charrefs=True)
        self.page_url = self.base = page_url
        self.title = self.h1 = ''
        self.description = ''
        self.canonicals = []
        self.robots = []
        self.references = []
        self.video_objects = []
        self.in_title = self.in_h1 = self.in_video = False
        self.in_head = False
        self.json_script = False
        self.json_data = []

    def address(self, value):
        value = (value or '').strip()
        result = urllib.parse.urljoin(self.base, value)
        parsed = urllib.parse.urlsplit(result)
        if parsed.scheme not in ('http', 'https') or not parsed.netloc or parsed.username or parsed.password:
            return None
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, parsed.query, ''))

    def reference(self, value, kind, tag, attribute, attrs):
        address = self.address(value)
        if address:
            self.references.append({'media_url': address, 'media_kind': kind,
                                    'source_image_url': source_image(address) if kind == 'image' else address,
                                    'tag': tag, 'attribute': attribute,
                                    'source_line': self.getpos()[0], 'alt': attrs.get('alt'),
                                    'rendered_width': attrs.get('width'), 'rendered_height': attrs.get('height')})

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'base' and a.get('href'):
            self.base = self.address(a['href']) or self.base
        if tag == 'head': self.in_head = True
        # SVG accessibility titles describe icons, not the document.
        if tag == 'title': self.in_title = self.in_head
        if tag == 'h1': self.in_h1 = True
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name == 'description': self.description = a.get('content', '')
            if name in ('robots', 'googlebot', 'bingbot'): self.robots.append(a.get('content', ''))
        if tag == 'link' and a.get('rel', '').lower() == 'canonical' and a.get('href'):
            self.canonicals.append(self.address(a['href']))
        if tag == 'img':
            for attr in ('src', 'data-src', 'data-lazy-src'):
                if a.get(attr): self.reference(a[attr], 'image', tag, attr, a)
        if tag == 'video':
            self.in_video = True
            if a.get('src'): self.reference(a['src'], 'video', tag, 'src', a)
            if a.get('poster'): self.reference(a['poster'], 'image', tag, 'poster', a)
        if tag == 'source' and a.get('src'):
            self.reference(a['src'], 'video' if self.in_video else 'unclassified_source', tag, 'src', a)
        if tag in ('img', 'source'):
            for attr in ('srcset', 'data-srcset'):
                for member in a.get(attr, '').split(','):
                    words = member.strip().split()
                    if words and not words[0].startswith('data:'):
                        self.reference(words[0], 'video' if self.in_video else 'image', tag, attr, a)
        if tag == 'iframe' and a.get('src'):
            address = self.address(a['src'])
            if address and urllib.parse.urlsplit(address).hostname in VIDEO_HOSTS:
                self.reference(a['src'], 'player', tag, 'src', a)
        if tag == 'script' and a.get('type', '').lower() == 'application/ld+json':
            self.json_script = True
            self.json_data = []

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1 += data
        if self.json_script: self.json_data.append(data)

    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = self.in_title = False
        if tag == 'title': self.in_title = False
        if tag == 'h1': self.in_h1 = False
        if tag == 'video': self.in_video = False
        if tag == 'script' and self.json_script:
            self.json_script = False
            try:
                value = json.loads(''.join(self.json_data))
                def collect(node):
                    if isinstance(node, list):
                        for item in node: collect(item)
                    if isinstance(node, dict):
                        types = node.get('@type', [])
                        if types == 'VideoObject' or isinstance(types, list) and 'VideoObject' in types:
                            self.video_objects.append(node)
                        for item in node.values():
                            if isinstance(item, (dict, list)): collect(item)
                collect(value)
            except (ValueError, TypeError):
                pass

    def snapshot(self, xrobots=''):
        directives = self.robots + ([xrobots] if xrobots else [])
        noindex = any({'noindex', 'none'} & set(re.findall(r'[a-z_]+', value.lower())) for value in directives)
        noimageindex = any('noimageindex' in re.findall(r'[a-z_]+', value.lower()) for value in directives)
        expected = c.address(self.page_url)
        normalized = [c.address(value) if value else None for value in self.canonicals]
        return {'page_url': self.page_url, 'title': self.title.strip(), 'h1': self.h1.strip(),
                'description': self.description, 'canonical_urls': self.canonicals,
                'canonical_normalized': normalized,
                'robots': directives, 'self_canonical': normalized == [expected],
                'canonical_conflict': any(value != expected for value in normalized),
                'canonical_basis': 'explicit_html' if self.canonicals else 'accepted_publisher_preferred_url; explicit_html_canonical_unknown',
                'noindex': noindex, 'noimageindex': noimageindex, 'media_references': self.references,
                'video_objects': self.video_objects}


def selected_urls(pages):
    result = []
    for row in pages:
        u = row['page_url']; p = urllib.parse.urlsplit(u)
        if p.hostname in ('materials.pinnacleblooms.org', 'interventions.pinnacleblooms.org') or p.hostname == 'www.pinnacleblooms.org' and p.path.startswith('/abs/'):
            result.append(u)
    if len(result) != len(set(result)):
        raise ValueError('Duplicate selected publisher page')
    return sorted(result)


def snapshot_one(url, destination):
    stamp = dt.datetime.now(dt.timezone.utc).isoformat()
    result = {'page_url': url, 'observed_at': stamp, 'publication_qualified': False}
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'PinnacleSitemapVerification/1.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read(MAX_BODY + 1)
            result.update(status=response.status, final_url=response.url, content_type=response.headers.get('Content-Type', ''))
            xrobots = response.headers.get('X-Robots-Tag', '')
        if len(raw) > MAX_BODY:
            raise ValueError('Public HTML exceeds bounded snapshot size')
        if not result['content_type'].lower().startswith('text/html'):
            raise ValueError('Public resource did not return HTML')
        identity = hashlib.sha256(url.encode()).hexdigest()
        body = destination/'html'/(identity + '.html.gz')
        body.parent.mkdir(parents=True, exist_ok=True)
        body.write_bytes(gzip.compress(raw, compresslevel=1, mtime=0))
        parser = MediaHTML(url); parser.feed(raw.decode('utf-8', 'replace')); parser.close()
        result.update(parser.snapshot(xrobots), body_bytes=len(raw),
                      body_sha256=hashlib.sha256(raw).hexdigest(),
                      body_gzip_relative='html/' + body.name,
                      body_gzip_sha256=c.file_hash(body))
        result['publication_qualified'] = result['status'] == 200 and result['final_url'] == url and not result['canonical_conflict'] and not result['noindex']
    except (OSError, ValueError, urllib.error.URLError) as error:
        result['error'] = str(error)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--pages', type=Path, required=True)
    parser.add_argument('--pages-sha256', required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--workers', type=int, default=4)
    args = parser.parse_args()
    if args.workers not in range(1, 5): raise ValueError('Use one to four source requests at a time')
    if c.file_hash(args.pages) != args.pages_sha256: raise ValueError('Published page input hash mismatch')
    if args.output.exists(): raise ValueError('Use an immutable new HTML snapshot directory')
    with args.pages.open(newline='', encoding='utf-8-sig') as stream:
        urls = selected_urls(csv.DictReader(stream))
    args.output.mkdir(parents=True)
    path = args.output/'public-media-snapshot.jsonl'
    counts = {'pages': len(urls), 'received': 0, 'qualified': 0, 'images': 0, 'videos': 0, 'players': 0, 'errors': 0}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool, path.open('w', encoding='utf-8') as stream:
        for result in pool.map(lambda url: snapshot_one(url, args.output), urls):
            stream.write(c.packed(result) + '\n'); stream.flush()
            counts['received'] += 1; counts['qualified'] += result['publication_qualified']
            counts['errors'] += bool(result.get('error'))
            for row in result.get('media_references', []):
                key = {'image': 'images', 'video': 'videos', 'player': 'players'}.get(row['media_kind'])
                if key: counts[key] += 1
            if counts['received'] % 100 == 0: print(c.packed({'progress': counts}), flush=True)
    if c.file_hash(args.pages) != args.pages_sha256: raise ValueError('Published page input changed during snapshot')
    receipt = {'source_pages_sha256': args.pages_sha256, 'snapshot_sha256': c.file_hash(path),
               'accounting': counts, 'media_bytes_downloaded': False, 'private_routes_fetched': False,
               'crawl_time_is_page_lastmod': False, 'deletions_inferred': False,
               'public_promotion': False, 'scope': 'Only baseline eligible public resource/assessment-example HTML'}
    (args.output/'SNAPSHOT-RECEIPT.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print(c.packed(receipt))


if __name__ == '__main__':
    main()
