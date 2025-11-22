# Vercel Deployment Script for PowerShell
# Usage: .\QUICK_DEPLOY.ps1

Write-Host "🚀 AI Receipt Generator - Vercel Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
if ($null -eq $vercelPath) {
    Write-Host "❌ Vercel CLI is not installed" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
Write-Host ""

# Verify we're in the correct directory
if (!(Test-Path "vercel.json")) {
    Write-Host "❌ Error: vercel.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Project directory verified" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Show environment files
Write-Host "🔍 Configuration Files:" -ForegroundColor Yellow
Write-Host "  ✓ vercel.json - Deployment configuration"
Write-Host "  ✓ .vercelignore - Files to exclude"
Write-Host "  ✓ Next.js 14.1.0 - Framework"
Write-Host ""

Write-Host "🔐 Authenticating with Vercel..." -ForegroundColor Yellow
Write-Host "Please sign in with your Vercel/GitHub account" -ForegroundColor Yellow
Write-Host "(A browser window will open for authentication)" -ForegroundColor Yellow
Write-Host ""

# Authenticate with Vercel
vercel login

Write-Host ""
Write-Host "🚀 Deploying your application..." -ForegroundColor Cyan
Write-Host "This may take 2-5 minutes. Please wait..." -ForegroundColor Yellow
Write-Host ""

# Deploy to Vercel
$deployResult = vercel deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Your Application is Live!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Deployment Details:" -ForegroundColor Cyan
    Write-Host "  Project: AI Receipt Generator"
    Write-Host "  Platform: Vercel"
    Write-Host "  Framework: Next.js 14.1.0"
    Write-Host ""
    Write-Host "🔗 Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://vercel.com/dashboard"
    Write-Host "  2. Select your project"
    Write-Host "  3. Go to Settings → Environment Variables"
    Write-Host "  4. Add these from your .env.local:"
    Write-Host "     - NEXT_PUBLIC_SUPABASE_URL"
    Write-Host "     - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    Write-Host "     - SUPABASE_SERVICE_ROLE_KEY"
    Write-Host "     - ANTHROPIC_API_KEY"
    Write-Host "     - NEXT_PUBLIC_APP_URL"
    Write-Host ""
    Write-Host "  5. Update Supabase authentication URLs:"
    Write-Host "     - Go to Supabase Project → Authentication → URL Configuration"
    Write-Host "     - Add redirect URL: https://<your-domain>.vercel.app/auth/callback"
    Write-Host ""
    Write-Host "  6. Redeploy to apply environment variables"
    Write-Host ""
    Write-Host "✅ Read DEPLOY.md for detailed post-deployment instructions" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "Please check the error message above and try again" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Yellow
    Write-Host "  - Verify you're logged in: vercel whoami"
    Write-Host "  - Check logs: vercel logs"
    Write-Host "  - Read docs: https://vercel.com/docs"
}

Write-Host ""
