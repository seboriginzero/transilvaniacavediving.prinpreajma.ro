---
name: admin-settings
description: >-
  Instrucțiuni pentru consultarea, actualizarea și securizarea setărilor dinamice
  (program vizitare, tarife, telefoane) prin panoul /administrator și fișierele de configurare.
---

# Gestionarea Setărilor Dinamice ale Site-ului

Această abilitate ghidează configurarea parametrilor dinamici de pe site fără a necesita re-compilare de cod.

## 1. Fișierul de Configurare
Parametrii dinamici sunt stocați în:
`src/content/dynamic-settings.json`

Structură:
```json
{
  "grotaUrsului": {
    "status": "Deschis în weekend",
    "days": "Sâmbătă și Duminică",
    "hours": "11:00 – 16:00",
    "adultPrice": 20,
    "childPrice": 10,
    "phone": "+40 770 846 001",
    "notes": "..."
  },
  "viaFerrata": {
    "access": "Accesibil cu echipament omologat",
    "season": "Tot timpul anului, exclusiv în condiții meteo favorabile",
    "fee": "Acces gratuit, cu echipament propriu omologat",
    "rental": "Echipament complet și ghidaj autorizat la cerere",
    "phone": "+40 770 846 001",
    "length": "600 m",
    "bridge": "25 m punte indiană suspendată",
    "grade": "B"
  }
}
```

## 2. Autentificarea în Panoul `/administrator`
- Deschide `/administrator` în browser.
- Introdu parola configurată în variabila `ADMIN_PASSWORD` (din `.env.local` sau din secretele VM1).
- La autentificare reușită, interfața încarcă valorile curente în formulare și afișează panoul de sinteză live.

## 3. Actualizarea prin API
Actualizarea se poate face fie direct din interfață, fie printr-un apel POST autorizat:
```bash
curl -X POST http://localhost:3000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"password": "...", "settings": { ... }}'
```
Modificările intră în vigoare imediat pe paginile dinamice.
