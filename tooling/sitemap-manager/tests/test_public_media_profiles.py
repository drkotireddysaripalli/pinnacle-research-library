import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import catalogue_v2 as c
import manager as m
import normalized_profiles as n
import public_media_profiles as p


class ReviewedMediaProfiles(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name);self.v1=self.root/'v1.db';self.db=self.root/'v2.db'
        db=m.connect(self.v1)
        source=self.root/'pages.jsonl';source.write_text(json.dumps({'url':'https://www.example.com/resource','family':'Materials','decision':'INCLUDE'})+'\n')
        m.import_register(db,source);db.commit();db.close();c.import_catalogue(self.v1,None,self.db,c.model())
        self.source=self.root/'reviewed.json'
        self.doc={'format':'pinnacle-reviewed-public-media-v1','scope':'explicit public fixture',
                  'observed_at':'2026-10-13T12:00:00Z','authorization_evidence_sha256':'d'*64,
                  'source_hashes':{'actual_fixture':'e'*64},'row_count':1,'rows':[{
                  'page_url':'https://www.example.com/resource','page_content_version_sha256':'a'*64,
                  'media_url':'https://images.example.com/cdn-cgi/image/width=1200/example.png',
                  'selected_rendition_url':'https://images.example.com/example.png','media_kind':'image',
                  'asset_source_system':'fixture_public_source','asset_source_key':'example.png',
                  'rights_status':'permission_recorded','rights_evidence':'explicit fixture permission',
                  'public_use_basis':'current_public_dom','observed_at':'2026-10-13T12:00:00Z'}]}

    def apply(self):
        self.doc['row_count']=len(self.doc['rows']);self.source.write_text(json.dumps(self.doc))
        return p.apply(self.db,self.source,c.file_hash(self.source))

    def collected(self):
        with sqlite3.connect(self.db) as db:
            db.row_factory=sqlite3.Row;return n.collect(db)

    def test_real_original_and_rendered_renditions_share_asset_and_replay(self):
        first=self.apply();second=self.apply()
        self.assertEqual(first['accounting']['image_profiles'],1)
        self.assertEqual(second['accounting']['image_profiles'],1)
        values=list(self.collected()['images'].values())
        self.assertEqual(values,[[{'loc':'https://images.example.com/example.png'}]])

    def test_new_page_version_replaces_only_active_profiles_and_retains_history(self):
        self.apply();self.doc['rows'][0]['page_content_version_sha256']='b'*64;self.apply()
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM image_sitemap_profiles').fetchone()[0],1)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM media_uses WHERE publication_state='superseded_public_use'").fetchone()[0],1)
        self.assertEqual(len(list(self.collected()['images'].values())[0]),1)

    def test_held_parent_and_unknown_permission_fail_without_partial_commit(self):
        self.doc['rows'][0]['page_url']='https://www.example.com/unknown'
        with self.assertRaisesRegex(ValueError,'held or unknown'):self.apply()
        self.doc['rows'][0]['page_url']='https://www.example.com/resource';self.doc['rows'][0]['rights_status']='unknown'
        with self.assertRaisesRegex(ValueError,'rights/reference permission'):self.apply()
        with sqlite3.connect(self.db) as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM image_sitemap_profiles').fetchone()[0],0)

    def test_video_uses_reviewed_thumbnail_and_omits_unknown_optional_metrics(self):
        video={**self.doc['rows'][0],'media_kind':'video','asset_source_key':'movie.mp4',
               'media_url':'https://images.example.com/movie.mp4','selected_rendition_url':'https://images.example.com/movie.mp4',
               'video':{'thumbnail_loc':'https://images.example.com/example.png','title':'Actual resource video','description':'A public educational resource.'}}
        self.doc['rows'].append(video);self.apply()
        values=list(self.collected()['videos'].values())[0][0]['values']
        self.assertEqual(values['content_loc'],video['media_url'])
        self.assertEqual(values['thumbnail_loc'],'https://images.example.com/example.png')
        self.assertNotIn('view_count',values);self.assertNotIn('publication_date',values)


if __name__=='__main__':unittest.main()
