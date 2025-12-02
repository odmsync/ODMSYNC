# 🔴 URGENT: Fix Netlify Environment Variables

## The Problem

Your Netlify build is failing because `VITE_GEMINI_API_KEY` is set in Netlify environment variables.

**Error:**
```
"AIza***" detected as a likely secret:
  found value at line 34 in dist/assets/index-Clgr7hov.js
```

## Why This Happens

Vite bundles **ALL** `VITE_` prefixed environment variables into the client JavaScript bundle, even if your code doesn't use them. This means:

1. `VITE_GEMINI_API_KEY` gets bundled into `dist/assets/index-*.js`
2. Secret scanner detects "AIza" (Google API key prefix)
3. Build fails for security reasons

## The Fix (2 Minutes)

### Step 1: Remove VITE_GEMINI_API_KEY

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**
2. Find `VITE_GEMINI_API_KEY` in the list
3. Click the **trash icon** to delete it
4. Confirm deletion

### Step 2: Verify GEMINI_API_KEY Exists

Make sure you have:
- ✅ `GEMINI_API_KEY` = `your_actual_api_key_here`

This is the **only** API key you need. It's used server-side by Netlify Functions and never exposed to the client.

### Step 3: Clear Cache and Redeploy

1. Go to **Netlify Dashboard** → **Deploys**
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for build to complete

## Expected Result

✅ Build succeeds  
✅ No "AIza" detected in secrets scan  
✅ No `gemini-vendor-*.js` in build output  
✅ Chat widget works via Netlify Functions  

## Why This Architecture is Secure

- **Frontend**: Calls `/.netlify/functions/gemini` (no API keys)
- **Netlify Function**: Uses `GEMINI_API_KEY` (server-side only)
- **API Key**: Never exposed to browser, never bundled in client code

## Quick Reference

**✅ DO SET:**
- `GEMINI_API_KEY` (server-side only)

**❌ DO NOT SET:**
- `VITE_GEMINI_API_KEY` (gets bundled into client code)

---

**After fixing, your build will succeed!** 🎉

