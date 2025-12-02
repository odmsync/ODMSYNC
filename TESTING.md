# Testing Netlify Functions

## Quick Test (Browser Console)

Open your browser console on your site and run:

```javascript
fetch("/.netlify/functions/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Test ODMSYNC" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Local Testing

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Set Environment Variable

Create `.env` file in project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Start Netlify Dev

```bash
netlify dev
```

This will:
- Start Vite dev server on `http://localhost:5173`
- Start Netlify Functions on `http://localhost:8888`
- Functions available at `http://localhost:8888/.netlify/functions/`

### 4. Test Function

**Option A: Browser Console**
```javascript
fetch("http://localhost:8888/.netlify/functions/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Test ODMSYNC" })
})
.then(r => r.json())
.then(console.log);
```

**Option B: Test Script**
```bash
npm run test:gemini
```

**Option C: cURL**
```bash
curl -X POST http://localhost:8888/.netlify/functions/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test ODMSYNC"}'
```

## Production Testing

After deploying to Netlify:

1. Set `GEMINI_API_KEY` in Netlify Dashboard → Site Settings → Environment Variables
2. Test using your production URL:

```javascript
fetch("https://your-site.netlify.app/.netlify/functions/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Test ODMSYNC" })
})
.then(r => r.json())
.then(console.log);
```

## Expected Response

**Success:**
```json
{
  "success": true,
  "data": {
    "text": "Response from Gemini AI...",
    "fullResponse": { ... }
  }
}
```

**Error (no API key):**
```json
{
  "success": false,
  "error": "Gemini API key not configured. Please contact support."
}
```

**Error (invalid prompt):**
```json
{
  "success": false,
  "error": "Missing or invalid prompt"
}
```

## Troubleshooting

### Function not found (404)
- Make sure `netlify dev` is running
- Check that `netlify/functions/gemini.ts` exists
- Verify `netlify.toml` has `[functions]` section

### API key error (500)
- Set `GEMINI_API_KEY` in `.env` (local) or Netlify Dashboard (production)
- Restart `netlify dev` after setting environment variable

### CORS errors
- Function includes CORS headers automatically
- Make sure you're using the correct URL (localhost:8888 for local dev)

### Network errors
- Check your internet connection
- Verify Gemini API is accessible
- Check Netlify function logs: `netlify functions:log`

