"""Generate the directory and its source log from the reviewed research."""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
farms = json.loads((ROOT / 'research/farm-research.json').read_text(encoding='utf-8'))
additions = json.loads((ROOT / 'research/additions-2026-09-30.json').read_text(encoding='utf-8'))
additions += json.loads((ROOT / 'research/additions-2026-10-04.json').read_text(encoding='utf-8'))
farms += [entry['farm'] for entry in additions]
by_id = {f[0]: f for f in farms}
by_id['det-var-soerens'][6:10] = ['28853538', 'https://www.facebook.com/detvarsorens', 'Lille økologisk landbrug med salg af økologisk kød.', 'https://www.facebook.com/detvarsorens']
by_id['bakkemosegaard'][7] = 'https://www.facebook.com/Bakkemosegaard'
by_id['babberup'][7] = 'https://www.facebook.com/babberupkoed'
by_id['kraghoejgaard'][7] = 'https://www.facebook.com/KraghoejgaardOekologi/'
by_id['verningelund'][7] = 'https://www.facebook.com/111351809238161/'
by_id['verningelund'][8] = 'Oksekød fra egne økologiske dyr, pølser, pålæg og mælk. Kontakt helst gården via SMS.'
for key in ['dalhoejgaard', 'sommergroent', 'alsoe']:
    by_id[key][7] = ''

addresses = {a['id']: a for a in json.loads((ROOT / 'research/address-results.json').read_text(encoding='utf-8-sig'))}
addresses.update({a['id']: a for a in json.loads((ROOT / 'research/address-additions-2026-09-30.json').read_text(encoding='utf-8'))})
addresses.update({a['id']: a for a in json.loads((ROOT / 'research/address-additions-2026-10-04.json').read_text(encoding='utf-8'))})
fallbacks = {'maansson':'Grarupvej 15A', 'jysk-naturkoed':'Ole Rømers Vej 32', 'hoekildegaard':'Åmarksvej 46A', 'aarstiderne':'Krogerupvej 3C', 'bondegaarden':'Engtoften 14', 'grennessminde':'Snubbekorsvej 16'}
cached_geo = {a['id']: a for a in json.loads((ROOT / 'research/geocoded-locations.json').read_text(encoding='utf-8'))}
notes = {
 'hvolbaekgaard':'Intet sikkert telefonnummer eller aktivt link fundet; tidligere hjemmeside er under konstruktion.',
 'dalhoejgaard':'Tidligere hjemmeside dalhojgaard.dk viser en parkeret side. Aktivt link mangler.',
 'sommergroent':'Tidligere hjemmeside sommergroent.dk kunne ikke findes i DNS. Aktiv hjemmeside/Facebook mangler. Telefonnummer fra Krak; ældre kilder har et andet nummer.',
 'alsoe':'Tidligere hjemmeside godtkoed.dk kunne ikke findes i DNS. Aktivt link mangler. Butiksadresse fra producentbrochure; registreret virksomhedsadresse i Hvidovre er ikke brugt som besøgsadresse.',
 'bakkemosegaard':'Facebook-link leveret af brugeren. Facebook viste utilgængeligt indhold uden login; linkets indhold kunne ikke bekræftes. Adresse og telefon fra den anførte sekundære kilde.',
 'den-glade-bondemand':'Den offentlige Facebook-side oplyser, at siden blev hacket i 2023. Adresse og telefon matcher; en ny sides adresse er ikke fundet.',
 'steensgaard':'Nuværende hjemmeside fokuserer på ost. Aktuel fysisk butiksdrift bør bekræftes direkte. Telefonnummer støttet af erhvervsmedlemsliste fra 2025.',
 'lophave':'Intet sikkert offentligt telefonnummer fundet.',
 'diddesminde':'Intet sikkert offentligt telefonnummer fundet.',
 'tinnetgaard':'PDF-navnet Tingetgård fortolket som Tinnetgaard, den matchende økologiske gårdbutik i Vonge.',
 'noerregaarden':'Optræder to gange i PDF; oprettet én gang.',
 'kraghoejgaard':'Hjemmesiden havde certifikatfejl; Facebook-link fra VisitNordvestkysten anvendt.',
 'verningelund':'Hjemmesidens certifikat var udløbet; Facebook-link fra VisitDenmark anvendt.',
}

notes.update({entry['farm'][0]: entry['note'] for entry in additions if entry.get('note')})
additional_sources = {entry['farm'][0]: entry['sources'] for entry in additions}

def merc(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))

# Reference points embedded in src/assets/danmark-regioner.svg.
ax = (545.5 - 90.9) / (11.975559929457779 - 8.44687340696684)
ay = (449.5 - 738.1) / (merc(56.000749030975314) - merc(54.727718541943865))
def project(lon, lat):
    return {'x': round(90.9 + ax * (lon - 8.44687340696684), 1), 'y': round(738.1 + ay * (merc(lat) - merc(54.727718541943865)), 1)}

locations = []
geo = []
for f in farms:
    ident, name, region, street, postal, city, phone, website, description, source = f
    entry = addresses[ident]
    expected = fallbacks.get(ident, street)
    if ident in fallbacks and not any(a['vejnavn'] + ' ' + a['husnr'] == expected and a['postnr'] == postal for a in entry['matches']):
        # DAWA closed on 1 October 2026. Preserve the reviewed fallback lookup.
        cached = cached_geo[ident]
        road, number = expected.rsplit(' ', 1)
        entry = {'matches': [{'vejnavn': road, 'husnr': number, 'postnr': postal,
            'x': cached['longitude'], 'y': cached['latitude'],
            'betegnelse': cached['address'], 'href': cached['source']}]}
    exact = [a for a in entry['matches'] if a['vejnavn'] + ' ' + a['husnr'] == expected and a['postnr'] == postal]
    if not exact:
        raise ValueError((ident, expected, entry))
    a = exact[0]
    location = dict(id=ident, name=name, region=region, address=street, postalCode=postal, city=city, mapPosition=project(a['x'],a['y']), description=description)
    if phone: location['phone'] = phone
    if website: location['website'] = website
    locations.append(location)
    geo.append({'id':ident,'address':a['betegnelse'],'longitude':a['x'],'latitude':a['y'],'source':a['href'],'approximate':ident in fallbacks})
    if ident in fallbacks:
        notes[ident] = notes.get(ident,'') + ' Oversigtskortet bruger nærmeste matchende DAR-bygning (' + expected + '); besøgsadressen bevares som angivet af butikken. Kortmarkøren er vejledende, Google Maps bruger hele besøgsadressen.'

assert len(locations) == len({f['id'] for f in locations}) == len(farms)
assert all(re.fullmatch(r'\d{8}', f['phone']) for f in locations if 'phone' in f)
(ROOT / 'src/data/locations.ts').write_text('import type { Location } from "@/types/locations";\n\n// Reviewed sources and limitations: research/gaardbutikker-kilder.md\nexport const locations: Location[] = ' + json.dumps(locations,ensure_ascii=False,indent=2) + ';\n',encoding='utf-8')
(ROOT / 'research/geocoded-locations.json').write_text(json.dumps(geo,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report = '# Gårdbutikker – kilder og kontrol\n\nOprindelige 68 steder kontrolleret 28. september 2026 fra brugerens Danske Gårdbutikker.pdf. Tilføjelser kontrolleret 30. september 2026: 29 forslag, 28 nye steder. Den Bornholmske Kalv og Nygård-Pilegård er én post. Tilføjelser kontrolleret 4. oktober 2026: 23 nye fysiske steder og Lille Jord som separat webshop. Alle 24 forslag er indarbejdet; se additions-review-2026-10-04.md. I alt 119 fysiske steder. Ingen åbningstider er importeret.\n\nKontaktdata er fundet på butikkernes egne sider, hvor muligt, og ellers i de angivne sekundære kilder. Et adresseopslag bekræfter adressens eksistens, ikke at butikken fortsat drives. Tomme felter betyder ikke fundet sikkert. Links kan ændre sig eller kræve Facebook-login.\n\nKortpositioner kommer fra Danmarks Adresseregister via Dataforsyningen (oprindelige steder) og Adressevælgeren (4. oktober 2026) og omregnes til kortets Mercator-projektion. Enkelte kortmarkører bruger en nærliggende bygning, fordi butikken angiver et hovednummer eller nummerinterval, som DAR opdeler.\n\n'
for f,g in zip(farms,geo):
    report += f'## {f[1]}\n\n- Adresse: {f[3]}, {f[4]} {f[5]}\n- Telefon: {f[6] or "Ikke fundet sikkert"}\n- Link: {f[7] or "Ikke fundet aktivt"}\n- Kontaktkilde: {f[9]}\n- DAR: {g["source"]}\n'
    for source in additional_sources.get(f[0], []): report += '- Supplerende kilde: ' + source + '\n'
    if f[0] in notes: report += '- Bemærkning: ' + notes[f[0]] + '\n'
    report += '\n'
(ROOT / 'research/gaardbutikker-kilder.md').write_text(report,encoding='utf-8')
print({'shops':len(locations),'phones':sum('phone' in f for f in locations),'links':sum('website' in f for f in locations),'regions':{r:sum(f['region']==r for f in locations) for r in sorted({f['region'] for f in locations})}})
