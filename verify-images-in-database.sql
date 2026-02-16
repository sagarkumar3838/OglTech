-- Verify images are properly stored in the database

-- 1. Check if media table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'media'
) as media_table_exists;

-- 2. Count total images in database
SELECT 
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_images,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_images
FROM public.media
WHERE media_type = 'image';

-- 3. List all images with details
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
ORDER BY usage_type, position;

-- 4. Check for missing images (images that should be in database)
-- Expected images:
-- /assets/images/business-7836199.jpg
-- /assets/images/man-597178.jpg
-- /assets/images/pexels-cottonbro-4880411.jpg
-- /assets/images/student-7378904.jpg
-- /assets/images/pexels-rdne-7683750.jpg
-- /assets/images/SkillEval.png

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/business-7836199.jpg') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as business_image,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/man-597178.jpg') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as developer_image,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/pexels-cottonbro-4880411.jpg') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as assessment_image,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/student-7378904.jpg') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as student_image,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/pexels-rdne-7683750.jpg') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as training_image,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.media WHERE media_url = '/assets/images/SkillEval.png') 
    THEN '✓ Found' 
    ELSE '✗ Missing' 
  END as logo_image;

-- 5. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'media';
