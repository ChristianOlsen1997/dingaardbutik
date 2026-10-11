"""Cache reviewed exact DAR addresses. Requires pyproj; pass YYYY-MM-DD."""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from pyproj import Transformer

root = Path(__file__).resolve().parent
date = sys.argv[1]
entries = json.loads((root / f'additions-{date}.json').read_text(encoding='utf-8'))
transform = Transformer.from_crs(25832, 4326, always_xy=True)

def get(url):
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.load(response)

addresses = []
for entry in entries:
    farm = entry['farm']
    url = 'https://adressevaelger.dk/husnumre/soeg?' + urllib.parse.urlencode({'tekst': farm[3] + ', ' + farm[4], 'token': 'adressevaelger123'})
    matches = []
    for hit in get(url)['fund']:
        if hit['type'] != 'husnummer':
            continue
        detail_url = 'https://adressevaelger.dk/husnumre/' + hit['id'] + '?token=adressevaelger123'
        house = get(detail_url)['husnummer']
        if house['vejnavn'] + ' ' + house['husnummertekst'] != farm[3] or house['postnummer']['postnr'] != farm[4]:
            continue
        lon, lat = transform.transform(*house['adgangspunkt']['geometri']['coordinates'])
        matches.append({'vejnavn': house['vejnavn'], 'husnr': house['husnummertekst'], 'postnr': house['postnummer']['postnr'], 'x': lon, 'y': lat, 'betegnelse': house['adgangsadressebetegnelse'], 'href': detail_url, 'official': house})
    if not matches:
        raise ValueError(farm)
    addresses.append({'id': farm[0], 'url': url, 'matches': matches})
    print(farm[0], matches[0]['betegnelse'])
(root / f'address-additions-{date}.json').write_text(json.dumps(addresses, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
