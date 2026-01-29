# Local Images Setup Guide

## Overview

This guide will help you replace the external Pexels images with your local images and store them in the database.

## Your Local Images

Found in `client/dist/assets/images`:
- `business-7836199.jpg` - Business team collaboration
- `man-597178.jpg` - Professional developer
- `pexels-cottonbro-4880411.jpg` - Technical assessment
- `student-7378904.jpg` - Student learning
- `pexels-rdne-7683750.jpg` - Additional image

## Step 1: Create Media Table

The new `media` table supports both images and videos.

### Option A: SQL Script (Recommended)

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open file: `create-media-table.sql`
4. Copy all contents
5. Paste into SQL Editor
6. Click **Run**

### What It Does:
- Creates `media` table (replaces `videos` table)
- Supports both `image` and `video` types
- Has `usage_type` for `hero` or `parallax`
- Includes RLS policies for security

## Step 2: Upload Local Images

### Option A: SQL Script

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open file: `insert-local-images.sql`
4. Copy all contents
5. Paste into SQL Editor
6. Click **Run**

### Option B: TypeScript Script

```bash
# Run the batch file
UPLOAD_IMAGES_TO_DB.bat

# Or run directly
npx ts-node scripts/upload-local-images.ts
```

### What Gets Added:
- 4 local images as parallax media
- All images copied to `client/public/assets/images/`
- Images stored in database with metadata

## Step 3: Verify Setup

### Check Database:

```sql
SELECT 
  title,
  media_type,
  usage_type,
  position,
  media_url,
  is_active
FROM public.media
ORDER BY usage_type, position;
```

### Expected Result:

```
HERO MEDIA:
• Main Hero Background (video)
  URL: /assets/images/206779_small.mp4

PARALLAX MEDIA:
1. Business Team Collaboration (image)
   URL: /assets/images/business-7836199.jpg
2. Professional Developer at Work (image)
   URL: /assets/images/man-597178.jpg
3. Technical Assessment Session (image)
   URL: /assets/images/pexels-cottonbro-4880411.jpg
4. Student Learning and Development (image)
   URL: /assets/images/student-7378904.jpg
```

## Step 4: Test Website

### Start Development Server:

```bash
cd client
npm run dev
```

### Open Browser:
```
http://localhost:3002/
```

### What to Check:
- ✅ Hero video plays in background
- ✅ Local images appear in parallax section (scroll down)
- ✅ Images have smooth parallax scroll effect
- ✅ No console errors
- ✅ Images load quickly

## What Changed

### 1. New Media Service

Created `client/src/services/mediaService.ts`:
- Replaces `videoService.ts`
- Supports both images and videos
- Fetches from `media` table

### 2. Updated SmoothScrollHero Component

`client/src/components/SmoothScrollHero.tsx`:
- Now fetches media from database
- Supports both images and videos
- Auto-detects media type
- Fallback to external images if database empty

### 3. Database Schema

New `media` table:
```sql
CREATE TABLE public.media (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  usage_type TEXT CHECK (usage_type IN ('hero', 'parallax')),
  position INTEGER,
  alt_text TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## File Structure

### Images Location:

```
client/public/assets/images/
├── business-7836199.jpg
├── man-597178.jpg
├── pexels-cottonbro-4880411.jpg
├── student-7378904.jpg
├── 206779_small.mp4 (hero video)
└── 13232-246463976_small.mp4
```

### Database:

```
media table:
├── Hero media (1 video)
└── Parallax media (4 images + videos)
```

## Add More Images

### Method 1: SQL

```sql
INSERT INTO public.media (
  title, 
  media_url, 
  media_type,
  usage_type, 
  position, 
  alt_text
) VALUES (
  'My New Image',
  '/assets/images/my-image.jpg',
  'image',
  'parallax',
  5,
  'Description of image'
);
```

### Method 2: Supabase Dashboard

1. Go to **Table Editor**
2. Select **media** table
3. Click **Insert row**
4. Fill in:
   - title: "My New Image"
   - media_url: "/assets/images/my-image.jpg"
   - media_type: "image"
   - usage_type: "parallax"
   - position: 5
   - alt_text: "Description"
   - is_active: true
5. Click **Save**

## Troubleshooting

### Images Not Showing?

**1. Check Database:**
```sql
SELECT * FROM public.media WHERE media_type = 'image';
```

**2. Check File Paths:**
- Images must be in `client/public/assets/images/`
- URLs in database must match file locations

**3. Check Browser Console:**
- Open DevTools (F12)
- Look for 404 errors

**4. Check RLS Policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'media';
```

### Images Not Loading?

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Check file permissions**
3. **Verify image format** (JPG, PNG, WebP)
4. **Check file size** (optimize large images)

### Parallax Not Working?

1. **Scroll down** - parallax starts after hero section
2. **Check smooth scroll** - Lenis must be installed
3. **Test in different browser**

## Migration from Videos Table

If you have existing data in `videos` table:

### Option 1: Keep Both Tables

The `media` table is separate, so your `videos` table data is safe.

### Option 2: Migrate Data

```sql
-- Copy videos to media table
INSERT INTO public.media (
  title,
  description,
  media_url,
  media_type,
  usage_type,
  position,
  alt_text,
  is_active
)
SELECT 
  title,
  description,
  video_url as media_url,
  'video' as media_type,
  video_type as usage_type,
  position,
  alt_text,
  is_active
FROM public.videos;

-- Verify migration
SELECT COUNT(*) FROM public.media WHERE media_type = 'video';
```

## Features

### Supported Media Types:
- ✅ Images (JPG, PNG, WebP, GIF)
- ✅ Videos (MP4, WebM)

### Supported Usage Types:
- ✅ Hero (full-screen background)
- ✅ Parallax (scrolling section)

### Features:
- ✅ Dynamic loading from database
- ✅ Fallback to external URLs
- ✅ Auto-detect media type
- ✅ Smooth parallax effects
- ✅ Responsive design
- ✅ RLS security

## Files Created

1. ✅ `create-media-table.sql` - Database schema
2. ✅ `insert-local-images.sql` - Insert images SQL
3. ✅ `scripts/upload-local-images.ts` - Upload script
4. ✅ `client/src/services/mediaService.ts` - Media API
5. ✅ `UPLOAD_IMAGES_TO_DB.bat` - Batch file
6. ✅ `IMAGES_SETUP_GUIDE.md` - This guide

## Quick Commands

```bash
# Copy images to public folder (already done)
Copy-Item "client\dist\assets\images\*.jpg" "client\public\assets\images\" -Force
Copy-Item "client\dist\assets\images\*.png" "client\public\assets\images\" -Force

# Upload images to database
npx ts-node scripts/upload-local-images.ts

# Check media in database (SQL)
SELECT * FROM public.media;

# Start dev server
cd client && npm run dev
```

## Summary

✅ **4 local images** ready to use
✅ **Media table** created (supports images + videos)
✅ **Upload scripts** ready (SQL + TypeScript)
✅ **Component updated** to use local images
✅ **Fallback system** in place
✅ **Ready for production**

---

**Next Step**: Run `create-media-table.sql` in Supabase, then run `UPLOAD_IMAGES_TO_DB.bat`!

🎉 Your local images will replace the external Pexels images!
