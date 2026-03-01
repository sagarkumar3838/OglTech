-- Replace hero video with 3D portrait people image
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
  '3D Portrait People',
  'Modern 3D portrait illustration for hero section',
  '/assets/images/3d-portrait-people.jpg',
  'image',
  'hero',
  1,
  '3D Portrait People - Modern professional illustration',
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
