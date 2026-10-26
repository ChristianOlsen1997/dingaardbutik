"""Fetch public farm websites and up to two relevant same-site pages. No login."""
import concurrent.futures,json,re,urllib.request,urllib.parse,os
from html.parser import HTMLParser
from pathlib import Path
TMP=Path(os.environ['TEMP'])/'akra-review'
class Extract(HTMLParser):
 def __init__(self): super().__init__(); self.text=[]; self.links=[]; self.skip=0
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ['script','style','noscript','svg']: self.skip+=1
  if t=='a' and a.get('href'): self.links.append(a['href'])
 def handle_endtag(self,t):
  if t in ['script','style','noscript','svg'] and self.skip:self.skip-=1
 def handle_data(self,d):
  if not self.skip and d.strip():self.text.append(d.strip())
def get(url):
 parts=urllib.parse.urlsplit(url)
 host=parts.hostname.encode('idna').decode()
 url=urllib.parse.urlunsplit((parts.scheme or 'https',host,urllib.parse.quote(urllib.parse.unquote(parts.path)),parts.query,''))
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; directory-verification/1.0)'})
 with urllib.request.urlopen(req,timeout=15) as r:
  content=r.read(1500000)
  if 'text/html' not in r.headers.get('Content-Type',''): raise ValueError('not HTML')
  charset=r.headers.get_content_charset() or 'utf-8'
  p=Extract();p.feed(content.decode(charset,errors='replace'))
  return {'url':r.url,'text':'\n'.join(p.text),'links':p.links}
def fetch(x):
 out=TMP/(str(x['id'])+'-site.json')
 if out.exists(): return
 p=TMP/(str(x['id'])+'.json')
 if not p.exists():return
 d=json.loads(p.read_text(encoding='utf-8'))
 url=d.get('website') or d.get('facebook')
 pages=[]
 if not url: out.write_text('[]'); return
 try:
  p=get(url);pages.append(p)
  if not any(t in url for t in ['facebook.com','instagram.com']):
   links=[]
   for href in p['links']:
    u=urllib.parse.urljoin(p['url'],href)
    if urllib.parse.urlsplit(u).netloc!=urllib.parse.urlsplit(p['url']).netloc or '#' in href or '?' in href:continue
    if re.search(r'kontakt|contact|gaardbutik|g%C3%A5rdbutik|g%C3%A5rdsalg|gardsalg|find-os',u,re.I) and u.rstrip('/')!=p['url'].rstrip('/') and u not in links:links.append(u)
   for u in links[:2]:
    try:pages.append(get(u))
    except Exception as e:pages.append({'url':u,'error':str(e)})
 except Exception as e:pages.append({'url':url,'error':str(e)})
 out.write_text(json.dumps(pages,ensure_ascii=False),encoding='utf-8')
data=json.loads(Path('research/akra-2026-10-26/inventory.json').read_text(encoding='utf-8'))
todo=[x for x in data if x['status']=='candidate']
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for i,_ in enumerate(pool.map(fetch,todo),1):
  if i%25==0: print('Websites checked',i,flush=True)
print('DONE')
