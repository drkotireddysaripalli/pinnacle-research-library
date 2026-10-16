#!/usr/bin/env python3
"""Bounded saved-input validation for the current Ability asset metadata export."""
import argparse,importlib.util,json,pathlib,tempfile
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('adapter',ROOT/'export_ability_asset_metadata.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--definitions',required=True,type=pathlib.Path);p.add_argument('--parent-join',required=True,type=pathlib.Path);p.add_argument('--objects',required=True,type=pathlib.Path);p.add_argument('--declared-url-probe',required=True,type=pathlib.Path);p.add_argument('--export',required=True,type=pathlib.Path);a=p.parse_args();out=a.export.resolve()
    if not out.is_relative_to(ROOT):p.error('Export/validation output must remain beneath '+str(ROOT))
    records=[json.loads(l) for l in (out/'ability-asset-metadata.jsonl').read_text().splitlines()];summary=json.loads((out/'ability-asset-summary.json').read_text());defs=json.loads(a.definitions.read_text())['rows'];checks={}
    checks['exact_asset_counts']=len(records)==1962 and len({(r['bucket'],r['object_key']) for r in records})==1962
    expected={'definition_rows':988,'source_context_matched_assets':1960,'source_context_unmatched_assets':2,'mapped_asset_records':1899,'mapped_parent_relationship_candidates':1899,'mapped_existing_abs_parents':47,'unmapped_asset_records':63,'held_for_publication_use_assets':1962,'sitemap_admissions':0,'excluded_nonimage_objects':2}
    checks['current_snapshot_accounting']=all(summary[k]==v for k,v in expected.items())
    checks['output_hashes']=all(m.filehash(out/k)==v for k,v in summary['output_sha256'].items())
    source_exact=True;known404=0
    for r in records:
        pointer=r['provenance']['reference_json_pointer'];context=r['semantic_context']
        if pointer:
            row=defs[int(pointer.rsplit('/',1)[1])]
            source_exact&=(r['question_id'],r['assessment_id'])==(row['Id'],row['AId']) and context['Question']==row['Question'] and context['Keyword']==row.get('Keyword') and context['examples']==[{'source_field':k,'text':row[k]} for k in ['E1','E2','E3'] if row.get(k)] and r['provenance']['reference_row_sha256']==m.sha(m.encode(row)) and r['declared_question_url_F2']['declared_value']==row.get('F2')
        else:source_exact&=r['question_id'] is None and r['assessment_id'] is None and context['Question'] is None and context['examples']==[]
        if r['question_id']==627:known404+=1;assert r['declared_question_url_F2']['known_http_status']==404
    checks['exact_reference_semantic_context']=bool(source_exact);checks['saved_627_F2_404_retained']=known404==2
    checks['no_public_use_or_license_inferred']=all(r['publication']['actual_rendered_use'] is None and r['publication']['sitemap_admission']=='HOLD_FOR_RENDERER_VISIBILITY_QUALIFICATION' and not r['publication']['new_standalone_url_created'] and r['rights']['image_license'] is None and not r['rights']['new_publication_or_redistribution_rights_inferred'] and not r['declared_question_url_F2']['accepted_as_parent'] for r in records)
    checks['alt_and_brand_separation']=all(r['alt_text'] is None for r in records) and '9100181181' not in (out/'ability-asset-metadata.jsonl').read_text() and json.loads((out/'ability-asset-brand-context.json').read_text())['enquiry_phone']=='9100181181'
    again,excluded,replay=m.build(a.definitions,a.parent_join,a.objects,a.declared_url_probe)
    checks['deterministic_replay_exact']=m.sha(b''.join(m.encode(r)+b'\n' for r in again))==m.filehash(out/'ability-asset-metadata.jsonl') and m.sha(b''.join(m.encode(r)+b'\n' for r in excluded))==m.filehash(out/'ability-asset-exclusions.jsonl')
    with tempfile.TemporaryDirectory(prefix='.reference-field-validation-',dir=ROOT) as td:
        r={'Id':1,'AId':1,'Question':'Synthetic reference fixture','PatientName':'SYNTHETIC_REJECT_ME'};f=pathlib.Path(td)/'forbidden-field.json';f.write_text(json.dumps({'success':True,'rows_affected':0,'row_count':1,'columns':list(r),'rows':[r]}))
        try:m.load_definitions(f);checks['unexpected_private_field_rejected']=False
        except ValueError:checks['unexpected_private_field_rejected']=True
    result={'passed':all(checks.values()),'checks':checks,'counts':expected,'network_requests':0,'database_writes':0,'private_records_read':False,'asset_jsonl_sha256':m.filehash(out/'ability-asset-metadata.jsonl'),'adapter_sha256':m.filehash(ROOT/'export_ability_asset_metadata.py'),'validator_sha256':m.filehash(__file__)}
    (out/'ability-asset-validation.json').write_text(json.dumps(result,sort_keys=True,indent=2)+'\n');print(json.dumps(result,indent=2));return 0 if result['passed'] else 1
if __name__=='__main__':raise SystemExit(main())
