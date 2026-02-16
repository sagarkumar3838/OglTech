-- Add hero1.mp4 video to media table
-- This replaces the previous hero video with the new one

-- First, deactivate any existing hero videos
UPDATE media 
SET is_active = false 
WHERE usage_type = 'hero' AND media_type = 'video';

-- Insert the new hero1.mp4 video
INSERT INTO media (
  title,
  media_url,
  media_type,
  usage_type,
  position,
  alt_text,
  is_active
) VALUES (
  'Hero Background Video',
  '/assets/images/hero1.mp4',
  'video',
  'hero',
  1,
  'Hero background video showcasing skill development and career growth',
  true
)
ON CONFLICT (media_url) 
DO UPDATE SET
  is_active = true,
  usage_type = 'hero',
  position = 1,
  updated_at = NOW();

-- Verify the insertion
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active,
  created_at
FROM media
WHERE usage_type = 'hero'
ORDER BY position;
