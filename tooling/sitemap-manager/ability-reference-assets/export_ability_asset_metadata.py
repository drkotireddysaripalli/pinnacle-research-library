#!/usr/bin/env python3
"""Saved reference definitions + exact public-prefix object metadata; no network or DB writes."""
import argparse,collections,csv,hashlib,json,os,pathlib,re,tempfile
from urllib.parse import urlsplit,quote
ROOT=pathlib.Path(__file__).resolve().parent
FIELDS={'Id','AId','Type','Seq','Keyword','Question','AllOptions','E1','E2','E3','F1','F2','F3','F4','F5','F6','F7','F8','F9','RS','CDT','UDT'}
PREFIXES=('Ability/Questions/','Ability/Examples/')
PATTERN=re.compile(r'Ability/(Questions|Examples)/([1-9][0-9]*)\.jpg\Z')
encode=lambda v:json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()
sha=lambda b:hashlib.sha256(b).hexdigest()
def filehash(p):
    h=hashlib.sha256()
    with pathlib.Path(p).open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
def load_definitions(path):
    d=json.loads(pathlib.Path(path).read_text());rows=d['rows']
    if d.get('success') is not True or d.get('rows_affected')!=0 or d.get('row_count')!=len(rows) or not rows:raise ValueError('Expected successful reference-only read export')
    if set(d.get('columns',[]))-FIELDS:raise ValueError('Unexpected source columns; reference-only projection required')
    byid={}
    for n,r in enumerate(rows):
        if set(r)-FIELDS:raise ValueError('Unexpected/private source field; refusing export')
        if type(r.get('Id')) is not int or type(r.get('AId')) is not int or r['Id']<=0 or r['AId']<=0 or r['Id'] in byid:raise ValueError('Invalid/duplicate reference identity')
        if not isinstance(r.get('Question'),str) or not r['Question'].strip():raise ValueError('Missing reference Question')
        byid[r['Id']]=(n,r)
    return d,byid

def build(definitions,parent_join,objects,probe=None):
    d,defs=load_definitions(definitions);j=json.loads(pathlib.Path(parent_join).read_text());sourcehash=filehash(definitions);joinhash=filehash(parent_join);inventoryhash=filehash(objects)
    evidence={'definitions':{'file':pathlib.Path(definitions).name,'sha256':sourcehash,'table':'eipassessment','retrieved_at_declared':d.get('retrieved_at'),'query_sha256':sha(d.get('source',{}).get('query','').encode())},'parent_join':{'file':pathlib.Path(parent_join).name,'sha256':joinhash},'object_inventory':{'file':pathlib.Path(objects).name,'sha256':inventoryhash}}
    probedata=json.loads(pathlib.Path(probe).read_text()) if probe else None
    if probe:evidence['declared_url_probe']={'file':pathlib.Path(probe).name,'sha256':filehash(probe)}
    candidates=collections.defaultdict(list);priorheld=collections.defaultdict(list)
    for row in j['candidates']:candidates[row['object_key']].append(row)
    for row in j['held']:priorheld[row['object_key']].append(row['reason'])
    records=[];excluded=[];seen=set();counts=collections.Counter();seen_question_roles=set();parents=set();mapped_relationships=0
    with pathlib.Path(objects).open(newline='',encoding='utf-8-sig') as f:
        for line,o in enumerate(csv.DictReader(f),2):
            key=o['object_key']
            if not key.startswith(PREFIXES):continue
            if o['bucket']!='pbn-test':raise ValueError('Unexpected bucket in assessment public-prefix inventory')
            identity=(o['bucket'],key)
            if identity in seen:raise ValueError('Duplicate exact object identity')
            seen.add(identity)
            if o['media_kind']!='image':excluded.append({'bucket':o['bucket'],'object_key':key,'media_kind':o['media_kind'],'reason':'not_an_image_object','inventory_csv_line':line});continue
            match=PATTERN.fullmatch(key);qid=int(match[2]) if match else None;item=defs.get(qid);ordinal,row=item if item else (None,None);role='question_image' if key.startswith(PREFIXES[0]) else 'example_image';urls=json.loads(o['configured_public_urls']);imageurls=[u for u in urls if isinstance(u,str) and urlsplit(u).netloc=='images.pinnacleblooms.org' and urlsplit(u).path=='/'+quote(key,safe='/')]
            if len(imageurls)!=1:raise ValueError('Need one exact inventory-declared images-host URL')
            exact_url=imageurls[0];mapped=[];conflicts=[]
            for c in candidates[key]:
                valid=row is not None and (c.get('question_id'),c.get('assessment_id'),c.get('role'),c.get('bucket'),c.get('image_url'),c.get('inventory_etag'))==(qid,row['AId'],role,o['bucket'],exact_url,o['etag']) and c['parent_url'].startswith('https://www.pinnacleblooms.org/abs/')
                p={'parent_url':c['parent_url'],'question_id':c.get('question_id'),'assessment_id':c.get('assessment_id'),'public_parent_evidence':c.get('public_parent_evidence'),'source_join_decision':c.get('decision'),'source_join_reader_use':c.get('current_reader_use')}
                (mapped if valid else conflicts).append(p)
            if len({p['parent_url'] for p in mapped})!=len(mapped):raise ValueError('Duplicate exact parent/object mapping')
            reason='mapped_existing_abs_parent_candidate' if mapped else 'parent_mapping_conflicts_with_current_source' if conflicts else 'noncanonical_filename_requires_explicit_alias' if not match else 'definition_not_in_reference_export' if not row else 'assessment_not_in_qualified_abs_snapshot'
            if row:seen_question_roles.add((qid,role))
            counts[reason]+=1;counts[role]+=1;counts['semantic_context_matched' if row else 'semantic_context_unmatched']+=1;parents.update(p['parent_url'] for p in mapped);mapped_relationships+=len(mapped)
            f2=row.get('F2') if row else None;f2evidence={'declared_value':f2,'source_field':'F2','verification':'UNVERIFIED_PUBLIC_OR_CANONICAL_USE','accepted_as_parent':False,'known_http_status':None}
            if probedata and f2 and probedata.get('url')==f2:f2evidence.update(known_http_status=probedata.get('status'),probe_evidence_sha256=evidence['declared_url_probe']['sha256'])
            context={'Question':row.get('Question') if row else None,'Keyword':row.get('Keyword') if row else None,'AllOptions':row.get('AllOptions') if row else None,'examples':[{'source_field':k,'text':row[k]} for k in ['E1','E2','E3'] if row and row.get(k)],'use':'Reference-question semantic context; does not assert what the image depicts.'}
            provenance={'reference_export_sha256':sourcehash,'reference_json_pointer':f'/rows/{ordinal}' if row else None,'reference_row_sha256':sha(encode(row)) if row else None,'source_created_at_declared':row.get('CDT') if row else None,'source_updated_at_declared':row.get('UDT') if row else None,'source_version_status':'hash_bound_snapshot; null dates remain unknown','object_inventory_sha256':inventoryhash,'inventory_csv_line':line,'parent_join_sha256':joinhash}
            records.append({'asset_id':sha(encode(identity)),'bucket':o['bucket'],'object_key':key,'exact_configured_public_url':exact_url,'configured_public_urls':urls,'url_evidence':'inventory_configured_domain_mapping; not a current delivery check','role':role,'role_basis':'exact Questions/Examples object prefix','question_id':qid if row else None,'assessment_id':row['AId'] if row else None,'cohort_type':row.get('Type') if row else None,'source_ordinal':row.get('Seq') if row else None,'object_metadata':{k:o.get(k) or None for k in ['size_bytes','content_type','etag','version','uploaded_at','last_modified']},'semantic_context':context,'alt_text':None,'alt_text_status':'not_generated_without_verified_visual_depiction','declared_question_url_F2':f2evidence,'existing_abs_parent_candidates':mapped,'conflicting_parent_candidates':conflicts,'parent_mapping_disposition':reason,'prior_hold_reasons':sorted(set(priorheld[key])),'metadata_record_status':'source_reference_enriched' if row else 'object_record_created_reference_mapping_unresolved','publication':{'actual_rendered_use':None,'current_public_parent_use':'pending_published_reader_confirmation','public_access_class':'unknown_not_inferred_from_object_delivery_or_registration','sitemap_admission':'HOLD_FOR_RENDERER_VISIBILITY_QUALIFICATION','new_standalone_url_created':False},'rights':{'reference_metadata_enrichment_authorized':True,'authorization_basis':'founder_reference_asset_enrichment_instruction_20261016','image_license':None,'asset_specific_rights_status':'unknown_not_inferred_from_database_or_bucket','new_publication_or_redistribution_rights_inferred':False},'brand_metadata_ref':'ability-asset-brand-context.json','provenance':provenance})
    records.sort(key=lambda r:(r['bucket'],r['object_key']));excluded.sort(key=lambda r:(r['bucket'],r['object_key']))
    missing={role:sorted(q for q in defs if (q,role) not in seen_question_roles) for role in ['question_image','example_image']}
    summary={'definition_rows':len(defs),'definition_assessment_ids':len({r['AId'] for n,r in defs.values()}),'exact_image_asset_records':len(records),'source_context_matched_assets':counts['semantic_context_matched'],'source_context_unmatched_assets':counts['semantic_context_unmatched'],'mapped_asset_records':counts['mapped_existing_abs_parent_candidate'],'mapped_parent_relationship_candidates':mapped_relationships,'mapped_existing_abs_parents':len(parents),'unmapped_asset_records':len(records)-counts['mapped_existing_abs_parent_candidate'],'parent_mapping_dispositions':{k:counts[k] for k in ['mapped_existing_abs_parent_candidate','assessment_not_in_qualified_abs_snapshot','noncanonical_filename_requires_explicit_alias','definition_not_in_reference_export','parent_mapping_conflicts_with_current_source']},'asset_roles':{k:counts[k] for k in ['question_image','example_image']},'held_for_publication_use_assets':len(records),'sitemap_admissions':0,'excluded_nonimage_objects':len(excluded),'reference_ids_missing_exact_role_object':missing,'patients_or_respondents_read':False,'source_payload_fields_allowlisted':True,'network_requests':0,'database_writes':0,'canonical_or_production_edits':0,'source_evidence':evidence}
    return records,excluded,summary

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--definitions',required=True,type=pathlib.Path);p.add_argument('--parent-join',required=True,type=pathlib.Path);p.add_argument('--objects',required=True,type=pathlib.Path);p.add_argument('--declared-url-probe',type=pathlib.Path);p.add_argument('--out',required=True,type=pathlib.Path);a=p.parse_args();out=a.out.resolve()
    if not out.is_relative_to(ROOT):p.error('Output must remain beneath '+str(ROOT))
    inputs=[x.resolve() for x in [a.definitions,a.parent_join,a.objects,a.declared_url_probe] if x];names=['ability-asset-metadata.jsonl','ability-asset-exclusions.jsonl','ability-asset-summary.json','ability-asset-brand-context.json']
    for name in names:
        dest=out/name
        if any(dest==i or dest.exists() and dest.samefile(i) for i in inputs):p.error('Output overlaps an input')
    records,excluded,summary=build(a.definitions,a.parent_join,a.objects,a.declared_url_probe);out.mkdir(parents=True,exist_ok=True)
    brand={'brand':'Pinnacle Blooms Network','enquiry_phone':'9100181181','cta':'For enquiries, call 9100181181.','placement':'Separate brand/enquiry metadata; never prepend this to image alt text or source Question/examples.'}
    blobs={names[0]:b''.join(encode(r)+b'\n' for r in records),names[1]:b''.join(encode(r)+b'\n' for r in excluded),names[3]:encode(brand)+b'\n'};summary['output_sha256']={k:sha(v) for k,v in blobs.items()};summary['adapter_sha256']=filehash(__file__);blobs[names[2]]=json.dumps(summary,sort_keys=True,ensure_ascii=False,indent=2).encode()+b'\n'
    with tempfile.TemporaryDirectory(prefix='.ability-asset-export-',dir=out) as td:
        for name,b in blobs.items():(pathlib.Path(td)/name).write_bytes(b)
        for name in [names[0],names[1],names[3],names[2]]:os.replace(pathlib.Path(td)/name,out/name)
    print(json.dumps({k:v for k,v in summary.items() if k not in ['source_evidence','reference_ids_missing_exact_role_object','output_sha256']},indent=2))
if __name__=='__main__':main()
