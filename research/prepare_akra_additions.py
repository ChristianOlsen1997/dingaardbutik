"""Build additions only from manually accepted evidence and exact DAR matches."""
import json,re,os,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parent;R=ROOT/'akra-2026-10-26';TMP=Path(os.environ['TEMP'])/'akra-review'
a=json.loads((R/'accepted.json').read_text(encoding='utf-8'));inv=json.loads((R/'inventory.json').read_text(encoding='utf-8'))
def slug(s):return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',s.lower().replace('æ','ae').replace('ø','oe').replace('å','aa')).encode('ascii','ignore').decode()).strip('-')
baseline=json.loads((ROOT/'farm-research.json').read_text(encoding='utf-8'))
for date in ['2026-09-30','2026-10-04','2026-10-11','2026-10-26']:
 baseline += [x['farm'] for x in json.loads((ROOT/f'additions-{date}.json').read_text(encoding='utf-8'))]
old=[{'id':f[0],'name':f[1],'address':f[3],'postalCode':f[4]} for f in baseline]
ids={x['id'] for x in old};rows=[];addresses=[];fallbacks={};review=[]
excluded={54:'Egen side oplyser, at den tidligere gårdbutik er ophørt; nu kun æggesalg.',409:'Primært webshop/lagerafhentning; fysisk gårdbutik ikke dokumenteret.',895:'Egen side angiver ophør.',1358:'Månebutikken er lukket; abonnementsordning er ikke en åben gårdbutik.',988:'Egen side oplyser, at der ikke er en almindelig åben gårdbutik.',1132:'Nuværende udvalg er dyrefoder og andre produkter; fødevarer fra gården er ikke dokumenteret.',712:'Fisker; uden for den ønskede afgrænsning.',1143:'Fisk/skaldyrsproducent; uden for den ønskede afgrænsning.',262:'Adressekonflikt: Akra angiver Klørupvej 13, andre kilder Gamle Viborgvej 210; butikkens aktuelle besøgsadresse er ikke bekræftet.'}
duplicates={60:'fjand',894:'aarstiderne',1792565753650:'hvolbaekgaard'}
for x in inv:
 key=str(x['id']);decision=a.get(key);d={};pages=[]
 if (TMP/f'{key}.json').exists():d=json.loads((TMP/f'{key}.json').read_text(encoding='utf-8'))
 if (TMP/f'{key}-site.json').exists():pages=json.loads((TMP/f'{key}-site.json').read_text(encoding='utf-8'))
 sources=list(dict.fromkeys((decision or {}).get('sources',[])+[p['url'] for p in pages if p.get('text') and 'facebook.com' not in p['url']]))
 if decision:
  geo=json.loads((R/'dar'/f'{key}.json').read_text(encoding='utf-8'));m=geo['matches'][0];official=m['official']
  name=decision.get('name',x['name']);ident=slug(name)
  if ident in ids:raise ValueError('Duplicate ID '+ident)
  ids.add(ident)
  text='\n'.join(p.get('text','') for p in pages);phone=re.sub(r'\D','',str(d.get('phone')or''))[-8:]
  # Do not join all digits in a page, which can create false cross-line phone matches.
  digits=re.sub(r'[\s().+\-]','',text)
  phone=decision.get('phone',phone if len(phone)==8 and phone in digits else '')
  street=m['vejnavn']+' '+m['husnr'];note=decision.get('note','')
  if decision.get('darStreet'):
   fallbacks[ident]=street;street=decision.get('address',x['address']).split(',')[0]
   note+=' Besøgsadressen følger butikkens egen side; kortpositionen bruger DAR-bygningen '+decision['darStreet']+'.'
  website=decision.get('website',d.get('website')or d.get('facebook')or'')
  source=sources[0] if sources else website
  assert source and website
  farm=[ident,name,geo['region'],street,m['postnr'],official['postnummer']['navn'],phone,website,decision['description'],source]
  rows.append({'farm':farm,'sources':sources,'note':note.strip(),'akraId':x['id']})
  addresses.append({'id':ident,'url':geo['url'],'matches':geo['matches']})
  x.update(status='accepted',reason='Gårdbutik/gårdsalg bekræftet i de angivne kilder; DAR-adresse kontrolleret.')
 elif x['id'] in duplicates:x.update(status='duplicate',reason=duplicates[x['id']])
 elif x['id'] in excluded:x.update(status='deferred' if x['id']==262 else 'excluded',reason=excluded[x['id']])
 elif x['status']=='candidate':
  text='\n'.join(p.get('text','') for p in pages)
  x.update(status='deferred',reason='Ikke tilføjet: aktuelt fysisk gårdsalg, sortiment eller besøgsadresse kunne ikke bekræftes tilstrækkeligt i de undersøgte kilder.' if text else 'Ikke tilføjet: ingen læsbar egen kilde; link mangler, kræver login eller kunne ikke hentes.')
 review.append({'id':x['id'],'name':x['name'],'address':x['address'],'status':x['status'],'reason':x['reason'],'sources':sources or [p['url'] for p in pages if p.get('url')],'website':d.get('website')or d.get('facebook')or'','checks':[{'url':p['url'],'result':'read' if p.get('text') else p.get('error','empty')} for p in pages]})
(ROOT/'additions-akra-2026-10-26.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'address-additions-akra-2026-10-26.json').write_text(json.dumps(addresses,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(R/'fallbacks.json').write_text(json.dumps(fallbacks,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(R/'review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
from collections import Counter
print(Counter(x['status'] for x in review))
print('New',len(rows),'phones',sum(bool(x['farm'][6]) for x in rows))
for row in rows:
 f=row['farm']
 for o in old:
  if slug(f[3])==slug(o['address']) and f[4]==o['postalCode']:print('DUPLICATE ADDRESS',f[0],o['id'])
