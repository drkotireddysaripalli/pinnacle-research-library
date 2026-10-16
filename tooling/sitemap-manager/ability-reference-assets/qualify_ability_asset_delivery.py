"""Bounded HEAD-only qualification of the exact exported Ability image objects."""
import argparse, collections, concurrent.futures, datetime, hashlib, json, pathlib, re
import urllib.error, urllib.parse, urllib.request

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def main():
    cli=argparse.ArgumentParser()
    cli.add_argument('--assets', required=True, type=pathlib.Path)
    cli.add_argument('--out', required=True, type=pathlib.Path)
    args=cli.parse_args()
    raw=args.assets.read_bytes()
    rows=[json.loads(line) for line in raw.splitlines() if line]
    assert len(rows)==1962 and len({r['asset_id'] for r in rows})==1962
    for row in rows:
        u=urllib.parse.urlsplit(row['exact_configured_public_url'])
        assert u.scheme=='https' and u.netloc=='images.pinnacleblooms.org'
        assert u.path.startswith(('/Ability/Questions/', '/Ability/Examples/')) and not u.query
    args.out.mkdir(parents=True, exist_ok=True)
    def check(row):
        url=row['exact_configured_public_url']
        out={'asset_id':row['asset_id'],'object_key':row['object_key'],'url':url,
             'method':'HEAD','observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
        try:
            req=urllib.request.Request(url,method='HEAD',headers={'User-Agent':'PinnacleSitemapAssetQualification/1.0'})
            with urllib.request.build_opener(NoRedirect).open(req,timeout=20) as r:
                out.update(status=r.status,content_type=r.headers.get('Content-Type'),
                    content_length=r.headers.get('Content-Length'),etag=r.headers.get('ETag'),
                    last_modified=r.headers.get('Last-Modified'),x_robots_tags=r.headers.get_all('X-Robots-Tag') or [])
        except urllib.error.HTTPError as e:
            out.update(status=e.code,location=e.headers.get('Location'),x_robots_tags=e.headers.get_all('X-Robots-Tag') or [])
        except Exception as e:
            out.update(status=None,error_type=type(e).__name__)
        tags=','.join(out.get('x_robots_tags',[]))
        veto=bool(re.search(r'\b(?:noindex|noimageindex)\b',tags,re.I) or re.search(r'(?:^|[,;])\s*none\s*(?:$|[,;])',tags,re.I))
        out['robots_veto']=veto
        out['delivery_verified']=out.get('status')==200 and (out.get('content_type') or '').lower().startswith('image/') and not veto
        out['sitemap_admission']='requires_visible_source_parent_and_publication_verification'
        return out
    records=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(check,rows):
            records.append(result)
            if len(records)%500==0:
                print(json.dumps({'checked':len(records),'delivery_verified':sum(x['delivery_verified'] for x in records)}),flush=True)
    payload=''.join(json.dumps(r,sort_keys=True,ensure_ascii=False)+'\n' for r in records)
    output=args.out/'delivery.jsonl';output.write_text(payload)
    summary={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'HEAD only; redirects not followed; no retries; four workers',
        'source_asset_sha256':hashlib.sha256(raw).hexdigest(),'objects_checked':len(records),
        'delivery_verified':sum(r['delivery_verified'] for r in records),
        'status_counts':dict(collections.Counter(str(r.get('status')) for r in records)),
        'robots_vetoes':sum(r['robots_veto'] for r in records),
        'delivery_receipt_sha256':hashlib.sha256(payload.encode()).hexdigest(),
        'media_bodies_downloaded':0,'sitemap_admissions':0,
        'boundary':'Delivery proof only; source mapping, actual rendered use and public parent eligibility remain separate.'}
    (args.out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2),flush=True)
if __name__=='__main__':
    main()
