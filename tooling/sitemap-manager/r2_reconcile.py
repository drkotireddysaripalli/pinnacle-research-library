"""Reconcile verified R2 metadata with public publisher references.

The output is a candidate map. Object existence, a route, or a filename never
grants publication approval or invents a page content version.
"""
from __future__ import annotations

import argparse
import collections
import csv
import json
from pathlib import Path
import tempfile
import urllib.parse

import catalogue_v2 as c


def package(manifest, expected):
    manifest = Path(manifest)
    if c.file_hash(manifest) != expected:
        raise ValueError('R2 package manifest hash mismatch')
    doc = json.loads(manifest.read_text())
    entries = {}
    for row in doc['files']:
        name = row['name']
        if Path(name).name != name or '\\' in name or name in entries:
            raise ValueError('Unsafe or duplicate R2 package entry')
        path = manifest.parent / name
        if path.is_symlink() or path.stat().st_size != row['bytes'] or c.file_hash(path) != row['sha256']:
            raise ValueError('R2 package file bytes/hash mismatch: ' + name)
        entries[name] = path
    return entries


def csv_rows(path):
    with Path(path).open(newline='', encoding='utf-8-sig') as stream:
        yield from csv.DictReader(stream)


def reconcile(job_path, output):
    job_path, output = Path(job_path), Path(output)
    job = json.loads(job_path.read_text())
    required = {'r2_manifest', 'ask_manifest', 'publisher_media', 'eligible_pages', 'answer_membership'}
    if set(job['inputs']) != required:
        raise ValueError('Incomplete R2 reconciliation job')
    sources = {}
    for role, ref in job['inputs'].items():
        path = Path(ref['path'])
        c.disjoint_paths(job_path, output, path)
        if path.is_symlink() or c.file_hash(path) != ref['sha256']:
            raise ValueError('R2 input hash mismatch: ' + role)
        sources[role] = path
    r2 = package(sources['r2_manifest'], job['inputs']['r2_manifest']['sha256'])
    ask = package(sources['ask_manifest'], job['inputs']['ask_manifest']['sha256'])
    c.disjoint_paths(output, *r2.values(), *ask.values())
    summary = json.loads(r2['summary.json'].read_text())
    route = json.loads(ask['ask-worker-route-evidence.json'].read_text())
    if not summary.get('all_selected_pagination_complete'):
        raise ValueError('Incomplete R2 pagination')
    if route.get('public_bindings', {}).get('OG_BUCKET', {}).get('bucket_name') != 'pinnacle-ask-og':
        raise ValueError('Unverified Ask R2 binding')
    if not route.get('deployed_versions') or not route.get('deployed_entry_sha256') or not route.get('renderer_sha256'):
        raise ValueError('Missing deployed Ask source evidence')
    eligible = {r['page_url'] for r in csv_rows(sources['eligible_pages'])}
    publisher = {(r['page_url'], r['media_url'], r['media_role']) for r in csv_rows(sources['publisher_media'])}
    member_doc = json.loads(sources['answer_membership'].read_text())
    answers = []
    for doc in member_doc['answer_docs']:
        if doc['status'] != 200 or doc['url'] != doc['final_url']:
            raise ValueError('Public answer shard did not serve directly')
        answers.extend(r['loc'] for r in doc['rows'])
    if len(answers) != len(set(answers)) or not set(answers) <= eligible:
        raise ValueError('Answer membership conflicts with accepted baseline')
    answers = set(answers)
    counts = collections.Counter()
    wanted = {}
    for row in csv_rows(ask['ask-worker-slug-image-candidates.csv']):
        counts['ask_source_rows'] += 1
        parent = row['page_url']
        if parent not in answers:
            counts['ask_non_answer_rows_retained'] += 1
            continue
        if row['media_role'] != 'renderer_png_candidate_if_not_curated':
            counts['ask_other_renditions_retained'] += 1
            continue
        parsed = urllib.parse.urlsplit(parent)
        key = parsed.path.removeprefix('/ask/') + '.png'
        if parsed.scheme != 'https' or parsed.netloc != 'pinnacleblooms.org' or not parsed.path.startswith('/ask/') or '/' in key:
            raise ValueError('Unexpected Ask answer identity')
        if row['bucket'] != 'pinnacle-ask-og' or row['object_key'] != key or row['media_url'] != parent + '.png':
            raise ValueError('Ask candidate contradicts deployed slug route')
        identity = (row['bucket'], row['object_key'])
        use = (parent, row['media_url'], 'ask_renderer_png_candidate')
        wanted.setdefault(identity, []).append(use)
    for row in csv_rows(r2['page-media-object-joins.csv']):
        counts['direct_source_rows'] += 1
        use = (row['page_url'], row['source_media_url'], row['source_media_role'])
        if row['match_type'] != 'exact-configured-domain-key' or use not in publisher:
            raise ValueError('R2 direct join is not backed by publisher source')
        wanted.setdefault((row['bucket'], row['object_key']), []).append(use)
    selected = []
    seen = set()
    for row in csv_rows(r2['public-resource-objects.csv']):
        key = (row['bucket'], row['object_key'])
        if key in seen:
            raise ValueError('Duplicate R2 object identity')
        seen.add(key)
        counts['exported_objects'] += 1
        counts['exported_' + row['media_kind'] + '_objects'] += 1
        if key not in wanted:
            counts['unassociated_objects_retained'] += 1
            continue
        uses = wanted[key]
        counts['associated_objects'] += 1
        configured = set(json.loads(row['configured_public_urls']))
        for parent, address, role in uses:
            if role != 'ask_renderer_png_candidate' and address not in configured:
                raise ValueError('R2 direct join contradicts configured object address')
            if role == 'ask_renderer_png_candidate' and row['content_type'] != 'image/png':
                raise ValueError('Ask PNG candidate has no matching reported MIME')
            selected.append({'page_url': parent, 'media_url': address, 'media_role': role,
                             'bucket': row['bucket'], 'object_key': row['object_key'],
                             'etag': row['etag'], 'object_bytes': int(row['size_bytes']),
                             'reported_content_type': row['content_type'],
                             'object_last_modified': row['last_modified'],
                             'parent_in_accepted_baseline': parent in eligible,
                             'approval_state': 'requires_current_public_publisher_version_and_rendered_use',
                             'r2_observed_at': summary['observed_at']})
    if counts['exported_objects'] != summary['exported_objects'] or set(wanted) - seen:
        raise ValueError('R2 object accounting mismatch')
    pairs = {(r['page_url'], r['media_url']) for r in selected}
    if len(pairs) != len(selected):
        raise ValueError('Duplicate candidate page/media relationship')
    selected.sort(key=lambda r: (r['page_url'], r['media_url']))
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=output.parent, delete=False) as stream:
        temporary = Path(stream.name)
    try:
        with temporary.open('w', encoding='utf-8') as stream:
            for row in selected:
                stream.write(c.packed(row) + '\n')
        for role, path in sources.items():
            if c.file_hash(path) != job['inputs'][role]['sha256']:
                raise ValueError('R2 source changed during reconciliation')
        package(sources['r2_manifest'], job['inputs']['r2_manifest']['sha256'])
        package(sources['ask_manifest'], job['inputs']['ask_manifest']['sha256'])
        temporary.replace(output)
    finally:
        temporary.unlink(missing_ok=True)
    counts['candidate_relationships'] = len(selected)
    counts['candidate_answer_pngs'] = sum(r['media_role'] == 'ask_renderer_png_candidate' for r in selected)
    return {'format': 'pinnacle-r2-page-media-candidates-v1', 'job_sha256': c.file_hash(job_path),
            'source_hashes': {k: v['sha256'] for k, v in job['inputs'].items()},
            'accounting': dict(counts), 'public_answer_parents': len(answers),
            'output': str(output.resolve()), 'output_sha256': c.file_hash(output),
            'page_lastmod_from_object_dates': False, 'public_promotion': False,
            'rights_inferred_from_storage': False, 'deletions_inferred': False,
            'unassociated_objects': 'Retained in the verified inventory; no page binding invented.',
            'rendered_use_boundary': 'PNG candidates require current publisher metadata; SVG and hash-card objects are not automatically rendered images.'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--job', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--receipt', type=Path, required=True)
    args = parser.parse_args()
    inputs = json.loads(args.job.read_text())['inputs']
    paths = [Path(r['path']) for r in inputs.values()]
    for role in ('r2_manifest', 'ask_manifest'):
        manifest = Path(inputs[role]['path'])
        paths.extend(manifest.parent / r['name'] for r in json.loads(manifest.read_text())['files'])
    c.disjoint_paths(args.job, args.output, args.receipt, *paths)
    result = reconcile(args.job, args.output)
    args.receipt.parent.mkdir(parents=True, exist_ok=True)
    args.receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(c.packed(result))


if __name__ == '__main__':
    main()
