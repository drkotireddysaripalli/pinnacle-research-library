import copy,datetime as dt,hashlib,json,re,sys,tempfile,unittest,zipfile
from pathlib import Path
from types import SimpleNamespace
from unittest import mock
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
  return selected.refresh(self.db,resources if resources is not None else self.resources,cache if cache is not None else {},self.now,no_query,managed.head_ok,managed.fresh)
 def seed_guru(self):
  desired,_,_=self.run_source();managed.reconcile(self.db,desired);plans,_=selected.guru_packet();url,plan=next(iter(plans.items()));return url,plan,plan['manifest']['assets'][0]['selected_url']
 def current_body(self,resources,url,body):
  cap=resources[url]['reference_capture'];raw=body.encode();cap['body_hex']=raw.hex();cap['proof'].update(body_sha256=hashlib.sha256(raw).hexdigest(),body_bytes=len(raw),observed_at=self.now.isoformat())
 def has_guru(self,desired,url,image):return any(r['page_url']==url and r['image_url']==image for r in desired[selected.GURU])
 def test_exact_visible_fixtures_admit2049_pairs_without_network(self):
  desired,proof,holds=self.run_source();self.assertEqual(holds,[]);self.assertEqual(sum(map(len,desired.values())),2049);self.assertEqual(proof['headsQueried'],0);self.assertEqual(proof['ability']['qualified_pairs'],1899);self.assertEqual(proof['guru']['qualifiedPairs'],150)
  changes,count=managed.reconcile(self.db,desired);self.assertEqual(count['added'],2049);self.assertEqual(len(changes),193)
 def test_missing_parent_capture_is_not_an_empty_source_or_deletion(self):
  desired,proof,holds=self.run_source({});self.assertEqual(desired,{});self.assertEqual(proof['status'],'capture-pending')
 def test_guru_unknown_hidden_duplicate_and_changed_sequence_do_not_qualify(self):
  plans,_=selected.guru_packet();url,plan=next(iter(plans.items()));html=self.data[url]['html']
  for bad in [html.replace('<section ','<section hidden ',1),html+html,html.replace('data-guru-gallery-sequence="0"','data-guru-gallery-sequence="7"'),html.replace(plan['manifest']['assets'][0]['selected_url'],'https://example.org/unselected.jpg')]:
   parser=selected.GuruHTML(plan);parser.feed(bad);parser.close();self.assertFalse(parser.qualified())
 def test_guru_current_parent_veto_does_not_restore_prior_pair(self):
  for flag in ['noimageindex','noindex','canonical_conflict','current-404']:
   url,plan,image=self.seed_guru();resources=copy.deepcopy(self.resources);resources[url]['observed_at']=self.now.isoformat()
   if flag=='current-404':resources[url].update(status=404,publication_qualified=False)
   else:resources[url][flag]=True
   desired,proof,holds=self.run_source(resources)
   self.assertFalse(self.has_guru(desired,url,image),flag);self.assertTrue(holds)
   managed.reconcile(self.db,desired);row=self.db.execute('SELECT images_json,metadata_json FROM pages WHERE url=?',(url,)).fetchone()
   self.assertNotIn(image,{r['loc'] for r in json.loads(row['images_json'])},flag)
   self.assertNotIn(selected.GURU,json.loads(row['metadata_json']).get('managed_image_ownership',{}).get(image,{}).get('owners',[]),flag)
 def test_guru_current_image_veto_does_not_carry_prior_pair(self):
  for change in [{'status':404,'direct_image_delivery_verified':False},{'status':200,'x_robots':'noimageindex'},{'status':302,'location':'https://example.org/redirect','direct_image_delivery_verified':False}]:
   url,plan,image=self.seed_guru();head={'url':image,'method':'HEAD','status':200,'content_type':'image/jpeg','checked_at':self.now.isoformat(),'direct_image_delivery_verified':True,**change}
   desired,proof,holds=self.run_source(cache={image:head});self.assertFalse(self.has_guru(desired,url,image),str(change));managed.reconcile(self.db,desired)
   self.assertNotIn(image,{r['loc'] for r in json.loads(self.db.execute('SELECT images_json FROM pages WHERE url=?',(url,)).fetchone()[0])})
 def test_guru_complete_render_removal_preserves_other_ownership_and_unmanaged_image(self):
  url,plan,image=self.seed_guru();row=dict(self.db.execute('SELECT * FROM pages WHERE url=?',(url,)).fetchone());meta=json.loads(row['metadata_json']);owner=meta['managed_image_ownership'][image];owner['owners'].append(managed.KNOWLEDGE);owner['source_sha256'][managed.KNOWLEDGE]='a'*64
  unmanaged='https://images.pinnacleblooms.org/unmanaged-fixture.jpg';row['images_json']=m.dump(json.loads(row['images_json'])+[{'loc':unmanaged}]);row['metadata_json']=m.dump(meta);m.upsert(self.db,m.refresh_digest(row))
  resources=copy.deepcopy(self.resources);html=re.sub(r'<figure\b.*?</figure>','',self.data[url]['html'],flags=re.S).replace('<section ','<section data-observed-set-complete="true" ',1);self.current_body(resources,url,'<html><head><link rel="canonical" href="'+url+'"></head><body><main>'+html+'</main></body></html>')
  desired,_,holds=self.run_source(resources);self.assertFalse(self.has_guru(desired,url,image));managed.reconcile(self.db,desired)
  row=self.db.execute('SELECT images_json,metadata_json FROM pages WHERE url=?',(url,)).fetchone();self.assertTrue({image,unmanaged}<={r['loc'] for r in json.loads(row['images_json'])});owner=json.loads(row['metadata_json'])['managed_image_ownership'][image];self.assertEqual(owner['owners'],[managed.KNOWLEDGE]);self.assertNotIn(selected.GURU,owner['source_sha256'])
 def test_guru_uncertain_capture_or_transient_image_carries_prior(self):
  for case in ['missing-capture','stale-capture','invalid-body-hex','missing-body-hash','missing-section','partial-selection','hidden-selection','changed-sequence','image-503']:
   url,plan,image=self.seed_guru();resources=copy.deepcopy(self.resources);cache={}
   if case=='missing-capture':resources[url].pop('reference_capture')
   elif case=='stale-capture':resources[url]['reference_capture']['proof']['observed_at']=(self.now-dt.timedelta(hours=25)).isoformat()
   elif case=='invalid-body-hex':resources[url]['reference_capture']['body_hex']='not-hex'
   elif case=='missing-body-hash':resources[url]['reference_capture']['proof'].pop('body_sha256')
   elif case=='missing-section':self.current_body(resources,url,'<html><head><link rel="canonical" href="'+url+'"></head><body><main>Current public article without a selection marker</main></body></html>')
   elif case=='partial-selection':self.current_body(resources,url,'<html><head><link rel="canonical" href="'+url+'"></head><body><main>'+re.sub(r'<figure\b.*?</figure>','',self.data[url]['html'],flags=re.S)+'</main></body></html>')
   elif case=='hidden-selection':self.current_body(resources,url,bytes.fromhex(resources[url]['reference_capture']['body_hex']).decode().replace('<section ','<section hidden ',1))
   elif case=='changed-sequence':self.current_body(resources,url,bytes.fromhex(resources[url]['reference_capture']['body_hex']).decode().replace('data-guru-gallery-sequence="0"','data-guru-gallery-sequence="99"'))
   else:cache[image]={'url':image,'method':'HEAD','status':503,'content_type':'image/jpeg','checked_at':self.now.isoformat(),'direct_image_delivery_verified':False}
   desired,_,holds=self.run_source(resources,cache);self.assertTrue(self.has_guru(desired,url,image),case);self.assertTrue(holds,case)
 def test_managed_refresh_cannot_restore_a_blocked_selected_pair(self):
  for veto in ['parent-noimageindex','image-404']:
   url,plan,image=self.seed_guru();resources=copy.deepcopy(self.resources)
   if veto=='parent-noimageindex':resources[url]['noimageindex']=True
   sample_parent=next(u for u in self.resources if u!=url);sample_image='https://images.pinnacleblooms.org/blocked-regression-fixture.jpg';stamp=self.now.isoformat()
   def head(address,status=200):return {'url':address,'method':'HEAD','status':status,'content_type':'image/jpeg','checked_at':stamp,'direct_image_delivery_verified':status==200}
   resources[managed.CATALOGUE]={'catalogue_capture':{'body_hex':b'<html></html>'.hex(),'proof':{'body_sha256':hashlib.sha256(b'<html></html>').hexdigest()}},'publication_qualified':True}
   permit=Path(self.temp.name)/'permit.json';permit.write_text(json.dumps({'scope':'current_public_sitemap_references','direct_user_request':True}))
   def export_knowledge(repo,release,out):
    out.mkdir();(out/'source-backed-relationships.jsonl').write_text(json.dumps({'canonical_parent':sample_parent,'image_url':sample_image,'source':{'sha256':'a'*64}})+'\n');(out/'source-inputs.json').write_text('{}')
   class Catalogue:
    cards=[{'renderer_scope_recognized':True,'images':[{'is_pb_image':True,'source_url':sample_image}]}]
    def feed(self,body):pass
    def close(self):pass
   def export_catalogue(args):args.output.mkdir();(args.output/'catalogue-use-qualified-candidates.jsonl').write_text('');(args.output/'held-relationships.jsonl').write_text('')
   knowledge=SimpleNamespace(export=export_knowledge);catalogue=SimpleNamespace(CatalogueHTML=Catalogue,IMAGE=re.compile(re.escape(sample_image)),export=export_catalogue)
   def unsafe_carry(db,observed,cache,*args):
    if veto=='image-404':cache[image]=head(image,404)
    return {selected.GURU:[{'page_url':url,'image_url':image,'source_sha256':'b'*64}]},{'headsQueried':0},[]
   with mock.patch.object(managed,'PERMISSION',permit),mock.patch.object(managed,'bootstrap_heads',return_value={sample_image:head(sample_image)}),mock.patch.object(managed,'load_module',side_effect=lambda name,file:knowledge if name=='knowledge_media_export' else catalogue),mock.patch.object(selected,'refresh',side_effect=unsafe_carry):
    managed.refresh(self.db,Path(self.temp.name),Path(self.temp.name),resources,Path(self.temp.name)/veto,self.now)
   images=json.loads(self.db.execute('SELECT images_json FROM pages WHERE url=?',(url,)).fetchone()[0]);self.assertNotIn(image,{r['loc'] for r in images},veto)
 def test_missing_ability_capture_preserves_owned_pairs_with_hold(self):
  desired,_,_=self.run_source();managed.reconcile(self.db,desired);url=next(u for u,r in self.data.items() if r['kind']=='ability');prior={r['image_url'] for r in desired[selected.ABILITY] if r['page_url']==url}
  resources=copy.deepcopy(self.resources);resources[url].pop('reference_capture');resources[url].update(publication_qualified=False,status=None,observed_at=self.now.isoformat())
  current,proof,holds=self.run_source(resources);self.assertEqual(prior,{r['image_url'] for r in current[selected.ABILITY] if r['page_url']==url});self.assertGreater(proof['ability']['carried_forward_pairs'],0);self.assertTrue(any(r['page_url']==url for r in holds))
if __name__=='__main__':unittest.main()
