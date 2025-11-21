#!/bin/bash

# Vercel Deployment Script
# This script automates the deployment process

echo "🚀 AI Receipt Generator - Vercel Deployment Script"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Verify we're in the correct directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this from the project root."
    exit 1
fi

echo "📁 Project directory verified"
echo ""

# Check git status
echo "📊 Checking git status..."
git status

echo ""
echo "🔐 Authenticating with Vercel..."
echo "Please sign in with your Vercel/GitHub account in the browser that opens."
echo ""

# Authenticate with Vercel
vercel auth login

echo ""
echo "🚀 Deploying to Vercel..."
echo "This may take a few minutes..."
echo ""

# Deploy to Vercel
vercel deploy --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy your deployment URL from above"
echo "2. Go to https://vercel.com/dashboard to manage your project"
echo "3. Add environment variables in Project Settings"
echo "4. Update Supabase callback URLs"
echo ""
echo "Need help? Read DEPLOY.md for detailed instructions"
