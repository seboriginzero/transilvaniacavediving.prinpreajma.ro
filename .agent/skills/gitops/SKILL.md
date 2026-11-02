---
name: gitops
description: >-
  Fluxul operațional complet GitOps: verificare locală (lint & build), sincronizare cu
  depozitul GitHub oficial (origin/main), declanșarea deploy-ului pe serverul Proxmox VM1
  și verificarea containerului Docker și a endpoint-ului public.
---

# Flux Operațional GitOps — Transilvania Cave Diving

Această abilitate documentează comanda unificată și etapele pipeline-ului de livrare automată către producție.

## 1. Comandă Rapidă All-in-One

Pentru a livra o modificare nouă în producție, parcurge secvența:

```bash
# 1. Verificare integritate
npm run lint && npm run build

# 2. Sincronizare depozit GitHub
git add -A && git commit -m "feat/fix(domeniu): descriere" && git push origin main

# 3. Execuție deploy pe Proxmox VM1
ssh antigravity@192.168.57.51 "bash /home/antigravity/tenants/transilvaniacavediving/deploy-gitops.sh"

# 4. Verificare răspuns producție
curl -s -i https://transilvaniacavediving.prinpreajma.ro/api/health
```

## 2. Puncte de Control
- **Compilare Next.js**: Verifică ca toate cele 27 de rute să fie generate fără erori.
- **Docker VM1**: Verifică ca imaginea `transilvaniacavediving:latest` să fie reconstruită și containerul `originzero-tenant-transilvaniacavediving` să ruleze (`Up`).
- **Nginx & SSL**: Verifică ca `https://transilvaniacavediving.prinpreajma.ro` să returneze `HTTP 200 OK`.
