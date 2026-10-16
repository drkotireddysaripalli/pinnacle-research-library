#!/usr/bin/env python3
"""Offline exact-scope NEW Guru gallery selection; never a sitemap/feed importer."""
import argparse
import collections
import hashlib
import html
import json
import pathlib
import re
import urllib.parse

FAMILY = 'guru_selected_reference_galleries_v1'
HOLD = 'HOLD_UNTIL_RENDERED_DELIVERY_AND_PARENT_QUALIFIED'
PINS = {
    'gallery-candidates.jsonl': '14544936ab7321fafe4434a42cd691c9d9e6eedd8a8811e9dec2c8abb1404786',
    'guru-gallery-disposition.json': '11514084a9d7abf54934379fcd4a1b7b04ee1fe9adbca36d756d4104451c1bd0',
    'guru-public-image-projection.json': 'c320d729fb3159c2bfe4e2e7b8f226e1446ef0fd1f3757c8df82e9e4db03e6bd',
}
MISSING = {6104, 6132}
NULL_COUNT = {5974, 5979, 6015, 6380, 6381, 6382, 6383, 6385}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, sort_keys=True, indent=2, ensure_ascii=False) + '\n').encode()


def record_sha(value):
    return sha(encoded(value))


def normalized_title(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError('Missing literal public title')
    return ' '.join(value.split())


def validate_sources(candidates, projection, disposition, exact_scope=True):
    """Structural and cross-source checks; exact production input bytes checked separately."""
    rows = projection.get('rows', [])
    public = {r['Id']: r for r in rows}
    if len(public) != len(rows) or projection.get('success') is not True:
        raise ValueError('Duplicate IDs or unsuccessful reference projection')
    grouped = collections.defaultdict(list)
    seen_keys, seen_urls = set(), set()
    for row in candidates:
        gid, seq = row['guru_id'], row['gallery_sequence_candidate']
        if type(gid) is not int or type(seq) is not int or seq < 0 or gid not in public:
            raise ValueError('Unknown Guru ID or invalid sequence')
        source = public[gid]
        count = source.get('TotalImages')
        if type(count) is not int or count < 1 or gid in MISSING | NULL_COUNT:
            raise ValueError('Excluded or undeclared original-gallery parent')
        expected_key = f'Assets/IMAGEGALLERY/{gid}_{seq}.jpg'
        url = 'https://images.pinnacleblooms.org/' + expected_key
        if (row.get('object_key') != expected_key or url not in row.get('configured_public_urls', [])
                or row.get('exact_declared_count_match') is not True
                or row.get('declared_TotalImages') != count
                or row.get('candidate_count_for_id') != count):
            raise ValueError('Exact key, configured URL or declared-count mismatch')
        parent = row.get('source_parent_url', '')
        u = urllib.parse.urlsplit(parent)
        prefix = f'/guru/{gid}/'
        if (u.scheme != 'https' or u.netloc != 'www.pinnacleblooms.org' or u.query or u.fragment
                or not u.path.startswith(prefix) or not u.path[len(prefix):]
                or '/' in u.path[len(prefix):] or re.search(r'%2f|%5c|[\\\x00-\x20\x7f]', parent, re.I)):
            raise ValueError('Not the exact existing public Guru detail parent')
        if expected_key in seen_keys or url in seen_urls:
            raise ValueError('Duplicate selected asset')
        seen_keys.add(expected_key)
        seen_urls.add(url)
        normalized_title(source.get('Title'))
        grouped[gid].append(row)
    for gid, group in grouped.items():
        count = public[gid]['TotalImages']
        if sorted(r['gallery_sequence_candidate'] for r in group) != list(range(count)):
            raise ValueError('Gallery sequence is incomplete or noncontiguous')
        if len({r['source_parent_url'] for r in group}) != 1:
            raise ValueError('Multiple parent URLs for selected Guru ID')
    if exact_scope:
        if len(candidates) != 150 or len(grouped) != 146 or len(public) != 156:
            raise ValueError('Changed commissioned selection counts')
        if set(public) - set(grouped) != MISSING | NULL_COUNT:
            raise ValueError('Unexpected excluded-parent scope')
        if {r['guru_id'] for r in disposition['missing_declared_images']} != MISSING:
            raise ValueError('Missing-object disposition changed')
        if {r['guru_id'] for r in disposition['null_declared_count_ids']} != NULL_COUNT:
            raise ValueError('Null-count disposition changed')
    return public, grouped


def render_fragment(manifest, manifest_sha):
    e = lambda x: html.escape(str(x), quote=True)
    title = e(manifest['public_title'])
    lines = [f'<section data-guru-gallery-source="{FAMILY}" data-guru-id="{manifest["guru_id"]}" '
             f'data-guru-selection-sha256="{e(manifest["selection_scope_sha256"])}" '
             f'data-guru-render-manifest-sha256="{e(manifest_sha)}" aria-label="Article gallery: {title}">',
             f'  <h2>Article gallery: {title}</h2>']
    for asset in manifest['assets']:
        lines += [f'  <figure data-guru-gallery-asset="{e(asset["asset_id"])}" '
                  f'data-guru-gallery-sequence="{asset["sequence"]}">',
                  f'    <img src="{e(asset["selected_url"])}" alt="{e(asset["purpose_alt"])}" '
                  'loading="lazy" decoding="async">',
                  f'    <figcaption>{e(asset["caption"])}</figcaption>', '  </figure>']
    lines += ['  <p><a href="tel:+919100181181">Pinnacle Blooms Network: call 9100181181</a></p>',
              '</section>', '']
    return '\n'.join(lines).encode()


def make_plan(candidates, projection, disposition, input_hashes, exact_scope=True):
    public, grouped = validate_sources(candidates, projection, disposition, exact_scope)
    pairs = []
    for gid in sorted(grouped):
        for row in sorted(grouped[gid], key=lambda r: r['gallery_sequence_candidate']):
            pairs.append({'guru_id': gid, 'parent_url': row['source_parent_url'],
                          'sequence': row['gallery_sequence_candidate'], 'object_key': row['object_key'],
                          'selected_url': 'https://images.pinnacleblooms.org/' + row['object_key'],
                          'candidate_record_sha256': record_sha(row),
                          'public_projection_record_sha256': record_sha(public[gid])})
    selection = {
        'schema': FAMILY, 'selection_date': '2026-10-16', 'input_sha256': input_hashes,
        'authorization': {
            'human': 'Dr. Koti Reddy Saripalli', 'recorded_by': 'Codex under the accountable root owner task',
            'scope': 'NEW explicit selection of these 150 exact public-prefix Guru gallery objects on these 146 existing public Guru parents under the user R2 publication instruction.',
            'selection_basis': 'Derived GuruID + contiguous object sequence + exact current reference TotalImages count, followed by explicit owner selection now.',
            'historical_render_or_upload_provenance': 'UNKNOWN; not claimed or required as provenance for this NEW selection',
            'copyright_ownership': 'UNKNOWN', 'licence': 'UNKNOWN; no new licence grant',
            'public_reference_publication_instruction': True,
        },
        'asset_bytes_inspected': False, 'visual_depictions_inferred': False,
        'source_inventory_metadata': disposition.get('source_files', []),
        'selected_parent_count': len(grouped), 'selected_object_count': len(pairs), 'exact_scope': pairs,
        'excluded_parent_ids': sorted(set(public) - set(grouped)),
        'sitemap_admission': HOLD, 'feed_rows_created': 0,
    }
    selection_sha = record_sha(selection)
    manifests, relationships = [], []
    for gid in sorted(grouped):
        record = public[gid]
        title = normalized_title(record['Title'])
        assets = []
        group = sorted(grouped[gid], key=lambda r: r['gallery_sequence_candidate'])
        parent = group[0]['source_parent_url']
        for row in group:
            seq = row['gallery_sequence_candidate']
            url = 'https://images.pinnacleblooms.org/' + row['object_key']
            asset_id = sha((row['object_key'] + '\n' + url).encode())
            assets.append({
                'asset_id': asset_id, 'asset_id_basis': 'SHA256(exact object key + LF + selected URL), not media-byte hash',
                'object_key': row['object_key'], 'selected_url': url, 'sequence': seq,
                'role': 'owner_selected_article_gallery_illustration',
                'purpose_alt': f'Gallery illustration {seq + 1} of {len(group)} for article: {title}',
                'caption': f'Gallery illustration {seq + 1} of {len(group)} for the Pinnacle Guru article “{title}”.',
                'candidate_record_sha256': record_sha(row),
                'cached_object_metadata': {k: row.get(k) for k in ('bucket', 'size_bytes', 'content_type', 'etag', 'last_modified')},
                'object_metadata_boundary': 'Cached object metadata; last_modified is not a publication date; ETag is not asserted to be a cryptographic byte identity.',
                'copyright_ownership': 'UNKNOWN', 'licence': 'UNKNOWN', 'visual_description': 'UNKNOWN',
                'current_actual_rendered_use': 'PENDING_INTEGRATION_AND_LIVE_READBACK',
                'sitemap_admission': HOLD,
            })
        manifest = {
            'schema': FAMILY, 'selection_scope_sha256': selection_sha, 'input_sha256': input_hashes,
            'guru_id': gid, 'existing_parent_url': parent, 'new_parent_url_created': False,
            'source_public_title_literal': record['Title'], 'public_title': title,
            'public_title_normalization': 'Whitespace collapsed only; no new semantic or visual claims.',
            'declared_TotalImages': record['TotalImages'], 'public_projection_record_sha256': record_sha(record),
            'source_reference': {'file': 'guru-public-image-projection.json', 'table': 'Guru reference-only projection',
                                 'record_id': gid, 'database_source': projection.get('source'), 'retrieved_at': projection.get('retrieved_at')},
            'selection_basis': selection['authorization']['selection_basis'],
            'historical_render_or_upload_provenance': 'UNKNOWN',
            'assets': assets,
            'primary_og_replacement_policy': {
                'replacement_url_if_qualified': assets[0]['selected_url'],
                'condition': 'Owner may select sequence zero as NEW primary/OG fallback only after exact current same-ID selected-primary evidence confirms 404/410 or true absence, and replacement HEAD + parent qualification pass.',
                'preserve': 'Preserve valid existing featured image and unknown/temporary failures; no footer/related/common-shell rewrites; OG and visible-primary decisions separate.',
            },
            'cta': {'brand': 'Pinnacle Blooms Network', 'phone': '9100181181', 'href': 'tel:+919100181181', 'count_per_section': 1},
            'integration_state': 'NOT_INTEGRATED', 'clinical_claims_created': False,
            'scoring_or_child_response_data': False, 'sitemap_admission': HOLD,
        }
        manifest_sha = record_sha(manifest)
        manifests.append((gid, manifest, manifest_sha, render_fragment(manifest, manifest_sha)))
        for asset in assets:
            relationships.append({'family': FAMILY, 'guru_id': gid, 'parent_url': parent,
                                  'asset_id': asset['asset_id'], 'object_key': asset['object_key'],
                                  'image_url': asset['selected_url'], 'sequence': asset['sequence'],
                                  'role': asset['role'], 'selection_scope_sha256': selection_sha,
                                  'parent_render_manifest_sha256': manifest_sha,
                                  'source_candidate_record_sha256': asset['candidate_record_sha256'],
                                  'source_public_projection_record_sha256': record_sha(record),
                                  'input_sha256': input_hashes, 'public_reference_instruction': True,
                                  'historical_rendered_use': 'UNKNOWN', 'actual_rendered_use': 'PENDING',
                                  'copyright_ownership': 'UNKNOWN', 'licence': 'UNKNOWN', 'sitemap_admission': HOLD})
    excluded = {'missing_declared_originals': disposition.get('missing_declared_images', []),
                'null_count_parents': disposition.get('null_declared_count_ids', []),
                'publication_action': 'EXCLUDED_FROM_NEW_SELECTION; no replacement keys or parent URLs invented'}
    return selection, manifests, relationships, excluded


def build(inputs, output):
    inputs, output = inputs.resolve(), output.resolve()
    if output.exists() or inputs == output or inputs in output.parents or output in inputs.parents:
        raise ValueError('Output must be a new sibling directory, disjoint from input directory')
    raw = {name: (inputs / name).read_bytes() for name in PINS}
    hashes = {name: sha(data) for name, data in raw.items()}
    if hashes != PINS:
        raise ValueError('Input snapshot hash changed; owner must reselect the exact scope')
    candidates = [json.loads(line) for line in raw['gallery-candidates.jsonl'].splitlines() if line]
    selection, manifests, relationships, excluded = make_plan(
        candidates, json.loads(raw['guru-public-image-projection.json']),
        json.loads(raw['guru-gallery-disposition.json']), hashes)
    files = {'selection-scope.json': encoded(selection), 'excluded-dispositions.json': encoded(excluded),
             'relationships-pending.jsonl': b''.join((json.dumps(r, sort_keys=True, ensure_ascii=False) + '\n').encode() for r in relationships)}
    parents = []
    for gid, manifest, manifest_sha, fragment in manifests:
        mf, ff = f'parents/{gid}.json', f'fragments/{gid}.html'
        files[mf], files[ff] = encoded(manifest), fragment
        parents.append({'guru_id': gid, 'parent_url': manifest['existing_parent_url'], 'manifest_file': mf,
                        'manifest_sha256': manifest_sha, 'fragment_file': ff, 'fragment_sha256': sha(fragment),
                        'selected_pairs': len(manifest['assets'])})
    index = {'schema': FAMILY, 'selection_scope_sha256': record_sha(selection), 'input_sha256': hashes,
             'parents': parents, 'counts': {'parents': len(parents), 'objects': len(relationships),
             'missing_original_parents_excluded': len(MISSING), 'null_count_parents_excluded': len(NULL_COUNT)},
             'file_sha256': {name: sha(data) for name, data in sorted(files.items())},
             'sitemap_admission': HOLD, 'network_requests_during_generation': 0, 'database_writes': 0}
    files['index.json'] = encoded(index)
    output.mkdir()
    for name, data in sorted(files.items()):
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
    return {'output': str(output), 'index_sha256': sha(files['index.json']), **index['counts']}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--inputs', required=True, type=pathlib.Path)
    cli.add_argument('--output', required=True, type=pathlib.Path)
    args = cli.parse_args()
    print(json.dumps(build(args.inputs, args.output), sort_keys=True))
