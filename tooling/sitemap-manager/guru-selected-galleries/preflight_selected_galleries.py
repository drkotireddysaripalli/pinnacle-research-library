#!/usr/bin/env python3
"""Bounded metadata preflight and cached replay; never image GETs or feed admission."""
import argparse
import collections
import concurrent.futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
import pathlib
import re
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser

from build_selected_galleries import FAMILY, HOLD, encoded, sha

PARENT_UA = 'Pinnacle-Sitemap-Qualification/1.0'
IMAGE_UA = 'PinnacleSitemapAssetQualification/1.0'
BOTS = ('Googlebot', 'Bingbot', 'Googlebot-Image')
THUMB_HOSTS = {'images.pinnacleblooms.org', 'res.pinnacleblooms.org', 'www.pinnacleblooms.org'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def canonical_uri(value):
    value = ''.join(c if c.isascii() else ''.join(f'%{b:02X}' for b in c.encode('utf-8')) for c in value)
    return re.sub(r'%[0-9a-fA-F]{2}', lambda m: m[0].upper(), value)


def robots_veto(values):
    return bool(re.search(r'(?:^|[,;:\s])(?:noindex|none|noimageindex)(?=$|[,;\s])', ','.join(values), re.I))


class Page(HTMLParser):
    def __init__(self, parent):
        super().__init__(convert_charrefs=True)
        self.parent, self.stack = parent, []
        self.canonicals, self.meta_robots, self.og_images, self.primary_images = [], [], [], []
        self.renderers, self.selected_gallery_markers = set(), []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        classes = set((d.get('class') or '').split())
        if tag == 'main' and 'guru-recovery' in classes:
            self.renderers.add('maintained_guru_recovery_main_gallery')
        if d.get('id') == 'cm-news-page-content':
            self.renderers.add('legacy_guru_article_image_container')
        if tag == 'link' and 'canonical' in (d.get('rel') or '').lower().split():
            self.canonicals.append(urllib.parse.urljoin(self.parent, d.get('href') or ''))
        if tag == 'meta':
            if (d.get('name') or '').lower() in ('robots', 'googlebot', 'bingbot', 'googlebot-image'):
                self.meta_robots.append(d.get('content') or '')
            if (d.get('property') or '').lower() == 'og:image':
                self.og_images.append(urllib.parse.urljoin(self.parent, d.get('content') or ''))
        if d.get('data-guru-gallery-source'):
            self.selected_gallery_markers.append(d)
        if tag == 'img':
            recovery = any(t == 'main' and 'guru-recovery' in set((a.get('class') or '').split()) for t, a in self.stack)
            gallery = any('guru-gallery' in set((a.get('class') or '').split()) for _, a in self.stack)
            legacy = any(a.get('id') == 'cm-news-page-content' for _, a in self.stack)
            legacy_image = any('image' in set((a.get('class') or '').split()) for _, a in self.stack)
            legacy_body = any('cm-np-c-data' in set((a.get('class') or '').split()) for _, a in self.stack)
            if (recovery and gallery) or (legacy and legacy_image and legacy_body):
                self.primary_images.append({'url': urllib.parse.urljoin(self.parent, d.get('src') or ''),
                                            'attributes': d, 'source_scope': 'recovery.gallery' if recovery else 'legacy.article.image'})
        if tag not in VOID:
            self.stack.append((tag, d))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                return


def same_id_thumbnail(url, gid):
    u = urllib.parse.urlsplit(url)
    return (u.scheme == 'https' and u.netloc in THUMB_HOSTS and not u.query and not u.fragment
            and u.path == f'/Assets/PUBLISHIMAGE/Image/{gid}_THUMB.jpeg')


def load_plan(plan):
    index = json.loads((plan / 'index.json').read_bytes())
    if index.get('schema') != FAMILY or index['counts']['parents'] != 146 or index['counts']['objects'] != 150:
        raise ValueError('Not the commissioned Guru selection plan')
    for name, expected in index['file_sha256'].items():
        target = (plan / name).resolve()
        if plan.resolve() not in target.parents or sha(target.read_bytes()) != expected:
            raise ValueError('Plan path/hash changed')
    manifests = [json.loads((plan / p['manifest_file']).read_bytes()) for p in index['parents']]
    if len({p['existing_parent_url'] for p in manifests}) != 146:
        raise ValueError('Duplicate parent in plan')
    return index, manifests


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def capture_request(url, method, kind, output):
    """Writes parsed raw header pairs and bounded HTML/robots bytes. HEAD never read."""
    identity = sha((method + '\n' + url).encode())
    rec = {'url': url, 'method': method, 'kind': kind, 'observed_at': now(), 'redirects_followed': False,
           'credentials_sent': False, 'media_body_downloaded': False, 'status': None}
    req = urllib.request.Request(url, method=method, headers={
        'User-Agent': IMAGE_UA if method == 'HEAD' else PARENT_UA,
        'Accept-Encoding': 'identity', 'Accept': 'image/*' if method == 'HEAD' else 'text/html,text/plain;q=0.9'})
    response = None
    try:
        try:
            response = urllib.request.build_opener(NoRedirect).open(req, timeout=25)
        except urllib.error.HTTPError as error:
            response = error
        headers = list(response.headers.raw_items())
        rec.update(status=response.status, response_url=response.geturl(),
                   content_type=response.headers.get('Content-Type'), content_length=response.headers.get('Content-Length'),
                   etag=response.headers.get('ETag'), last_modified=response.headers.get('Last-Modified'),
                   location=response.headers.get('Location'), x_robots=response.headers.get_all('X-Robots-Tag') or [])
        header_bytes = encoded({'status': response.status, 'reason': str(response.reason), 'header_pairs': headers})
        name = f'raw/{identity}.headers.json'
        (output / name).write_bytes(header_bytes)
        rec.update(raw_headers_file=name, raw_headers_sha256=sha(header_bytes))
        if method == 'GET' and rec['status'] == 200:
            content_type = (rec['content_type'] or '').lower()
            allowed_body = (kind == 'robots' and ('text/' in content_type or not content_type)) or (
                kind == 'parent' and content_type.startswith(('text/html', 'application/xhtml+xml')))
            if allowed_body:
                limit = 2 * 1024 * 1024
                body = response.read(limit + 1)
                rec['body_complete'] = len(body) <= limit
                body = body[:limit]
                name = f'raw/{identity}.{"html" if kind == "parent" else "robots.txt"}'
                (output / name).write_bytes(body)
                rec.update(body_file=name, body_sha256=sha(body), body_bytes=len(body))
            else:
                rec['body_complete'] = False
                rec['body_not_read_reason'] = 'Unexpected content type; no media body read'
    except Exception as error:
        rec.update(error_type=type(error).__name__)
    finally:
        if response is not None:
            response.close()
    return rec


def validate_raw(rec, evidence):
    for field in ('raw_headers', 'body'):
        name = rec.get(field + '_file')
        if name:
            p = (evidence / name).resolve()
            if evidence.resolve() not in p.parents or sha(p.read_bytes()) != rec.get(field + '_sha256'):
                raise ValueError('Cached preflight raw file/hash mismatch')
    if rec.get('raw_headers_file'):
        raw = json.loads((evidence / rec['raw_headers_file']).read_bytes())
        values = [v for k, v in raw['header_pairs'] if k.lower() == 'x-robots-tag']
        if raw['status'] != rec['status'] or values != rec.get('x_robots', []):
            raise ValueError('Cached header/status summary differs from raw evidence')


def robot_allow(rec, evidence, url):
    # A direct404/410 means no robots file, not a Disallow rule. Keep403/429/5xx/redirects unknown.
    if rec and rec.get('status') in (404, 410) and rec.get('response_url') == rec.get('url'):
        return {bot: True for bot in BOTS}
    if not rec or rec.get('status') != 200 or not rec.get('body_complete'):
        return {bot: None for bot in BOTS}
    parser = urllib.robotparser.RobotFileParser()
    parser.parse((evidence / rec['body_file']).read_text(errors='replace').splitlines())
    return {bot: parser.can_fetch(bot, url) for bot in BOTS}


def parent_observation(manifest, rec, robots, evidence):
    parent = manifest['existing_parent_url']
    parser = Page(parent)
    if rec.get('body_complete') and rec.get('body_file'):
        parser.feed((evidence / rec['body_file']).read_text(errors='replace'))
    robots_allowed = robot_allow(robots, evidence, parent)
    canonical_ok = [canonical_uri(u) for u in parser.canonicals] == [canonical_uri(parent)]
    reasons = []
    if rec.get('status') != 200 or rec.get('response_url') != parent:
        reasons.append('PARENT_NOT_DIRECT_200')
    if not (rec.get('content_type') or '').lower().startswith(('text/html', 'application/xhtml+xml')):
        reasons.append('PARENT_NOT_HTML')
    if not rec.get('body_complete'):
        reasons.append('PARENT_BODY_INCOMPLETE')
    if not canonical_ok:
        reasons.append('PARENT_CANONICAL_MISMATCH_OR_AMBIGUOUS')
    if robots_veto(rec.get('x_robots', []) + parser.meta_robots):
        reasons.append('PARENT_ROBOTS_VETO')
    if not all(value is True for value in robots_allowed.values()):
        reasons.append('PARENT_ROBOTS_TXT_BLOCKED_OR_UNKNOWN')
    return {'guru_id': manifest['guru_id'], 'parent_url': parent, 'status': rec.get('status'),
            'content_type': rec.get('content_type'), 'canonicals': parser.canonicals, 'canonical_consistent': canonical_ok,
            'x_robots': rec.get('x_robots', []), 'meta_robots': parser.meta_robots, 'robots_allowed': robots_allowed,
            'parent_preflight_qualified': not reasons, 'hold_reasons': reasons,
            'body_file': rec.get('body_file'), 'body_sha256': rec.get('body_sha256'),
            'raw_headers_file': rec.get('raw_headers_file'), 'raw_headers_sha256': rec.get('raw_headers_sha256'),
            'observed_at': rec['observed_at'], 'recognized_renderers': sorted(parser.renderers),
            'selected_primary_images': parser.primary_images, 'og_images': parser.og_images,
            'gallery_source_markers_seen': parser.selected_gallery_markers,
            'new_selected_gallery_render_verification': 'PENDING_INTEGRATION; these observations do not admit any feed row'}


def image_observation(rec, robot_rec, evidence):
    allowed = robot_allow(robot_rec, evidence, rec['url'])
    reasons = []
    if rec.get('status') != 200 or rec.get('response_url') != rec['url']:
        reasons.append('IMAGE_NOT_DIRECT_200')
    if not (rec.get('content_type') or '').lower().startswith('image/'):
        reasons.append('IMAGE_CONTENT_TYPE_NOT_IMAGE')
    length = rec.get('content_length')
    if not isinstance(length, str) or not length.isdigit() or int(length) < 1:
        reasons.append('IMAGE_POSITIVE_LENGTH_UNPROVEN')
    if robots_veto(rec.get('x_robots', [])):
        reasons.append('IMAGE_X_ROBOTS_VETO')
    direct_delivery = not reasons
    if not all(value is True for value in allowed.values()):
        reasons.append('IMAGE_ROBOTS_TXT_BLOCKED_OR_UNKNOWN')
    return {**rec, 'robots_allowed': allowed, 'robots_txt_status': robot_rec.get('status') if robot_rec else None,
            'robots_policy_basis': 'NO_ROBOTS_FILE_DIRECT_404_OR_410' if robot_rec and robot_rec.get('status') in (404, 410) else 'ROBOTS_BODY_RULES_OR_UNKNOWN',
            'direct_image_delivery_verified': direct_delivery,
            'delivery_preflight_qualified': not reasons, 'hold_reasons': reasons,
            'image_dimensions': 'UNKNOWN; HEAD only', 'media_byte_identity': 'UNKNOWN; no body downloaded'}


def replacement_decision(manifest, parent, heads, replacement_ok):
    gid = manifest['guru_id']
    def decide(urls, true_absence_known):
        unique = sorted(set(urls))
        if not unique:
            basis = 'ABSENT_IN_RECOGNIZED_CURRENT_RENDERER' if true_absence_known else 'PRIMARY_SELECTION_UNKNOWN'
            permit = true_absence_known
        elif all(same_id_thumbnail(url, gid) for url in unique):
            statuses = [heads.get(url, {}).get('status') for url in unique]
            permit = all(status in (404, 410) for status in statuses)
            basis = 'EXACT_SELECTED_SAME_ID_THUMBNAIL_CONFIRMED_404_OR_410' if permit else 'PRESERVE_VALID_OR_UNKNOWN_EXISTING_SELECTION'
        else:
            permit, basis = False, 'PRESERVE_OTHER_EXISTING_SELECTION_NO_BLIND_REWRITE'
        permit = permit and parent['parent_preflight_qualified'] and replacement_ok
        return {'observed_exact_urls': unique, 'basis': basis, 'fallback_permitted_for_integration': permit,
                'new_fallback_url': manifest['assets'][0]['selected_url'] if permit else None,
                'action': 'NEW_SEQUENCE_ZERO_FALLBACK_PERMITTED_FOR_INTEGRATION' if permit else 'PRESERVE_OR_HOLD',
                'target_boundary': 'Only this selected visible-primary/OG slot; never footer, related cards, shared shell or other images.'}
    recognized = bool(parent['recognized_renderers'])
    return {'guru_id': gid, 'parent_url': manifest['existing_parent_url'],
            'sequence_zero_url': manifest['assets'][0]['selected_url'],
            'visible_primary': decide([r['url'] for r in parent['selected_primary_images']], recognized),
            'og_image': decide(parent['og_images'], bool(parent.get('body_sha256'))),
            'parent_body_sha256': parent.get('body_sha256'),
            'historical_gallery_or_upload_provenance': 'UNKNOWN; fallback is a NEW explicit selection',
            'sitemap_admission': HOLD, 'automatic_page_rewrites': 0}


def summarize(plan, evidence, output):
    index, manifests = load_plan(plan)
    capture = json.loads((evidence / 'capture-index.json').read_bytes())
    if capture['plan_index_sha256'] != sha((plan / 'index.json').read_bytes()):
        raise ValueError('Capture belongs to different plan')
    records = capture['requests']
    for rec in records:
        validate_raw(rec, evidence)
    by_method_url = {(r['method'], r['url']): r for r in records}
    if len(by_method_url) != len(records):
        raise ValueError('Duplicate preflight request evidence')
    robots = {urllib.parse.urlsplit(r['url']).netloc: r for r in records if r['kind'] == 'robots'}
    parent_rows, primary_rows, pairs = [], [], []
    image_rows = []
    for manifest in manifests:
        parent = parent_observation(manifest, by_method_url['GET', manifest['existing_parent_url']],
                                    robots.get('www.pinnacleblooms.org'), evidence)
        parent_rows.append(parent)
        qualified_images = {}
        for asset in manifest['assets']:
            rec = by_method_url['HEAD', asset['selected_url']]
            image = image_observation(rec, robots.get('images.pinnacleblooms.org'), evidence)
            image_rows.append(image)
            qualified_images[asset['selected_url']] = image['delivery_preflight_qualified']
            pairs.append({'family': FAMILY, 'guru_id': manifest['guru_id'], 'parent_url': manifest['existing_parent_url'],
                          'image_url': asset['selected_url'], 'object_key': asset['object_key'], 'sequence': asset['sequence'],
                          'selection_scope_sha256': index['selection_scope_sha256'],
                          'parent_render_manifest_sha256': sha(encoded(manifest)),
                          'parent_body_sha256': parent.get('body_sha256'),
                          'image_HEAD_headers_sha256': image.get('raw_headers_sha256'),
                          'parent_preflight_qualified': parent['parent_preflight_qualified'],
                          'image_delivery_preflight_qualified': image['delivery_preflight_qualified'],
                          'hold_reasons': sorted(set(parent['hold_reasons'] + image['hold_reasons'] + ['NEW_GALLERY_NOT_YET_INTEGRATED_AND_READ_BACK'])),
                          'actual_rendered_use': 'PENDING', 'copyright_ownership': 'UNKNOWN', 'licence': 'UNKNOWN',
                          'public_reference_instruction': True, 'sitemap_admission': HOLD})
        primary_rows.append(replacement_decision(manifest, parent,
            {u: r for (m, u), r in by_method_url.items() if m == 'HEAD'},
            qualified_images[manifest['assets'][0]['selected_url']]))
    files = {'parent-preflight.jsonl': parent_rows, 'image-HEAD-preflight.jsonl': image_rows,
             'primary-replacement-plan.jsonl': primary_rows, 'relationships-preflight-pending.jsonl': pairs}
    output.mkdir(exist_ok=False)
    hashes = {}
    for name, rows in files.items():
        data = b''.join((json.dumps(r, ensure_ascii=False, sort_keys=True) + '\n').encode() for r in rows)
        (output / name).write_bytes(data)
        hashes[name] = sha(data)
    summary = {
        'schema': FAMILY, 'plan_index_sha256': capture['plan_index_sha256'],
        'capture_index_sha256': sha((evidence / 'capture-index.json').read_bytes()),
        'observed_from': min(r['observed_at'] for r in records), 'observed_to': max(r['observed_at'] for r in records),
        'exact_selected_objects': len(image_rows), 'existing_parents': len(parent_rows),
        'parent_preflight_qualified': sum(p['parent_preflight_qualified'] for p in parent_rows),
        'image_direct_delivery_verified': sum(p['direct_image_delivery_verified'] for p in image_rows),
        'image_delivery_preflight_qualified': sum(p['delivery_preflight_qualified'] for p in image_rows),
        'pair_parent_and_delivery_preflight_qualified': sum(p['parent_preflight_qualified'] and p['image_delivery_preflight_qualified'] for p in pairs),
        'image_HEAD_status_counts': dict(collections.Counter(str(r.get('status')) for r in image_rows)),
        'parent_GET_status_counts': dict(collections.Counter(str(r.get('status')) for r in parent_rows)),
        'visible_primary_fallbacks_permitted': sum(r['visible_primary']['fallback_permitted_for_integration'] for r in primary_rows),
        'og_fallbacks_permitted': sum(r['og_image']['fallback_permitted_for_integration'] for r in primary_rows),
        'fallback_reason_counts': dict(collections.Counter(r['visible_primary']['basis'] for r in primary_rows)),
        'request_counts': dict(collections.Counter(r['kind'] for r in records)),
        'network_requests': len(records), 'sitemap_admissions': 0, 'feed_rows_created': 0, 'media_bodies_downloaded': 0,
        'actual_new_gallery_render_verification': 'PENDING_INTEGRATION_AND_LIVE_READBACK',
        'rights_boundary': 'User public-reference instruction recorded; copyright ownership/licence unknown; no licence grant invented.',
        'raw_headers_boundary': 'Original repeated header pairs from urllib response; not a TCP/wire capture.',
        'file_sha256': hashes,
    }
    (output / 'summary.json').write_bytes(encoded(summary))
    return summary


def capture(plan, output):
    index, manifests = load_plan(plan)
    if output.exists():
        raise ValueError('Capture output must be new; no repeat/overwrite of cached evidence')
    output.mkdir()
    (output / 'raw').mkdir()
    requests = []
    robots_urls = ['https://www.pinnacleblooms.org/robots.txt', 'https://images.pinnacleblooms.org/robots.txt']
    for url in robots_urls:
        requests.append(capture_request(url, 'GET', 'robots', output))
    batch = [(m['existing_parent_url'], 'GET', 'parent') for m in manifests]
    batch += [(a['selected_url'], 'HEAD', 'selected_gallery_image') for m in manifests for a in m['assets']]
    assert len(batch) == 296 and len(set(batch)) == 296
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for i, rec in enumerate(pool.map(lambda x: capture_request(*x, output), batch), 1):
            requests.append(rec)
            if i % 40 == 0:
                print(json.dumps({'primary_batch_completed': i, 'total': len(batch)}), flush=True)
    parents = {r['url']: r for r in requests if r['kind'] == 'parent'}
    primary_urls = set()
    for m in manifests:
        rec = parents[m['existing_parent_url']]
        if rec.get('body_complete') and rec.get('body_file'):
            p = Page(m['existing_parent_url'])
            p.feed((output / rec['body_file']).read_text(errors='replace'))
            for url in p.og_images + [r['url'] for r in p.primary_images]:
                if same_id_thumbnail(url, m['guru_id']):
                    primary_urls.add(url)
    # At most one same-ID thumbnail URI per observed primary/OG slot; no arbitrary images followed.
    if len(primary_urls) > 2 * len(manifests):
        raise ValueError('Unexpected primary-thumbnail scope growth')
    existing_heads = {r['url'] for r in requests if r['method'] == 'HEAD'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        requests.extend(pool.map(lambda u: capture_request(u, 'HEAD', 'same_id_selected_primary_thumbnail', output),
                                 sorted(primary_urls - existing_heads)))
    payload = {'plan_index_sha256': sha((plan / 'index.json').read_bytes()), 'completed_at': now(),
               'request_policy': 'No redirects, retries, credentials or media GETs; max4workers. Only146parents+150selectedHEADs+2robots+deduped current same-ID primary/OG thumbnail HEADs.',
               'parent_user_agent': PARENT_UA, 'image_user_agent': IMAGE_UA, 'requests': requests}
    (output / 'capture-index.json').write_bytes(encoded(payload))
    return {'requests': len(requests), 'capture_index_sha256': sha(encoded(payload))}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    sub = cli.add_subparsers(dest='command', required=True)
    c = sub.add_parser('capture')
    c.add_argument('--plan', required=True, type=pathlib.Path)
    c.add_argument('--output', required=True, type=pathlib.Path)
    s = sub.add_parser('summarize')
    s.add_argument('--plan', required=True, type=pathlib.Path)
    s.add_argument('--evidence', required=True, type=pathlib.Path)
    s.add_argument('--output', required=True, type=pathlib.Path)
    a = cli.parse_args()
    result = capture(a.plan, a.output) if a.command == 'capture' else summarize(a.plan, a.evidence, a.output)
    print(json.dumps(result, sort_keys=True, indent=2), flush=True)
