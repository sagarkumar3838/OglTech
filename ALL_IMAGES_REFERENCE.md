# All Images Reference

## Current Images in `client/dist/assets/images/`

### Already in Database (6 images)
1. ✓ `business-7836199.jpg` - Business Team Collaboration
2. ✓ `man-597178.jpg` - Professional Developer
3. ✓ `pexels-cottonbro-4880411.jpg` - Technical Assessment
4. ✓ `student-7378904.jpg` - Student Learning
5. ✓ `pexels-rdne-7683750.jpg` - Professional Training
6. ✓ `SkillEval.png` - Logo

### NEW Images to Add (4 images)
7. ⚠ `boy-cartoon-character-surrounded-by-technology.jpg` - Cartoon character with tech
8. ⚠ `img1.jpeg` - Professional learning environment
9. ⚠ `img2.jpeg` - Modern workspace
10. ⚠ `view-3d-young-child-watching-movie.jpg` - 3D child learning

### Videos (not images)
- `13232-246463976_small.mp4`
- `206779_small.mp4`

---

## How to Add New Images

### Option 1: Add Only NEW Images (Recommended)
Use: `add-new-images-to-database.sql`
- Adds only the 4 new images
- Faster and cleaner
- Won't duplicate existing images

### Option 2: Add ALL Images
Use: `insert-all-images-to-database.sql`
- Adds all 10 images (old + new)
- Safe - uses `ON CONFLICT DO NOTHING`
- Good if you're not sure what's in database

---

## Quick Steps

1. Run `ADD_NEW_IMAGES.bat` for instructions

2. Open Supabase Dashboard → SQL Editor

3. Copy and paste the SQL file

4. Run it

5. Done! Images will appear in your app

---

## Image Details

### Position Numbers
- Position 1-6: Original images
- Position 7-10: New images
- Lower position = appears first in parallax

### Usage Type
- All images set to: `parallax`
- Can change to: `hero` for main hero section

### Active Status
- All images set to: `is_active = true`
- Set to `false` to hide without deleting

---

## Verify Images in Database

Run this SQL to check:
```sql
SELECT 
  title,
  media_url,
  position,
  is_active
FROM public.media
WHERE media_type = 'image'
ORDER BY position;
```

Should show 10 images total after adding new ones.
