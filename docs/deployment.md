# Production Deployment & Operations Guide (Ubuntu 24.04 LTS)

## 1. Target Architecture

The reconstructed **Transilvania Cave Diving** platform is built on **Next.js (App Router, TypeScript strict mode, Tailwind CSS)** and supports both standalone Node.js server execution (via `systemd` or `Docker Compose`) behind an **Nginx** or **Caddy** reverse proxy with TLS 1.3 termination.

- **Target OS**: Ubuntu 24.04 LTS (`noble`)
- **Node.js Runtime**: Node.js 20 LTS / 22 LTS / 25.x
- **Health Check Endpoint**: `GET /api/health` (returns HTTP `200 OK` with JSON status, build version, content inventory count, and uptime)

---

## 2. Local Development & Verification

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Run local development server
npm run dev

# 4. Run crawler & content completeness verification scripts
npm run verify:completeness

# 5. Run unit and Playwright E2E test suites
npm test
npm run test:e2e

# 6. Build and run production server locally
npm run build
npm run start
```

---

## 3. Ubuntu 24.04 LTS Bare-Metal / VM Deployment (`systemd` + `Nginx`)

### 3.1 System Preparation

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Allow SSH, HTTP, and HTTPS through firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 3.2 Application Installation

```bash
sudo mkdir -p /var/www/transilvaniacavediving.com
sudo chown -R $USER:$USER /var/www/transilvaniacavediving.com

# Copy or clone the repository into /var/www/transilvaniacavediving.com
cd /var/www/transilvaniacavediving.com
npm ci
cp .env.example .env
# Edit .env with production values
npm run build
```

### 3.3 `systemd` Service Configuration (`/etc/systemd/system/transilvania-cavediving.service`)

```ini
[Unit]
Description=Transilvania Cave Diving Next.js Production Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/transilvaniacavediving.com
EnvironmentFile=/var/www/transilvaniacavediving.com/.env
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=transilvania-cavediving

# Security hardening for systemd unit
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo chown -R www-data:www-data /var/www/transilvaniacavediving.com/.next
sudo systemctl daemon-reload
sudo systemctl enable --now transilvania-cavediving.service
sudo systemctl status transilvania-cavediving.service
```

### 3.4 Nginx Reverse Proxy & HTTPS Termination (`/etc/nginx/sites-available/transilvaniacavediving.com`)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name transilvaniacavediving.com www.transilvaniacavediving.com;

    # Canonical www -> non-www redirect
    if ($host = www.transilvaniacavediving.com) {
        return 301 https://transilvaniacavediving.com$request_uri;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Long-term immutable cache for static assets and local media archive
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /media/ {
        root /var/www/transilvaniacavediving.com/public;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri =404;
    }
}
```

Enable site and provision Let's Encrypt TLS certificate:

```bash
sudo ln -s /etc/nginx/sites-available/transilvaniacavediving.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d transilvaniacavediving.com -d www.transilvaniacavediving.com
```

---

## 4. Docker Compose Deployment Option

A production `docker-compose.yml` is also supported for containerized environments:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "127.0.0.1:3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

