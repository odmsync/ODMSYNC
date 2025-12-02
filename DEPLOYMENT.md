# Netlify Deployment Guide

## ⚠️ CRITICAL: Environment Variables Setup

### Required Environment Variables

**ONLY set these in Netlify Dashboard:**

1. `GEMINI_API_KEY` = `your_api_key_here`
   - Used by Netlify Functions (server-side only)
   - Never exposed to client

2. `NETLIFY_DATABASE_URL` (if using Neon database)
3. `NETLIFY_DATABASE_URL_UNPOOLED` (if using Neon database)

### ❌ DO NOT SET

**`VITE_GEMINI_API_KEY`** - **REMOVE THIS IF IT EXISTS**

- Vite bundles ALL `VITE_` prefixed variables into client code
- This will trigger secret scanning and cause build failures
- The API key will be exposed in the browser bundle
- **Delete this variable from Netlify Dashboard immediately**

---

## Deployment Steps

### 1. Check Environment Variables

Go to **Netlify Dashboard → Site Settings → Environment Variables**

**Verify:**
- ✅ `GEMINI_API_KEY` exists (with your actual key)
- ❌ `VITE_GEMINI_API_KEY` does NOT exist (delete if present)

### 2. Clear Cache and Deploy

1. Go to **Netlify Dashboard → Deploys**
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for build to complete

### 3. Verify Build Success

Check build logs for:
- ✅ No `gemini-vendor-*.js` files in build output
- ✅ No "AIza" detected in secrets scan
- ✅ Build completes successfully

---

## Why This Matters

### How Vite Environment Variables Work

- Variables prefixed with `VITE_` are **bundled into client code** at build time
- Even if your code doesn't use them, Vite includes them in the bundle
- This exposes secrets to anyone viewing your website's JavaScript

### Our Architecture

- **Frontend**: Calls `/.netlify/functions/gemini` (no API keys)
- **Netlify Function**: Uses `GEMINI_API_KEY` (server-side only, never exposed)

### Security Best Practice

- ✅ Server-side API keys (`GEMINI_API_KEY`) - Secure
- ❌ Client-side API keys (`VITE_GEMINI_API_KEY`) - Exposed in bundle

---

## Troubleshooting

### Build Fails: "AIza*** detected as likely secret"

**Cause:** `VITE_GEMINI_API_KEY` is set in Netlify environment variables

**Fix:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Find `VITE_GEMINI_API_KEY`
3. Click **Delete**
4. Clear cache and redeploy

### Build Output Shows `gemini-vendor-*.js`

**Cause:** Gemini SDK is being bundled (shouldn't happen)

**Fix:**
1. Verify `package.json` doesn't include `@google/genai` or `@google/generative-ai`
2. Run `npm install` to ensure clean dependencies
3. Clear cache and redeploy

### Chat Widget Not Working

**Possible Causes:**
1. `GEMINI_API_KEY` not set in Netlify Dashboard
2. Netlify Function not deployed
3. CORS issues

**Fix:**
1. Verify `GEMINI_API_KEY` is set in Netlify Dashboard
2. Check Netlify Function logs: Dashboard → Functions → gemini
3. Test function directly: `https://your-site.netlify.app/.netlify/functions/gemini`

---

## Quick Checklist

Before deploying:

- [ ] `GEMINI_API_KEY` is set in Netlify Dashboard
- [ ] `VITE_GEMINI_API_KEY` is **NOT** set (deleted if it existed)
- [ ] `package.json` doesn't include Gemini SDK packages
- [ ] Code doesn't import `@google/genai` or `@google/generative-ai`
- [ ] All Gemini calls go through `/.netlify/functions/gemini`

After deploying:

- [ ] Build succeeds without secret scanning errors
- [ ] No `gemini-vendor-*.js` in build output
- [ ] Chat widget works on production site
- [ ] Browser console shows no API key errors

---

## Need Help?

If you're still seeing issues:

1. Check build logs in Netlify Dashboard
2. Verify environment variables are set correctly
3. Test Netlify Function directly using browser console:
   ```javascript
   fetch("/.netlify/functions/gemini", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ prompt: "test" })
   }).then(r => r.json()).then(console.log)
   ```

