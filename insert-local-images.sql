-- Insert local images from client/dist/assets/images into the database

-- Clear existing parallax images (optional - comment out if you want to keep them)
-- DELETE FROM public.media WHERE usage_type = 'parallax' AND media_type = 'image';

-- Insert parallax images

-- Image 1: Business/Team collaboration
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

-- Verify the inserted images
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
