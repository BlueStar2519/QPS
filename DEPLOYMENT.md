# Deployment Guide

This guide will help you deploy your Quiet Presence Score application online.

## Option 1: Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and offers the simplest deployment process.

### Steps:

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Your site will be live** at a URL like: `https://your-project-name.vercel.app`

### Vercel automatically:
- Builds your Next.js app
- Handles environment variables
- Provides HTTPS
- Enables automatic deployments on git push

---

## Option 2: Netlify

1. **Push your code to GitHub** (same as above)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

---

## Option 3: Other Platforms

### Railway
- Connect GitHub repo
- Auto-detects Next.js
- Deploys automatically

### Render
- Connect GitHub repo
- Build command: `npm run build`
- Start command: `npm start`

### DigitalOcean App Platform
- Connect GitHub repo
- Auto-detects Next.js settings

---

## Before Deploying - Quick Checklist

✅ Make sure `nc_logo.png` is in the `public/` folder  
✅ Test the build locally: `npm run build`  
✅ Ensure all dependencies are in `package.json`  
✅ Check that `.gitignore` excludes `node_modules/` and `.next/`

---

## Environment Variables

If you need to add environment variables later:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

---

## Custom Domain

After deployment, you can add a custom domain:
- **Vercel**: Project Settings → Domains
- **Netlify**: Site Settings → Domain Management

---

## Need Help?

- Vercel Docs: https://nextjs.org/docs/deployment
- Netlify Docs: https://docs.netlify.com/integrations/frameworks/nextjs/

