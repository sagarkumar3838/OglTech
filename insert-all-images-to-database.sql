-- Insert ALL local images from client/dist/assets/images into the database
-- Run this in your Supabase SQL Editor

-- First, let's see what's currently in the media table
SELECT 
  id,
  title,
  media_type,
  usage_type,
  position,
  media_url,
  is_active
FROM public.media
WHERE media_type = 'image'
ORDER BY usage_type, position;

-- Clear existing parallax images if you want to start fresh (OPTIONAL)
-- DELETE FROM public.media WHERE usage_type = 'parallax' AND media_type = 'image';

-- Insert parallax images (these will be used in the hero section)

-- Image 1: Business Team Collaboration
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
  'Business Team Collaboration',
  'Professional team working together on business projects',
  '/assets/images/business-7836199.jpg',
  'image',
  'parallax',
  1,
  'Business team collaboration and planning',
  true
) ON CONFLICT DO NOTHING;

-- Image 2: Professional Developer
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
  'Professional Developer at Work',
  'Developer working on technical projects',
  '/assets/images/man-597178.jpg',
  'image',
  'parallax',
  2,
  'Professional developer coding',
  true
) ON CONFLICT DO NOTHING;

-- Image 3: Technical Assessment
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
  'Technical Assessment Session',
  'Professional taking technical skill assessment',
  '/assets/images/pexels-cottonbro-4880411.jpg',
  'image',
  'parallax',
  3,
  'Technical assessment and evaluation',
  true
) ON CONFLICT DO NOTHING;

-- Image 4: Student Learning
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
  'Student Learning and Development',
  'Students engaged in learning and skill development',
  '/assets/images/student-7378904.jpg',
  'image',
  'parallax',
  4,
  'Student learning and skill development',
  true
) ON CONFLICT DO NOTHING;

-- Image 5: Professional Training Session
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
  'Professional Training Session',
  'Professional training and skill development session',
  '/assets/images/pexels-rdne-7683750.jpg',
  'image',
  'parallax',
  5,
  'Professional training and development',
  true
) ON CONFLICT DO NOTHING;

-- Image 6: SkillEval Logo (can be used as hero or parallax)
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
  'SkillEval Logo',
  'SkillEval platform logo and branding',
  '/assets/images/SkillEval.png',
  'image',
  'parallax',
  6,
  'SkillEval logo',
  true
) ON CONFLICT DO NOTHING;

-- NEW IMAGES ADDED BELOW

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

-- Verify all inserted images
SELECT 
  id,
  title,
  media_type,
  usage_type,
  position,
  media_url,
  is_active,
  created_at
FROM public.media
WHERE media_type = 'image'
ORDER BY usage_type, position;

-- Count total images
SELECT 
  usage_type,
  COUNT(*) as total_images
FROM public.media
WHERE media_type = 'image' AND is_active = true
GROUP BY usage_type;
