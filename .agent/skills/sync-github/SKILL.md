---
name: sync-github
description: >-
  Procedura standard de pregătire, verificare a calității codului (lint & build)
  și sincronizare prin push către depozitul oficial GitHub (origin/main).
---

# Sincronizare GitHub Repository

Această abilitate standardizează fluxul de verificare locală și publicare a codului în depozitul GitHub oficial.

## 1. Verificare Pre-Commit Obligatorie
Înainte de orice commit, rulează verificările TypeScript și build-ul complet de producție:
```bash
npm run lint
npm run build
```
Ambele comenzi trebuie să finalizeze cu cod de ieșire `0` și fără erori de tip sau pagini eșuate.

## 2. Staging și Verificare Secrete
Asigură-te că fișierele locale care conțin secrete (`.env.local`, `.env`) sunt ignorate de Git:
```bash
git status --ignored
```

## 3. Crearea Commit-ului Semantic
Include modificările relevante și formulează un mesaj descriptiv:
```bash
git add -A
git commit -m "feat/fix(domeniu): descriere clară a schimbării"
```

## 4. Publicarea pe Ramura Principală
Împinge commit-ul pe ramura `main`:
```bash
git push origin main
```
Confirmă că starea locală este aliniată:
```bash
git status
```
