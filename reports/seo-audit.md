# Audit SEO, Date Structurate și Accesibilitate — Transilvania Cave Diving

---

## 1. Implementare Tehnică SEO

- **Titluri și Meta Descrieri Unice**: Toate cele **53** pagini și articole dispun de titluri și descrieri meta optimizate în limba română (cu suport pentru paginile multilingve EN/HU de pe traseele turistice din Moneasa).
- **URL-uri Canonice și Hreflang**:
  - Fiecare pagină generează tagul `<link rel="canonical" ... />`.
  - Paginile trilingve ale traseelor cu cod QR (`/pestera-liliecilor`, `/bat-cave`, `/denever-barlang` și `/pestera-uscata-de-la-moara`, `/the-mill-karst-system`, `/a-malom-karsztrendszere`) sunt interconectate prin selector vizibil de limbă și metadate `alternates.languages`.
- **Date Structurate JSON-LD (Schema.org)**:
  - `Organization` și `LocalBusiness` (S.C. Transilvania Cave Diving S.R.L., CIF 39749631, J02/1309/2018, telefon +40 770 846 001).
  - `WebSite` și `BreadcrumbList` pe toate paginile interioare.
  - `TouristAttraction` pe paginile obiectivelor carstice și montane (Grota Ursului, Peștera Liliecilor, Sistemul Carstic de la Moară, Via Ferrata Dezna, Belvedere Moneasa, Peștera Isverna).
  - `Article` pe toate cele 36 de articole istorice și editoriale.
- **Sitemap XML și Robots.txt**:
  - Generate dinamic prin `src/app/sitemap.ts` și `src/app/robots.ts`.

---

## 2. Conformitate Accesibilitate (WCAG 2.2 AA)

- **Contrast Cromatic**: Tema *„Transilvania Underground & Adventure”* folosește text `#F6F4EE` pe fundal `#0B1116` (raport **17.4 : 1**, depășind cerința AAA de 7:1).
- **Navigare de la Tastatură**: Link `Skip to main content` („Sari la conținutul principal”), meniu mobil accesibil cu tasta `Escape`, lightbox galerie foto controlabil din tastatură (`ArrowLeft`, `ArrowRight`, `Escape`).
- **Semantică HTML5**: Landmark-uri `<header>`, `<nav>`, `<main id="main-content">`, `<article>`, `<aside>`, `<footer>` și ierarhie strictă de titluri (`h1` unic pe fiecare pagină).
