# FoodLoop AI - Deployment Guide

Complete instructions for deploying FoodLoop AI to production.

## Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] No console errors in development
- [ ] Update README with your deployment URL
- [ ] Set up environment variables (.env)
- [ ] Test all user flows (provider, recipient, volunteer)

## 1️⃣ Vercel (Recommended - Easiest)

### Setup

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to Vercel account (or create one)
   - Select framework: React
   - Confirm build settings

4. **Get your URL:** Deployment complete! 🎉

### Configure Custom Domain
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS setup instructions

## 2️⃣ Netlify

### Via Web UI (Easiest)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Go to [netlify.com](https://netlify.com)**
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "New site from Git"
   - Connect your repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click Deploy

### Via CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# For first time setup
netlify init
```

### Configure Custom Domain
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records

## 3️⃣ GitHub Pages

### Setup

1. **Update vite.config.js:**
   ```javascript
   export default {
     base: '/foodloop-ai/',  // your-repo-name
     // ... rest of config
   }
   ```

2. **Update package.json scripts:**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && git add dist && git commit -m 'Deploy' && git push origin main"
     }
   }
   ```

3. **Go to GitHub → Settings → Pages**
   - Source: Deploy from branch
   - Branch: main
   - Folder: /root or /docs

4. **Save and deploy:**
   ```bash
   npm run build
   # Manually upload dist folder to gh-pages branch
   ```

## 4️⃣ Docker (Self-Hosted)

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build & Run

```bash
# Build image
docker build -t foodloop-ai:latest .

# Run container
docker run -p 3000:3000 foodloop-ai:latest

# Access at http://localhost:3000
```

### Docker Compose

```yaml
version: '3.8'
services:
  foodloop:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_APP_NAME=FoodLoop AI
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 5️⃣ AWS

### Via Amplify (Easiest for AWS)

1. **Connect GitHub repository:**
   - Go to AWS Amplify
   - Click "New App" → "Host web app"
   - Connect GitHub
   - Select repository and branch

2. **Configure build settings:**
   - Build command: `npm run build`
   - Start command: keep empty
   - Output directory: `dist`

3. **Save and deploy** - Automatic! 🚀

### Via S3 + CloudFront

1. **Build:**
   ```bash
   npm run build
   ```

2. **Create S3 bucket:**
   - S3 → Create bucket
   - Upload `dist/` contents
   - Enable static website hosting

3. **Setup CloudFront:**
   - Create distribution
   - Set S3 as origin
   - Update DNS to CloudFront URL

## 6️⃣ Railway.app

1. **Go to [railway.app](https://railway.app)**
2. Create new project → Deploy from GitHub
3. Connect repository
4. Railway auto-detects Node.js project
5. Set build command: `npm run build`
6. Custom start: `npm run preview`
7. Click Deploy!

## 7️⃣ Azure Static Web Apps

1. **Connect GitHub:**
   - Azure Portal → Static Web Apps
   - Create new → Select GitHub repo

2. **Configure:**
   - App location: `/`
   - API location: (leave empty)
   - Output location: `dist`

3. **Deploy** - Auto-deployed on push! 🎉

## Environment Setup Across Platforms

### Vercel (.env.production)
```
VITE_API_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
```

### Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[env]
  VITE_API_URL = "https://api.yourdomain.com"
```

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: ./github-pages-deploy-action@releases/v4
        with:
          folder: dist
```

## Domain Configuration

### Point Domain to Deployment

**For Vercel/Netlify:**
- Go to provider dashboard
- Add domain
- Update DNS CNAME records
- Verify SSL certificate (auto)

**For Custom Server:**
- Update A/AAAA records to server IP
- Setup SSL with Let's Encrypt
- Configure reverse proxy (Nginx/Apache)

### Example Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL certificates
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    
    # Root directory
    root /var/www/foodloop/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Continuous Deployment

### GitHub Actions (Auto-Deploy on Push)

1. **Create `.github/workflows/deploy.yml`**
2. **Configure secrets:**
   - Vercel token
   - Netlify token
   - Or any other deployment service

3. **On every push to main:**
   - Tests run
   - Build created
   - Auto-deployed ✅

## Performance Optimization

### Before Deployment

1. **Optimize bundle:**
   ```bash
   npm run build
   npm i -g serve
   serve -s dist  # Test production
   ```

2. **Check size:**
   ```bash
   npm install -g esbuild
   esbuild --version
   ```

3. **Minify assets:**
   - Already done by Vite ✅

### After Deployment

1. **Enable caching:**
   - Cache-Control headers: 1 year for `/assets`
   - Cache-Control headers: no-cache for `/index.html`

2. **Enable compression:**
   - Gzip enabled automatically
   - Brotli for supported browsers

3. **Monitor performance:**
   - Use Lighthouse
   - Monitor Core Web Vitals
   - Setup error tracking

## Monitoring & Maintenance

### Setup Error Tracking

**Sentry Integration** (Optional):
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Setup Analytics (Optional)

**Google Analytics**:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', {...});
  gtag('config', 'GA_ID');
</script>
```

### Health Checks

- Monitor uptime
- Check error rates
- Monitor response times
- Track user sessions

## Rollback Plan

### If Deployment Fails

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Dashboard → Deploys → Previous version → Publish

**GitHub Pages:**
```bash
git revert <commit-hash>
git push origin main
```

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
npm install
npm run build
```

### Blank Page After Deploy
- Check `index.html` served correctly
- Verify `vite.config.js` base path
- Check browser console for errors
- Test with `npm run preview` locally

### CORS Issues
- Add headers to server config
- Or use `/api` proxy

### 404 on Refresh
- Configure server to route all requests to `index.html`
- Most platforms handle this automatically

## Final Checklist

- [ ] App builds successfully
- [ ] No console errors
- [ ] All routes work
- [ ] Responsive on mobile
- [ ] Performance score > 80
- [ ] Deployed and accessible
- [ ] Domain configured
- [ ] SSL certificate valid
- [ ] Monitoring setup
- [ ] Backup plan ready

---

## Quick Deploy Scripts

### One-Line Deploy to Vercel
```bash
npm run build && vercel --prod
```

### One-Line Deploy to Netlify  
```bash
npm run build && netlify deploy --prod --dir=dist
```

### Deploy to Multiple Platforms
```bash
npm run build && \
vercel --prod && \
netlify deploy --prod --dir=dist
```

---

**Your FoodLoop AI is now ready for the world! 🌍**

For support, refer to your platform's documentation or community forums.
