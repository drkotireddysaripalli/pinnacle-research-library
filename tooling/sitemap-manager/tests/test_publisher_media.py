import csv
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import catalogue_v2 as c
import manager
import publisher_media as publisher


class PublisherMediaTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        legacy = self.root / 'legacy.sqlite3'
        db = manager.connect(legacy)
        register = self.root / 'register.jsonl'
        register.write_text(json.dumps({'url':'https://www.example.com/page', 'family':'Ask', 'decision':'INCLUDE', 'reason':'approved_fixture'}) + '\n')
        manager.import_register(db, register)
        db.close()
        self.database = self.root / 'normalized.sqlite3'
        c.import_catalogue(legacy, None, self.database, c.model())
        self.stamp = '2026-10-13T11:33:12+00:00'

    def tearDown(self):
        self.tmp.cleanup()

    def export(self, pages=None, rows=None):
        pages = pages if pages is not None else ['https://www.example.com/page']
        rows = rows if rows is not None else [
            ['https://www.example.com/page','https://images.example.com/a.jpg','image','source.json','maintained source'],
            ['https://www.example.com/page','https://images.example.com/poster.jpg','poster','source.json','maintained source'],
            ['https://www.example.com/page','https://player.example.com/v','player','source.json','maintained source'],
            ['https://www.example.com/unmapped','https://images.example.com/other.jpg','image','source.json','maintained source'],
            ['https://www.example.com/page','relative-unknown-image','image','source.json','maintained source'],
        ]
        with (self.root / publisher.PAGES_FILE).open('w', newline='') as stream:
            writer = csv.writer(stream)
            writer.writerow(['page_url','live_sitemap_url'])
            writer.writerows([[page,'https://www.example.com/sitemap-managed.xml'] for page in pages])
        with (self.root / publisher.MEDIA_FILE).open('w', newline='') as stream:
            writer = csv.writer(stream)
            writer.writerow(['page_url','media_url','media_role','source_file','evidence_scope'])
            writer.writerows(rows)
        (self.root / publisher.PROVENANCE_FILE).write_text(json.dumps({'page_media_relationships':len(rows)}))
        files=[]
        for name in [publisher.PAGES_FILE,publisher.MEDIA_FILE,publisher.PROVENANCE_FILE]:
            source=self.root / name
            files.append({'name':name,'bytes':source.stat().st_size,'sha256':c.file_hash(source)})
        manifest=self.root / 'manifest.json'
        manifest.write_text(json.dumps({'source':'1'*40,'scope':'public synthetic fixture','files':files}))
        return manifest, c.file_hash(manifest)

    def counts(self):
        db=sqlite3.connect(self.database)
        result={name:db.execute('SELECT COUNT(*) FROM '+name).fetchone()[0] for name in ['source_imports','observations','assets','media_uses','image_sitemap_profiles','video_sitemap_profiles']}
        db.close()
        return result

    def test_replay_keeps_provenance_roles_unknowns_and_does_not_promote(self):
        manifest,digest=self.export()
        receipt=publisher.import_export(self.database,manifest,digest,self.stamp)
        self.assertTrue(receipt['passed'])
        self.assertEqual(receipt['accounting']['mapped_rows'],3)
        self.assertEqual(receipt['accounting']['unmapped_rows_retained'],1)
        self.assertEqual(receipt['accounting']['unresolved_rows_retained'],1)
        self.assertFalse(receipt['public_promotion'])
        first=self.counts()
        publisher.import_export(self.database,manifest,digest,self.stamp)
        self.assertEqual(self.counts(),first)
        self.assertEqual(first['image_sitemap_profiles'],0)
        self.assertEqual(first['video_sitemap_profiles'],0)

    def test_changed_download_bytes_fail_before_import(self):
        manifest,digest=self.export()
        before=self.counts()
        with (self.root / publisher.MEDIA_FILE).open('a') as stream:
            stream.write('tampered')
        with self.assertRaisesRegex(ValueError,'bytes/hash mismatch'):
            publisher.import_export(self.database,manifest,digest,self.stamp)
        self.assertEqual(self.counts(),before)

    def test_different_eligible_baseline_is_not_silently_adopted(self):
        manifest,digest=self.export(pages=['https://www.example.com/other'])
        before=self.counts()
        with self.assertRaisesRegex(ValueError,'eligible baseline'):
            publisher.import_export(self.database,manifest,digest,self.stamp)
        self.assertEqual(self.counts(),before)

    def test_unknown_source_commit_and_manifest_hash_are_rejected(self):
        manifest,digest=self.export()
        with self.assertRaisesRegex(ValueError,'manifest hash'):
            publisher.import_export(self.database,manifest,'0'*64,self.stamp)
        data=json.loads(manifest.read_text())
        data['source']='unknown'
        manifest.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError,'source commit'):
            publisher.import_export(self.database,manifest,c.file_hash(manifest),self.stamp)
