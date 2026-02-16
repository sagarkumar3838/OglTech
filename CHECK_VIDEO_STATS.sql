-- ============================================
-- CHECK VIDEO/DOCUMENTATION STATISTICS
-- ============================================

-- Overall statistics
SELECT 
  COUNT(*) as total_questions,
  COUNT(mdn_link) as has_mdn_link,
  COUNT(youtube_english) as has_english_video,
  COUNT(youtube_hindi) as has_hindi_video,
  COUNT(youtube_kannada) as has_kannada_video,
  COUNT(youtube_tamil) as has_tamil_video,
  COUNT(youtube_telugu) as has_telugu_video,
  ROUND(COUNT(mdn_link)::numeric / COUNT(*) * 100, 1) as pct_with_docs,
  ROUND(COUNT(youtube_english)::numeric / COUNT(*) * 100, 1) as pct_with_video
FROM questions;

-- ============================================
-- BY SKILL - Which skills have the most resources?
-- ============================================

SELECT 
  skill,
  COUNT(*) as total,
  COUNT(mdn_link) as has_docs,
  COUNT(youtube_english) as has_video,
  ROUND(COUNT(youtube_english)::numeric / COUNT(*) * 100, 1) as video_coverage_pct
FROM questions
GROUP BY skill
ORDER BY video_coverage_pct DESC, total DESC;

-- ============================================
-- SAMPLE QUESTIONS WITH ALL RESOURCES
-- ============================================

SELECT 
  skill,
  level,
  LEFT(question, 60) as question_preview,
  CASE WHEN mdn_link IS NOT NULL THEN '✓' ELSE '✗' END as docs,
  CASE WHEN youtube_english IS NOT NULL THEN '✓' ELSE '✗' END as en,
  CASE WHEN youtube_hindi IS NOT NULL THEN '✓' ELSE '✗' END as hi,
  CASE WHEN youtube_kannada IS NOT NULL THEN '✓' ELSE '✗' END as kn,
  CASE WHEN youtube_tamil IS NOT NULL THEN '✓' ELSE '✗' END as ta,
  CASE WHEN youtube_telugu IS NOT NULL THEN '✓' ELSE '✗' END as te
FROM questions
WHERE youtube_english IS NOT NULL
LIMIT 10;
