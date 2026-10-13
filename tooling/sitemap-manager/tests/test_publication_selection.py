import json,sys,tempfile,unittest,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import publication_selection as publication

class PublicationSelectionTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.db=m.connect(self.root/'source.sqlite3');self.policy={'hosts':['www.example.com'],'family_buckets':{'guide':2},'html_page_size':2,'llms_full':False}
 def tearDown(self):self.db.close();self.tmp.cleanup()
 def release(self,name,records):
  register=self.root/(name+'.jsonl');register.write_text('\n'.join(json.dumps(x) for x in records));m.import_register(self.db,register,snapshot=True)
  release=self.root/name;manifest=m.build_release(self.db,release,self.policy);archive=self.root/(name+'.zip')
  with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
   for p in release.rglob('*'):
    if p.is_file():z.write(p,p.relative_to(release).as_posix())
  selection=self.root/(name+'-selection.json');selection.write_text(json.dumps({'schema_version':1,'archive':archive.name,'archive_sha256':m.digest_file(archive),'release_id':manifest['release_id'],'expected_page_urls':manifest['page_urls'],'reviewed_source':'Controlled non-care public guide publisher fixture'}));return selection,manifest
 def test_selected_source_is_verified_without_fixed_file_count(self):
  s,manifest=self.release('first',[{'url':'https://www.example.com/guide/a','family':'Guide','decision':'INCLUDE'}]);r=publication.selected_release(s,self.root/'selected');self.assertEqual(r['release_id'],manifest['release_id']);self.assertEqual(r['page_urls'],1)
 def test_corrupt_or_unreviewed_selection_does_not_replace_last_valid(self):
  s,_=self.release('first',[{'url':'https://www.example.com/guide/a','family':'Guide','decision':'INCLUDE'}]);publication.selected_release(s,self.root/'valid');before=(self.root/'valid/manifest.json').read_bytes();d=json.loads(s.read_text());d['archive_sha256']='0'*64;s.write_text(json.dumps(d))
  with self.assertRaisesRegex(ValueError,'hash mismatch'):publication.selected_release(s,self.root/'next')
  self.assertEqual((self.root/'valid/manifest.json').read_bytes(),before);self.assertFalse((self.root/'next').exists())
 def test_change_delete_release_selection_and_matching_rollback(self):
  first,fm=self.release('first',[{'url':'https://www.example.com/guide/a','family':'Guide','decision':'INCLUDE'},{'url':'https://www.example.com/guide/retired','family':'Guide','decision':'INCLUDE'}]);second,sm=self.release('second',[{'url':'https://www.example.com/guide/a','family':'Guide','decision':'INCLUDE','title':'Updated public guide'},{'url':'https://www.example.com/guide/retired','family':'Guide','decision':'EXCLUDE'}]);publication.selected_release(first,self.root/'old');publication.selected_release(second,self.root/'new');xml=''.join(p.read_text() for p in (self.root/'new').rglob('*.xml'));self.assertNotIn('/guide/retired',xml);self.assertNotEqual(fm['release_id'],sm['release_id']);rollback=publication.selected_release(first,self.root/'rollback');self.assertEqual(rollback['release_id'],fm['release_id']);self.assertEqual((self.root/'old/manifest.json').read_bytes(),(self.root/'rollback/manifest.json').read_bytes())
 def test_unmanifested_and_path_traversal_archive_members_rejected(self):
  s,_=self.release('first',[{'url':'https://www.example.com/guide/a','family':'Guide','decision':'INCLUDE'}]);d=json.loads(s.read_text());archive=self.root/d['archive']
  with zipfile.ZipFile(archive,'a') as z:z.writestr('../outside.txt','unexpected')
  d['archive_sha256']=m.digest_file(archive);s.write_text(json.dumps(d))
  with self.assertRaisesRegex(ValueError,'Unsafe'):publication.selected_release(s,self.root/'next')
  self.assertFalse((self.root/'outside.txt').exists())

if __name__=='__main__':unittest.main()
