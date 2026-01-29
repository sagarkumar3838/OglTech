-- Remove duplicate images and videos from the media table
-- This script identifies duplicates based on media_url and keeps only the first entry

-- Step 1: Check for duplicates in media table
SELECT 
  media_url,
  media_type,
  usage_type,
  COUNT(*) as duplicate_count
FROM public.media
GROUP BY media_url, media_type, usage_type
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Remove duplicates, keeping only the oldest entry (lowest id)
WITH duplicates AS (
  SELECT 
    id,
    media_url,
    ROW_NUMBER() OVER (
      PARTITION BY media_url, media_type, usage_type 
      ORDER BY created_at ASC, id ASC
    ) as row_num
  FROM public.media
)
DELETE FROM public.media
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE row_num > 1
);

-- Step 3: Check if videos table exists and has duplicates
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'videos'
  ) THEN
    -- Check for duplicates in videos table
    RAISE NOTICE 'Checking videos table for duplicates...';
    
    -- Show duplicates
    PERFORM video_url, video_type, COUNT(*) as duplicate_count
    FROM public.videos
    GROUP BY video_url, video_type
    HAVING COUNT(*) > 1;
    
    -- Remove duplicates from videos table
    WITH video_duplicates AS (
      SELECT 
        id,
        video_url,
        ROW_NUMBER() OVER (
          PARTITION BY video_url, video_type 
          ORDER BY created_at ASC, id ASC
        ) as row_num
      FROM public.videos
    )
    DELETE FROM public.videos
    WHERE id IN (
      SELECT id 
      FROM video_duplicates 
      WHERE row_num > 1
    );
    
    RAISE NOTICE 'Videos table cleaned!';
  ELSE
    RAISE NOTICE 'Videos table does not exist. Skipping...';
  END IF;
END $$;

-- Step 4: Verify cleanup - Show remaining media
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active,
  created_at
FROM public.media
ORDER BY usage_type, position, created_at;

-- Step 5: Show count by type
SELECT 
  media_type,
  usage_type,
  COUNT(*) as count
FROM public.media
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;

-- Step 6: If videos table exists, show remaining videos
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'videos'
  ) THEN
    RAISE NOTICE 'Showing remaining videos...';
    
    PERFORM id, title, video_url, video_type, position, is_active
    FROM public.videos
    ORDER BY video_type, position;
  END IF;
END $$;

-- Optional: Reset position numbers to be sequential
WITH ranked_media AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY usage_type, media_type 
      ORDER BY position, created_at
    ) as new_position
  FROM public.media
)
UPDATE public.media m
SET position = rm.new_position
FROM ranked_media rm
WHERE m.id = rm.id;

-- Final verification
SELECT 
  'Media Table Summary' as info,
  COUNT(*) as total_records,
  COUNT(DISTINCT media_url) as unique_urls,
  SUM(CASE WHEN media_type = 'image' THEN 1 ELSE 0 END) as images,
  SUM(CASE WHEN media_type = 'video' THEN 1 ELSE 0 END) as videos,
  SUM(CASE WHEN usage_type = 'hero' THEN 1 ELSE 0 END) as hero_media,
  SUM(CASE WHEN usage_type = 'parallax' THEN 1 ELSE 0 END) as parallax_media
FROM public.media;

RAISE NOTICE 'Duplicate removal complete!';
