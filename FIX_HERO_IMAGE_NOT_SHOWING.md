# Fix: Hero Image Not Showing

## Problem
The hero section shows text but no background image.

## Possible Causes & Solutions

### 1. Image Path Issue
**Check if image exists:**
```bash
dir client\dist\assets\images\view-3d-young-child-watching-movie.jpg
```

**If missing:** Copy the image to that location

### 2. Animation Starting Off-Screen
**Problem:** Image starts at `x: '100%'` which is completely off-screen

**Solution:** Changed to `x: '30%'` for partial slide effect

### 3. Browser Cache
**Solution:** Hard refresh the page
- Chrome/Edge: `Ctrl + Shift + R`
- Firefox: `Ctrl + F5`

### 4. Dev Server Not Serving Static Files
**Solution:** Restart dev server
```bash
npm run dev
```

### 5. Check Browser Console
Open DevTools (F12) and check for:
- 404 errors (image not found)
- CORS errors
- Loading errors

## Quick Test

1. Open `test-hero-image.html` in browser
2. If image shows → React component issue
3. If image doesn't show → File path issue

## Current Animation Settings

```typescript
initial={{ x: '30%', opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ 
  duration: 1.8, 
  ease: [0.43, 0.13, 0.23, 0.96],
  opacity: { duration: 1 }
}}
```

- Starts 30% to the right
- Slides to center in 1.8 seconds
- Fades in over 1 second
- Smooth easing curve

## Debugging Steps

### Step 1: Check Image in Browser
Navigate to: `http://localhost:3000/assets/images/view-3d-young-child-watching-movie.jpg`

Should show the image directly.

### Step 2: Check React DevTools
1. Install React DevTools extension
2. Find `CenterImage` component
3. Check `heroMedia` prop value
4. Verify `mediaUrl` is correct

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Refresh page
3. Look for image request
4. Check if it's 200 (success) or 404 (not found)

### Step 4: Simplify Animation
Temporarily remove animation to test if image loads:

```typescript
<img
  src="/assets/images/view-3d-young-child-watching-movie.jpg"
  alt="Test"
  className="absolute inset-0 w-full h-full object-cover"
/>
```

If this works, the issue is with the animation.

## Alternative: Use Video Fallback

If image continues to have issues, revert to video:

```typescript
const mediaUrl = heroMedia?.media_url || '/assets/images/206779_small.mp4';
```

## Database Check

Run this SQL to verify hero media in database:

```sql
SELECT * FROM public.media WHERE usage_type = 'hero';
```

Should return 1 row with the image.

## Common Fixes

### Fix 1: Clear Build Cache
```bash
rm -rf client/dist
npm run build
```

### Fix 2: Check Vite Config
Ensure `client/vite.config.ts` includes:

```typescript
publicDir: 'dist',
```

### Fix 3: Move Image to Public Folder
If using Vite, images should be in:
- `client/public/assets/images/` (not `client/dist/assets/images/`)

### Fix 4: Use Absolute Import
```typescript
import heroImage from '/assets/images/view-3d-young-child-watching-movie.jpg';
```

## Still Not Working?

### Option 1: Use Base64
Convert image to base64 and embed directly:
```typescript
const mediaUrl = 'data:image/jpeg;base64,...';
```

### Option 2: Use External URL
Upload image to CDN and use URL:
```typescript
const mediaUrl = 'https://your-cdn.com/hero-image.jpg';
```

### Option 3: Revert to Original Video
```sql
UPDATE public.media 
SET media_url = '/assets/images/206779_small.mp4',
    media_type = 'video'
WHERE usage_type = 'hero';
```

## Success Checklist

- [ ] Image file exists in correct location
- [ ] Dev server is running
- [ ] Browser cache cleared
- [ ] No console errors
- [ ] Image loads in Network tab
- [ ] Animation completes
- [ ] Text overlay visible
- [ ] Buttons clickable

## Contact for Help

If still not working, provide:
1. Screenshot of browser console
2. Screenshot of Network tab
3. Output of: `dir client\dist\assets\images`
4. Browser and version
