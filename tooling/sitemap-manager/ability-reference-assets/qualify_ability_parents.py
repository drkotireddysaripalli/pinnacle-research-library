#!/usr/bin/env python3
"""Read-only live parent preflight; not a rendering/admission substitute."""
import argparse,json,pathlib,urllib.request,urllib.error,urllib.parse,urllib.robotparser,hashlib,datetime,concurrent.futures,re
from html.parser import HTMLParser
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*a,**k):return None
class Head(HTMLParser):
 def __init__(self):super().__init__();self.canonicals=[];self.robots=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link' and 'canonical' in a.get('rel','').lower().split():self.canonicals.append(a.get('href',''))
  if tag=='meta' and a.get('name','').lower() in ('robots','googlebot','bingbot'):self.robots.append({'name':a['name'],'content':a.get('content','')})
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def norm(s):return urllib.parse.unquote(s).rstrip('/')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--index',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);a=ap.parse_args()
 urls=[r['parent_url'] for r in json.loads(a.index.read_text())['parents']];assert len(set(urls))==len(urls)==47
 opener=urllib.request.build_opener(NoRedirect);req=urllib.request.Request('https://www.pinnacleblooms.org/robots.txt',headers={'User-Agent':'Pinnacle-Sitemap-Qualification/1.0'})
 with opener.open(req,timeout=25) as r: rb=r.read();assert r.status==200
 rp=urllib.robotparser.RobotFileParser();rp.parse(rb.decode().splitlines())
 def check(u):
  out={'url':u,'checked_at':now()}
  try:
   with urllib.request.build_opener(NoRedirect).open(urllib.request.Request(u,headers={'User-Agent':'Pinnacle-Sitemap-Qualification/1.0'}),timeout=30) as r:
    data=r.read();headers=r.headers;out.update(status=r.status,content_type=headers.get('Content-Type'),bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),x_robots=headers.get_all('X-Robots-Tag') or [])
   p=Head();p.feed(data.decode('utf-8','replace'));out.update(canonicals=p.canonicals,meta_robots=p.robots)
   directives=','.join(out['x_robots']+[x['content'] for x in p.robots]).lower();veto=bool(re.search(r'(^|[\s,;:])(noindex|none)($|[\s,;])',directives))
   crawl={bot:rp.can_fetch(bot,u) for bot in ['Googlebot','Bingbot','Googlebot-Image']};out['crawl_allowed']=crawl
   out['canonical_consistent']=len(p.canonicals)<=1 and all(norm(urllib.parse.urljoin(u,x))==norm(u) for x in p.canonicals)
   out['passed']=out['status']==200 and 'text/html' in (out['content_type'] or '').lower() and not veto and all(crawl.values()) and out['canonical_consistent']
  except Exception as e:out.update(passed=False,error=type(e).__name__+': '+str(e))
  return out
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(check,urls))
 result={'at':now(),'read_only':True,'requests':48,'robots_sha256':hashlib.sha256(rb).hexdigest(),'parents':rows,'passed':all(r['passed'] for r in rows),'passed_count':sum(r['passed'] for r in rows),'count':len(rows),'limits':['Existing-parent delivery preflight only; no illustration rendered or sitemap admission established','Absent canonical is recorded, not invented']};a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:result[k] for k in ['count','passed_count','passed']}));print(json.dumps([r for r in rows if not r['passed']],ensure_ascii=False))
if __name__=='__main__':main()
