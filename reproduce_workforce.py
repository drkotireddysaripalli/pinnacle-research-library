"""Reproduce the source-audited institutional geography study.

python reproduce_workforce.py --source RCI_source.pdf --output-dir reproduced
Without --source, downloads the source identified in workforce_source_manifest.json.
Requires Python 3.10+ and pdfplumber. Uses only the official source, this script,
workforce_source_manifest.json and workforce_label_crosswalk.csv beside the script.
No course-capacity file or proprietary dataset is used.
"""
import argparse,collections,csv,hashlib,json,math,re,statistics,urllib.request
from pathlib import Path
import pdfplumber

HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source',type=Path)
parser.add_argument('--output-dir',type=Path,default=HERE/'reproduced')
args=parser.parse_args();OUT=args.output_dir.resolve();OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((HERE/'workforce_source_manifest.json').read_text(encoding='utf-8'))
source=args.source
if source is None:
 source=OUT/'RCI_approved_institutions_2026-02-04.pdf'
 if not source.exists():urllib.request.urlretrieve(manifest['source_url'],source)
source=source.resolve()
digest=hashlib.sha256(source.read_bytes()).hexdigest()
if digest!=manifest['source_sha256']:raise ValueError('Source checksum differs from the published study snapshot.')
crosswalk=list(csv.DictReader((HERE/'workforce_label_crosswalk.csv').open(encoding='utf-8-sig')))
labels={r['institute_code']:r for r in crosswalk}
def norm(s):return re.sub('[^A-Z0-9]','',s.upper())
def write(name,rows):
 with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
prefix={'AP':'Andhra Pradesh','AR':'Arunachal Pradesh','AS':'Assam','BR':'Bihar','CH':'Chandigarh','CG':'Chhattisgarh','DL':'Delhi','GO':'Goa','GJ':'Gujarat','HR':'Haryana','HP':'Himachal Pradesh','JK':'Jammu and Kashmir','JKH':'Jharkhand','KK':'Karnataka','KL':'Kerala','LDK':'Ladakh','MP':'Madhya Pradesh','MH':'Maharashtra','MN':'Manipur','MG':'Meghalaya','MZ':'Mizoram','OR':'Odisha','PD':'Puducherry','PB':'Punjab','RJ':'Rajasthan','SK':'Sikkim','TN':'Tamil Nadu','TL':'Telangana','TR':'Tripura','UP':'Uttar Pradesh','UT':'Uttarakhand','WB':'West Bengal'}
absent=['Andaman and Nicobar Islands','Dadra and Nagar Haveli and Daman and Diu','Lakshadweep','Nagaland']
all_states=sorted(set(prefix.values())|set(absent))
aliases={norm(s):s for s in all_states}
aliases.update({norm(a):b for a,b in [('CHATTISGARH','Chhattisgarh'),('ORISSA','Odisha'),('JAMMU & KASHMIR','Jammu and Kashmir'),('PONDICHERRY','Puducherry'),('UTTARANCHAL','Uttarakhand'),('UTTRANCHAL','Uttarakhand'),('NCT OF DELHI','Delhi')]})
code_re=re.compile(r'^[A-Z]{2,3}\d{3}$')
events=[];table_records={};geo={}
with pdfplumber.open(source) as pdf:
 if len(pdf.pages)!=113:raise ValueError('Expected 113 source pages.')
 for number,page in enumerate(pdf.pages,1):
  words=page.extract_words(x_tolerance=1,y_tolerance=2)
  groups=collections.defaultdict(list)
  page_codes=sorted([w for w in words if code_re.fullmatch(w['text']) and w['x0']<95],key=lambda w:w['top'])
  for pos,word in enumerate(page_codes):
   end=page_codes[pos+1]['top']-1 if pos+1<len(page_codes) else page.height-30
   text=page.crop((94.5,word['top']-1,251.4,end)).extract_text(x_tolerance=1,y_tolerance=2) or ''
   serial=[w['text'] for w in words if w['x0']<60 and abs(w['top']-word['top'])<2 and re.fullmatch(r'\d+\.?',w['text'])]
   if len(serial)!=1:raise ValueError(f'Unexpected serial at {word["text"]}')
   geo[word['text']]={'source_serial':int(serial[0].strip('.')),'page':number,'text':text}
  for word in words:
   groups[round(word['top']/2)*2].append(word)
   if code_re.fullmatch(word['text']) and word['x0']<95:events.append({'kind':'code','code':word['text'],'page':number,'y':word['top']})
  for y,line in groups.items():
   line.sort(key=lambda w:w['x0'])
   if line[0]['x0']<60:
    for cut in range(1,min(9,len(line))+1):
     raw=' '.join(w['text'] for w in line[:cut])
     if norm(raw) in aliases:
      events.append({'kind':'heading','state':aliases[norm(raw)],'raw':raw,'page':number,'y':y});break
  for table in page.find_tables():
   for row in table.extract(x_tolerance=1,y_tolerance=2):
    for j,cell in enumerate(row):
     if cell and code_re.fullmatch(cell.strip()):table_records[cell.strip()]=row[j+1] or ''
events.sort(key=lambda e:(e['page'],e['y'],e['kind']!='heading'))
state=None;records=[];validation=[];heading_rows=[]
for e in events:
 if e['kind']=='heading':
  state=e['state'];heading_rows.append({'source_page':e['page'],'source_y_top_pt':e['y'],'source_heading':e['raw'],'canonical_state_ut':state});continue
 code=e['code'];g=geo[code];full=table_records.get(code) or g['text'];label=labels[code]['final_label']
 clean=re.split(r'(?i)\b(?:Tel(?:ephone)?\.?\s*(?:No)?|Mob(?:ile)?\.?\s*(?:No)?|Fax|E[ -]?mail|Mail\s*(?:Id|ID)|Website|Web\s*Site)\b|www\.|https?://',full,maxsplit=1)[0].strip()
 clean=re.sub(r'[ \t]+',' ',clean).strip(' ,;\n')
 clean=re.split(r'(?i)\b(?:contact|phone|ph\.?\s*no)\b|[\w.+%\-]+@[\w.\-]+|\b\d{9,}\b|\b\d{3,5}[-– ]\d{6,8}\b',clean,maxsplit=1)[0].strip(' ,;\n')
 expected=prefix[re.match('[A-Z]+',code).group()]
 matched=norm(label) in norm(full)
 if not matched or expected!=state:raise ValueError(f'Source validation failed for {code}')
 records.append({'source_serial':g['source_serial'],'institute_code':code,'institution_label':label,'source_name_address_excerpt':clean.replace('\n',' | '),'state_ut':state,'source_page':e['page'],'source_y_top_pt':round(e['y'],3),'listing_scope':'listed_in_2026-02-04_register; current_activity_not_assessed'})
 validation.append({'institute_code':code,'source_page':e['page'],'source_serial':g['source_serial'],'source_heading_state':state,'prefix_crosscheck_state':expected,'heading_prefix_agree':'True','final_label_source_match':'exact_normalized_substring','name_extraction_route':'table_cell' if code in table_records else 'coordinate_crop'})
N=len(records)
assert N==1068 and len({r['institute_code'] for r in records})==1068
assert sorted(r['source_serial'] for r in records)==list(range(1,1069))
assert set(labels)=={r['institute_code'] for r in records}
assert all('@' not in str(r) and 'www.' not in str(r).lower() and 'http' not in str(r).lower() for r in records)
write('workforce_institutions_audited.csv',records);write('workforce_record_validation.csv',validation);write('workforce_source_headings.csv',heading_rows);write('workforce_label_crosswalk.csv',crosswalk)
changes=[{'institute_code':r['institute_code'],'field':'institution_label','old_value':r['prior_label'],'new_value':r['final_label'],'source_page':r['source_page'],'reason':'source text restores missing name or removes misplaced address tokens'} for r in crosswalk if r['prior_label']!=r['final_label']]
changes.append({'institute_code':'TN001','field':'source_serial','old_value':'not extracted by initial full-stop-only rule','new_value':'714','source_page':73,'reason':'source printed serial lacks terminal full stop; final parser permits it'})
write('workforce_change_log.csv',changes)
counts=collections.Counter(r['state_ut'] for r in records)
for s in all_states:counts.setdefault(s,0)
uts={'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'}
ordered=sorted(counts.items(),key=lambda x:(-x[1],x[0]));K=len(counts);cum=0;states=[]
for rank,(s,n) in enumerate(ordered,1):
 cum+=n;states.append({'rank_order':rank,'state_ut':s,'jurisdiction_type':'Union territory' if s in uts else 'State','institutions_listed':n,'share_percent':100*n/N,'cumulative_count_descending':cum,'cumulative_percent_descending':100*cum/N,'listing_status':'listed' if n else 'not_present_in_source'})
write('workforce_state_counts.csv',states)
asc=sorted(counts.items(),key=lambda x:(x[1],x[0]));cum=0;lorenz=[{'jurisdictions_cumulative':0,'jurisdiction_fraction':0,'institutions_cumulative':0,'institution_fraction':0}]
for j,(s,n) in enumerate(asc,1):
 cum+=n;lorenz.append({'jurisdictions_cumulative':j,'jurisdiction_fraction':j/K,'institutions_cumulative':cum,'institution_fraction':cum/N})
write('workforce_lorenz.csv',lorenz)
HHI=sum((n/N)**2 for n in counts.values());gini=sum(abs(a-b) for a in counts.values() for b in counts.values())/(2*K*N)
metrics={'institution_count':N,'jurisdiction_count':K,'represented_jurisdictions':sum(v>0 for v in counts.values()),'states_represented':sum(v>0 and s not in uts for s,v in counts.items()),'UTs_represented':sum(v>0 and s in uts for s,v in counts.items()),'absent_jurisdictions':absent,'top2_n':sum(n for s,n in ordered[:2]),'top2_percent':sum(n for s,n in ordered[:2])*100/N,'top5_n':sum(n for s,n in ordered[:5]),'top5_percent':sum(n for s,n in ordered[:5])*100/N,'top10_n':sum(n for s,n in ordered[:10]),'top10_percent':sum(n for s,n in ordered[:10])*100/N,'median_all36':statistics.median(counts.values()),'median_nonzero32':statistics.median(n for n in counts.values() if n),'gini_all36':gini,'HHI_unit_scale':HHI,'HHI_10000_scale':HHI*10000,'effective_jurisdictions':1/HHI,'state_total':sum(v for s,v in counts.items() if s not in uts),'UT_total':sum(v for s,v in counts.items() if s in uts),'jurisdictions_1_to_5':sum(1<=v<=5 for v in counts.values()),'institutions_jurisdictions_1_to_5':sum(v for v in counts.values() if 1<=v<=5),'bottom18_n':sum(n for s,n in asc[:18]),'bottom18_percent':sum(n for s,n in asc[:18])*100/N,'gini_nonzero32':sum(abs(a-b) for a in counts.values() if a>0 for b in counts.values() if b>0)/(2*32*N)}
metrics['validation']={'codes_unique':True,'serials_complete':True,'all_heading_prefix_agree':True,'all_final_labels_source_match':True,'no_contact_addresses':True,'sum_counts':sum(r['institutions_listed'] for r in states)==N,'rows_checked':N,'table_cell_names':len(table_records),'coordinate_crop_names':N-len(table_records)}
(OUT/'workforce_metrics.json').write_text(json.dumps(metrics,indent=2),encoding='utf-8')
(OUT/'workforce_source_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(json.dumps({'records':N,'source_sha256':digest,'validation':metrics['validation'],'output_dir':str(OUT)},indent=2))
