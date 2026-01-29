-- Add new media (image or video) to the database
-- This script adds the new pexels-rdne-7683750.jpg image

-- Check current media count
SELECT 
  media_type,
  usage_type,
  COUNT(*) as count
FROM public.media
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;

-- Add the new image as parallax media
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
  'Professional Team Meeting',
  'Team of professionals collaborating in modern office environment',
  '/assets/images/pexels-rdne-7683750.jpg',
  'image',
  'parallax',
  5,
  'Professional team meeting and collaboration',
  true
) ON CONFLICT DO NOTHING;

-- If you want to add it as a hero image instead, use this:
-- INSERT INTO public.media (
--   title, 
--   description, 
--   media_url, 
--   media_type,
--   usage_type, 
--   position, 
--   alt_text,
--   is_active
-- ) VALUES (
--   'Professional Team Meeting',
--   'Team of professionals collaborating in modern office environment',
--   '/assets/images/pexels-rdne-7683750.jpg',
--   'image',
--   'hero',
--   1,
--   'Professional team meeting and collaboration',
--   true
-- ) ON CONFLICT DO NOTHING;

-- Verify the new media was added
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

-- Show updated count
SELECT 
  media_type,
  usage_type,
  COUNT(*) as count
FROM public.media
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;
