import datetime as dt,hashlib,json,sys,tempfile,unittest,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import managed_media_sources as managed
import selected_reference_sources as selected
class SelectedReferences(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.db=m.connect(Path(self.temp.name)/'feed.sqlite3');self.now=dt.datetime(2026,10,16,11,tzinfo=dt.timezone.utc)
  self.data=json.loads((selected.HERE.parents[1]/'speech-site/deployment/selected-reference-data.json').read_bytes());self.resources={}
  for url,r in self.data.items():
   body=('<html><head><link rel="canonical" href="'+url+'"></head><body><main>'+r['html']+'</main></body></html>').encode()
   self.resources[url]={'publication_qualified':True,'reference_capture':{'body_hex':body.hex(),'proof':{'page_url':url,'method':'GET','status':200,'final_url':url,'content_type':'text/html','publication_qualified':True,'body_complete':True,'body_sha256':hashlib.sha256(body).hexdigest(),'body_bytes':len(body),'observed_at':self.now.isoformat(),'credentials_sent':False,'redirects_followed':False,'media_bodies_downloaded':False,'response_headers':{'X-Robots-Tag':[]}}}}
   row=dict(url_hash=m.sha(url),url=url,host='www.pinnacleblooms.org',module_type=r['kind'],decision='INCLUDE',title='Fixture public reference',description='Fixture only',keywords_json='[]',canonical_url=url,language='en',content_modified_at=None,priority_hint=None,change_frequency_hint=None,relevance=None,og_image=None,images_json='[]',videos_json='[]',links_json='[]',llm_text=None,llm_approved=0,metadata_json='{}',row_sha256='');m.upsert(self.db,m.refresh_digest(row))
 def tearDown(self):self.db.close();self.temp.cleanup()
 def run_source(self,resources=None,cache=None):
  def no_query(*args):raise AssertionError('Fresh packet delivery evidence must be reused')
  return selected.refresh(self.db,resources if resources is not None else self.resources,cache or {},self.now,no_query,managed.head_ok,managed.fresh)
 def test_exact_visible_fixtures_admit2049_pairs_without_network(self):
  desired,proof,holds=self.run_source();self.assertEqual(holds,[]);self.assertEqual(sum(map(len,desired.values())),2049);self.assertEqual(proof['headsQueried'],0);self.assertEqual(proof['ability']['qualified_pairs'],1899);self.assertEqual(proof['guru']['qualifiedPairs'],150)
  changes,count=managed.reconcile(self.db,desired);self.assertEqual(count['added'],2049);self.assertEqual(len(changes),193)
 def test_missing_parent_capture_is_not_an_empty_source_or_deletion(self):
  desired,proof,holds=self.run_source({});self.assertEqual(desired,{});self.assertEqual(proof['status'],'capture-pending')
 def test_guru_unknown_hidden_duplicate_and_changed_sequence_do_not_qualify(self):
  plans,_=selected.guru_packet();url,plan=next(iter(plans.items()));html=self.data[url]['html']
  for bad in [html.replace('<section ','<section hidden ',1),html+html,html.replace('data-guru-gallery-sequence="0"','data-guru-gallery-sequence="7"'),html.replace(plan['manifest']['assets'][0]['selected_url'],'https://example.org/unselected.jpg')]:
   parser=selected.GuruHTML(plan);parser.feed(bad);parser.close();self.assertFalse(parser.qualified())
 def test_confirmed_guru_render_and_delivery_veto_withdraw_prior_selected_ownership(self):
  desired,_,_=self.run_source();managed.reconcile(self.db,desired)
  plans,_=selected.guru_packet();url,plan=next(iter(plans.items()));image=plan['manifest']['assets'][0]['selected_url'];original=self.resources[url]
  for kind in ('hidden','noimageindex','image404','image_noimageindex'):
   with self.subTest(kind=kind):
    resources=dict(self.resources);row=json.loads(json.dumps(original));cache={}
    if kind=='hidden':
     body=bytes.fromhex(row['reference_capture']['body_hex']).replace(b'<section ',b'<section hidden ',1);row['reference_capture']['body_hex']=body.hex();row['reference_capture']['proof'].update(body_sha256=hashlib.sha256(body).hexdigest(),body_bytes=len(body))
    elif kind=='noimageindex':row['noimageindex']=True
    else:cache[image]={'url':image,'method':'HEAD','status':404 if kind=='image404' else 200,'content_type':'image/jpeg','direct_image_delivery_verified':True,'checked_at':self.now.isoformat(),'x_robots':'noimageindex' if kind=='image_noimageindex' else ''}
    resources[url]=row;current,_,holds=self.run_source(resources,cache)
    self.assertTrue((url,image) not in {(r['page_url'],r['image_url']) for r in current[selected.GURU]},'A current confirmed veto must not be retained as an unknown transport failure');self.assertTrue(holds)
 def test_unknown_guru_capture_or_transient_delivery_preserves_exact_prior_pair(self):
  desired,_,_=self.run_source();managed.reconcile(self.db,desired)
  plans,_=selected.guru_packet();url,plan=next(iter(plans.items()));image=plan['manifest']['assets'][0]['selected_url']
  for kind in ('missing_capture','image503'):
   with self.subTest(kind=kind):
    resources=dict(self.resources);cache={}
    if kind=='missing_capture':resources[url]={'publication_qualified':False}
    else:cache[image]={'url':image,'method':'HEAD','status':503,'checked_at':self.now.isoformat()}
    current,_,holds=self.run_source(resources,cache);self.assertIn((url,image),{(r['page_url'],r['image_url']) for r in current[selected.GURU]});self.assertTrue(holds)
if __name__=='__main__':unittest.main()
