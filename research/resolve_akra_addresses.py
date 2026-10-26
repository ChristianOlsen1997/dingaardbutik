"""Resolve manually reviewed Akra candidates against DAR, with resumable caches."""
import json,re,os,unicodedata,urllib.request,urllib.parse,concurrent.futures
from pathlib import Path
from pyproj import Transformer
ROOT=Path(__file__).resolve().parent
REVIEW=ROOT/'akra-2026-10-26'
TMP=Path(os.environ['TEMP'])/'akra-review'
accepted=json.loads((REVIEW/'accepted.json').read_text(encoding='utf-8'))
inventory=json.loads((REVIEW/'inventory.json').read_text(encoding='utf-8'))
transform=Transformer.from_crs(25832,4326,always_xy=True)
def norm(s):
 s=s.lower().replace('gamle ','gl ').replace('gammel ','gl ').replace('sønder ','sdr ').replace('nørre ','nr ')
 return re.sub(r'[^a-z0-9æøå]','',unicodedata.normalize('NFKD',s).replace('\u0301',''))
def get(url):
 with urllib.request.urlopen(url,timeout=30) as r:return json.load(r)
def region(code):
 n=int(code)
 if n in (101,147,151,153,155,157,159,161,163,165,167,169,173,175,183,185,187,190,201,210,217,219,223,230,240,250,260,270,400):return 'hovedstaden'
 if n in (773,787,810,813,820,825,840,846,849,851,860):return 'nordjylland'
 if n in (615,657,661,665,671,706,707,710,727,730,740,741,746,751,756,760,766,779,791):return 'midtjylland'
 if n in (410,420,430,440,450,461,479,480,482,492,510,530,540,550,561,563,573,575,580,607,621,630):return 'syddanmark'
 if n in (253,259,265,269,306,316,320,326,329,330,336,340,350,360,370,376,390):return 'sjaelland'
 raise ValueError('Unknown municipality '+str(n))
def run(x):
 key=str(x['id']);a=accepted[key];cache=REVIEW/'dar'/f'{key}.json'
 if cache.exists():
  cached=json.loads(cache.read_text(encoding='utf-8'));cached['region']=region(cached['matches'][0]['official']['navngivenvejkommunedel']['kommune']);cache.write_text(json.dumps(cached,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');return cached
 address=a.get('address',x['address']);m=re.fullmatch(r'(.+?),\s*(\d{4})\s+(.+)',address)
 if not m:return {'akraId':key,'error':'Unstructured address: '+address}
 street,postal,city=m.groups();street=street.split(",")[0].strip();street=a.get("darStreet",street)
 url='https://adressevaelger.dk/husnumre/soeg?'+urllib.parse.urlencode({'tekst':street+', '+postal,'token':'adressevaelger123'})
 try:
  hits=get(url)['fund'];matches=[]
  for hit in hits:
   if hit['type']!='husnummer':continue
   detail='https://adressevaelger.dk/husnumre/'+hit['id']+'?token=adressevaelger123'
   house=get(detail)['husnummer'];official=house['vejnavn']+' '+house['husnummertekst']
   if norm(official)!=norm(street) or house['postnummer']['postnr']!=postal:continue
   lon,lat=transform.transform(*house['adgangspunkt']['geometri']['coordinates'])
   matches.append({'vejnavn':house['vejnavn'],'husnr':house['husnummertekst'],'postnr':postal,'x':lon,'y':lat,'betegnelse':house['adgangsadressebetegnelse'],'href':detail,'official':house})
  if len(matches)!=1:return {'akraId':key,'error':f'{address}: {len(matches)} exact matches','hits':hits}
  result={'akraId':key,'url':url,'matches':matches,'region':region(matches[0]['official']['navngivenvejkommunedel']['kommune'])}
  cache.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');return result
 except Exception as e:return {'akraId':key,'error':str(e)}
(REVIEW/'dar').mkdir(exist_ok=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=list(pool.map(run,[x for x in inventory if str(x['id']) in accepted]))
errors=[x for x in results if 'error'in x]
(REVIEW/'address-errors.json').write_text(json.dumps(errors,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Resolved',len(results)-len(errors),'of',len(results))
for e in errors:print(e['akraId'],e['error'])
