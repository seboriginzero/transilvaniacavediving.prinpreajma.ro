# Transilvania Cave Diving — Full-Stack Web Platform & Content Archive

**Domeniu sursă migrat:** `https://transilvaniacavediving.com`  
**Proprietar:** `S.C. Transilvania Cave Diving S.R.L.` (`CIF: 39749631`, `Reg. com.: J02/1309/2018`, Arad / Moneasa, România)  
**Stivă Tehnologică:** Next.js 14 (App Router), React 18, TypeScript (Strict Mode), Tailwind CSS, Node.js Crawler & Content Pipeline, Playwright E2E.

---

## 1. Prezentare Generală

Această aplicație reprezintă reconstrucția completă, modernă, accesibilă (WCAG 2.2 AA) și optimizată SEO a întregului website public `https://transilvaniacavediving.com`, păstrând **100% din conținutul original**, descrierile speologice, specificațiile tehnice, monografiile istorice, biografiile, avertismentele de siguranță, tarifele cu context istoric, creditele fotografice și galeriile media (stocate integral local în `public/media/`).

### Obiective Principale și Secțiuni Acoperite
- **Peștera Grota Ursului (Peștera de la Băi) – Moneasa (`/grota-ursului`)**: Traseu turistic amenajat (200 m până în Sala Czárán Gyula), expoziția Peștera Coliboaia (cca. 36.000 ani), ture de speoturism (250 m – 1.500 m), mineralogie (cristale de aragonit) și istoric explorări (>2.500 m).
- **Peștera Liliecilor – Moneasa (`/pestera-liliecilor`, `/bat-cave`, `/denever-barlang`)**: Cod RAN `11487.01`, traseu Bandă Albastră (1,3 km), cartări Gábor Halasi (1974) și A.S. Speowest (2011), faună (*Rhinolophus ferrumequinum*) și variante multilingve RO/EN/HU pentru panourile QR.
- **Sistemul Carstic de la Moară (`/pestera-uscata-de-la-moara`, `/the-mill-karst-system`, `/a-malom-karsztrendszere`)**: Sit Natura 2000 `ROSCI0042` Codru-Moma, Peștera cu Apă de la Moară (1.750 m, Clasa A), Ponorul de la Merezărie (538 m), Peștera Uscată de la Moară (45 m) și variante RO/EN/HU.
- **Via Ferrata – Cetatea Medievală Dezna (`/via-ferrata-cetate-dezna`)**: Grad dificultate B, lungime 600 m (+120 m denivelare), punte indiană 25 m, reguli de siguranță UIAA/CE și istoria cetății de pe Dealul Osoiu (390 m).
- **Belvedere Moneasa & Cariera de Marmură (`/belvedere-moneasa`)**: Traseu Punct Roșu (2,7 km) și istoria exploatării marmurei roșii și negre.
- **Moneasa Adventure (`/moneasa-adventure`)**: Excursii educative *Școala Altfel* și *Săptămâna Verde* pentru grădinițe, ciclul primar, gimnazial și liceu.
- **Stațiunea Balneoclimaterică Moneasa (`/statiunea-moneasa`)**: Monografie istorică amplă (1597 – prezent), izvoare mezotermale (24–32 °C), epoca contelui Fridrich Wenckheim, calea ferată Sebiș–Moneasa și bibliografie științifică.
- **Czárán Gyula (`/czaran-gyula`)**: Biografia pionierului turismului în Munții Apuseni (1847–1906).
- **Cave Diving & Peștera Isverna (`/cave-diving`, `/visit-isverna`)**: Parametrii celor 6 sifoane din Isverna (Green, Yellow, Black -44 m, Gravel, Sand, Final), cursuri IANTD (Side Mount, Cavern, Intro to Cave) și echipamente.
- **Servicii (`/servicii`, `/blog`)**: Ghidaj speologic, cave diving, distribuție echipamente și lucrări subacvatice/industriale la baraje, hidrocentrale și la înălțime.
- **Magazin (`/magazin`)**: Distribuție oficială pentru **Fenix, TecLine, Ammonite System, Shearwater, Ursuit, Bauer Kompressoren, Kwark, UR-Flex, Si Tech**, livrare gratuită >300 lei și retur în 14 zile conform O.U.G. 34/2014.
- **Jurnal (`/jurnal` și `/[year]/[month]/[day]/[slug]`)**: Toate cele 36 de articole de arhivă (2019–2025) cu filtrare interactivă și păstrarea URL-urilor cronologice originale.

---

## 2. Structura Proiectului

```text
├── crawler/
│   ├── config/crawler.config.json      # Configurare domenii permise, rate-limiting, excluderi
│   ├── src/security.mjs                # Protecție SSRF, validare DNS/IP privat, redirecționări
│   ├── src/extractor.mjs               # Extragere semantică HTML -> Markdown + JSON (Secțiunea 2.4)
│   ├── src/crawl.mjs                   # Motorul de crawling multi-sursă și descărcare media SHA-256
│   └── tests/security.test.mjs         # Teste unitare SSRF și extracție
├── source-data/
│   ├── raw/                            # Arhiva brută HTML, API JSON (WordPress v2 & v1.1), Sitemaps
│   ├── normalized/pages/               # Înregistrările JSON normalizate pentru fiecare pagină
│   └── manifests/                      # pages-manifest.json, media-manifest.json, completeness-manifest.json
├── public/media/                       # Toate activele media descărcate local (zero hotlinking)
├── scripts/
│   ├── compile-content-and-reports.mjs # Compilare src/content/site-database.json și generare rapoarte
│   └── verify-completeness.mjs         # Audit automatizat 100% completitudine conținut și media
├── src/
│   ├── app/                            # Rute Next.js App Router (102 pagini statice + API)
│   ├── components/                     # Componente UI accesibile (Header, Footer, MediaGallery, etc.)
│   ├── content/site-database.json      # Baza de date unificată a site-ului
│   └── lib/                            # Utilitare conținut, SEO, JSON-LD
├── docs/                               # Documentație arhitectură, crawling, model date, design, securitate
├── reports/                            # Toate rapoartele CSV și Markdown de audit și inventar
└── tests/                              # Teste unitare și suite Playwright E2E pe 5 rezoluții
```

---

## 3. Instrucțiuni de Rulare și Dezvoltare Locală

### Instalare Dependențe
```bash
npm install
```

### Rulare Server de Dezvoltare
```bash
npm run dev
```

### Re-compilare Bază de Date Conținut și Rapoarte (din datele extrase)
```bash
npm run compile:content
```

### Verificare Automată a Completitudinii și Teste Unitare
```bash
npm test
```

### Build de Producție și Pornire Server
```bash
npm run build
npm run start
```

### Rulare Suite Playwright E2E (pe 5 rezoluții: 375px, 768px, 1024px, 1440px, 1920px)
```bash
npm run test:e2e
```

