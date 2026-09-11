# Minecraft1 — 3D Voxel Sandbox

A high-performance 3D voxel sandbox game inspired by Minecraft, featuring infinite world generation, block placement/destruction, inventory management, tiered tool crafting, survival mechanics, day-night cycle, and 3D artifact exploration.

---

## 🚀 Deploying to Vercel (vercel.com)

This game is fully optimized for **zero-config deployment on [Vercel](https://vercel.com/)** with global Edge CDN caching and serverless API endpoints.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push or export this repository to your **GitHub**, **GitLab**, or **Bitbucket** account.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel automatically detects the project configuration via `vercel.json`:
   - **Framework Preset**: Other (or None)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `./` (leave default)
5. Click **Deploy**. Your game will be live with a production URL in seconds!

---

### Option 2: Deploy via Vercel CLI

You can deploy directly from your terminal using the Vercel CLI:

```bash
# 1. Install or run Vercel CLI
npx vercel

# 2. Follow the on-screen prompts (accept default settings)

# 3. Deploy to production
npx vercel --prod
```

---

## ⚡ Optimizations Included for Vercel

- **`vercel.json` Configuration**:
  - **Edge Caching**: Immutable 1-year cache headers for static visual assets, textures, and fonts.
  - **Fast Invalidation**: Revalidation on root `index.html` ensuring players always receive the newest updates immediately.
  - **Security Headers**: `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, strict referrer policy, and device permission policies.
  - **Route Rewrites**: Clean URL routing and legacy route aliases.
- **Serverless API (`api/health.js`)**:
  - Native Vercel Serverless Function answering `/api/health` queries with low latency.
- **Resource Preloading (`index.html`)**:
  - `preconnect` and `dns-prefetch` for fast connection establishment to JSDelivr CDN and asset hosts.
  - `modulepreload` for the Three.js 3D engine, accelerating First Contentful Paint and world boot time.
  - PWA mobile web app tags and theme color integration.

---

## 💻 Local Development

To run the game locally using Node.js:

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
