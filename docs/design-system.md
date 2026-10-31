# Visual Design System — "Transilvania Underground & Adventure"

## 1. Design Philosophy & Aesthetic Identity

The visual design system for **Transilvania Cave Diving** embodies subterranean scientific exploration, karst geology, technical cave diving, and mountain adventure in the Apuseni (Codru-Moma) and Mehedinți mountains.

Unlike generic tourism templates, the interface pairs deep subterranean dark-slate surfaces and warm limestone neutrals with mineral turquoise and safety-amber accents—evoking underwater dive beams illuminating submerged calcite formations and historic speleological cartography.

## 2. Color Palette & Accessibility (WCAG 2.2 AA)

All foreground/background pairings meet or exceed WCAG 2.2 AA contrast thresholds (`4.5:1` for normal text, `3:1` for large text and UI components).

| Token Name | Hex Value | Role & Semantic Usage | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| `--bg-abyss` | `#0B1116` | Deep charcoal/subterranean primary dark canvas, hero backgrounds, footer | `18.4:1` vs `#F4F1EA` |
| `--bg-cavern` | `#131D26` | Secondary dark slate surface, technical specification cards, dive panels | `15.6:1` vs `#F4F1EA` |
| `--bg-limestone` | `#F6F4EE` | Warm limestone beige light editorial surface for long-form reading | `14.8:1` vs `#131D26` |
| `--bg-calcite` | `#FFFFFF` | High-contrast card surface on limestone backgrounds | `17.2:1` vs `#131D26` |
| `--text-primary-light` | `#F4F1EA` | Primary text on dark subterranean surfaces | `18.4:1` on `#0B1116` |
| `--text-secondary-light` | `#B0C0CE` | Muted technical metadata and captions on dark surfaces | `9.8:1` on `#0B1116` |
| `--text-primary-dark` | `#111921` | Primary text on warm limestone editorial surfaces | `15.4:1` on `#F6F4EE` |
| `--text-secondary-dark` | `#3D4F60` | Secondary text on warm limestone surfaces | `7.5:1` on `#F6F4EE` |
| `--accent-turquoise` | `#14B8A6` / `#0D9488` | Mineral turquoise interactive highlights, dive depth badges, active states | `8.2:1` on `#0B1116` (`#2DD4BF`) |
| `--accent-underground-blue` | `#0284C7` | Hydrogeological links, karst water routes, informational badges | `6.1:1` |
| `--accent-amber` | `#D97706` / `#F59E0B` | Restrained safety-amber accents, mandatory equipment alerts, CTAs | `10.4:1` on `#0B1116` (`#FBBF24`) |
| `--status-danger` | `#DC2626` | Critical cave diving / speleological hazard warnings | `5.6:1` |

## 3. Typography & Romanian Diacritics Support

Typography is engineered for full Latin Extended support (`ă, â, î, ș, ț, Ă, Â, Î, Ș, Ț` as well as Hungarian/German historical names such as *Czárán Gyula*):

- **Display & Headings**: `Outfit` / `Plus Jakarta Sans` (system fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — geometric precision with strong readability for destination titles and section headers.
- **Editorial Body**: `Inter` / system sans — generous `1.75` line-height and `65ch–75ch` measure for historical narratives, geological studies, and expedition journals.
- **Technical Data & Coordinates**: `JetBrains Mono` / monospace — used for cave survey dimensions, altitude (`m`), depth (`m`), water temperature (`°C`), historical years, and SHA-256 provenance references.

## 4. Core UI Component Library

1. **Cinematic Hero (`<HeroSection />`)**:
   - Full-viewport or large-aspect atmospheric photography with subtle gradient scrims (`from-[#0B1116]/90 via-[#0B1116]/60 to-[#0B1116]/95`), category pill, breadcrumb trail, technical quick-facts bar, and photographer attribution badge.
2. **Sticky Navigation & Mobile Drawer (`<Header />`)**:
   - Persistent top navigation featuring the 8 primary IA categories (*Acasă*, *Descoperă*, *Aventuri și experiențe*, *Servicii*, *Istorie și patrimoniu*, *Jurnal*, *Magazin*, *Contact*), keyboard-accessible dropdowns, skip-to-content link, and responsive mobile drawer (`375px`+ verified).
3. **Structured Technical Data Cards (`<TechnicalSpecsCard />`)**:
   - Displays verified measurements, geological formations, access conditions, difficulty classification, and mandatory equipment checklists.
4. **Safety & Eligibility Callout (`<SafetyWarningBanner />`)**:
   - High-visibility amber/crimson warning panel distinguishing recreational tourist visits from technical speotourism, vertical caving, via ferrata, and overhead-environment cave diving (IANTD/TDI certification requirements).
5. **Historical Pricing & Status Notice (`<HistoricalContextBadge />`)**:
   - Explicitly frames historical tariffs, schedules, or archived expedition programs from the source site so visitors never confuse historical records with unverified current availability.
6. **Interactive Lightbox Gallery (`<MediaGallery />`)**:
   - Responsive CSS Grid gallery with lazy-loaded below-the-fold images, keyboard-accessible modal lightbox (`Escape`, `ArrowLeft`, `ArrowRight`), full captions, and preserved photographer credits.
7. **Illustrated Chronology Timeline (`<Timeline />`)**:
   - Vertical timeline presenting cave discovery dates, *Czárán Gyula*'s trailblazing work in Moneasa (late 19th / early 20th century), and modern Romanian cave diving milestones.

## 5. Motion & Reduced-Motion Standards

- Subtle CSS transitions (`150ms–250ms ease-out`) on card hover states, navigation underlines, and lightbox dialogs.
- Zero scroll-jacking or layout-shifting animations (`CLS < 0.1`).
- Global `@media (prefers-reduced-motion: reduce)` rule disables all non-essential transitions and transforms immediately.

