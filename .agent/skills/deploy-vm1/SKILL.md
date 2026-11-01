---
name: deploy-vm1
description: >-
  Ghid operațional și comenzi pentru deploy-ul GitOps al platformei Transilvania Cave Diving
  pe serverul Proxmox VM1 (192.168.57.51), verificarea containerului Docker și a endpoint-ului de sănătate.
---

# Deploy și Verificare pe VM1 Proxmox

Această abilitate documentează pașii necesari pentru publicarea și monitorizarea aplicației pe serverul de producție VM1.

## 1. Conexiunea SSH la VM1
- **Host**: `192.168.57.51`
- **User**: `antigravity`
- **Director tenant**: `/home/antigravity/tenants/transilvaniacavediving`

Comandă rapidă de test conexiune:
```bash
ssh -o ConnectTimeout=8 antigravity@192.168.57.51 "hostname && uptime"
```

## 2. Executarea Deploy-ului GitOps
Deploy-ul se declanșează prin rularea scriptului dedicat:
```bash
ssh antigravity@192.168.57.51 "bash /home/antigravity/tenants/transilvaniacavediving/deploy-gitops.sh"
```

Scriptul execută:
1. Preluarea ultimelor commit-uri de pe `origin/main` în directorul `source/`;
2. Construirea noii imagini Docker `transilvaniacavediving:latest`;
3. Asigurarea permisiunilor pe `/app/data`;
4. Repornirea containerului cu `docker compose up -d`.

## 3. Verificarea Stării și a Răspunsului HTTP
Verifică dacă containerul este sănătos și răspunde local:
```bash
ssh antigravity@192.168.57.51 "docker ps -f name=originzero-tenant-transilvaniacavediving && curl -s -i http://127.0.0.1:3040/api/health"
```

Verifică domeniul public protejat prin reverse-proxy Nginx:
```bash
curl -s -i https://transilvaniacavediving.prinpreajma.ro/api/health
```

