# Vercel Deployment Guide

## Overview
This guide will help you deploy the AI Receipt Generator to Vercel, a modern hosting platform optimized for Next.js applications.

## Prerequisites
- [Vercel Account](https://vercel.com/signup) (free)
- GitHub repository with this code
- Environment variables from your `.env.local` file

## Step 1: Prepare Your Repository

1. Ensure all changes are committed to Git:
```bash
git add .
git commit -m "Add Vercel configuration"
git push
```

2. Make sure `.env.local` is in `.gitignore` (it should be):
```bash
cat .gitignore | grep env
```

## Step 2: Create Vercel Project

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Select the root directory (should auto-detect)
6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from your project directory:
```bash
cd D:\Websites\Receipt\Receipt_Generator
vercel
```

3. Follow the prompts to link your project

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add the following variables from your `.env.local`:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Secret |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Public |
| `STRIPE_SECRET_KEY` | Stripe secret key | Secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Secret |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain | Public |

### Finding Your Values:

**Supabase:**
- Go to [supabase.com](https://supabase.com) → Your Project → Settings → API
- Copy URL and anon key

**Anthropic:**
- Go to [console.anthropic.com](https://console.anthropic.com) → API keys
- Copy your API key

**Stripe (if using payments):**
- Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API keys
- Copy publishable and secret keys

## Step 4: Update Callback URLs

### Supabase:
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to Redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`

### Stripe (if using webhooks):
1. Go to Developers → Webhooks
2. Add endpoint:
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

## Step 5: Build and Test

### Local build test (before deploying):
```bash
npm run build
npm start
```

### Verify Vercel Deployment:
1. Vercel will automatically build and deploy when you push to your main branch
2. Check deployment status in Vercel dashboard
3. View logs if there are any build errors

## Step 6: Database Migrations (if needed)

If you have database migrations, run them:
```bash
npx supabase migration up
```

Or use Supabase dashboard to run migrations directly.

## Step 7: Verify Deployment

Visit your deployed URL:
- `https://your-project-name.vercel.app`

Test the following:
- [ ] Landing page loads correctly
- [ ] Authentication works (Supabase)
- [ ] Dashboard loads after login
- [ ] Receipt generation works
- [ ] PDF/PNG downloads work
- [ ] Preview modal opens correctly

## Environment Variables Reference

### Public Variables (visible in client-side code)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Secret Variables (server-side only)
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Deployment Strategy

### Automatic Deployments:
- Every push to `main` branch automatically deploys to production
- Preview deployments for pull requests
- Automatic rollback if build fails

### Manual Deployments:
```bash
vercel --prod
```

## Monitoring & Logs

### View Logs:
1. Vercel Dashboard → Your Project → Deployments
2. Click on a deployment to see build logs
3. Check "Analytics" for performance metrics

### Troubleshooting:

**Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all required environment variables are set
- Run `npm run build` locally to reproduce

**Runtime Errors:**
- Check server logs: Vercel Dashboard → Logs
- Look for 500 errors in Function logs
- Check Supabase logs for database issues

## Performance Optimization

Vercel automatically provides:
- Edge Function caching
- Image optimization via Next.js Image component
- Automatic code splitting
- Tree-shaking of unused code

Additional optimization:
```javascript
// Use dynamic imports for large components
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('./heavy'))
```

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records:
   - Add CNAME pointing to `cname.vercel-dns.com`
   - Or update A records as shown in Vercel dashboard

## Git Integration

Your project is connected to GitHub. Every commit to:
- **main** → Deploys to production
- **Pull requests** → Creates preview deployment
- **Other branches** → Ignored (can be configured)

## Useful Vercel Commands

```bash
# Deploy (interactive)
vercel

# Deploy to production
vercel --prod

# View project settings
vercel env pull

# View deployments
vercel deployments

# Open project dashboard
vercel open
```

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/hosting/vercel)
- [Vercel Support](https://vercel.com/support)

## Costs

Vercel offers:
- **Free plan**: Perfect for getting started
  - 1 project, automatic deployments, basic analytics
  - Perfect for development/testing

- **Pro plan**: $20/month
  - Unlimited projects, team collaboration, advanced features

- **Enterprise**: Custom pricing
  - Dedicated support, SLA, custom configurations

For this project, the free plan should be sufficient initially.

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Supabase callback URLs updated
- [ ] Stripe webhooks configured
- [ ] Custom domain (if applicable) set up
- [ ] HTTPS enabled (automatic)
- [ ] Database backups configured
- [ ] Monitoring/alerts enabled
- [ ] Analytics reviewed

## Rolling Back

If deployment has issues:
1. Vercel Dashboard → Deployments
2. Find previous good deployment
3. Click the three dots → "Promote to Production"

Automatic rollback on build failure prevents broken deployments.

---

**Deployment Date**: [Your deployment date]
**Live URL**: https://your-domain.vercel.app
