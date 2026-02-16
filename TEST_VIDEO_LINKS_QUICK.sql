-- ============================================
-- QUICK TEST: Check if video links are in questions
-- ============================================

-- Test 1: Get a few questions with video links
SELECT 
  id,
  skill,
  level,
  LEFT(question, 80) as question_preview,
  mdn_link,
  youtube_english,
  youtube_hindi,
  youtube_kannada,
  youtube_tamil,
  youtube_telugu
FROM questions
WHERE youtube_english IS NOT NULL
LIMIT 5;

-- Test 2: Check JavaScript easy questions (what you see in Practice page)
SELECT 
  id,
  skill,
  level,
  LEFT(question, 60) as question_preview,
  CASE WHEN mdn_link IS NOT NULL THEN '✓ Has Docs' ELSE '✗ No Docs' END as docs,
  CASE WHEN youtube_english IS NOT NULL THEN '✓ Has Video' ELSE '✗ No Video' END as video
FROM questions
WHERE skill = 'javascript' 
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 10;

-- Test 3: Count by skill - which skills have videos?
SELECT 
  skill,
  COUNT(*) as total_questions,
  COUNT(youtube_english) as has_video,
  ROUND(COUNT(youtube_english)::numeric / COUNT(*) * 100, 0) as video_pct
FROM questions
GROUP BY skill
HAVING COUNT(youtube_english) > 0
ORDER BY video_pct DESC;
