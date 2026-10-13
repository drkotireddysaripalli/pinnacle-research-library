import csv
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import catalogue_v2 as c
import r2_reconcile as r


class R2Reconciliation(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.parent = 'https://pinnacleblooms.org/ask/example-answer'
        self.inputs = {}
        objects = [dict(bucket='pinnacle-ask-og', object_key='example-answer.png',
                        size_bytes='123', content_type='image/png', etag='object-etag',
                        last_modified='2026-10-12T10:00:00Z', media_kind='image',
                        configured_public_urls='[]'),
                   dict(bucket='pinnacle-ask-og', object_key='cards/unmatched.png',
                        size_bytes='123', content_type='image/png', etag='other',
                        last_modified='', media_kind='image', configured_public_urls='[]')]
        image_rows = [dict(page_url=self.parent, media_url=self.parent+'.png', bucket='pinnacle-ask-og',
                           object_key='example-answer.png', media_role='renderer_png_candidate_if_not_curated'),
                      dict(page_url=self.parent, media_url=self.parent+'.svg', bucket='pinnacle-ask-og',
                           object_key='example-answer.svg', media_role='worker_svg_candidate')]
        self.r2files = {'summary.json': {'all_selected_pagination_complete': True, 'exported_objects': 2, 'observed_at': '2026-10-13T10:00:00Z'},
                       'public-resource-objects.csv': objects,
                       'page-media-object-joins.csv': []}
        self.askfiles = {'ask-worker-route-evidence.json': {'public_bindings': {'OG_BUCKET': {'bucket_name': 'pinnacle-ask-og'}},
                                                          'deployed_versions': [{'version_id': 'actual-deployed-version'}],
                                                          'deployed_entry_sha256': 'a'*64, 'renderer_sha256': 'b'*64},
                        'ask-worker-slug-image-candidates.csv': image_rows}
        self.publish('r2_manifest', self.r2files, 'r2')
        self.publish('ask_manifest', self.askfiles, 'ask')
        self.input('eligible_pages', [{'page_url': self.parent}], 'eligible.csv')
        self.input('publisher_media', [], 'publisher.csv')
        self.input('answer_membership', {'answer_docs': [{'status': 200, 'url': 'https://pinnacleblooms.org/ask/sitemap-1.xml',
                                                         'final_url': 'https://pinnacleblooms.org/ask/sitemap-1.xml',
                                                         'rows': [{'loc': self.parent}]}]}, 'answers.json')
        self.job = self.root/'job.json'
        self.save_job()
        self.output = self.root/'candidates.jsonl'

    def file(self, name, value, folder=None):
        path = (folder or self.root)/name
        path.parent.mkdir(parents=True, exist_ok=True)
        if name.endswith('.csv'):
            with path.open('w', newline='') as stream:
                fields = list(value[0]) if value else ['page_url', 'media_url', 'media_role']
                writer = csv.DictWriter(stream, fields); writer.writeheader(); writer.writerows(value)
        else:
            path.write_text(json.dumps(value))
        return path

    def input(self, role, value, name):
        path = self.file(name, value)
        self.inputs[role] = {'path': str(path), 'sha256': c.file_hash(path)}

    def publish(self, role, files, folder):
        directory = self.root/folder
        entries = []
        for name, value in files.items():
            path = self.file(name, value, directory)
            entries.append({'name': name, 'bytes': path.stat().st_size, 'sha256': c.file_hash(path)})
        path = self.file('MANIFEST.json', {'files': entries}, directory)
        self.inputs[role] = {'path': str(path), 'sha256': c.file_hash(path)}

    def save_job(self):
        self.job.write_text(json.dumps({'inputs': self.inputs}))

    def test_png_mapping_retains_variants_and_unmatched_objects_and_replays(self):
        receipt = r.reconcile(self.job, self.output)
        self.assertEqual(receipt['accounting']['candidate_answer_pngs'], 1)
        self.assertEqual(receipt['accounting']['ask_other_renditions_retained'], 1)
        self.assertEqual(receipt['accounting']['unassociated_objects_retained'], 1)
        row = json.loads(self.output.read_text())
        self.assertEqual(row['media_url'], self.parent+'.png')
        self.assertFalse(receipt['public_promotion'])
        self.assertFalse(receipt['page_lastmod_from_object_dates'])
        self.assertEqual(receipt['output_sha256'], r.reconcile(self.job, self.output)['output_sha256'])

    def test_tampered_source_fails_before_output(self):
        Path(self.inputs['eligible_pages']['path']).write_text('changed')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            r.reconcile(self.job, self.output)
        self.assertFalse(self.output.exists())

    def test_filename_route_contradiction_is_rejected(self):
        self.askfiles['ask-worker-slug-image-candidates.csv'][0]['object_key'] = 'another-answer.png'
        self.publish('ask_manifest', self.askfiles, 'ask'); self.save_job()
        with self.assertRaisesRegex(ValueError, 'contradicts deployed slug route'):
            r.reconcile(self.job, self.output)
        self.assertFalse(self.output.exists())

    def test_answer_omission_never_creates_a_binding_or_a_deletion(self):
        self.input('answer_membership', {'answer_docs': []}, 'answers.json'); self.save_job()
        receipt = r.reconcile(self.job, self.output)
        self.assertEqual(receipt['accounting']['candidate_relationships'], 0)
        self.assertEqual(receipt['accounting']['unassociated_objects_retained'], 2)
        self.assertFalse(receipt['deletions_inferred'])

    def html_input(self, refs, parent=None):
        url = parent or self.parent
        value = {'page_url': url, 'status': 200, 'final_url': url,
                 'canonical_urls': [], 'robots': [], 'body_sha256': 'c'*64,
                 'title': 'Actual public topic', 'description': 'Public resource description',
                 'observed_at': '2026-10-13T10:00:00Z', 'media_references': refs,
                 'video_objects': []}
        path = self.root/'html.jsonl'; path.write_text(json.dumps(value)+'\n')
        self.inputs['html_snapshot'] = {'path': str(path), 'sha256': c.file_hash(path)}
        self.save_job()

    def test_dom_video_binding_requires_an_actual_inventory_object(self):
        url = 'https://images.pinnacleblooms.org/Assets/Materials/video/example.mp4'
        self.r2files['public-resource-objects.csv'].append(dict(bucket='pbn-test', object_key='Assets/Materials/video/example.mp4', size_bytes='456', content_type='video/mp4', etag='movie', last_modified='', media_kind='video', configured_public_urls=json.dumps([url])))
        self.r2files['summary.json']['exported_objects'] = 3
        self.publish('r2_manifest', self.r2files, 'r2')
        self.html_input([{'media_url': url, 'media_kind': 'video', 'tag': 'source', 'attribute': 'src'}])
        receipt = r.reconcile(self.job, self.output)
        self.assertEqual(receipt['accounting']['dom_matched_video_relationships'], 1)
        self.assertFalse(receipt['public_promotion'])

    def test_dom_parent_cannot_promote_an_unknown_or_private_page(self):
        self.html_input([], 'https://www.pinnacleblooms.org/private-patient-record')
        with self.assertRaisesRegex(ValueError, 'parent contradicts accepted publisher baseline'):
            r.reconcile(self.job, self.output)
        self.assertFalse(self.output.exists())

    def test_dom_reference_without_object_remains_unmatched(self):
        self.html_input([{'media_url': 'https://images.pinnacleblooms.org/Assets/missing.png', 'media_kind': 'image', 'tag': 'img', 'attribute': 'src'}])
        receipt = r.reconcile(self.job, self.output)
        self.assertEqual(receipt['accounting']['dom_unmatched_relationships_retained'], 1)
        self.assertEqual(receipt['accounting']['dom_matched_image_relationships'], 0)


if __name__ == '__main__':
    unittest.main()
