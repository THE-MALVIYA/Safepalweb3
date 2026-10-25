# 🚀 VPS Hosting & Deployment Guide for SafePal Web App

This guide explains how to properly run the full-stack SafePal application on an Ubuntu / Debian VPS with Nginx and PM2 so that you never encounter the `"Unable to connect to server"` error.

---

## 📌 Why did the error happen?
The application is a **full-stack app**:
1. **Frontend**: React + Tailwind + Vite SPA.
2. **Backend**: Express Node.js server (`server.ts` or `dist/server.cjs`) that manages user login, real-time database sync (`/api/sync`), wallet transfers (`/api/transfer/internal`), and admin controls.

If you only copied the `dist/` HTML files into Nginx or Apache without running the Node.js backend server, or if Nginx did not forward `/api/*` requests to port `3000`, the login API could not be reached and showed:
> *"Unable to connect to server. Please check your network connection."*

---

## 🛠️ Step-by-Step VPS Setup Guide

### Step 1: Install Node.js (v18+) and PM2 on your VPS
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Install PM2 globally to keep the server running 24/7
sudo npm install -g pm2
```

---

### Step 2: Upload or Clone the Project
Upload your project files to `/var/www/safepal` (or your chosen directory).

```bash
cd /var/www/safepal

# Install dependencies
npm install

# Build the frontend and backend server bundle
npm run build
```

---

### Step 3: Start the Backend Server using PM2
Run the production server using PM2 so it automatically restarts if rebooted:

```bash
cd /var/www/safepal

# Start the server with PM2
pm2 start dist/server.cjs --name "safepal"

# Save PM2 process list so it starts on VPS reboot
pm2 save
pm2 startup
```

Verify that the server is running:
```bash
pm2 status
curl http://127.0.0.1:3000/api/health
# Output should be: {"status":"ok","app":"SafePal Web Crypto Wallet", ...}
```

---

### Step 4: Configure Nginx as Reverse Proxy

Create or edit your Nginx site configuration (e.g. `/etc/nginx/sites-available/safepalweb3.sbs`):

```nginx
server {
    listen 80;
    server_name safepalweb3.sbs www.safepalweb3.sbs;

    # Maximum upload size for QR codes / receipts
    client_max_body_size 25M;

    # Proxy all traffic to the Node.js Express server running on port 3000
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
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/safepalweb3.sbs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 5: Install Free SSL Certificate (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d safepalweb3.sbs -d www.safepalweb3.sbs
```

---

### 🔑 Admin Credentials
- **Admin Email**: `legendxadmin1999@gmail.com`
- **Admin Password**: `Joshi$12legend`
