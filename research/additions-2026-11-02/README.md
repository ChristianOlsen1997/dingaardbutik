# Tilføjelser kontrolleret 2. november 2026

11 nye besøgssteder er tilføjet: Marielyst, Uldum Mølle, Strandgårdens Frugtplantage, Skovløkke Munkebo, Den Lille Mark, Lysemosegaard, Økomølleriet/Kragegaarden, Stokmosegård, Svanholm, Knoldbjerggaard og Kæragergård Grisen.

## Dubletter

Merialyst og Marielyst er samme butik. Følgende var allerede i begge datasæt og er ikke oprettet igen: Knudsens Øko Græsæg, Havredal Gårdbutik, Tinnetgaard, Ravnsminde, Gartneriet Lumbygaard, Holistia, Bodebjergvej 42, Thorshøjgaard og Gråsten Fjerkræ. Thorhøjgård i forespørgslen er matchet til Thorshøjgaard i Dronningmølle. Skovløkke i Marslev var eksisterende; Munkebo er et andet besøgssted.

## Kilder og afgrænsninger

Se entries.json for navne, adresser, koordinater, telefon, links, beskrivelser og åbningstidsnoter. Hvert *-address.json indeholder den kontrollerede DAR-adresse. Den Lille Marks punkt kommer fra Google Maps-linket på producentens egen hjemmeside, så navigationen ikke peger på naboens private bolig.

Se production-review.json for beslutninger om økologi og græsfodring. Filerne læses også af research/production-claims/build-review.py og genererer én fælles mærkningsliste til app og hjemmeside. Knudsens profil kunne nu læses og bekræfter økologiske æg. Strandgården bekræfter økologiske egne kartofler; mærkets begrænsning vises på profilen. Ingen nye steder opfyldte det konservative filter for græsfodret kød. Græsæg, udegående dyr og økologisk produktion er ikke i sig selv græsfodret kød.

Stokmosegårds egen Facebook-introduktion bekræfter økologisk landbrug, adresse Skalkendrupvej 60 og telefon 31518030. Kæragergårds eget uge 45-opslag henviser besøgende til Søndergade 108, torsdag/fredag 10–17. Det præcise registrerede salgssted er Søndergade 108C, 7080 Børkop, som bruges på kortet; gårdadressen Mørkholtvej 8 bruges ikke. Kilde: https://www.facebook.com/photo/?fbid=1134044079374453&set=a.134023119376559 . Registreret adresse: https://www.postage.dk/virksomhed/1570194-kaeragergaard-slagteren-i-s/ .

Skovløkkes egen profil bekræfter to butikker, i Dræby og Marslev. Den specifikke Munkebo-adresse er sammenholdt med GoForLocal, VisitKerteminde og DAR. Åbningstid gives som sæsonnote frem for udokumenterede helårstider.

Marielysts egen hjemmeside var under opbygning; besøgsoplysninger kommer fra VisitLolland-Falster. Svanholm oplyser vinterlukket café/grøntsagssalg til foråret 2027. Uldum Mølles aktuelle tider gælder frem til 1. december. Lysemosegaards sæsonopslag er ikke omdannet til helårstider. Økomølleriets udtrykkelige døgnåbne selvbetjening er lagt i strukturerede felter.

## Database

import.sql indsætter kun de 11 nye ID'er og deres kilder. Eksisterende billeder, rettelser og åbningstider overskrives ikke. Importen validerer alle nye felter i en transaktion. Resultat: 256 fysiske steder og én webshop, i alt 257.

Hjemmesidens filtre anvender samme kildebekræftede lister som appen. Begge filtre samtidig betyder, at begge betingelser skal være opfyldt.
