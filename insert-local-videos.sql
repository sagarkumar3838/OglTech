-- Insert local videos from client/dist/assets/images into the database

-- First, let's clear any existing videos (optional - comment out if you want to keep existing ones)
-- DELETE FROM public.videos;

-- Insert the hero video (main background)
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Main Hero Background - Students Learning',
  'Primary hero section background video showing students and team collaboration',
  '/assets/images/206779_small.mp4',
  'hero',
  1,
  'Students collaborating and learning together',
  true
) ON CONFLICT DO NOTHING;

-- Insert parallax videos

-- Video 1: Small coding video
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Coding and Development Scene',
  'Parallax video showing coding and software development',
  '/assets/images/13232-246463976_small.mp4',
  'parallax',
  1,
  'Developer coding and programming',
  true
) ON CONFLICT DO NOTHING;

-- Video 2: Students learning (can be used as parallax too)
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Team Collaboration and Learning',
  'Parallax video showing team collaboration and skill development',
  '/assets/images/206779_small.mp4',
  'parallax',
  2,
  'Team working together on technical projects',
  true
) ON CONFLICT DO NOTHING;

-- Add some external videos to fill out the parallax section

-- Video 3: Technical assessment
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Technical Assessment',
  'Parallax video showing technical skill assessment',
  'https://cdn.pixabay.com/video/2023/04/28/160827-822725703_tiny.mp4',
  'parallax',
  3,
  'Developer taking technical assessment',
  true
) ON CONFLICT DO NOTHING;

-- Video 4: Developer workspace
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text,
  is_active
) VALUES (
  'Developer Workspace',
  'Parallax video showing professional developer workspace',
  'https://cdn.pixabay.com/video/2022/12/05/142408-779071817_tiny.mp4',
  'parallax',
  4,
  'Professional coding environment and workspace',
  true
) ON CONFLICT DO NOTHING;

-- Verify the inserted videos
SELECT 
  id,
  title,
  video_type,
  position,
  video_url,
  is_active
FROM public.videos
ORDER BY video_type, position;
