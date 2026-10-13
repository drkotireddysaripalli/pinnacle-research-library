import csv,importlib.util,json,tempfile,unittest,sys,xml.etree.ElementTree as E
from pathlib import Path
SPEC=importlib.util.spec_from_file_location('sitemap_manager',Path(__file__).parents[1]/'manager.py')
m=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(m)
sys.path.insert(0,str(Path(__file__).parents[1]))
import run as operations
import reconcile

class ManagerTest(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);self.db=m.connect(self.root/'catalogue.sqlite3')
  self.policy={'hosts':['www.example.com'],'family_buckets':{'ask':2},'html_page_size':2,'llms_full':False}
 def tearDown(self):self.db.close();self.temp.cleanup()
 def seed(self,records=None):
  items=records or [{'url':'https://www.example.com/ask/a?x=1&y=2','family':'Ask','decision':'INCLUDE'},{'url':'https://www.example.com/ask/b','family':'Ask','decision':'INCLUDE'},{'url':'https://www.example.com/private','family':'Ask','decision':'HOLD'}]
  p=self.root/'register.jsonl';p.write_text('\n'.join(json.dumps(x) for x in items));return m.import_register(self.db,p)
 def test_held_pages_not_in_public_outputs_and_xml_escaping(self):
  self.seed();r=m.build_release(self.db,self.root/'release',self.policy)
  self.assertEqual(r['page_urls'],2)
  combined=''.join(p.read_text() for p in (self.root/'release').rglob('*.xml'))
  self.assertNotIn('/private',combined);self.assertIn('&amp;',combined)
 def test_repeat_build_is_identical(self):
  self.seed();first=m.build_release(self.db,self.root/'release',self.policy);second=m.build_release(self.db,self.root/'release',self.policy)
  self.assertEqual(first['release_id'],second['release_id']);self.assertEqual(first['files'],second['files'])
 def test_new_update_remove_reconciles_without_fixed_counts(self):
  self.seed();first=m.build_release(self.db,self.root/'release',self.policy)
  self.seed([{'url':'https://www.example.com/ask/a?x=1&y=2','family':'Ask','decision':'EXCLUDE'},{'url':'https://www.example.com/new','family':'New','decision':'INCLUDE'}])
  second=m.build_release(self.db,self.root/'release',self.policy)
  self.assertEqual(second['page_urls'],2);self.assertNotEqual(first['release_id'],second['release_id'])
 def test_no_credential_bearing_or_fragment_identity(self):
  with self.assertRaises(ValueError):m.normal('https://user:secret@www.example.com/a')
  self.assertEqual(m.normal('https://www.example.com/a#fragment'),'https://www.example.com/a')
 def test_unapproved_hosts_fail_before_promotion(self):
  self.seed([{'url':'https://other.example.com/a','family':'Ask','decision':'INCLUDE'}])
  with self.assertRaises(ValueError):m.build_release(self.db,self.root/'release',self.policy)
  self.assertFalse((self.root/'release').exists())
 def test_failed_build_preserves_last_valid_release(self):
  self.seed();first=m.build_release(self.db,self.root/'release',self.policy)
  self.db.execute("UPDATE pages SET canonical_url='https://www.example.com/wrong' WHERE decision='INCLUDE'");self.db.commit()
  with self.assertRaises(ValueError):m.build_release(self.db,self.root/'release',self.policy)
  self.assertEqual(json.loads((self.root/'release/manifest.json').read_text())['release_id'],first['release_id'])
 def test_corrupted_xml_detected(self):
  self.seed();r=m.build_release(self.db,self.root/'release',self.policy);f=next(f for f in r['files'] if f['kind']=='pages')
  (self.root/'release'/f['path']).write_text('broken')
  with self.assertRaises(ValueError):m.validate_release(self.root/'release')
 def test_llm_curation_required_for_detail_mirrors(self):
  self.seed();r=m.build_release(self.db,self.root/'release',self.policy)
  self.assertFalse(any('llm-pages/' in f['path'] for f in r['files']))
  row=dict(self.db.execute("SELECT * FROM pages WHERE decision='INCLUDE' LIMIT 1").fetchone());p=self.root/'curation.json';p.write_text(json.dumps({'source':'public source review','reviewed_by':'Test reviewer','reviewed_at':'2026-10-12','pages':[{'url':row['url'],'llm_approved':True,'llm_text':'# Approved reference\nCanonical source: '+row['url'],'reviewed_sha256':m.approval_hash({**row,'llm_text':'# Approved reference\nCanonical source: '+row['url']})}]}));m.policy_load(self.db,p)
  r=m.build_release(self.db,self.root/'release',self.policy);self.assertEqual(sum('llm-pages/' in f['path'] for f in r['files']),1)
 def test_curation_rejects_held_page(self):
  self.seed();p=self.root/'curation.json';p.write_text(json.dumps({'pages':[{'url':'https://www.example.com/private','llm_approved':True}]}))
  with self.assertRaises(ValueError):m.policy_load(self.db,p)
 def test_safely_shortens_video_title_preserves_original(self):
  data={'values':{'thumbnail_loc':'https://www.example.com/thumbnail.jpg','title':'A valid title '+'x'*150,'description':'Public video description','player_loc':'https://video.example.com/embed/one','category':'deprecated'}};warnings=[]
  v=m.video_element(data,warnings,'https://www.example.com/watch')
  self.assertLessEqual(len(v.find('{'+m.VI+'}title').text),100)
  self.assertGreater(len(data['values']['title']),100);self.assertIsNone(v.find('{'+m.VI+'}category'));self.assertEqual(len(warnings),1)
 def test_invalid_video_description_is_explicit_exception(self):
  d={'values':{'thumbnail_loc':'https://www.example.com/a.jpg','title':'Title','description':'x'*2049,'player_loc':'https://video.example.com/embed/1'}};w=[]
  self.assertIsNone(m.video_element(d,w,'https://www.example.com/watch'));self.assertEqual(w[0]['type'],'video_description_too_long')
 def test_mysql_export_parameter_data_is_hex_not_executable_sql(self):
  self.seed();row=dict(self.db.execute("SELECT * FROM pages WHERE decision='INCLUDE' LIMIT 1").fetchone());row['title']="x'); DROP TABLE other; --";m.upsert(self.db,m.refresh_digest(row));self.db.commit()
  r=m.export_mysql(self.db,self.root/'sql',2);self.assertEqual(r['rows'],3)
  s=''.join(p.read_text() for p in (self.root/'sql').glob('*.sql'));self.assertNotIn('DROP TABLE other',s);self.assertIn('ON DUPLICATE KEY UPDATE',s)

 def test_raw_entity_like_query_keys_are_preserved(self):
  u='https://www.example.com/a?x=1&copy=2';self.assertEqual(m.normal(u),u)
  with self.assertRaises(ValueError):m.normal('https://www.example.com:80/a')
 def test_only_w3c_dates_are_accepted(self):
  for bad in ('20261012','2026-W42-1','2026-10-12 12:00:00','2026-10-12T12:00:00','2026-02-30'):
   self.assertFalse(m.valid_date(bad),bad)
  for good in ('2026-10-12','2026-10-12T12:00:00Z','2026-10-12T12:00:00+05:30'):self.assertTrue(m.valid_date(good))
 def test_enrichment_revokes_changed_llm_approval_preserves_custom_text(self):
  self.seed();url='https://www.example.com/ask/b';cur=self.root/'cur.json';cur.write_text(json.dumps({'source':url,'reviewed_by':'Reviewer','reviewed_at':'2026-10-12','pages':[{'url':url,'llm_text':'# Reviewed custom text','llm_approved':True,'reviewed_sha256':m.approval_hash({**dict(self.db.execute('SELECT * FROM pages WHERE url=?',(url,)).fetchone()),'llm_text':'# Reviewed custom text'})}]}));m.policy_load(self.db,cur)
  source=self.root/'ahrefs.csv';source.write_text('URL,Title,Meta description\n'+url+',Changed title,Changed description\n');m.enrich(self.db,source,'ahrefs','2026-10-12')
  row=self.db.execute('SELECT * FROM pages WHERE url=?',(url,)).fetchone();self.assertEqual(row['llm_approved'],0);self.assertEqual(row['llm_text'],'# Reviewed custom text')
  with self.assertRaises(ValueError):m.policy_load(self.db,cur)
  self.assertEqual(self.db.execute('SELECT llm_approved FROM pages WHERE url=?',(url,)).fetchone()[0],0)
 def census(self,body,url='https://www.example.com/public-source.xml'):
  p=self.root/'census';p.mkdir(exist_ok=True);digest=m.sha(body);(p/(digest+'.source')).write_text(body)
  c=p/'sitemap-census.json';c.write_text(json.dumps({'documents':[{'url':url,'kind':'urlset','sha256':digest,'status':200,'fetchedAtUTC':'2026-10-12T13:42:22+00:00'}]}));return c
 def test_media_snapshot_removes_last_reference_and_disappeared_parent(self):
  self.seed();a='<urlset xmlns="'+m.SM+'" xmlns:image="'+m.IM+'"><url><loc>https://www.example.com/ask/b</loc><image:image><image:loc>https://www.example.com/photo.jpg</image:loc></image:image></url></urlset>';m.media_import(self.db,self.census(a));self.assertNotEqual(self.db.execute("SELECT images_json FROM pages WHERE url LIKE '%/b'").fetchone()[0],'[]')
  empty='<urlset xmlns="'+m.SM+'"><url><loc>https://www.example.com/ask/b</loc></url></urlset>';m.media_import(self.db,self.census(empty));self.assertEqual(self.db.execute("SELECT images_json FROM pages WHERE url LIKE '%/b'").fetchone()[0],'[]')
  m.media_import(self.db,self.census(a));m.media_import(self.db,self.census('<urlset xmlns="'+m.SM+'"/>'));self.assertEqual(self.db.execute("SELECT images_json FROM pages WHERE url LIKE '%/b'").fetchone()[0],'[]')
 def test_media_provenance_rejects_path_escape_or_corruption(self):
  self.seed();p=self.census('<urlset xmlns="'+m.SM+'"/>');c=json.loads(p.read_text());c['documents'][0]['sha256']='../../outside';p.write_text(json.dumps(c))
  with self.assertRaises(ValueError):m.media_import(self.db,p)
  p=self.census('<urlset xmlns="'+m.SM+'"/>');c=json.loads(p.read_text());(p.parent/(c['documents'][0]['sha256']+'.source')).write_text('tampered')
  with self.assertRaises(ValueError):m.media_import(self.db,p)
 def test_video_parent_url_and_missing_restriction_attribute_rejected(self):
  data={'values':{'thumbnail_loc':'https://www.example.com/a.jpg','title':'Title','description':'Description','content_loc':'https://www.example.com/watch'}}
  with self.assertRaises(ValueError):m.video_element(data,[],'https://www.example.com/watch')
  data['values']['content_loc']='https://www.example.com/file.mp4';data['values']['platform']='web'
  with self.assertRaises(ValueError):m.video_element(data,[],'https://www.example.com/watch')
 def test_approved_root_llms_is_never_generated_over(self):
  self.seed();r=m.build_release(self.db,self.root/'release',self.policy)
  self.assertFalse(any(f['path']=='www.example.com/llms.txt' for f in r['files']));self.assertTrue(any(f['kind']=='llms_addition' for f in r['files']))
 def test_fresh_output_directories_reproduce_public_hashes(self):
  self.seed();a=m.build_release(self.db,self.root/'one',self.policy);b=m.build_release(self.db,self.root/'two',self.policy);self.assertEqual(a['release_id'],b['release_id'])
 def test_snapshot_absent_urls_become_tombstones(self):
  self.seed();p=self.root/'next.jsonl';p.write_text(json.dumps({'url':'https://www.example.com/ask/b','family':'Ask','decision':'INCLUDE'}));m.import_register(self.db,p,snapshot=True);self.assertEqual(self.db.execute("SELECT COUNT(*) FROM pages WHERE decision='INCLUDE'").fetchone()[0],1)
 def test_mysql_export_removes_stale_batches_and_supports_empty_string(self):
  self.seed();self.db.execute("UPDATE pages SET title='' WHERE decision='INCLUDE'");self.db.commit();m.export_mysql(self.db,self.root/'sql',1);m.export_mysql(self.db,self.root/'sql',10)
  self.assertEqual(len(list((self.root/'sql').glob('*.sql'))),1);self.assertIn("CONVERT(X'' USING utf8mb4)",(self.root/'sql/batch-00000.sql').read_text());self.assertNotIn('CONVERT(0x USING',(self.root/'sql/batch-00000.sql').read_text())
 def test_asset_union_retains_every_file_and_omits_private_catalogue(self):
  self.seed();release=self.root/'release';m.build_release(self.db,release,self.policy);assets=self.root/'assets';assets.mkdir();(assets/'llms.txt').write_text('Existing approved guide');(assets/'home.html').write_text('Approved home')
  receipt=operations.assemble(release,assets,self.root/'assembled');self.assertEqual(receipt['baseline_files'],2);self.assertEqual((self.root/'assembled/llms.txt').read_text(),'Existing approved guide');self.assertFalse(list((self.root/'assembled').rglob('*.sqlite3')))
 def test_assembly_refuses_existing_output(self):
  self.seed();r=self.root/'release';m.build_release(self.db,r,self.policy);assets=self.root/'assets';assets.mkdir();(assets/'home').write_text('Home');dest=self.root/'out';dest.mkdir()
  with self.assertRaises(ValueError):operations.assemble(r,assets,dest)
 def test_repeated_assembly_reconciles_only_prior_managed_namespace(self):
  self.seed();old=self.root/'old';m.build_release(self.db,old,self.policy);assets=self.root/'assets';assets.mkdir();(assets/'llms.txt').write_text('Approved root guide');operations.assemble(old,assets,self.root/'first-union')
  self.seed([{'url':'https://www.example.com/ask/b','family':'Ask','decision':'EXCLUDE'}]);new=self.root/'new';m.build_release(self.db,new,self.policy)
  receipt=operations.assemble(new,self.root/'first-union',self.root/'second-union',old);self.assertEqual((self.root/'second-union/llms.txt').read_text(),'Approved root guide');self.assertGreater(receipt['removed_managed_files'],0)
 def test_replay_rejects_changed_inputs_before_import(self):
  p=self.root/'input';p.write_text('tampered');job=self.root/'job.json';job.write_text(json.dumps({'schema_version':1,'inputs':[{'role':'register','path':str(p),'sha256':'0'*64}]}))
  with self.assertRaises(ValueError):operations.prepare(job,self.root/'new.sqlite3',self.root/'release',self.root/'policy.json')
 def test_reconciliation_search_activity_does_not_prove_eligibility(self):
  p=self.root/'gsc.json';p.write_text(json.dumps({'rows':[{'keys':['https://www.pinnacleblooms.org/example'],'clicks':10,'impressions':100}]}));out=self.root/'register.jsonl';r=reconcile.reconcile({'gsc_performance-0':(p,{})},out,'2026-10-12');self.assertEqual(r['decisions'],{'HOLD':1})
 def test_old_indexability_evidence_requires_refresh(self):
  x={'url':'https://www.pinnacleblooms.org/example','family':'Core, services and other','in_current_sitemap':True,'evidence':[{'source':'ahrefs','date':'2026-09-01','indexable':True,'status':200,'reason':None}]};self.assertEqual(reconcile.decide(x,'2026-10-12')[1],'eligibility_evidence_expired')
 def test_latest_live_evidence_is_selected_independent_of_input_order(self):
  new={'source':'live_metadata','date':'2026-10-12','indexable':True,'status':200,'reason':None};old={'source':'live_metadata','date':'2026-10-01','indexable':None,'status':None,'reason':'live_fetch_unverified'};x={'url':'https://www.pinnacleblooms.org/example','family':'Core, services and other','in_current_sitemap':True,'evidence':[new,old]};self.assertEqual(reconcile.decide(x,'2026-10-12')[0],'INCLUDE');x['evidence'].reverse();self.assertEqual(reconcile.decide(x,'2026-10-12')[0],'INCLUDE')
 def test_partial_snapshot_cannot_modify_existing_catalogue(self):
  self.seed();job=self.root/'empty.json';job.write_text(json.dumps({'schema_version':1,'scope':'collected_exports_snapshot','inputs':[]}))
  with self.assertRaises(ValueError):operations.prepare(job,self.root/'catalogue.sqlite3',self.root/'release',self.root/'policy.json')
  self.assertEqual(self.db.execute("SELECT COUNT(*) FROM pages WHERE decision='INCLUDE'").fetchone()[0],2)
 def test_change_queue_is_bound_to_release_not_later_database_edits(self):
  self.seed();r=self.root/'release';m.build_release(self.db,r,self.policy);self.seed([{'url':'https://www.example.com/ask/b','family':'Ask','decision':'EXCLUDE'}]);q=operations.change_queue(self.db,r,r);self.assertEqual(q['events'],[])
 def test_empty_optional_video_tags_are_omitted(self):
  data={'values':{'thumbnail_loc':'https://www.example.com/a.jpg','title':'Title','description':'Description','player_loc':'https://video.example.com/embed/1','tag':['','Useful']}};warnings=[];v=m.video_element(data,warnings,'https://www.example.com/watch');self.assertEqual([t.text for t in v.findall('{'+m.VI+'}tag')],['Useful']);self.assertEqual(warnings[0]['type'],'video_empty_tags_omitted')
 def test_hreflang_requires_reciprocal_eligible_equivalents(self):
  self.seed();row=dict(self.db.execute("SELECT * FROM pages WHERE url LIKE '%/b'").fetchone());metadata=json.loads(row['metadata_json']);metadata['alternates']=[{'language':'en','url':row['url']},{'language':'hi','url':'https://www.example.com/private'}];row['metadata_json']=m.dump(metadata);m.upsert(self.db,m.refresh_digest(row));self.db.commit()
  with self.assertRaises(ValueError):m.build_release(self.db,self.root/'release',self.policy)

if __name__=='__main__':unittest.main()
