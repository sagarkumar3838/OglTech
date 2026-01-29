-- Add video1 through video5 to the media database
-- Make sure you have placed video1.mp4, video2.mp4, video3.mp4, video4.mp4, video5.mp4 
-- in the client/public/assets/images/ folder before running this script

-- Check current media before adding
SELECT 
  media_type,
  usage_type,
  COUNT(*) as count
FROM public.media
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;

-- ============================================
-- Add video1.mp4 as hero video (main background)
-- ============================================
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
  'Hero Background Video 1',
  'Primary hero section background video',
  '/assets/images/video1.mp4',
  'video',
  'hero',
  1,
  'Professional team collaboration background video',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Add video2.mp4 as parallax video
-- ============================================
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
  'Parallax Video 2 - Skill Development',
  'Video showing skill development and learning',
  '/assets/images/video2.mp4',
  'video',
  'parallax',
  1,
  'Professionals developing technical skills',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Add video3.mp4 as parallax video
-- ============================================
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
  'Parallax Video 3 - Team Collaboration',
  'Video showing team working together',
  '/assets/images/video3.mp4',
  'video',
  'parallax',
  2,
  'Team collaboration and project work',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Add video4.mp4 as parallax video
-- ============================================
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
  'Parallax Video 4 - Technical Assessment',
  'Video showing technical skill assessment',
  '/assets/images/video4.mp4',
  'video',
  'parallax',
  3,
  'Developer taking technical assessment',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Add video5.mp4 as parallax video
-- ============================================
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
  'Parallax Video 5 - Career Growth',
  'Video showing career development and growth',
  '/assets/images/video5.mp4',
  'video',
  'parallax',
  4,
  'Professional career growth and advancement',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Verify all videos were added
-- ============================================
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
WHERE media_url LIKE '%video%.mp4'
ORDER BY usage_type, position;

-- ============================================
-- Show complete media summary
-- ============================================
SELECT 
  media_type,
  usage_type,
  COUNT(*) as total,
  STRING_AGG(title, ', ') as titles
FROM public.media
WHERE is_active = true
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;

-- ============================================
-- Show all media ordered by usage and position
-- ============================================
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active
FROM public.media
ORDER BY 
  CASE WHEN usage_type = 'hero' THEN 1 ELSE 2 END,
  position,
  created_at;
