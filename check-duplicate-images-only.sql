-- Check for Duplicate Images (READ ONLY - No Deletions)
-- Run this first to see what duplicates exist

-- Show duplicate image URLs and how many times they appear
SELECT 
  media_url,
  COUNT(*) as times_appears,
  STRING_AGG(title, ' | ') as all_titles
FROM public.media
WHERE media_type = 'image'
GROUP BY media_url
HAVING COUNT(*) > 1
ORDER BY times_appears DESC;

-- Show detailed list of ALL duplicate entries
SELECT 
  id,
  title,
  media_url,
  position,
  is_active,
  created_at,
  CASE 
    WHEN created_at = MIN(created_at) OVER (PARTITION BY media_url) 
    THEN '✓ KEEP (oldest)' 
    ELSE '✗ DELETE (duplicate)' 
  END as action
FROM public.media
WHERE media_type = 'image'
  AND media_url IN (
    SELECT media_url
    FROM public.media
    WHERE media_type = 'image'
    GROUP BY media_url
    HAVING COUNT(*) > 1
  )
ORDER BY media_url, created_at;

-- Count total images
SELECT 
  COUNT(*) as total_images,
  COUNT(DISTINCT media_url) as unique_images,
  COUNT(*) - COUNT(DISTINCT media_url) as duplicates_to_remove
FROM public.media
WHERE media_type = 'image';
