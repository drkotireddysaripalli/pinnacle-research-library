"""Optional independent QA against locally saved official sitemap schemas.

Requires lxml; the core generator/validator does not. Supply the documented
official sitemap.xsd, siteindex.xsd, image.xsd and video.xsd in --schema-dir.
No network retrieval or entity resolution occurs during validation.
"""
import argparse,copy,json
from pathlib import Path
from lxml import etree as E
import manager as m

def validate(release,schema_dir):
 m.validate_release(release);release=Path(release);schema_dir=Path(schema_dir);parser=E.XMLParser(resolve_entities=False,no_network=True)
 files=json.loads((release/'manifest.json').read_text())['files']
 schemas={kind:E.XMLSchema(E.parse(str(schema_dir/name),parser)) for kind,name in (('pages','sitemap.xsd'),('index','siteindex.xsd'),('images','image.xsd'),('videos','video.xsd'))};checked=0;images=0;videos=0;news=0
 if any(f['kind']=='news' for f in files):schemas['news']=E.XMLSchema(E.parse(str(schema_dir/'news.xsd'),parser))
 for f in files:
  if f['kind'] not in ('pages','index','images','videos','news'):continue
  root=E.parse(str(release/f['path']),parser).getroot()
  if f['kind']=='index':schemas['index'].assertValid(root)
  else:
   base=copy.deepcopy(root)
   for entry in base:
    for child in list(entry):
     if child.tag.startswith('{'+m.IM+'}'):
      schemas['images'].assertValid(child);images+=1;entry.remove(child)
     elif child.tag.startswith('{'+m.VI+'}'):
      schemas['videos'].assertValid(child);videos+=1;entry.remove(child)
     elif child.tag.startswith('{'+m.NW+'}'):
      schemas['news'].assertValid(child);news+=1;entry.remove(child)
     elif child.tag.startswith('{'+m.XH+'}'):entry.remove(child) # reciprocal alternates checked by semantic validator
   schemas['pages'].assertValid(base)
  checked+=1
 return {'official_schema_xml_files':checked,'image_elements':images,'video_elements':videos,'news_elements':news,'passed':True}

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--release',required=True);p.add_argument('--schema-dir',required=True);a=p.parse_args();print(json.dumps(validate(a.release,a.schema_dir),indent=2))
