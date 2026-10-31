# Content Model & Data Provenance Specification

## 1. Design Principles

All content in the reconstructed Transilvania Cave Diving platform is modeled as strongly typed, independently editable entities stored in `source-data/` (raw & normalized archives) and compiled into `src/content/site-database.json` with TypeScript interfaces in `src/lib/content.ts`.

Every content entity maintains strict provenance (`source_url`, `wp_id`, `publication_date`, `last_modified`, `content_sha256`) and explicit factual validation metadata (`validation_status`, `historical_context_note`).

## 2. Core Entity Schemas

### 2.1 `DestinationEntity`
Represents major caves, karst systems, mountain routes, and heritage landmarks (`Grota Ursului`, `Peștera Liliecilor`, `Sistemul Carstic de la Moară`, `Via Ferrata – Cetate Dezna`, `Belvedere Moneasa`, `Moneasa Adventure`, `Stațiunea Moneasa`, `Czárán Gyula`, `Peștera Isverna`).

```typescript
export interface DestinationEntity {
  slug: string;
  sourceUrl: string;
  canonicalPath: string;
  title: string;
  subtitle: string;
  category: 'pestera' | 'sistem-carstic' | 'via-ferrata' | 'belvedere' | 'statiune' | 'patrimoniu' | 'cave-diving' | 'educatie';
  language: 'ro' | 'en' | 'hu';
  translations?: { lang: 'ro' | 'en' | 'hu'; path: string; title: string }[];
  location: {
    locality: string;
    county: string;
    mountains: string;
    protectedArea?: string;
    ranCode?: string;
    altitude?: string;
    accessRoutes: string[];
    mapUrls: string[];
  };
  technicalFacts: Record<string, string>;
  visitingInfo: {
    schedule?: string;
    tariffs?: string[];
    groupPolicy?: string;
    verificationNote: string;
  };
  safetyWarnings: string[];
  requiredEquipment: string[];
  heroImage: MediaAssetRef;
  sections: ContentSection[];
  bodyMarkdown: string;
  gallery: MediaAssetRef[];
  historicalTimeline: { year: string; event: string }[];
  sourceReferences: string[];
  credits: string[];
  publicationDate: string | null;
  lastModified: string | null;
}
```

### 2.2 `ArticleEntity` (Jurnal & Historical Archive)
Represents all 36 chronological articles from `2020` to `2025` (`/YYYY/MM/DD/slug`), categorized by domain without losing a single paragraph, image, video, price, or safety warning:

- `speoturism` (Speotourism programs, Peștera Șura Mare, Grota Ursului technical tours)
- `cave-diving` (Visit Isverna 2021/2022, Program Cave Diving România, Underwater Budapest / Kőbánya, Apuseni Cave Diving Tour)
- `cursuri` (IANTD OW Side Mount Diver, Cavern, Intro to Cave with Instructor Karel Levrau)
- `echipamente` (Fenix headlamps HM75R, HM70R, HM65R, HM65R-T, HM65R-DT, HM61R, HM60R, HP30R V2.0, HP16R, HL32R; TecLine Military Line, SideMount sets, LED Teclight; Ammonite System; Bauer Junior II 30th Anniversary; Hose holders)
- `comunitate-si-oferte` (FRS/CORSA/ANSMR 10% member discount, Străița Bunicii local syrups, seasonal promotions)

### 2.3 `MediaAssetRef`
```typescript
export interface MediaAssetRef {
  sourceUrl: string;
  localPath: string;
  originalFilename: string;
  sha256: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  altText: string;
  caption: string;
  photographerCredit: string;
  sourcePage: string;
  rightsStatus: string;
}
```

## 3. Content Classification & Factual Validation Rules

The normalization pipeline distinguishes between:
1. **Verified Current Information**: Legal entity registration (`S.C. Transilvania Cave Diving S.R.L.`, CIF `39749631`, `J02/1309/2018`), geographic locations, geological ages (Triassic Anisian–Carnian ~230 Ma), archaeological RAN codes (`11487.01`), and Natura 2000 site codes (`ROSCI0042`).
2. **Source-Confirmed Operational Information (Requires Periodic Owner Confirmation)**: Grota Ursului weekend visiting schedule (`Sâmbătă și duminică 11:00–16:00`), standard tourist entry tariffs (`20 lei` adults / `10 lei` children under 14 / free under 5 & legitimized speleologists/mountain rescue), and shop free shipping threshold (`300 lei`).
3. **Historical Archive Information (Explicitly Labeled as Historical)**: Past event dates and tariffs from 2021–2022 posts (e.g., August 2021 Grota Ursului speotourism tour at `200 lei`, August 2021 Peștera Șura Mare tour at `250 lei`, September 2021 IANTD Side Mount course at `450 euro`, 2021–2022 seasonal discounts). These are preserved in full for historical fidelity with an explicit archival banner so users never mistake them for active 2026 price lists.
4. **Safety-Critical Information**: Mandatory equipment and training requirements for Via Ferrata (helmet, harness, energy-absorbing lanyard), technical caving (helmet with lighting, caving suit, vertical gear, guide), Rezervația Peștera Valea Morii (Class A permit from Comisia Patrimoniului Speologic & ANMAP), and Cave Diving (certified cave divers only, thermal protection for `8°C` water).

