# Deploy to Netlify - Step by Step Guide

Your project is already configured for Netlify deployment! Follow these steps:

## Prerequisites

1. ✅ Your code is ready (already configured)
2. A GitHub account (free)
3. A Netlify account (free at [netlify.com](https://netlify.com))

---

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Create your first commit**:
   ```bash
   git commit -m "Initial commit - Quiet Presence Score"
   ```

4. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click the "+" icon → "New repository"
   - Name it (e.g., "quiet-presence-score")
   - Don't initialize with README (you already have files)
   - Click "Create repository"

5. **Connect and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name)

---

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Sign up/Login to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Sign up" (or "Log in" if you have an account)
   - Choose "Sign up with GitHub" for easiest setup

2. **Import your project**:
   - Once logged in, click **"Add new site"** → **"Import an existing project"**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub account if prompted
   - Select your repository from the list

3. **Configure build settings** (Netlify should auto-detect these):
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - These should be pre-filled from your `netlify.toml` file

4. **Deploy**:
   - Click **"Deploy site"**
   - Wait 1-3 minutes for the build to complete
   - Watch the build logs in real-time

5. **Your site is live!**:
   - Netlify will assign a URL like: `https://random-name-123.netlify.app`
   - You can click on it to see your live site

### Option B: Deploy via Netlify CLI (Alternative)

If you prefer using the command line:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   netlify init
   ```
   - Follow the prompts to connect to your site
   - Choose "Create & configure a new site"
   - Choose your team (or create one)

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

---

## Step 3: Customize Your Site

### Change Site Name

1. Go to **Site Settings** → **Change site name**
2. Enter a custom name (e.g., "quiet-presence-score")
3. Your new URL will be: `https://your-custom-name.netlify.app`

### Add Custom Domain (Optional)

1. Go to **Site Settings** → **Domain Management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Netlify will provide DNS records to add to your domain registrar

---

## Step 4: Automatic Deployments

Netlify automatically deploys when you push to GitHub:

- **Every push to `main` branch** → Deploys to production
- **Pull requests** → Creates preview deployments
- **No manual action needed!**

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```
Netlify will automatically rebuild and deploy!

---

## Step 5: Environment Variables (If Needed)

If you need to add environment variables later:

1. Go to **Site Settings** → **Environment Variables**
2. Click **"Add variable"**
3. Add your key-value pairs
4. Redeploy for changes to take effect

---

## Troubleshooting

### Build Fails

1. **Check build logs**: Click on the failed deployment to see error messages
2. **Test locally first**: Run `npm run build` locally to catch errors
3. **Check Node version**: Netlify uses Node 18 by default (you can change this in Site Settings → Build & Deploy → Environment)

### Site Shows 404

- This is normal for client-side routing. The `netlify.toml` redirects should handle this.
- If you see 404s, check that the redirect rule in `netlify.toml` is correct

### Assets Not Loading

- Verify that the `out` folder contains all files after build
- Check that `public/` folder files are included in the build

### Need to Change Build Settings

- Edit `netlify.toml` in your repository
- Or go to Site Settings → Build & Deploy → Build settings

---

## Your Current Configuration

✅ **netlify.toml** - Already configured with:
- Build command: `npm run build`
- Publish directory: `out`
- Redirects for client-side routing

✅ **next.config.js** - Already configured with:
- Static export enabled
- Images unoptimized (for static hosting)

---

## Quick Reference

- **Netlify Dashboard**: [app.netlify.com](https://app.netlify.com)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js on Netlify**: [docs.netlify.com/integrations/frameworks/nextjs/](https://docs.netlify.com/integrations/frameworks/nextjs/)

---

## Need Help?

- Check Netlify's [community forum](https://answers.netlify.com/)
- Review [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Check your build logs in the Netlify dashboard

