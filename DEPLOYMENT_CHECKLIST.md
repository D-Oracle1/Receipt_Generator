# Vercel Deployment Quick Checklist

## Pre-Deployment (5 minutes)

### 1. Create Vercel Account
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Connect your GitHub account
- [ ] Create organization (optional)

### 2. Push Code to GitHub
```bash
git push origin main
```

## Deployment (10 minutes)

### 3. Import Project to Vercel
1. [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. [ ] Click "Add New" → "Project"
3. [ ] Select your GitHub repository
4. [ ] Click "Import"
5. [ ] Vercel will auto-detect Next.js framework (confirm it does)
6. [ ] Keep root directory as-is

### 4. Add Environment Variables
In Vercel Project Settings → Environment Variables, add:

**Public Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = <your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-anon-key>
NEXT_PUBLIC_APP_URL = https://<your-project>.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...  (if using Stripe)
```

**Secret Variables:**
```
SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>
ANTHROPIC_API_KEY = sk-ant-...
STRIPE_SECRET_KEY = sk_live_...  (if using Stripe)
STRIPE_WEBHOOK_SECRET = whsec_...  (if using Stripe)
```

### 5. Deploy
1. [ ] Click "Deploy" button
2. [ ] Wait for build to complete (2-3 minutes)
3. [ ] Verify deployment says "Ready"

## Post-Deployment (5 minutes)

### 6. Update Supabase Configuration
1. [ ] Go to Supabase Project Settings → Authentication → URL Configuration
2. [ ] Add to "Redirect URLs":
   - `https://<your-project>.vercel.app/auth/callback`
3. [ ] Add to "Site URL":
   - `https://<your-project>.vercel.app`

### 7. Test Deployment
- [ ] Visit `https://<your-project>.vercel.app`
- [ ] Test login with email (Supabase auth)
- [ ] Test Google sign-in (if enabled)
- [ ] Navigate to dashboard
- [ ] Test receipt generation
- [ ] Download PDF/PNG
- [ ] Preview receipt in modal
- [ ] Sign out

### 8. Configure Custom Domain (Optional)
1. [ ] Go to Project Settings → Domains
2. [ ] Add your custom domain
3. [ ] Update DNS records as shown
4. [ ] Wait 24-48 hours for DNS propagation

### 9. Enable Analytics (Optional)
1. [ ] Go to Analytics tab
2. [ ] View real-time traffic and performance metrics
3. [ ] Set up monitoring alerts if needed

## Final Verification

- [ ] Landing page loads at correct URL
- [ ] All images and styling load correctly
- [ ] Navigation works (buttons lead to login)
- [ ] Login page displays properly with lavender theme
- [ ] Supabase authentication works (test login)
- [ ] Dashboard shows after login
- [ ] Can access receipt generator
- [ ] Receipt generation completes
- [ ] Downloads work (PDF and PNG)
- [ ] Preview modal opens and displays receipt
- [ ] Icons are visible on dark background
- [ ] Performance is acceptable (check Vercel Analytics)

## Troubleshooting Quick Links

**Build Failed:**
- [ ] Check Vercel build logs
- [ ] Run `npm run build` locally
- [ ] Check for missing environment variables

**Runtime Errors:**
- [ ] Check Function logs in Vercel
- [ ] Verify environment variables match .env.local
- [ ] Test locally: `npm run build && npm start`

**Authentication Issues:**
- [ ] Verify Supabase redirect URLs are correct
- [ ] Check NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
- [ ] Test in incognito window to clear cache

**Styling Issues:**
- [ ] Clear browser cache
- [ ] Check Tailwind CSS build (should be in bundle)
- [ ] Verify vercel.json build settings

## Useful Commands

```bash
# Check build locally before deploying
npm run build

# Test production build locally
npm start

# View Vercel project
vercel open

# View deployment logs
vercel logs

# Redeploy last deployment
vercel redeploy
```

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Supabase Integration](https://supabase.com/docs/guides/hosting/vercel)
- [Community Help](https://vercel.com/support)

## Timeline

| Step | Time | Status |
|------|------|--------|
| Create Vercel Account | 2 min | ⬜ |
| Push to GitHub | 1 min | ⬜ |
| Import & Configure | 5 min | ⬜ |
| Build & Deploy | 3 min | ⬜ |
| Test | 5 min | ⬜ |
| **Total** | **~15 min** | ⬜ |

---

**Total estimated time: 15-20 minutes** ⏱️

Your application will be live after deployment! 🚀
