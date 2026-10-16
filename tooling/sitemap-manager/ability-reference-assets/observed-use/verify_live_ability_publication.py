#!/usr/bin/env python3
"""Read-only acceptance of the pinned Ability images in live HTML and XML.

This does not admit feed rows, change ownership, submit URLs or prove indexing.
Run once after the owner supplies a new deployed release, with a fresh output dir.
"""
import argparse
import collections
import concurrent.futures
import datetime as dt
import hashlib
import json
import pathlib
import sys
import urllib.error
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

HERE = pathlib.Path(__file__).resolve().parent
for adapter_dir in (HERE, HERE / 'ability-reference-assets'):
    if (adapter_dir / 'qualify_observed_ability_uses.py').is_file():
        sys.path.insert(0, str(adapter_dir))
        break
import qualify_observed_ability_uses as ability

UA = 'Pinnacle-Sitemap-Qualification/1.0'
MAX = 8 * 1024 * 1024


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        response = urllib.request.build_opener(NoRedirect).open(request, timeout=35)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        body = response.read(MAX + 1)
        if len(body) > MAX:
            raise ValueError('Bounded public document exceeds limit')
        return body, {'url': url, 'final_url': response.url, 'status': response.status,
            'content_type': response.headers.get('Content-Type', ''),
            'x_robots': response.headers.get_all('X-Robots-Tag') or [],
            'location': response.headers.get_all('Location') or [],
            'body_bytes': len(body), 'body_sha256': hashlib.sha256(body).hexdigest(),
            'observed_at': dt.datetime.now(dt.timezone.utc).isoformat()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--packet', required=True, type=pathlib.Path)
    parser.add_argument('--heads', required=True, type=pathlib.Path)
    parser.add_argument('--head-receipt', required=True, type=pathlib.Path)
    parser.add_argument('--deployment', required=True)
    parser.add_argument('--out', required=True, type=pathlib.Path)
    parser.add_argument('--sitemap-url', default='https://www.pinnacleblooms.org/sitemap-images-assessments-001.xml')
    args = parser.parse_args()
    packet = ability.load_packet(args.packet)
    heads = ability.load_heads(args.heads, args.head_receipt, packet)
    args.out.mkdir(parents=True, exist_ok=False)
    (args.out / 'html').mkdir()
    clock = dt.datetime.now(dt.timezone.utc)
    raw_robots, robots_receipt = fetch('https://www.pinnacleblooms.org/robots.txt')
    if robots_receipt['status'] != 200:
        raise ValueError('Current public parent robots could not be verified')
    (args.out / 'robots.txt').write_bytes(raw_robots)
    robots = urllib.robotparser.RobotFileParser()
    robots.parse(raw_robots.decode('utf-8').splitlines())

    def check(parent):
        body, row = fetch(parent)
        filename = 'html/' + ability.sha(parent.encode()) + '.html'
        (args.out / filename).write_bytes(body)
        row['body_path'] = filename
        plan = packet['parents'][parent]
        html_parser = ability.RenderHTML(parent, plan, packet['consent_sha256'])
        html_parser.feed(body.decode('utf-8'))
        html_parser.finish()
        row['canonical_consistent'] = len(html_parser.canonical) == 1 and ability.canonical_uri(html_parser.canonical[0]) == ability.canonical_uri(parent)
        row['crawl_allowed'] = {bot: robots.can_fetch(bot, parent) for bot in ('Googlebot', 'Bingbot', 'Googlebot-Image')}
        row['renderer_errors'] = html_parser.errors
        row['expected_pairs'] = len(plan['images'])
        row['observed_pairs'] = len(html_parser.images)
        row['exact_pairs_present'] = set(html_parser.images) == set(plan['images'])
        row['reference_selection_complete'] = html_parser.selection_complete
        row['delivery_holds'] = []
        for image in plan['images'].values():
            status, reason = ability.head_decision(heads.get(image['image_url']), image['image_url'], clock)
            if status != 'qualified':
                row['delivery_holds'].append({'url': image['image_url'], 'condition': reason})
        row['passed'] = (row['status'] == 200 and row['final_url'] == parent and not row['location']
            and row['content_type'].lower().startswith('text/html') and row['canonical_consistent']
            and all(row['crawl_allowed'].values()) and not ability.restricted(row, html_parser.robots)
            and not row['renderer_errors'] and row['exact_pairs_present']
            and row['reference_selection_complete'] and not row['delivery_holds'])
        return row

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        parents = list(pool.map(check, sorted(packet['parents'])))
    xml, xml_receipt = fetch(args.sitemap_url)
    (args.out / 'image-sitemap.xml').write_bytes(xml)
    if xml_receipt['status'] != 200 or 'xml' not in xml_receipt['content_type'].lower():
        raise ValueError('Expected public image sitemap not delivered directly as XML')
    namespace = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'i': 'http://www.google.com/schemas/sitemap-image/1.1'}
    counts = collections.Counter()
    for entry in ET.fromstring(xml).findall('s:url', namespace):
        parent = entry.findtext('s:loc', namespaces=namespace)
        for image in entry.findall('i:image', namespace):
            counts[(parent, image.findtext('i:loc', namespaces=namespace))] += 1
    bad_pairs = [{'parent_url': p, 'image_url': i, 'occurrences': counts[(p, i)]}
        for p, i in sorted(packet['pairs']) if counts[(p, i)] != 1]
    report = {'at': dt.datetime.now(dt.timezone.utc).isoformat(), 'deployment_claim_supplied_by_owner': args.deployment,
        'read_only': True, 'database_writes': 0, 'submissions': 0, 'media_body_downloads': 0,
        'consent_sha256': packet['consent_sha256'], 'render_index_sha256': packet['index_sha256'],
        'robots': robots_receipt, 'parents': parents, 'sitemap': xml_receipt,
        'expected_parent_count': 47, 'passed_parent_count': sum(x['passed'] for x in parents),
        'expected_exact_pairs': len(packet['pairs']), 'pairs_missing_or_duplicated_in_live_xml': bad_pairs,
        'passed': len(parents) == 47 and all(x['passed'] for x in parents) and not bad_pairs,
        'limits': ['Independent public HTML/XML evidence only; no current feed mutation or ownership proof',
            'Image HEAD evidence is reused only while the pinned adapter still considers it fresh',
            'Does not prove image pixels, search indexing, rankings or qualified enquiries']}
    (args.out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: report[k] for k in ('passed', 'passed_parent_count', 'expected_exact_pairs')}))
    return 0 if report['passed'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
