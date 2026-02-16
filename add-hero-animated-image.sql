-- Replace hero video with animated 3D child image
-- Run this in Supabase SQL Editor

-- First, remove any existing hero media
DELETE FROM public.media WHERE usage_type = 'hero';

-- Add the new hero image
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
  '3D Young Child Watching Educational Content',
  '3D rendered scene of young child engaged in learning and skill development',
  '/assets/images/view-3d-young-child-watching-movie.jpg',
  'image',
  'hero',
  1,
  '3D child watching educational content - learning platform',
  true
);

-- Verify the hero image was added
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active
FROM public.media
WHERE usage_type = 'hero';
