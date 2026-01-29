-- Simple script to remove duplicate media from database
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what duplicates exist
SELECT 
  media_url,
  media_type,
  usage_type,
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as ids
FROM public.media
GROUP BY media_url, media_type, usage_type
HAVING COUNT(*) > 1;

-- 2. Delete duplicates, keeping only the first one (oldest by created_at)
DELETE FROM public.media
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY media_url, media_type, usage_type 
        ORDER BY created_at ASC, id ASC
      ) as rn
    FROM public.media
  ) t
  WHERE rn > 1
);

-- 3. Verify - show all remaining media
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active
FROM public.media
ORDER BY usage_type, position;

-- 4. Summary
SELECT 
  media_type,
  usage_type,
  COUNT(*) as total
FROM public.media
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;
