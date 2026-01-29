-- Update database to use only images for parallax section
-- This script will deactivate any videos in parallax and ensure only images are shown

-- Step 1: Check current parallax media
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active
FROM public.media
WHERE usage_type = 'parallax'
ORDER BY position;

-- Step 2: Deactivate all videos in parallax section (keep them in database but hide them)
UPDATE public.media
SET is_active = false
WHERE usage_type = 'parallax' 
  AND media_type = 'video';

-- Step 3: Ensure all images in parallax are active
UPDATE public.media
SET is_active = true
WHERE usage_type = 'parallax' 
  AND media_type = 'image';

-- Step 4: Verify - show only active parallax media (should be images only)
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active
FROM public.media
WHERE usage_type = 'parallax' 
  AND is_active = true
ORDER BY position;

-- Step 5: Summary
SELECT 
  media_type,
  usage_type,
  is_active,
  COUNT(*) as count
FROM public.media
GROUP BY media_type, usage_type, is_active
ORDER BY usage_type, media_type, is_active;

-- Optional: If you want to completely remove videos from parallax (not just deactivate)
-- Uncomment the following lines:
-- DELETE FROM public.media
-- WHERE usage_type = 'parallax' 
--   AND media_type = 'video';
