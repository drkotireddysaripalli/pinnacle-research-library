"""Import the owner's workbook once. No billing data, inferred service roster or capacity.
The checked-in register is the page input; rerun only for a changed workbook.
"""
import argparse, hashlib, json, math, pathlib, re
from urllib.parse import urlparse
import openpyxl

site = pathlib.Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('workbook')
args = parser.parse_args()
source = pathlib.Path(args.workbook)
directory = json.loads((site/'src/data/centre-directory.json').read_text(encoding='utf-8'))
media_additions = json.loads((site/'src/data/centre-media-additions.json').read_text(encoding='utf-8'))['centres']
hfr = json.loads((site.parent/'verify-site/content/hfr-register.json').read_text(encoding='utf-8'))['rows']
conditions = json.loads((site/'reviews/CENTRE-SOURCE-CONDITIONS-20261001.json').read_text(encoding='utf-8'))
rows = list(openpyxl.load_workbook(source, read_only=True, data_only=True).active.values)
headers = rows.pop(0)
slug = lambda x: urlparse(str(x)).path.rstrip('/').split('/')[-1].lower()
aliases = {'best-autism-speech-aba-occupational-therapy-center-labbipet-vijyawada-ap-india':'labbipet',
 'best-autism-speech-aba-occupational-therapy-center-chanda-nagar-hyderbad-telangana-india':'chandanagar',
 'best-autism-speech-aba-occupational-therapy-center-california-usa':'usa'}
lookup = {slug(c['profileUrl']): c['id'] for c in directory}
lookup.update(aliases)
def clean(v):
    s = str(v).strip() if v is not None else ''
    return None if s.upper() in ('', 'NULL', 'NA', 'N/A', 'NONE', '0') else s
def number(v):
    s = re.sub(r'\D', '', clean(v) or '')
    if len(s)==12 and s.startswith('91'): s=s[2:]
    return '+91'+s if re.fullmatch(r'[6-9]\d{9}',s) else None
def link(v):
    s=clean(v)
    return s if s and urlparse(s).scheme=='https' and urlparse(s).netloc else None
def split(v):
    return list(dict.fromkeys(s.strip(' .') for s in re.split(r'[,;\n]+',clean(v) or '') if s.strip(' .')))
matched={}
for values in rows:
    r=dict(zip(headers,values)); key=lookup.get(slug(r.get('SEO URL')))
    if not key: raise ValueError('Unmapped workbook centre: '+str(r.get('Name')))
    if key in matched: raise ValueError('Duplicate join: '+key)
    matched[key]=r
excluded={'kadapa-exterior-43.jpg','attapur-exterior-17.jpg','attapur-interior-46-0.jpg','himayatnagar-interior-36-1.jpg','himayatnagar-interior-36-2.jpg'}
conditionmap={r['id']:r for r in conditions['entries']}
records=[]
for c in directory:
    r=matched.get(c['id'],{}); cid=c['id']; issues=[]
    address=clean(r.get('Address')) or c['address']; postcode=clean(r.get('Pincode'))
    postcode=postcode if postcode and re.fullmatch(r'\d{6}',postcode) else None
    if not postcode and address:
        codes=re.findall(r'(?<!\d)\d{6}(?!\d)',address)
        if len(set(codes))==1: postcode=codes[0]
    coords=None
    try:
        lat,lng=float(r['LAT']),float(r['LONG'])
        if -90<=lat<=90 and -180<=lng<=180 and lat and lng: coords={'latitude':lat,'longitude':lng}
    except (KeyError,ValueError,TypeError): pass
    if cid=='gachibowli':
        address=c['address']; coords=None; postcode='500032'
        issues.append('Workbook duplicates Chanda Nagar premises; established branch address retained, duplicate coordinates excluded.')
    if cid=='usa':
        address=None; postcode=None; coords=None
        path='/centers/best-autism-speech-aba-occupational-therapy-center-california-usa'
        issues.append('Historical California slug is retained for guidance, not a verified operating US clinic.')
    else: path=urlparse(c['profileUrl']).path
    if cid=='jublieehills': path='/centers/best-autism-speech-aba-occupational-therapy-center-jubilee-hills-hyderabad-telangana-india'
    if cid=='kurnool': excluded.update(p['file'] for p in c['images'] if p['kind']=='exterior')
    # Preserve established identity: workbook names/cities contain old branch aliases.
    if clean(r.get('Name')) and clean(r.get('Name'))!=c['name']: issues.append('Established branch label retained; workbook label recorded as source alias.')
    if postcode and cid in ('guntur','labbipet','eluru'):
        postcode=conditionmap[cid]['addressPostcodeText']
        issues.append('Public address postcode retained; separate workbook/HFR postcode differs.')
    nid=clean(r.get('NHA Registration Number'))
    evidence=next((e for e in hfr if e['id']==nid),None)
    if not evidence:
        normal=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
        evidence=next((e for e in hfr if normal(e['name']) in (normal(c['name']),normal(clean(r.get('Name')) or ''))),None)
    if cid=='gachibowli': evidence=None
    if cid=='kadapa': evidence=next(e for e in hfr if e['id']=='IN2810065144')
    images=[p for p in c['images'] if p['file'] not in excluded]
    additions=media_additions.get(cid,{})
    images=list({p['file']:p for p in images+additions.get('images',[])}.values())
    if additions.get('emblem'): c={**c,'emblem':additions['emblem']}
    rating=None
    try:
        value=float(r['Ratings']); count=int(r['Reviews'])
        if 0<value<=5 and count>=0: rating={'rating':value,'reviews':count,'source':'Owner-supplied centre workbook','snapshotDate':None}
    except (KeyError,ValueError,TypeError): pass
    condition=conditionmap.get(cid)
    if condition: issues.append(condition['condition'])
    held=cid in ('delhi','annanagar','nizamabad','jayanagar','indiranagar','marathahalli')
    records.append({**c,'profileUrl':'https://www.pinnacleblooms.org'+path,'address':address,
      'postalCode':postcode,'directTelephone':number(r.get('Center Number')) if cid!='usa' else None,
      'coordinates':coords,'catchmentLocalities':split(r.get('NearBy')) if cid!='usa' else [],
      'catchmentPostcodes':list(dict.fromkeys(re.findall(r'(?<!\d)\d{6}(?!\d)',clean(r.get('Near By Pincodes')) or ''))) if cid!='usa' else [],
      'googleBusinessUrl':link(r.get('GBURL')) or c['mapsUrl'],'reviewUrl':link(r.get('Google Review URL')),
      'reviewSnapshot':rating,
      'socialLinks':[x for x in [link(r.get('FBURL')),link(r.get('Lined In'))] if x],
      'images':images,'facilityEvidence':evidence,'sourceAlias':clean(r.get('Name')),
      'sourceNotes':issues,'sourceRecord':{'file':source.name,'rowId':r.get('Id'),'importedOn':'2026-10-07'},
      'operations':{'services':None,'languages':None,'openingHours':None,'appointmentCapacity':None,'owner':None,'operatingStatus':'not supplied'},
      'campaign':{'status':'held' if held else 'not changed by website release','landingPage':'https://www.pinnacleblooms.org'+path,'campaignId':None},
      'pageStatus':'location-status' if cid in ('delhi','usa') else 'centre-enquiry','nearbyCentres':[]})
def distance(a,b):
    r=math.pi/180;lat1,lat2=a['latitude']*r,b['latitude']*r
    s=math.sin((lat2-lat1)/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin((b['longitude']-a['longitude'])*r/2)**2
    return 6371*2*math.atan2(math.sqrt(s),math.sqrt(1-s))
for c in records:
    peers=[p for p in records if p['id']!=c['id'] and p['pageStatus']=='centre-enquiry' and p['coordinates'] and c['coordinates']]
    peers=sorted([(p,distance(c['coordinates'],p['coordinates'])) for p in peers],key=lambda x:x[1])
    c['nearbyCentres']=[{'id':p['id'],'name':p['name'],'url':p['profileUrl'],'city':p['city'],'distanceKm':round(km,1)} for p,km in peers[:3] if km<=100]
register={'updatedOn':'2026-10-07','source':{'file':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'records':len(rows)},'notes':['NearBy contains localities, not explicit neighbouring-centre relationships.','Distances are approximate straight-line distances from supplied coordinates; not driving times.','Operating details remain unknown where not supplied. Room counts are not appointment capacity.','Campaign holds are preserved. Website enquiries do not enable campaigns.'],'centres':records}
(site/'src/data/centre-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# The older directory remains a generated compatibility view for enrolment/navigation.
(site/'src/data/centre-directory.json').write_text(json.dumps([{k:v for k,v in c.items() if k not in ('facilityEvidence','sourceNotes','operations','sourceRecord','sourceAlias')} for c in records],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
routes={urlparse(c['profileUrl']).path:c['id'] for c in records}
(site/'deployment/centre-routes.mjs').write_text('// Generated from the maintained centre register.\nexport const CENTRE_DETAIL_ROUTES='+json.dumps(routes,separators=(',',':'))+';\n',encoding='utf-8')
print(json.dumps({'workbookRecords':len(rows),'centrePages':len(records),'directPhones':sum(bool(c['directTelephone']) for c in records),'premisesPhotos':sum(len(c['images']) for c in records),'heldCampaigns':sum(c['campaign']['status']=='held' for c in records)}))
