-- Add hero video with audio to database
-- Run this in Supabase SQL Editor

-- Remove existing hero media
DELETE FROM public.media WHERE usage_type = 'hero';

-- Add the new hero video with audio
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
  'Hero Background Video with Voice',
  'Professional background video with voiceover for hero section',
  '/assets/images/Add_backgrounds_voice_202602151110_ombpn.mp4',
  'video',
  'hero',
  1,
  'Hero background video with audio narration',
  true
);

-- Verify the video was added
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
WHERE usage_type = 'hero';
