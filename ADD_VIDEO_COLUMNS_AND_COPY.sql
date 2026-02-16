-- ============================================
-- ADD VIDEO/LINK COLUMNS TO QUESTIONS TABLE
-- ============================================

-- Step 1: Add the missing columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS mdn_link TEXT,
ADD COLUMN IF NOT EXISTS youtube_english TEXT,
ADD COLUMN IF NOT EXISTS youtube_hindi TEXT,
ADD COLUMN IF NOT EXISTS youtube_kannada TEXT,
ADD COLUMN IF NOT EXISTS youtube_tamil TEXT,
ADD COLUMN IF NOT EXISTS youtube_telugu TEXT;

-- ============================================
-- UPDATE EXISTING QUESTIONS WITH VIDEO LINKS
-- ============================================

-- Update questions that were already copied with the video/link data
UPDATE questions q
SET 
  mdn_link = pq.mdn_link,
  youtube_english = pq.youtube_english,
  youtube_hindi = pq.youtube_hindi,
  youtube_kannada = pq.youtube_kannada,
  youtube_tamil = pq.youtube_tamil,
  youtube_telugu = pq.youtube_telugu
FROM practice_questions pq
WHERE q.question = pq.question_text;

-- ============================================
-- VERIFY IT WORKED
-- ============================================

-- Check how many questions now have video links
SELECT 
  COUNT(*) as total_questions,
  COUNT(mdn_link) as has_mdn_link,
  COUNT(youtube_english) as has_english_video,
  COUNT(youtube_hindi) as has_hindi_video,
  COUNT(youtube_kannada) as has_kannada_video,
  COUNT(youtube_tamil) as has_tamil_video,
  COUNT(youtube_telugu) as has_telugu_video
FROM questions;

-- ============================================
-- VIEW SAMPLE WITH LINKS
-- ============================================

-- Show sample questions with their video links
SELECT 
  skill,
  level,
  LEFT(question, 50) as question_preview,
  CASE WHEN mdn_link IS NOT NULL THEN '✓' ELSE '✗' END as has_docs,
  CASE WHEN youtube_english IS NOT NULL THEN '✓' ELSE '✗' END as has_video
FROM questions
LIMIT 20;
