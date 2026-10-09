import copy,hashlib,json,unittest
from pathlib import Path
from bulk_identities import build,validate_map,VERSION
HERE=Path(__file__).parent
class BulkIdentity(unittest.TestCase):
 def fixture(self):
  catalogue={'records':[{'id':'999','path':'/mirracles/999/fixture'}],'aliasPaths':{}}
  detail={'999':{'id':'999','player':'https://www.youtube.com/embed/abcdefghijk','poster':'https://videodelivery.net//thumbnails/thumbnail.jpg','inSitemap':True}}
  source={'at':'2026-10-09T00:00:00Z','sha256':'0'*64,'rows':1,'projection':[{'Id':1,'F25':'999','YTUrl':'https://www.youtube.com/watch?v=abcdefghijk','F2':'a'*32,'RS':None}]}
  return source,catalogue,detail
 def test_changed_or_empty_thumbnail_keeps_matching_authoritative_video(self):
  source,catalogue,detail=self.fixture();out=build(source,catalogue,detail)
  self.assertEqual(out['legacyIds'],{'1':'999'});self.assertEqual(out['provenance']['counts']['thumbnailRepresentationDifference'],1)
 def test_conflicting_populated_video_is_not_mapped(self):
  source,catalogue,detail=self.fixture();source['projection'][0]['YTUrl']='https://www.youtube.com/watch?v=DIFFERENT01'
  self.assertEqual(build(source,catalogue,detail)['legacyIds'],{})
 def test_missing_public_target_is_never_created(self):
  source,catalogue,detail=self.fixture();source['projection'][0]['F25']='888'
  self.assertEqual(build(source,catalogue,detail)['legacyIds'],{})
 def test_canonical_and_previous_alias_conflicts_are_rejected(self):
  source,catalogue,detail=self.fixture()
  with self.assertRaises(ValueError):validate_map({'999':'999'},catalogue['records'],{})
  with self.assertRaises(ValueError):validate_map({'1':'999'},catalogue['records'],{'/mirracles/1/fixture':'888'})
 def test_public_map_has_no_private_projection_and_matches_catalogue(self):
  manifest=json.loads((HERE/'data/authoritative-legacy-ids.json').read_text(encoding='utf-8'));catalogue=json.loads((HERE/'data/catalogue.json').read_text(encoding='utf-8'))
  self.assertEqual(manifest['version'],VERSION);self.assertEqual(len(manifest['legacyIds']),23525);self.assertEqual(manifest['legacyIds'],catalogue['legacyIds'])
  self.assertEqual(set(manifest),{'version','legacyIds','provenance'});validate_map(manifest['legacyIds'],catalogue['records'],catalogue['aliasPaths'])
  provenance=json.loads((HERE/'data/provenance.json').read_text(encoding='utf-8'))['authoritativeLegacyIds']
  self.assertEqual(provenance['sha256'],hashlib.sha256((HERE/'data/authoritative-legacy-ids.json').read_bytes()).hexdigest())
  for old,target in {'1':'12546448127','1000':'20688902091','10000':'20708856202','10001':'20708856203','15843':'20709093434','20980':'20709497285','20067':'20709422279','18253':'20709207018'}.items():self.assertEqual(manifest['legacyIds'][old],target)
if __name__=='__main__':unittest.main()
