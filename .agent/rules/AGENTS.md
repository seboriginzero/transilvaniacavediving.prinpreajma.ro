# Reguli de Proiect — Transilvania Cave Diving (`transilvaniacavediving.com`)

Acest depozit găzduiește platforma web modernă **Transilvania Cave Diving** (Next.js 14 App Router, TypeScript strict, Tailwind CSS), dedicată explorării speologice, turismului de aventură și promovării patrimoniului carstic din stațiunea Moneasa și comuna Dezna (Munții Codru-Moma, județul Arad).

---

## 1. Limbă Română, Diacritice și Ortografie
- **Diacritice românești obligatorii**: Folosește exclusiv caracterele cu virgulă dedesubt: **`ș`**, **`ț`**, **`Ș`**, **`Ț`** (alături de `ă`, `â`, `î`, `Ă`, `Â`, `Î`). Este strict interzisă folosirea caracterelor cu sedilă (`ş`, `ţ`).
- **Particula „și”**: În toate textele narative, titlurile editoriale, meniuri și etichete, folosește cuvântul complet **`și`** (strict interzis caracterul ampersand `&` în limbaj natural; `&` este permis doar în cod, parametri URL sau denumiri de entități juridice stabilite).

---

## 2. Fidelitate Geografică, Istorică și Tematică
- **Focus regional exclusiv**: Platforma este dedicată exclusiv zonei **Moneasa și Dezna (Munții Codru-Moma, județul Arad)**.
- **Excluderea comerțului sau locațiilor străine**: Paginile active nu conțin referințe la magazin de echipamente, vânzări comerciale sau locații din afara arealului Codru-Moma (ex. Isverna/Mehedinți). Acestea aparțin doar arhivei istorice documentare.
- **Specificații tehnice atestate obligatorii**:
  - **Peștera Grota Ursului (Moneasa)**: Traseu turistic amenajat de cca. 200 m, electrificat, până în Sala Czárán Gyula. Adăpostește fosile de urs de cavernă (*Ursus spelaeus*) descoperite în 1989 și expoziția dedicată picturilor rupestre din Peștera Coliboaia (cca. 36.000 de ani). Temperatura interioară stabilă: **10 – 12 °C**.
  - **Via Ferrata Cetatea Dezna**: Traseu montan amenajat pe Dealul Osoiu (Dezna), lungime totală **600 m**, grad dificultate **B**, punte indiană suspendată de **25 m**. Traseu amenajat de Primăria Comunei Dezna prin SC Transilvania Cave Diving SRL, cu sprijinul Makita România.
  - **Peștera Liliecilor (Moneasa)**: Situată pe Dealul Hoanca Coului, traseu marcat cu bandă albastră (1,3 km de la drumul principal). Sit arheologic RAN 11487.01, adăpostește colonia protejată de liliac mare cu potcoavă (*Rhinolophus ferrumequinum*). Lungime dezvoltare: ~150 m (cartare Speowest, 2011).
  - **Sistemul Carstic de la Moară**: Sit Natura 2000 ROSCI0042 Codru-Moma. Include Peștera Uscată de la Moară și Peștera cu Apă de la Moară (1.750 m lungime explorată).
  - **Patrimoniu Istoric Moneasa**: Prima atestare documentară 1597 (donația lui Sigismund Báthory către Kornis Gáspár), forarea izvoarelor mezotermale (24 – 32 °C) în 1891–1893, calea ferată îngustă Sebiș – Moneasa (23,6 km, inaugurată în 1893, activă până în 1962), recunoașterea ca stațiune balneară la 13 mai 1896, placa comemorativă Czárán Gyula din 19 august 1906.

---

## 3. Direcție Vizuală & Standarde UI (Figma-Grade Editorial)
- **Fotografie Full-Bleed Naturală**: Fotografiile reale de explorare speologică și montană reprezintă punctul central al platformei.
- **Interzicerea efectului de spălăceală**: Este strict interzisă aplicarea de măști semitransparente albe, crem sau degradeuri deschise peste fotografii în tema Light. Toate degradeurile de contrast pentru text pe imagini folosesc exclusiv negru (`rgba(0,0,0,...)`), asigurând contrast impecabil și culori naturale.
- **Integritatea subiectelor foto**:
  - Slide-ul 4 din carusel (*Peștera Liliecilor*) trebuie să afișeze liliacul în întregime, inclusiv capul poziționat la baza fotografiei (`fit: 'contain-right'` pe desktop, mască superioară pe mobil).
  - Secțiunea Grota Ursului de pe prima pagină folosește schița originală `logo-grota-ursului-2025.jpg` cu raportul de aspect complet `aspect-[3/2]`, fără nicio decupare a desenului sau textului.
- **Header minimalist**: Înălțime fixă 64px, fundal translucid cu blur (`backdrop-blur-md`), meniu structurat: *Acasă*, *Obiective și Trasee* (dropdown), *Istorie și Patrimoniu* (dropdown), *Contact* (buton pill accentuat), selector limbă și comutator temă dark/light.

---

## 4. Securitate și Date Dinamice
- **Panoul de Administrare (`/administrator`)**:
  - Protejat prin parolă verificată server-side via `/api/admin/auth`.
  - Parola este extrasă din variabila de mediu `ADMIN_PASSWORD`. Nu se hardcodează parole în fișiere de cod.
  - Setările dinamice (program weekend, tarife adulți/copii, telefon, stare vizitare) sunt persistate în `src/content/dynamic-settings.json` și citite via `src/lib/settings.ts`.

---

## 5. Infrastructură, GitOps și Găzduire Proxmox VM1
- **Depozit GitHub Oficial**: `https://github.com/seboriginzero/transilvaniacavediving.prinpreajma.ro.git` (ramura `main`).
- **Găzduire Proxmox VM1**:
  - Adresă IP: `192.168.57.51`
  - Utilizator SSH: `antigravity`
  - Cale server: `/home/antigravity/tenants/transilvaniacavediving`
  - Secrete producție: `/home/antigravity/secrets/.env.transilvaniacavediving`
  - Container Docker: `originzero-tenant-transilvaniacavediving`
  - Port intern expus pe VM1: `0.0.0.0:3040->3000/tcp`
  - Reverse proxy Nginx: gestionează domeniul public `https://transilvaniacavediving.prinpreajma.ro`
  - Healthcheck activ: `GET /api/health` ➔ `HTTP 200 OK`

