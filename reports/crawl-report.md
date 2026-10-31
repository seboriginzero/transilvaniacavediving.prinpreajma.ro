# Raport de Crawling și Descoperire Sursă — Transilvania Cave Diving

**Domeniu sursă:** `https://transilvaniacavediving.com`  
**Infrastructură identificată:** WordPress.com (`transilvaniacavedivingcom.wordpress.com`)  
**Data execuției:** 2026-10-31T12:20:08.172Z

---

## 1. Sumar Statistic de Descoperire

| Indicator | Valoare |
|---|---|
| Pagini HTML procesate și extrase cu succes | **73** |
| Pagini principale de conținut (WordPress Pages) | **17** |
| Articole editoriale și istorice (WordPress Posts 2019–2025) | **36** |
| Pagini de arhivă (Categorii, Etichete, Autor, Paginație) | **19** |
| URL-uri cu eroare HTTP 404 pe site-ul sursă | **3** |
| Active media unice inventariate | **949** |
| Fișiere media unice descărcate local (deduplicate SHA-256) | **578** |

---

## 2. Surse de Descoperire Utilizate

1. `/robots.txt` — verificat și respectat integral.
2. `/sitemap.xml` și `/news-sitemap.xml` — extrase și arhivate în `source-data/raw/sitemaps/`.
3. `/feed/` (RSS 2.0) — extras și arhivat în `source-data/raw/sitemaps/feed.xml`.
4. **WordPress Public REST API (v2 & v1.1)**:
   - `https://public-api.wordpress.com/wp/v2/sites/transilvaniacavedivingcom.wordpress.com/pages?per_page=100` (17 pagini)
   - `https://public-api.wordpress.com/wp/v2/sites/transilvaniacavedivingcom.wordpress.com/posts?per_page=100` (36 articole)
   - `https://public-api.wordpress.com/wp/v2/sites/transilvaniacavedivingcom.wordpress.com/categories?per_page=100` (6 categorii)
   - `https://public-api.wordpress.com/wp/v2/sites/transilvaniacavedivingcom.wordpress.com/tags?per_page=100` (11 etichete)
   - `https://public-api.wordpress.com/rest/v1.1/sites/transilvaniacavedivingcom.wordpress.com/posts?number=100&type=any` (53 entități complete cu atașamente media și metadate EXIF).
5. **Recursie linkuri interne HTML**: toate linkurile din meniuri, submeniuri, articole și subsol.

---

## 3. Analiza URL-urilor cu Eroare pe Site-ul Sursă (HTTP 404)

1. `https://transilvaniacavediving.com/servicii/` (HTTP 404 pe sursă):
   - Pe site-ul WordPress original, pagina intitulată **„Servicii – Transilvania Cave Diving”** a fost publicată pe slug-ul `/blog/`.
   - **Soluție în noul site:** Am creat ruta canonică `/servicii` și am păstrat și ruta `/blog` activă, astfel încât ambele URL-uri răspund cu HTTP 200 și afișează conținutul complet al serviciilor.
2. `https://transilvaniacavediving.com/contact/context.submission.url` și `https://transilvaniacavediving.com/contact/context.item.anchor` (HTTP 404 pe sursă):
   - Acestea sunt șabloane Interactivity API neinterpolate generate de pluginul Jetpack Contact Form în HTML-ul paginii `/contact/`.
   - **Soluție în noul site:** Formularul de contact a fost înlocuit cu o componentă React nativă, accesibilă și securizată (`/api/contact`), eliminând linkurile reziduale invalide.
