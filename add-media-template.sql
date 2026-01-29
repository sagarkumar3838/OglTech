-- Template for adding new media (images or videos) to the database
-- Replace the values below with your actual media details

-- ============================================
-- ADD NEW IMAGE
-- ============================================
INSERT INTO public.media (
  title,                    -- Short descriptive title
  description,              -- Longer description (optional)
  media_url,                -- Path to the file: /assets/images/your-file.jpg or .mp4
  media_type,               -- 'image' or 'video'
  usage_type,               -- 'hero' (main background) or 'parallax' (scrolling images)
  position,                 -- Order number (1, 2, 3, etc.)
  alt_text,                 -- Accessibility text
  is_active                 -- true or false
) VALUES (
  'Your Media Title',
  'Detailed description of the media',
  '/assets/images/your-file.jpg',
  'image',                  -- Change to 'video' for videos
  'parallax',               -- Change to 'hero' for main background
  1,                        -- Position number
  'Alt text for accessibility',
  true
);

-- ============================================
-- EXAMPLE: Add a new parallax image
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
  'Professional Team Meeting',
  'Team of professionals collaborating in modern office',
  '/assets/images/pexels-rdne-7683750.jpg',
  'image',
  'parallax',
  5,
  'Professional team meeting and collaboration',
  true
);

-- ============================================
-- EXAMPLE: Add a new hero video
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
  'Main Hero Video',
  'Primary background video for hero section',
  '/assets/images/your-new-video.mp4',
  'video',
  'hero',
  1,
  'Background video showing team collaboration',
  true
);

-- ============================================
-- EXAMPLE: Add a new parallax video
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
  'Coding Scene',
  'Developer working on code',
  '/assets/images/your-video.mp4',
  'video',
  'parallax',
  3,
  'Developer coding and programming',
  true
);

-- ============================================
-- Verify the media was added
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
ORDER BY usage_type, position, created_at;

-- ============================================
-- Show summary by type
-- ============================================
SELECT 
  media_type,
  usage_type,
  COUNT(*) as total
FROM public.media
WHERE is_active = true
GROUP BY media_type, usage_type
ORDER BY usage_type, media_type;

-- ============================================
-- TIPS:
-- ============================================
-- 1. usage_type = 'hero' → Main background video/image (usually 1 item)
-- 2. usage_type = 'parallax' → Scrolling images/videos (multiple items)
-- 3. position → Controls the order (1, 2, 3, 4...)
-- 4. is_active = true → Media will be displayed
-- 5. is_active = false → Media will be hidden but kept in database
