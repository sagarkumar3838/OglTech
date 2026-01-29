-- ============================================
-- POPULATE MEDIA TABLE WITH HERO AND PARALLAX CONTENT
-- This will fix the 406 error by adding data to the media table
-- ============================================

-- Insert hero video (main background)
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
  'Main Hero Background',
  'Primary hero section background video',
  '/assets/images/206779_small.mp4',
  'video',
  'hero',
  1,
  'Students collaborating and learning together',
  true
) ON CONFLICT DO NOTHING;

-- Insert parallax videos
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
  'Coding Scene',
  'Parallax video showing coding and development',
  '/assets/images/13232-246463976_small.mp4',
  'video',
  'parallax',
  1,
  'Developer coding and programming',
  true
) ON CONFLICT DO NOTHING;

-- Insert parallax images
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
  'Business Team',
  'Professional team working together',
  '/assets/images/business-7836199.jpg',
  'image',
  'parallax',
  2,
  'Business team collaboration',
  true
) ON CONFLICT DO NOTHING;

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
  'Professional Developer',
  'Developer working on projects',
  '/assets/images/man-597178.jpg',
  'image',
  'parallax',
  3,
  'Professional developer coding',
  true
) ON CONFLICT DO NOTHING;

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
  'Technical Assessment',
  'Professional taking assessment',
  '/assets/images/pexels-cottonbro-4880411.jpg',
  'image',
  'parallax',
  4,
  'Technical assessment session',
  true
) ON CONFLICT DO NOTHING;

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
  'Student Learning',
  'Students engaged in learning',
  '/assets/images/student-7378904.jpg',
  'image',
  'parallax',
  5,
  'Student learning and development',
  true
) ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 
  '✅ MEDIA TABLE POPULATED' as status,
  COUNT(*) as total_items,
  COUNT(CASE WHEN usage_type = 'hero' THEN 1 END) as hero_items,
  COUNT(CASE WHEN usage_type = 'parallax' THEN 1 END) as parallax_items,
  COUNT(CASE WHEN media_type = 'video' THEN 1 END) as videos,
  COUNT(CASE WHEN media_type = 'image' THEN 1 END) as images
FROM public.media;

-- Show all media items
SELECT 
  id,
  title,
  media_type,
  usage_type,
  position,
  media_url,
  is_active
FROM public.media
ORDER BY usage_type, position;
