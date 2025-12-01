# Public Assets Folder

This folder contains static assets that are served directly by Vite.

## F150 Image

**Required file:** `f150_odm.png`

1. Place your F150 image with ODM logo in this folder
2. Name it exactly: `f150_odm.png` (or `.jpg` if it's a JPEG)
3. The image will be accessible at: `/f150_odm.png`

## Image Requirements

- **Filename:** `f150_odm.png` (lowercase, no spaces)
- **Location:** `/public/f150_odm.png`
- **Format:** PNG or JPG
- **Recommended size:** 1200x800px or larger for best quality

## Usage in Code

The image is referenced in `components/Hero.tsx` as:
```tsx
<img src="/f150_odm.png" alt="ODM F150 service vehicle" />
```

## Notes

- Files in `/public/` are copied to the root of `dist/` during build
- Use absolute paths starting with `/` to reference public assets
- Works in both development (`npm run dev`) and production (`npm run build`)

