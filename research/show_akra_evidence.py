import json,re,os,sys
from pathlib import Path
tmp=Path(os.environ['TEMP'])/'akra-review'
data=json.loads(Path('research/akra-2026-10-26/inventory.json').read_text(encoding='utf-8'))
todo=[x for x in data if x['status']=='candidate']
start=int(sys.argv[1]);end=int(sys.argv[2])
for n,x in enumerate(todo[start:end],start):
 d=json.loads((tmp/(str(x['id'])+'.json')).read_text(encoding='utf-8'))
 pages=json.loads((tmp/(str(x['id'])+'-site.json')).read_text(encoding='utf-8')) if (tmp/(str(x['id'])+'-site.json')).exists() else []
 text='\n'.join(p.get('text','') for p in pages)
 phone=re.sub(r'\D','',str(d.get('phone') or ''))[-8:]
 postcode=re.search(r'\b(\d{4})\b',x['address'])
 lines=text.splitlines()
 evidence=[line for line in lines if re.search(r'gårdbutik|gaardbutik|gårdsalg|stalddør|vejbod|selvbetjen|lukket|ophør|egen avl|egne dyr',line,re.I)]
 products=[w for w in ['kartofler','jordbær','grøntsager','æg','oksekød','lammekød','svinekød','kylling','æbler','pærer','most','honning','mel','ost','mælk','asparges','bær'] if re.search(r'\b'+w+r'\b',text,re.I)]
 addr=[line for line in lines if postcode and postcode[1] in line]
 print(f"{n} ID{x['id']} {x['name']} | {x['address']} | tel:{phone} checked:{bool(phone and phone in re.sub(chr(92)+'D','',text))}")
 print('URL',d.get('website') or d.get('facebook'),'|',','.join(products),'|ADDR',str(addr)[:180])
 print('EVIDENCE',' / '.join(evidence)[:550] if text else str(pages)[:120], '| AKRA',str(d.get('description',''))[:110])
