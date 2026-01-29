# Add Local Videos to Database - Quick Guide

## Your Local Videos

Found in `client\dist\assets\images`:
1. **206779_small.mp4** (11.5 MB) - Students/team collaboration
2. **13232-246463976_small.mp4** (1.9 MB) - Coding/development

## Method 1: SQL Script (Easiest)

### Step 1: Run the SQL Script

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open the file: `insert-local-videos.sql`
4. Copy all contents
5. Paste into SQL Editor
6. Click **Run**

✅ Done! Videos are now in the database.

### What Gets Added:
- **Hero Video**: 206779_small.mp4 (main background)
- **Parallax Video 1**: 13232-246463976_small.mp4
- **Parallax Video 2**: 206779_small.mp4 (reused)
- **Parallax Video 3**: External Pixabay video
- **Parallax Video 4**: External Pixabay video

## Method 2: TypeScript Script

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run the Script

**Option A: Use the batch file**
```bash
UPLOAD_VIDEOS_TO_DB.bat
```

**Option B: Run directly**
```bash
npx ts-node scripts/upload-local-videos.ts
```

### What It Does:
- Connects to your Supabase database
- Inserts all local videos
- Adds external videos for parallax
- Shows success/error for each video
- Displays final list of all videos

## Method 3: Manual Insert (Supabase Dashboard)

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select **videos** table
4. Click **Insert row**
5. Fill in the fields:

### Hero Video:
```
title: Main Hero Background - Students Learning
description: Primary hero section background video
video_url: /assets/images/206779_small.mp4
video_type: hero
position: 1
alt_text: Students collaborating and learning together
is_active: true
```

### Parallax Video 1:
```
title: Coding and Development Scene
description: Parallax video showing coding
video_url: /assets/images/13232-246463976_small.mp4
video_type: parallax
position: 1
alt_text: Developer coding and programming
is_active: true
```

Repeat for other videos...

## Verify Videos Were Added

### SQL Query:
```sql
SELECT 
  title,
  video_type,
  position,
  video_url,
  is_active
FROM public.videos
ORDER BY video_type, position;
```

### Expected Result:
```
HERO VIDEOS:
• Main Hero Background - Students Learning
  URL: /assets/images/206779_small.mp4

PARALLAX VIDEOS:
1. Coding and Development Scene
   URL: /assets/images/13232-246463976_small.mp4
2. Team Collaboration and Learning
   URL: /assets/images/206779_small.mp4
3. Technical Assessment
   URL: https://cdn.pixabay.com/...
4. Developer Workspace
   URL: https://cdn.pixabay.com/...
```

## Video File Locations

### Current Location:
```
client/dist/assets/images/
├── 206779_small.mp4
└── 13232-246463976_small.mp4
```

### Public Access Location:
```
client/public/assets/images/
├── 206779_small.mp4
└── 13232-246463976_small.mp4
```

**Note**: Videos should be in `public` folder for production. Copy them:

```bash
# Windows
copy client\dist\assets\images\*.mp4 client\public\assets\images\

# Or use PowerShell
Copy-Item "client\dist\assets\images\*.mp4" "client\public\assets\images\" -Force
```

## Test on Website

1. Start your dev server:
   ```bash
   cd client
   npm run dev
   ```

2. Open: `http://localhost:3002/`

3. Check:
   - ✅ Hero video plays in background
   - ✅ Parallax videos appear when scrolling
   - ✅ All videos autoplay and loop
   - ✅ No console errors

## Troubleshooting

### Videos Not Showing?

**Check 1: Database**
```sql
SELECT * FROM public.videos WHERE is_active = true;
```

**Check 2: File Paths**
- Ensure videos are in `client/public/assets/images/`
- Check URLs in database match file locations

**Check 3: Browser Console**
- Open DevTools (F12)
- Look for 404 errors
- Check video URLs

**Check 4: RLS Policies**
```sql
-- Check if public can read videos
SELECT * FROM pg_policies WHERE tablename = 'videos';
```

### Videos Added But Not Playing?

1. **Check video format**: Must be MP4
2. **Check file size**: Large files load slowly
3. **Check autoplay**: Videos must be muted
4. **Check mobile**: Add `playsInline` attribute

## Add More Videos

### From Local Files:

1. Copy video to `client/public/assets/images/`
2. Add to database:

```sql
INSERT INTO public.videos (
  title, 
  video_url, 
  video_type, 
  position, 
  alt_text
) VALUES (
  'My New Video',
  '/assets/images/my-video.mp4',
  'parallax',
  5,
  'Description of video'
);
```

### From External URL:

```sql
INSERT INTO public.videos (
  title, 
  video_url, 
  video_type, 
  position, 
  alt_text
) VALUES (
  'External Video',
  'https://cdn.example.com/video.mp4',
  'parallax',
  6,
  'Description'
);
```

## Files Created

1. ✅ `insert-local-videos.sql` - SQL script to insert videos
2. ✅ `scripts/upload-local-videos.ts` - TypeScript upload script
3. ✅ `UPLOAD_VIDEOS_TO_DB.bat` - Batch file to run script
4. ✅ `ADD_LOCAL_VIDEOS_GUIDE.md` - This guide

## Quick Commands

```bash
# Copy videos to public folder
Copy-Item "client\dist\assets\images\*.mp4" "client\public\assets\images\" -Force

# Run upload script
npx ts-node scripts/upload-local-videos.ts

# Check videos in database (SQL)
SELECT * FROM public.videos;

# Start dev server
cd client && npm run dev
```

## Summary

✅ 2 local videos found
✅ SQL script ready to run
✅ TypeScript script ready to run
✅ Videos will be added to database
✅ Website will load videos dynamically

**Next Step**: Run `insert-local-videos.sql` in Supabase SQL Editor!

---

**Status**: ✅ Ready to upload
**Videos**: 2 local + 2 external = 4 total
**Location**: `client/dist/assets/images/`
