"""Import a reviewed publisher export without granting media publication approval."""
from __future__ import annotations

import argparse
import collections
import csv
import datetime as dt
import json
from pathlib import Path
import re
import sqlite3
import urllib.parse

import catalogue_v2 as c

MEDIA_FILE = 'public-page-media-map.csv'
PAGES_FILE = 'eligible-public-pages.csv'
PROVENANCE_FILE = 'public-page-media-map.json'
FIELDS = {'page_url', 'media_url', 'media_role', 'source_file', 'evidence_scope'}
KINDS = {'image': 'image', 'poster': 'image', 'video': 'video', 'player': 'video'}


def import_export(database, manifest_path, expected_manifest_sha256, observed_at):
    """Retain exact source rows, parent dispositions and distinct player/poster roles.

    The manifest hash comes from the accepted transfer receipt, not from the
    downloaded manifest itself. An export omission never deletes a page or asset.
    """
    manifest_path = Path(manifest_path)
    c.disjoint_paths(database, manifest_path)
    if c.file_hash(manifest_path) != expected_manifest_sha256:
        raise ValueError('Publisher manifest hash mismatch')
    stamp = dt.datetime.fromisoformat(observed_at.replace('Z', '+00:00'))
    if stamp.tzinfo is None:
        raise ValueError('Publisher observation needs an explicit time zone')
    doc = json.loads(manifest_path.read_text())
    if not re.fullmatch(r'[0-9a-f]{40}', doc.get('source', '')):
        raise ValueError('Publisher source commit is required')
    entries = {}
    for item in doc['files']:
        name = item['name']
        if Path(name).name != name or name in entries:
            raise ValueError('Unsafe or duplicate publisher file name')
        source = manifest_path.parent / name
        c.disjoint_paths(database, source)
        if source.is_symlink() or source.stat().st_size != item['bytes'] or c.file_hash(source) != item['sha256']:
            raise ValueError('Publisher file bytes/hash mismatch: ' + name)
        entries[name] = item
    if not {MEDIA_FILE, PAGES_FILE, PROVENANCE_FILE} <= set(entries):
        raise ValueError('Incomplete publisher export')
    with (manifest_path.parent / PAGES_FILE).open(newline='', encoding='utf-8-sig') as stream:
        reader = csv.DictReader(stream)
        if set(reader.fieldnames or []) != {'page_url', 'live_sitemap_url'}:
            raise ValueError('Unexpected published-page fields')
        page_rows = list(reader)
    eligible = {c.address(row['page_url']) for row in page_rows}
    if len(eligible) != len(page_rows):
        raise ValueError('Duplicate published-page identities')
    with (manifest_path.parent / MEDIA_FILE).open(newline='', encoding='utf-8-sig') as stream:
        reader = csv.DictReader(stream)
        if set(reader.fieldnames or []) != FIELDS:
            raise ValueError('Unexpected publisher media fields')
        rows = list(reader)
    provenance = json.loads((manifest_path.parent / PROVENANCE_FILE).read_text())
    if provenance['page_media_relationships'] != len(rows):
        raise ValueError('Publisher media count mismatch')
    db = sqlite3.connect(database)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    counts = collections.Counter()
    try:
        db.execute('BEGIN IMMEDIATE')
        accepted = {row[0] for row in db.execute("SELECT u.url FROM url_registry u JOIN eligibility_decisions e ON e.subject_id=u.url_id WHERE u.is_current=1 AND e.subject_kind='url' AND e.channel='page_sitemap' AND e.decision='INCLUDE'")}
        if accepted != eligible:
            raise ValueError('Publisher pages differ from the accepted eligible baseline')
        parents = {row['url']: dict(row) for row in db.execute('SELECT u.url,p.page_id FROM pages p JOIN url_registry u ON u.url_id=p.primary_url_id')}
        writer = c.Writer(db, c.model())
        sid = c.identity('source-import', 'publisher-public-media', expected_manifest_sha256)
        writer.put('source_imports', dict(import_id=sid, source_type='maintained_public_publisher_media_export', source_scope=doc['scope'], input_sha256=expected_manifest_sha256, source_observed_at=observed_at, imported_at=writer.now, expected_rows=len(rows), received_rows=len(rows), completeness_state='selected_public_sources_not_whole_library', raw_artifact_reference=str(manifest_path.resolve())))
        for row in rows:
            counts['received_rows'] += 1
            kind = KINDS.get(row['media_role'])
            parsed = urllib.parse.urlsplit(row['media_url'])
            if kind is None or parsed.scheme not in ('https', 'http') or not parsed.hostname:
                # The original hashed CSV remains the evidence for unparsed rows.
                counts['unresolved_rows_retained'] += 1
                continue
            parent = parents.get(c.address(row['page_url']))
            aid, rid = writer.media(row['media_url'], kind, expected_manifest_sha256, sid)
            fact = dict(row, publisher_commit=doc['source'], parent_in_accepted_baseline=row['page_url'] in eligible)
            evidence = writer.observation(sid, 'asset', aid, 'publisher_media_candidate', fact, expected_manifest_sha256, observed_at)
            if parent is not None:
                # Stable source-row identity retains different source references
                # without asserting a DOM placement or a playable-video identity.
                role = 'publisher:' + row['media_role'] + ':' + c.digest(c.packed(row))
                writer.use(parent['page_id'], aid, rid, role, evidence, expected_manifest_sha256, 'candidate_not_approved_for_sitemap')
                counts['mapped_rows'] += 1
                counts['mapped_' + row['media_role']] += 1
            else:
                counts['unmapped_rows_retained'] += 1
        if counts['received_rows'] != counts['mapped_rows'] + counts['unmapped_rows_retained'] + counts['unresolved_rows_retained']:
            raise ValueError('Publisher media accounting mismatch')
        if c.file_hash(manifest_path) != expected_manifest_sha256 or any(c.file_hash(manifest_path.parent / name) != item['sha256'] for name, item in entries.items()):
            raise ValueError('Publisher source changed during import')
        receipt = c.validate(db, writer.data)
        if not receipt['passed']:
            raise ValueError('Publisher import failed normalized integrity')
        db.commit()
        receipt.update(accounting=dict(counts), source_manifest_sha256=expected_manifest_sha256, publisher_commit=doc['source'], eligible_pages=len(eligible), public_promotion=False, deletions_inferred=False, rights_inferred=False, complete_media_library=False)
        return receipt
    except BaseException:
        db.rollback()
        raise
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--manifest-sha256', required=True)
    parser.add_argument('--observed-at', required=True)
    parser.add_argument('--receipt', type=Path, required=True)
    args = parser.parse_args()
    c.disjoint_paths(args.db, args.manifest, args.receipt)
    receipt = import_export(args.db, args.manifest, args.manifest_sha256, args.observed_at)
    args.receipt.parent.mkdir(parents=True, exist_ok=True)
    args.receipt.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(c.packed(receipt))


if __name__ == '__main__':
    main()
