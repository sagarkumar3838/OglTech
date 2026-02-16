-- Find and Remove Duplicate Images from Media Table
-- Run this in Supabase SQL Editor

-- STEP 1: Find all duplicate images (same media_url)
SELECT 
  media_url,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as all_ids,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM public.media
WHERE media_type = 'image'
GROUP BY media_url
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- STEP 2: Show detailed view of duplicates
SELECT 
  id,
  title,
  media_url,
  position,
  is_active,
  created_at
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

-- STEP 3: Remove duplicates (keeps the OLDEST entry for each URL)
-- This deletes all duplicates except the first one created
WITH duplicates AS (
  SELECT 
    id,
    media_url,
    ROW_NUMBER() OVER (PARTITION BY media_url ORDER BY created_at ASC) as row_num
  FROM public.media
  WHERE media_type = 'image'
)
DELETE FROM public.media
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE row_num > 1
);

-- STEP 4: Verify duplicates are removed
SELECT 
  media_url,
  COUNT(*) as count
FROM public.media
WHERE media_type = 'image'
GROUP BY media_url
HAVING COUNT(*) > 1;

-- STEP 5: Show all remaining images (should be unique now)
SELECT 
  id,
  title,
  media_url,
  position,
  is_active,
  created_at
FROM public.media
WHERE media_type = 'image'
ORDER BY position;

-- STEP 6: Fix position numbers to be sequential (1, 2, 3, 4...)
WITH ranked_media AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY position, created_at) as new_position
  FROM public.media
  WHERE media_type = 'image' AND usage_type = 'parallax'
)
UPDATE public.media m
SET position = rm.new_position
FROM ranked_media rm
WHERE m.id = rm.id;

-- STEP 7: Final verification - show clean list
SELECT 
  position,
  title,
  media_url,
  is_active
FROM public.media
WHERE media_type = 'image'
ORDER BY position;
