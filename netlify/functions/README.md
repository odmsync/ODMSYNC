# Netlify Functions

Serverless functions for the ODM-LB website.

## Setup

### 1. Install Netlify CLI (for local development)

```bash
npm install -g netlify-cli
```

### 2. Install Function Dependencies

```bash
npm install --save-dev @netlify/functions
```

### 3. Local Development

Run Netlify dev server (includes functions):

```bash
netlify dev
```

This will:
- Start Vite dev server on port 5173
- Start Netlify Functions on port 8888
- Functions available at `http://localhost:8888/.netlify/functions/`

## Available Functions

### 1. Contact Form (`/api/contact`)

**Endpoint:** `POST /.netlify/functions/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+961 70 977 970",
  "message": "I need help with my internet connection",
  "type": "support"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact-1234567890",
    "timestamp": "2024-12-01T12:00:00.000Z"
  },
  "message": "Contact form submitted successfully"
}
```

### 2. Coverage Check (`/api/coverage/check`)

**Endpoint:** `POST /.netlify/functions/coverage-check`

**Request Body:**
```json
{
  "address": "Tripoli, Lebanon",
  "latitude": 34.4347,
  "longitude": 35.8497
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "comingSoon": false,
    "estimatedSpeed": 50
  }
}
```

### 3. Coverage Areas (`/api/coverage/areas`)

**Endpoint:** `GET /.netlify/functions/coverage-areas`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Tripoli",
      "nameAr": "طرابلس",
      "coordinates": [[35.8497, 34.4347]],
      "status": "covered"
    }
  ]
}
```

### 4. Gemini AI Chat (`/api/gemini`)

**Endpoint:** `POST /.netlify/functions/gemini`

**Request Body:**
```json
{
  "prompt": "What plans do you offer?",
  "conversationHistory": [
    {
      "role": "user",
      "parts": [{ "text": "Hello" }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Hi! How can I help?" }]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "We offer three plans: Starter (30 Mbps), Pro (100 Mbps), and Business (500 Mbps)..."
  }
}
```

**Security:** API key is stored server-side in `GEMINI_API_KEY` environment variable (never exposed to client).

## Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:

- `GEMINI_API_KEY` - **Required for chat widget** (server-side only, never exposed to client)
- `VITE_GEMINI_API_KEY` - Legacy client-side key (deprecated, use `GEMINI_API_KEY` in function instead)
- `SENDGRID_API_KEY` - For email notifications (optional)
- `WHATSAPP_API_KEY` - For WhatsApp notifications (optional)

**Important:** The `GEMINI_API_KEY` is used by the serverless function and is never exposed to the client. This is more secure than using `VITE_GEMINI_API_KEY` which gets bundled into the client code.

## Deployment

Functions are automatically deployed with your site when you push to GitHub.

Netlify will:
1. Build your site (`npm run build`)
2. Deploy functions from `netlify/functions/`
3. Make functions available at `/.netlify/functions/[function-name]`

## Function Structure

```
netlify/
  functions/
    contact.ts          # Contact form handler
    coverage-check.ts   # Coverage area checker
    coverage-areas.ts   # Get all coverage areas
    gemini.ts          # Gemini AI chat handler (secure server-side API key)
    README.md          # This file
```

## Next Steps (Optional Enhancements)

1. **Email Integration:**
   - Add SendGrid/Mailgun for email notifications
   - Send form submissions to support email

2. **Database Integration:**
   - Use FaunaDB/MongoDB to store submissions
   - Track form analytics

3. **WhatsApp Integration:**
   - Use Twilio API to send WhatsApp notifications
   - Forward submissions to support WhatsApp

4. **Rate Limiting:**
   - Add rate limiting to prevent spam
   - Use Netlify Edge Functions for better performance

5. **Form Validation:**
   - Enhanced server-side validation
   - Spam detection (reCAPTCHA, etc.)

