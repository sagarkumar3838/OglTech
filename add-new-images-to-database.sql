-- Add NEW images to the database
-- Run this in Supabase SQL Editor

-- First, check current images
SELECT 
  title,
  media_url,
  usage_type,
  position,
  is_active
FROM public.media
WHERE media_type = 'image'
ORDER BY usage_type, position;

-- Add the new images

-- Image 7: Boy Cartoon Character with Technology
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
  'Boy Cartoon Character with Technology',
  'Cartoon character surrounded by modern technology and digital elements',
  '/assets/images/boy-cartoon-character-surrounded-by-technology.jpg',
  'image',
  'parallax',
  7,
  'Cartoon boy with technology',
  true
) ON CONFLICT DO NOTHING;

-- Image 8: Professional Image 1
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

-- Image 9: Professional Image 2
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

-- Image 10: 3D Child Watching Movie
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
  '3D Young Child Watching Movie',
  '3D rendered scene of young child engaged in learning content',
  '/assets/images/view-3d-young-child-watching-movie.jpg',
  'image',
  'parallax',
  10,
  '3D child watching educational content',
  true
) ON CONFLICT DO NOTHING;

-- Verify all images including new ones
SELECT 
  id,
  title,
  media_url,
  usage_type,
  position,
  is_active,
  created_at
FROM public.media
WHERE media_type = 'image'
ORDER BY position;

-- Count total images
SELECT 
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_images
FROM public.media
WHERE media_type = 'image';
