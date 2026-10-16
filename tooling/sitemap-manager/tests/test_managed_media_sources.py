import json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import managed_media_sources as s
import source_refresh as refresh

class ManagedMedia(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.db=m.connect(Path(self.temp.name)/'feed.sqlite3');self.url='https://materials.pinnacleblooms.org/aac';self.image='https://www.pinnacleblooms.org/Assets/Materials/123.jpg'
  row=dict(url_hash=m.sha(self.url),url=self.url,host='materials.pinnacleblooms.org',module_type='materials-portal',decision='INCLUDE',title='Approved title',description='Approved description',keywords_json='[]',canonical_url=self.url,language='en',content_modified_at=None,priority_hint=None,change_frequency_hint=None,relevance=None,og_image=None,images_json='[]',videos_json='[]',links_json='[]',llm_text=None,llm_approved=0,metadata_json=m.dump({'eligibility':{'decision':'INCLUDE','evidence_date':'2026-10-15'},'curation':{}}),row_sha256='');m.upsert(self.db,m.refresh_digest(row))
 def tearDown(self):self.db.close();self.temp.cleanup()
 def desired(self,source=s.KNOWLEDGE):return {source:[{'page_url':self.url,'image_url':self.image,'source_sha256':'a'*64}]}
 def images(self):return json.loads(self.db.execute('select images_json from pages').fetchone()[0])
 def test_admit_and_unchanged_reuse_preserve_page_dates_and_videos(self):
  self.assertEqual(s.reconcile(self.db,self.desired())[1]['added'],1);first=self.db.execute('select row_sha256 from pages').fetchone()[0];self.assertEqual(s.reconcile(self.db,self.desired())[0],[]);self.assertEqual(first,self.db.execute('select row_sha256 from pages').fetchone()[0]);self.assertIsNone(self.db.execute('select content_modified_at from pages').fetchone()[0])
 def test_complete_owned_source_withdrawal_preserves_preexisting_pair(self):
  self.db.execute('update pages set images_json=?',(json.dumps([{'loc':self.image}]),));s.reconcile(self.db,self.desired());s.reconcile(self.db,{s.KNOWLEDGE:[]});self.assertEqual(self.images(),[{'loc':self.image}])
 def test_shared_pair_remains_until_last_owning_source_withdraws(self):
  s.reconcile(self.db,{**self.desired(),**self.desired(s.CAT_SOURCE)});s.reconcile(self.db,{s.KNOWLEDGE:[]});self.assertEqual(len(self.images()),1);s.reconcile(self.db,{s.CAT_SOURCE:[]});self.assertEqual(self.images(),[])
 def test_anonymous_gate_does_not_withdraw_maintained_reader_image(self):
  s.reconcile(self.db,self.desired());current={'publication_qualified':True,'media_references':[],'video_objects':[],'body_sha256':'d'*64,'content_sha256':'e'*64,'observed_at':'2026-10-16T00:00:00Z','title':'Approved title','description':'Approved description'}
  refresh.apply_resources(self.db,{self.url:current},{},{});self.assertEqual(len(self.images()),1)
 def test_noimageindex_removes_images_without_holding_parent(self):
  s.reconcile(self.db,self.desired());s.reconcile(self.db,self.desired(),{self.url});self.assertEqual(self.images(),[]);self.assertEqual(self.db.execute('select decision from pages').fetchone()[0],'INCLUDE')
 def test_unapproved_parent_and_unknown_source_fail(self):
  bad=self.desired();bad[s.KNOWLEDGE][0]['page_url']='https://www.pinnacleblooms.org/not-approved'
  with self.assertRaisesRegex(ValueError,'Approved exact'):s.reconcile(self.db,bad)
  with self.assertRaisesRegex(ValueError,'Unknown managed'):s.reconcile(self.db,{'unrelated':[]})
 def test_delivery_robots_override_successful_transport(self):
  good={'method':'HEAD','status':200,'direct_image_delivery_verified':True,'content_type':'image/jpeg','x_robots':''};self.assertTrue(s.head_ok(good));self.assertFalse(s.head_ok({**good,'x_robots':'noimageindex'}));self.assertFalse(s.head_ok({**good,'status':302}))
 def test_transient_failure_retains_only_exact_existing_source_use(self):
  s.reconcile(self.db,self.desired());desired={s.KNOWLEDGE:[]};pairs={s.KNOWLEDGE:{(self.url,self.image)}};self.assertEqual(s.preserve_transient(self.db,desired,pairs,{self.image:{'status':503}}),1);s.reconcile(self.db,desired);self.assertEqual(len(self.images()),1)
  desired={s.KNOWLEDGE:[]};self.assertEqual(s.preserve_transient(self.db,desired,pairs,{self.image:{'status':404}}),0);s.reconcile(self.db,desired);self.assertEqual(self.images(),[])
 def test_1001_images_fail_without_truncating(self):
  desired={s.KNOWLEDGE:[{'page_url':self.url,'image_url':f'https://www.pinnacleblooms.org/images/{i}.jpg','source_sha256':'a'*64} for i in range(1001)]}
  with self.assertRaisesRegex(ValueError,'1000-image'):s.reconcile(self.db,desired)
  self.assertEqual(self.images(),[])
if __name__=='__main__':unittest.main()
