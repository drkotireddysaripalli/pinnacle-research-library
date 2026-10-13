"""Validate a reviewed immutable publisher release before website composition.

No network, database mutation, deployment or inferred media approval. Output
must be new, so a bad source cannot overwrite the last valid publication.
"""
from __future__ import annotations
import argparse,hashlib,json,os,stat,zipfile
from pathlib import Path,PurePosixPath
import manager as m

FIELDS={'schema_version','archive','archive_sha256','release_id','expected_page_urls','reviewed_source'}
def selected_release(selection,output):
 selection=Path(selection).resolve();output=Path(output).resolve();doc=json.loads(selection.read_text(encoding='utf-8'))
 if set(doc)!=FIELDS or doc['schema_version']!=1:raise ValueError('Unknown or incomplete publication selection')
 if not isinstance(doc['reviewed_source'],str) or not doc['reviewed_source'].strip():raise ValueError('Reviewed publisher provenance required')
 if not isinstance(doc['expected_page_urls'],int) or doc['expected_page_urls']<1:raise ValueError('Reviewed complete-page count required')
 archive=(selection.parent/doc['archive']).resolve()
 if archive.is_symlink() or not archive.is_file() or m.digest_file(archive)!=doc['archive_sha256']:raise ValueError('Publisher archive hash mismatch')
 if output.exists() or output==archive.parent or output.is_relative_to(archive) or archive.is_relative_to(output):raise ValueError('New independent extraction directory required')
 with zipfile.ZipFile(archive) as z:
  members=z.infolist();names=[x.filename for x in members]
  if len(names)!=len(set(names)) or 'manifest.json' not in names:raise ValueError('Duplicate/missing archive members')
  for member in members:
   p=PurePosixPath(member.filename)
   if member.is_dir() or p.is_absolute() or '..' in p.parts or '\\' in member.filename or ':' in member.filename or stat.S_ISLNK(member.external_attr>>16):raise ValueError('Unsafe publisher archive member')
  manifest=json.loads(z.read('manifest.json'))
  if manifest['release_id']!=doc['release_id'] or manifest['page_urls']!=doc['expected_page_urls']:raise ValueError('Publisher release identity/count mismatch')
  if set(names)!={'manifest.json'}|{f['path'] for f in manifest['files']}:raise ValueError('Unmanifested archive bytes')
  for file in manifest['files']:
   b=z.read(file['path'])
   if len(b)!=file['bytes'] or hashlib.sha256(b).hexdigest()!=file['sha256']:raise ValueError('Publisher file bytes/hash mismatch')
  output.mkdir(parents=True)
  for member in members:
   target=output/member.filename;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(member))
 try:
  validation=m.validate_release(output)
 except BaseException:
  # The caller supplied a new extraction directory; never alter last-valid output.
  raise
 return {'selection_sha256':m.digest_file(selection),'archive_sha256':doc['archive_sha256'],'release_id':doc['release_id'],'page_urls':doc['expected_page_urls'],'reviewed_source':doc['reviewed_source'],'output':str(output),'validation':validation}

def main():
 p=argparse.ArgumentParser();p.add_argument('--selection',required=True,type=Path);p.add_argument('--output',required=True,type=Path);a=p.parse_args();print(json.dumps(selected_release(a.selection,a.output),ensure_ascii=False))
if __name__=='__main__':main()
