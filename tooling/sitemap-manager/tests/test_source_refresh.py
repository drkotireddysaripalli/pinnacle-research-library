import json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import source_refresh as s
from unittest.mock import patch
from email.message import Message
import urllib.error
import io

class SourceRefresh(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.db=m.connect(Path(self.temp.name)/'feed.sqlite3');self.url='https://pinnacleblooms.org/ask/real-parent-question';self.resource='https://materials.pinnacleblooms.org/aac';self.fp='a'*64
  for url,family in [(self.url,'ask'),(self.resource,'materials-portal')]:
   row=dict(url_hash=m.sha(url),url=url,host=url.split('/')[2],module_type=family,decision='INCLUDE',title='Approved title',description='Approved description',keywords_json='[]',canonical_url=url,language='en',content_modified_at=None,priority_hint=None,change_frequency_hint=None,relevance=None,og_image=None,images_json='[]',videos_json='[]',links_json='[]',llm_text=None,llm_approved=0,metadata_json=m.dump({'eligibility':{'decision':'INCLUDE','evidence_date':'2026-10-13'},'curation':{}}),row_sha256='');m.upsert(self.db,m.refresh_digest(row))
  self.db.commit();self.baseline=[{'canonical':self.url,'public_state':'published-public','indexable':'true','publisher_source_fingerprint':self.fp}]
 def tearDown(self):self.db.close();self.temp.cleanup()
 def snapshot(self,rows):return {'complete':True,'stable':True,'rows':rows,'eligibleTotal':len(rows),'completedAt':'2026-10-14T00:00:00Z'}
 def test_partial_snapshot_cannot_withdraw_a_parent(self):
  doc=self.snapshot([]);doc['complete']=False
  with self.assertRaises(ValueError):s.apply_ask(self.db,doc,self.baseline)
  self.assertEqual(self.db.execute('select decision from pages where url=?',(self.url,)).fetchone()[0],'INCLUDE')
 def test_complete_withdrawal_holds_known_parent_and_leaves_unrelated_source(self):
  changes,holds=s.apply_ask(self.db,self.snapshot([]),self.baseline);self.assertEqual(len(changes),1);self.assertFalse(holds);self.assertEqual(self.db.execute('select decision from pages where url=?',(self.url,)).fetchone()[0],'HOLD');self.assertEqual(self.db.execute('select decision from pages where url=?',(self.resource,)).fetchone()[0],'INCLUDE')
 def test_changed_content_needs_serving_proof_and_does_not_create_a_fake_lastmod(self):
  doc=self.snapshot([{'slug':'real-parent-question','lang':'en','publisher_source_fingerprint':'b'*64}]);changes,holds=s.apply_ask(self.db,doc,self.baseline);self.assertFalse(changes);self.assertEqual(len(holds),1)
  changes,holds=s.apply_ask(self.db,doc,self.baseline,lambda *_:{'publication_qualified':True,'title':'Current public title','description':'Current public description','content_sha256':'c'*64});self.assertEqual(len(changes),1);row=self.db.execute('select title,content_modified_at from pages where url=?',(self.url,)).fetchone();self.assertEqual(tuple(row),('Current public title',None))
 def test_new_publisher_identity_stays_held(self):
  doc=self.snapshot([{'slug':'real-parent-question','lang':'en','publisher_source_fingerprint':self.fp},{'slug':'unknown-parent','lang':'en','publisher_source_fingerprint':'c'*64}]);_,holds=s.apply_ask(self.db,doc,self.baseline);self.assertEqual(len(holds),1);self.assertEqual(self.db.execute('select count(*) from pages').fetchone()[0],2)
 def test_first_resource_and_video_wrapper_use_current_refs_not_prior_refs(self):
  image='https://images.pinnacleblooms.org/photo.jpg';video='https://images.pinnacleblooms.org/video.mp4';self.db.execute('update pages set images_json=?,videos_json=? where url=?',(json.dumps([{'loc':image}]),json.dumps([{'values':{'content_loc':video,'title':'Actual video','description':'Actual description','thumbnail_loc':image}}]),self.resource))
  current={'publication_qualified':True,'media_references':[{'media_kind':'image','source_image_url':image,'media_url':image},{'media_kind':'video','media_url':video}], 'video_objects':[],'body_sha256':'d'*64,'content_sha256':'e'*64,'observed_at':'2026-10-14T00:00:00Z','title':'Approved title','description':'Approved description'}
  changes,holds,_=s.apply_resources(self.db,{self.resource:current},{},{});self.assertFalse(changes);self.assertFalse(holds);self.assertEqual(len(json.loads(self.db.execute('select videos_json from pages where url=?',(self.resource,)).fetchone()[0])),1)
 def test_transient_resource_failure_does_not_infer_deletion(self):
  changes,holds,_=s.apply_resources(self.db,{self.resource:{'publication_qualified':False,'status':503,'error':'temporary'}},{},{});self.assertFalse(changes);self.assertEqual(len(holds),1);self.assertEqual(self.db.execute('select decision from pages where url=?',(self.resource,)).fetchone()[0],'INCLUDE')
 def test_304_current_robot_headers_override_old_positive_eligibility(self):
  url='https://materials.pinnacleblooms.org/'
  for directive in ['noimageindex','noindex']:
   prior={'etag':'unchanged','robots':['index,follow'],'publication_qualified':True,'noindex':False,'noimageindex':False,'catalogue_capture':{'body_hex':'3c2f68746d6c3e','proof':{'observed_at':'2026-10-15T00:00:00Z','response_headers':{'Content-Type':'text/html'}}}};headers=Message();headers.add_header('X-Robots-Tag','index');headers.add_header('X-Robots-Tag',directive)
   with patch.object(s,'open_public_source',side_effect=urllib.error.HTTPError(url,304,'Not modified',headers,None)):actual=s.public_resource(url,prior)
   self.assertTrue(actual[directive]);self.assertTrue(actual['catalogue_capture']['proof'][directive]);self.assertEqual(actual['publication_qualified'],directive!='noindex')
 def test_removed_http_restriction_gets_one_unconditional_truth_read(self):
  url='https://materials.pinnacleblooms.org/'
  class Reply(io.BytesIO):
   def __init__(self,body):
    super().__init__(body);self.status=200;self.url=url;self.headers=Message();self.headers.add_header('Content-Type','text/html')
  for body_directive in ['', '<meta name="robots" content="noimageindex">']:
   prior={'etag':'unchanged','robots':['noimageindex'],'publication_qualified':True,'noindex':False,'noimageindex':True};body=('<html><head><link rel="canonical" href="'+url+'">'+body_directive+'</head><body>Current catalogue</body></html>').encode();requests=[]
   def response(req,**kwargs):
    requests.append(req)
    if len(requests)==1:raise urllib.error.HTTPError(url,304,'Not modified',Message(),None)
    return Reply(body)
   with patch.object(s,'open_public_source',side_effect=response):actual=s.public_resource(url,prior)
   self.assertEqual(len(requests),2);self.assertTrue(requests[0].has_header('If-none-match'));self.assertFalse(requests[1].has_header('If-none-match'));self.assertEqual(actual['noimageindex'],bool(body_directive));self.assertTrue(actual['publication_qualified'])
 def test_navigation_requires_exact_authoritative_head_title_not_a_denylist(self):
  self.db.commit();root=Path(self.temp.name)/'release';root.mkdir();(root/'manifest.json').write_text(json.dumps({'files':[{'kind':'html','path':'index.html'}]}));source=[{'page_url':self.resource,'publication_qualified':True,'title':'Approved title'}]
  (root/'index.html').write_text('<nav><a href="'+self.resource+'">Materials</a></nav><main><a href="/site-map/">Index</a><a href="'+self.resource+'">Approved title</a></main>')
  proof=s.validate_resource_labels(root,source,Path(self.temp.name)/'feed.sqlite3');self.assertEqual(proof['distinctResourceLabelsMatched'],1)
  (root/'index.html').write_text('<main><a href="'+self.resource+'">Approved titleAromatherapy / Scent Kit</a></main>')
  with self.assertRaisesRegex(ValueError,'authoritative document head'):s.validate_resource_labels(root,source,Path(self.temp.name)/'feed.sqlite3')
 def test_native_checkpoint_preserves_indian_scripts_and_rupee_without_locale_defaults(self):
  self.db.commit();title='Telugu \u0c24\u0c32\u0c4d\u0c32\u0c3f \u20b9';record={'page_url':self.resource,'publication_qualified':True,'media_references':[],'video_objects':[],'body_sha256':'d'*64,'content_sha256':'e'*64,'observed_at':'2026-10-14T00:00:00Z','title':title,'description':title}
  cache=Path(self.temp.name)/'resources.jsonl';cache.write_text(json.dumps(record,ensure_ascii=False)+'\n',encoding='utf8');snapshot=self.snapshot([{'slug':'real-parent-question','lang':'en','publisher_source_fingerprint':self.fp}]);snapshot['sourceSHA256']='f'*64
  out=Path(self.temp.name)/'native';result=s.refresh(Path(self.temp.name)/'feed.sqlite3',snapshot,self.baseline,[record],out,reuse_resources=cache)
  saved=json.loads((out/'resource-snapshot.jsonl').read_text(encoding='utf8'));self.assertEqual(saved['title'],title);self.assertEqual(result['resources_checked'],1)

if __name__=='__main__':unittest.main()
