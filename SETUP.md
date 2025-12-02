# ODM Website Setup Guide

## Quick Setup

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key** (Optional)
   - Create `.env.local` file
   - Add: `VITE_GEMINI_API_KEY=your_key_here`
   - Note: Website works without this, but chat feature won't function
   - Important: Only variables starting with `VITE_` are exposed to the client

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:5173

5. **Build for Production**
   ```bash
   npm run build
   ```

## Troubleshooting

**npm command not found**
- Install Node.js from nodejs.org

**Port already in use**
- Change port in `vite.config.ts` or stop the process using the port

**API key errors**
- Ensure `.env.local` has `VITE_GEMINI_API_KEY` set, or leave empty if chat isn't needed
- For Netlify deployment, set `VITE_GEMINI_API_KEY` in Netlify Dashboard → Environment Variables

## Support

For technical support, contact: odmsync@gmail.com
