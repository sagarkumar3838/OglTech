# Image Storage Guide - Store Images in Database

## Problem
You added images to `client/dist/assets/images/` but they're not visible in the app because they need to be registered in the Supabase database.

## Solution

### Step 1: Verify Your Images
Your images are located in: `client/dist/assets/images/`

Current images:
- business-7836199.jpg
- man-597178.jpg
- pexels-cottonbro-4880411.jpg
- pexels-rdne-7683750.jpg
- student-7378904.jpg
- SkillEval.png

### Step 2: Insert Images into Database

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: SQL Editor
3. Open the file: `insert-all-images-to-database.sql`
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click "Run" or press Ctrl+Enter

### Step 3: Verify Images Are Stored

Run the verification script:
1. Open: `verify-images-in-database.sql`
2. Copy and paste into Supabase SQL Editor
3. Run it to see all your images

You should see:
- Total images count
- List of all images with URLs
- Status of each expected image (✓ Found or ✗ Missing)

### Step 4: Check in Your App

After inserting images:
1. Refresh your application
2. Images should now appear in the hero/parallax sections
3. The app fetches images from the `media` table using `mediaService.ts`

## How It Works

### Database Structure
The `media` table stores both images and videos:
```sql
- id: UUID (primary key)
- title: Text (image title)
- description: Text (optional description)
- media_url: Text (path to image: /assets/images/filename.jpg)
- media_type: 'image' or 'video'
- usage_type: 'hero' or 'parallax'
- position: Integer (display order)
- alt_text: Text (accessibility)
- is_active: Boolean (show/hide)
```

### Frontend Integration
The app uses `mediaService.ts` to fetch images:
- `getHeroMedia()` - Gets hero section media
- `getParallaxMedia()` - Gets parallax images
- `getAllMedia()` - Gets all active media

### Image Display
Images are displayed in:
- `SmoothScrollHero.tsx` - Hero section with parallax effect
- Other components that import `mediaService`

## Adding New Images

To add more images in the future:

1. Place image in: `client/dist/assets/images/your-image.jpg`

2. Insert into database:
```sql
INSERT INTO public.media (
  title, 
  description, 
  media_url, 
  media_type,
  usage_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Your Image Title',
  'Description of the image',
  '/assets/images/your-image.jpg',
  'image',
  'parallax',  -- or 'hero'
  7,  -- next position number
  'Alt text for accessibility',
  true
);
```

3. Verify it appears in the app

## Troubleshooting

### Images Not Showing?
1. Check if media table exists: Run `verify-images-in-database.sql`
2. Check if images are active: `is_active = true`
3. Check RLS policies: Ensure public read access
4. Check browser console for errors
5. Verify image paths match exactly

### RLS Issues?
If you get permission errors, the RLS policies might need adjustment:
```sql
-- Allow public read access
CREATE POLICY "Public media are viewable by everyone"
ON public.media FOR SELECT
USING (is_active = true);
```

### Wrong Image Paths?
Image URLs must match the actual file location:
- Database: `/assets/images/filename.jpg`
- Actual file: `client/dist/assets/images/filename.jpg`

## Quick Commands

Run the batch file for instructions:
```bash
INSERT_IMAGES_NOW.bat
```

Or manually run SQL files in Supabase:
1. `insert-all-images-to-database.sql` - Insert images
2. `verify-images-in-database.sql` - Verify insertion

## Summary

Your images are physically stored in `client/dist/assets/images/` but need to be registered in the Supabase `media` table so the app knows they exist. Run the SQL script to register them, and they'll appear immediately!
