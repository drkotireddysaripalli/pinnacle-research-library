"""Authoritative public-target Id/F25 projection. No network or operational writes."""
import collections, hashlib, json, re, sys
from pathlib import Path
from urllib.parse import urlsplit, parse_qs

VERSION = 'mirracles-authoritative-legacy-ids-20261009'

def youtube(value):
    if not value: return None
    u=urlsplit(str(value))
    if u.scheme!='https' or u.hostname not in ('www.youtube.com','youtube.com','www.youtube-nocookie.com','youtu.be'): return None
    key=u.path.rsplit('/',1)[-1] if u.hostname=='youtu.be' or u.path.startswith(('/embed/','/shorts/')) else parse_qs(u.query).get('v',[None])[0]
    return key if key and re.fullmatch(r'[\w-]{11}',key) else None

def validate_map(legacy_ids, records, alias_paths):
    known={str(r['id']):r for r in records}
    previous={p.split('/')[2]:str(target) for p,target in alias_paths.items()}
    for old,target in legacy_ids.items():
        if not isinstance(old,str) or not isinstance(target,str) or not re.fullmatch(r'[0-9]+',old) or not re.fullmatch(r'[0-9]+',target): raise ValueError('Invalid numeric identity mapping')
        if target not in known or old==target: raise ValueError('Missing canonical target or identity chain')
        if old in known: raise ValueError('Legacy identity shadows a primary record')
        if old in previous and previous[old]!=target: raise ValueError('Conflicting recorded path identity')
    return legacy_ids

def build(projection, catalogue, details):
    known={str(r['id']):r for r in catalogue['records']}
    counts=collections.Counter(); legacy_ids={}; seen={}
    for row in projection['projection']:
        old=str(row.get('Id') or '');target=str(row.get('F25') or '')
        if not re.fullmatch(r'[0-9]+',old): raise ValueError('Invalid source primary identity')
        if old in seen and seen[old]!=target: raise ValueError('Conflicting authoritative source identity')
        seen[old]=target
        if target not in known:
            counts['noExistingPublicTarget']+=1;continue
        if old==target: counts['alreadyCanonical']+=1;continue
        record=details[target]
        original_player=youtube(row.get('YTUrl'));published_player=youtube(record.get('player'))
        if original_player and published_player and original_player!=published_player:
            counts['videoIdentityConflict']+=1;continue
        if record.get('player') and not published_player: raise ValueError('Invalid existing public player identity')
        if row.get('YTUrl') and not original_player:
            counts['unrecognizedSourcePlayer']+=1
        if record.get('poster') and row.get('F2') and str(row['F2']) not in record['poster']:
            counts['thumbnailRepresentationDifference']+=1
        legacy_ids[old]=target
        counts['sitemapTargets' if record.get('inSitemap') else 'archiveTargets']+=1
        if original_player and published_player:counts['matchingVideoIdentity']+=1
    validate_map(legacy_ids,catalogue['records'],catalogue.get('aliasPaths',{}))
    counts['acceptedLegacyIds']=len(legacy_ids)
    return {'version':VERSION,'legacyIds':legacy_ids,'provenance':{'capturedAt':projection['at'],'source':'Read-only Id/F25 projection from the existing mirracle_view_v1-backed publication store; restricted to already-public catalogue records','sourceSha256':projection['sha256'],'sourceRows':projection['rows'],'counts':dict(counts),'eligibility':'Existing public catalogue membership only; null RS is not a publication or consent decision','identityPolicy':'Authoritative Id/F25 relation; reject ambiguous IDs and competing populated YouTube identities. Mutable or incomplete thumbnails do not change a matching video identity.'}}

if __name__=='__main__':
    source_path=Path(sys.argv[1]);folder=Path(__file__).parent/'data'
    catalogue=json.loads((folder/'catalogue.json').read_text(encoding='utf-8'));details={}
    for path in folder.glob('details-*.json'):details.update(json.loads(path.read_text(encoding='utf-8')))
    projection=json.loads(source_path.read_text(encoding='utf-8-sig'))
    output=build(projection,catalogue,details)
    output['provenance']['projectionFileSha256']=hashlib.sha256(source_path.read_bytes()).hexdigest()
    target=folder/'authoritative-legacy-ids.json'
    target.write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8',newline='\n')
    catalogue['legacyIds']=output['legacyIds']
    (folder/'catalogue.json').write_text(json.dumps(catalogue,ensure_ascii=False,separators=(',',':')),encoding='utf-8',newline='\n')
    provenance_path=folder/'provenance.json';provenance=json.loads(provenance_path.read_text(encoding='utf-8'))
    provenance['authoritativeLegacyIds']={'source':target.name,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),**output['provenance']}
    provenance_path.write_text(json.dumps(provenance,ensure_ascii=False,separators=(',',':')),encoding='utf-8',newline='\n')
    print(json.dumps({'counts':output['provenance']['counts'],'catalogueBytes':(folder/'catalogue.json').stat().st_size,'catalogueSha256':hashlib.sha256((folder/'catalogue.json').read_bytes()).hexdigest()}))
