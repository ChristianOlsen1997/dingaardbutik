"""Read-only discovery from Akra's public map; decisions reviewed separately."""
import concurrent.futures,json,re,unicodedata,urllib.request,time,os
from pathlib import Path
ROOT=Path.cwd()
OUT=ROOT/'research/akra-2026-10-26'
OUT.mkdir(exist_ok=True)
TMP=Path(os.environ['TEMP'])/'akra-review'
TMP.mkdir(exist_ok=True)
data=json.loads((Path(os.environ['TEMP'])/'akra-public-map.json').read_text(encoding='utf-8-sig'))
old=json.loads((ROOT/'src/data/locations.ts').read_text(encoding='utf-8').split('export const locations: Location[] = ')[1].strip().removesuffix(';'))
def norm(s):
 return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s.lower().replace('ø','o').replace('æ','ae').replace('aa','å')).encode('ascii','ignore').decode())
def addrkey(s):
 m=re.search(r'\b(\d{4})\b',s)
 street=s.split(',')[0]
 return norm(street)+(m[1] if m else '')
inventory=[]
for x in data:
 row={k:x.get(k) for k in ['id','name','address','type','lat','lng']}
 match=next((y for y in old if norm(x['name'])==norm(y['name']) or addrkey(x['address'])==norm(y['address'])+y['postalCode']),None)
 if match: row.update(status='duplicate',reason=match['id'])
 elif x.get('is_active') is False or x['id'] in [73,839] or 'QA ' in x['name']: row.update(status='excluded',reason='Inactive, removed or test entry')
 elif x['type']=='specialbutik' and not re.search(r'gårdbutik|gaardbutik',x['name'],re.I): row.update(status='excluded',reason='Specialist retail, not a farm shop')
 elif re.search(r'fisk|røgeri|hummer|shellfish|bryggeri|bryghus|destilleri|winery|vingård|vingaard|vinhandel|vinmageri|vineri| wines| vin$| vin |chokolade|biavl|honning|bigård|bageri|bageren|mølleri|valsemølle|oliemølle|slagter|slagtehus',x['name'],re.I) and not re.search(r'gårdbutik|gaardbutik|gårdsalg|vejbod',x['name'],re.I):
  row.update(status='excluded',reason='Specialised producer or retail; outside requested farm-shop scope')
 else: row.update(status='candidate',reason='')
 inventory.append(row)
def details(row):
 p=TMP/(str(row['id'])+'.json')
 if p.exists(): return
 try:
  req=urllib.request.Request('https://qmasgltmzzkougkquwet.supabase.co/rest/v1/rpc/get_shop_details',data=json.dumps({'shop_id':row['id']}).encode(),headers={'apikey':'sb_publishable_lUOMYxCGFUDs569VuiQf7g_tLzzhqil','Content-Type':'application/json'})
  r=json.load(urllib.request.urlopen(req,timeout=25))['details']
  slim={k:r.get(k) for k in ['website','facebook','phone','products','description','story','seasonNote']}
  p.write_text(json.dumps(slim,ensure_ascii=False),encoding='utf-8')
 except Exception as e: p.write_text(json.dumps({'error':str(e)}),encoding='utf-8')
 time.sleep(.15)
todo=[r for r in inventory if r['status']=='candidate']
(OUT/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Candidates:',len(todo),'duplicates:',sum(r['status']=='duplicate' for r in inventory),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for i,_ in enumerate(pool.map(details,todo),1):
  if i%40==0: print('Profiles reviewed:',i,flush=True)
print('DONE')
