# Build & Output Configuration Guide

## Overview

This document explains the optimized build and output settings configured for production deployment on Vercel.

---

## Next.js Configuration (`next.config.js`)

### Performance Optimizations

```javascript
output: 'standalone'        // Self-contained build, no node_modules needed
compress: true              // Enable gzip compression
swcMinify: true            // Fast SWC minification instead of Terser
```

**Benefits:**
- ✅ Smaller deployment bundle
- ✅ Faster build times
- ✅ Better caching
- ✅ Optimal Vercel integration

### Image Optimization

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
    { protocol: 'https', hostname: '**.vercel-storage.com' }
  ],
  formats: ['image/avif', 'image/webp'],  // Modern formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
}
```

**Benefits:**
- ✅ Automatic format conversion (AVIF, WebP)
- ✅ Responsive images for all devices
- ✅ Lazy loading by default
- ✅ Smaller file sizes

### Caching Strategy

**Pages (1 hour):**
```
Cache-Control: public, max-age=3600, s-maxage=3600
```

**API Routes (No cache):**
```
Cache-Control: public, max-age=0, must-revalidate
```

**Static Assets (1 year):**
```
Cache-Control: public, max-age=31536000, immutable
```

### Server Actions

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',              // Large file uploads
    allowedOrigins: ['*.vercel.app', 'localhost']
  },
  optimizePackageImports: [
    '@radix-ui/react-dialog',
    '@radix-ui/react-select',
    '@radix-ui/react-tabs',
    'lucide-react'
  ]
}
```

**Benefits:**
- ✅ Optimized bundle for UI libraries
- ✅ Smaller JavaScript bundles
- ✅ Faster initial page load

---

## Vercel Configuration (`vercel.json`)

### Build Settings

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next"
}
```

### Environment Variables

**Build-time variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `ANTHROPIC_API_KEY`

**Handled via Vercel secrets (not in build):**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Function Configuration

```json
"functions": {
  "api/**/*.ts": {
    "maxDuration": 60,      // 60 second timeout for API routes
    "memory": 1024          // 1GB memory for large operations
  }
}
```

**Optimized for:**
- ✅ Receipt PDF generation (CPU-intensive)
- ✅ OCR/layout extraction (memory-intensive)
- ✅ AI API calls (may take time)

### Security Headers

```
X-Content-Type-Options: nosniff          // Prevent MIME sniffing
X-Frame-Options: DENY                    // Prevent clickjacking
X-XSS-Protection: 1; mode=block         // XSS protection
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Caching Headers

**Static files (forever):**
```
/_next/static/*
Cache-Control: public, max-age=31536000, immutable
```

**Images (24 hours):**
```
/images/*
Cache-Control: public, max-age=86400
```

---

## Build Process Flow

```
┌─────────────────────────────────────────┐
│ 1. Install Dependencies                  │
│    npm install --legacy-peer-deps        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. TypeScript Compilation               │
│    next build                           │
│    - Type checking                      │
│    - Code splitting                     │
│    - Image optimization                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Bundling & Minification              │
│    - SWC minify                         │
│    - Tree shaking                       │
│    - Code compression                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Output to .next Directory            │
│    - Standalone build                   │
│    - No node_modules required           │
│    - Ready for deployment               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Vercel Deployment                    │
│    - CDN distribution                   │
│    - Edge caching                       │
│    - Automatic scaling                  │
└─────────────────────────────────────────┘
```

---

## Build Output Structure

```
.next/
├── standalone/              # Self-contained app
│   ├── node_modules/       # Only prod dependencies
│   ├── .next/              # Pre-built app
│   └── public/             # Static files
├── static/                 # Static assets
│   ├── css/               # CSS files
│   ├── chunks/            # JS chunks
│   └── images/            # Optimized images
├── server/                # Server code
│   ├── app/              # App routes
│   ├── app-render.js     # React renderer
│   └── pages/            # Page components
└── BUILD_ID              # Build identifier
```

---

## Build Optimization Tips

### 1. Code Splitting
- Automatic per-route code splitting
- Only download code for current page
- Lazy loading for unused components

### 2. Image Optimization
- Automatic WebP/AVIF conversion
- Responsive images
- Lazy loading

### 3. CSS Optimization
- Tailwind CSS purging
- Critical CSS inlining
- Minified output

### 4. JavaScript Minification
- SWC minifier (faster than Terser)
- Tree shaking removes unused code
- Gzip compression

### 5. Build Caching
- Incremental static regeneration
- Vercel Edge Caching
- Browser caching headers

---

## Monitoring Build Performance

### Build Time Targets
```
Install Dependencies:    30-45s  (depends on network)
Type Checking:           10-15s
Bundling:               20-30s
Total Build Time:       60-90s  (goal)
```

### Check Build Size
```bash
# Local build analysis
npm run build

# Check .next directory
du -sh .next/

# View build output
ls -la .next/
```

### Vercel Analytics
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics"
4. Monitor:
   - Build duration
   - Bundle size
   - Function execution times

---

## Environment Variable Handling

### Public Variables (in bundle)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Secret Variables (server-only)
```
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### Setting in Vercel
1. Project Settings → Environment Variables
2. Add variable name and value
3. Select which environments (Production/Preview/Development)
4. Redeploy to apply changes

---

## Troubleshooting Build Issues

### Build Fails with "out of memory"
**Solution:** Increase function memory in `vercel.json`:
```json
"api/**/generate.ts": {
  "maxDuration": 60,
  "memory": 2048
}
```

### Timeout on Receipt Generation
**Solution:** API routes already configured for 60-second timeout. For longer operations, use background jobs.

### Missing Environment Variables
**Solution:**
1. Verify variable is set in Vercel settings
2. Check variable name matches code
3. Rebuild after adding new variables

### Large Bundle Size
**Solution:**
1. Check for unused dependencies
2. Use dynamic imports for heavy libraries
3. Enable SWC minification (already done)

### Slow Image Loading
**Solution:**
1. Ensure images are properly optimized
2. Use Next.js Image component
3. Vercel Edge Caching handles distribution

---

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Bundle size reasonable: `npm run build` shows size
- [ ] Images optimized
- [ ] API routes configured with proper timeouts
- [ ] Security headers enabled
- [ ] Caching strategy appropriate
- [ ] Supabase URLs updated
- [ ] Database backups configured

---

## Advanced Configuration

### Custom Webpack Configuration
Edit `next.config.js` webpack section:
```javascript
webpack: (config, options) => {
  config.optimization = {
    ...config.optimization,
    usedExports: true,
    sideEffects: false,
  }
  return config
}
```

### Custom Headers
Edit `next.config.js` headers section:
```javascript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      // Add custom headers here
    ],
  },
]
```

### Custom Redirects
Edit `next.config.js` redirects section:
```javascript
redirects: async () => [
  {
    source: '/old-page',
    destination: '/new-page',
    permanent: true,
  },
]
```

---

## Performance Metrics

### Expected Results (after optimization)

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~ 1.2s |
| Largest Contentful Paint | < 2.5s | ~ 2.0s |
| Cumulative Layout Shift | < 0.1 | ~ 0.05 |
| Time to Interactive | < 3.5s | ~ 2.8s |

Check actual metrics in Vercel Analytics after deployment.

---

## Support & Resources

- [Next.js Configuration](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Performance Best Practices](https://nextjs.org/learn/foundations/how-nextjs-works)

---

**Last Updated:** 2025-11-22
**Configuration Version:** 2.0
**Next.js Version:** 14.1.0
**Vercel Platform:** v2
# Last updated: Sat, Nov 22, 2025  1:47:51 AM
