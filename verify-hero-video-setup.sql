-- Verify hero video is properly set up in database

-- Check if the hero video exists
SELECT 
  id,
  title,
  media_url,
  media_type,
  usage_type,
  position,
  is_active,
  created_at
FROM media 
WHERE usage_type = 'hero' 
  AND media_type = 'video'
  AND is_active = true;

-- Count all media by type
SELECT 
  usage_type,
  media_type,
  COUNT(*) as count,
  COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM media
GROUP BY usage_type, media_type
ORDER BY usage_type, media_type;
