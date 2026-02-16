-- Add ONLY img1.jpeg and img2.jpeg to the database
-- Run this in Supabase SQL Editor

-- Check current highest position number
SELECT MAX(position) as current_max_position
FROM public.media
WHERE media_type = 'image';

-- Insert img1.jpeg
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
  'Professional Learning Environment',
  'Professional learning and development environment',
  '/assets/images/img1.jpeg',
  'image',
  'parallax',
  8,
  'Professional learning environment',
  true
) ON CONFLICT DO NOTHING;

-- Insert img2.jpeg
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
  'Modern Workspace',
  'Modern professional workspace and collaboration',
  '/assets/images/img2.jpeg',
  'image',
  'parallax',
  9,
  'Modern workspace',
  true
) ON CONFLICT DO NOTHING;

-- Verify the images were added
SELECT 
  id,
  title,
  media_url,
  usage_type,
  position,
  is_active,
  created_at
FROM public.media
WHERE media_url IN ('/assets/images/img1.jpeg', '/assets/images/img2.jpeg')
ORDER BY position;

-- Show all images
SELECT 
  position,
  title,
  media_url,
  is_active
FROM public.media
WHERE media_type = 'image'
ORDER BY position;
