-- ============================================
-- VERIFY PRACTICE QUESTIONS DATABASE
-- ============================================
-- Run these queries to verify your upload

-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'practice_questions'
) as table_exists;

-- 2. Total questions count
SELECT COUNT(*) as total_questions 
FROM practice_questions;

-- 3. Breakdown by skill
SELECT 
    skill,
    COUNT(*) as total,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- 4. Breakdown by level
SELECT 
    level,
    COUNT(*) as question_count,
    COUNT(DISTINCT skill) as skills_covered
FROM practice_questions
GROUP BY level
ORDER BY level;

-- 5. Question types distribution
SELECT 
    type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM practice_questions
GROUP BY type
ORDER BY count DESC;

-- 6. Multimedia resources coverage
SELECT 
    COUNT(*) as total_questions,
    COUNT(mdn_link) as with_mdn_link,
    COUNT(youtube_english) as with_english_video,
    COUNT(youtube_hindi) as with_hindi_video,
    COUNT(youtube_kannada) as with_kannada_video,
    COUNT(youtube_tamil) as with_tamil_video,
    COUNT(youtube_telugu) as with_telugu_video,
    ROUND(COUNT(mdn_link) * 100.0 / COUNT(*), 2) as mdn_coverage_percent,
    ROUND(COUNT(youtube_english) * 100.0 / COUNT(*), 2) as video_coverage_percent
FROM practice_questions;

-- 7. Questions with complete multimedia (all languages)
SELECT 
    skill,
    level,
    COUNT(*) as questions_with_all_videos
FROM practice_questions
WHERE youtube_english IS NOT NULL
  AND youtube_hindi IS NOT NULL
  AND youtube_kannada IS NOT NULL
  AND youtube_tamil IS NOT NULL
  AND youtube_telugu IS NOT NULL
GROUP BY skill, level
ORDER BY questions_with_all_videos DESC;

-- 8. Sample questions from each skill (first 2)
SELECT 
    skill,
    level,
    LEFT(question_text, 80) as question_preview,
    CASE 
        WHEN mdn_link IS NOT NULL THEN '✓' 
        ELSE '✗' 
    END as has_mdn,
    CASE 
        WHEN youtube_english IS NOT NULL THEN '✓' 
        ELSE '✗' 
    END as has_video
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY skill ORDER BY level) as rn
    FROM practice_questions
) sub
WHERE rn <= 2
ORDER BY skill, level;

-- 9. Check for potential issues
SELECT 
    'Missing explanations' as issue,
    COUNT(*) as count
FROM practice_questions
WHERE explanation IS NULL OR explanation = ''
UNION ALL
SELECT 
    'Missing topics' as issue,
    COUNT(*) as count
FROM practice_questions
WHERE topic IS NULL OR topic = ''
UNION ALL
SELECT 
    'Questions without options (MCQ)' as issue,
    COUNT(*) as count
FROM practice_questions
WHERE type = 'mcq' 
  AND (option_a IS NULL OR option_b IS NULL);

-- 10. Top 10 skills by question count
SELECT 
    skill,
    COUNT(*) as total_questions,
    COUNT(DISTINCT level) as levels_available,
    MIN(created_at) as first_uploaded,
    MAX(created_at) as last_uploaded
FROM practice_questions
GROUP BY skill
ORDER BY total_questions DESC
LIMIT 10;

-- 11. Questions added in last 24 hours
SELECT 
    skill,
    level,
    COUNT(*) as recent_questions
FROM practice_questions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY skill, level
ORDER BY recent_questions DESC;

-- 12. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'practice_questions';

-- 13. Sample random question with all details
SELECT 
    skill,
    level,
    type,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    topic,
    mdn_link,
    youtube_english
FROM practice_questions
WHERE is_active = true
ORDER BY RANDOM()
LIMIT 1;

-- 14. Skills missing certain levels
SELECT 
    skill,
    CASE WHEN SUM(CASE WHEN level = 'beginner' THEN 1 ELSE 0 END) = 0 THEN 'Missing Beginner' END as beginner_status,
    CASE WHEN SUM(CASE WHEN level = 'intermediate' THEN 1 ELSE 0 END) = 0 THEN 'Missing Intermediate' END as intermediate_status,
    CASE WHEN SUM(CASE WHEN level = 'advanced' THEN 1 ELSE 0 END) = 0 THEN 'Missing Advanced' END as advanced_status
FROM practice_questions
GROUP BY skill
HAVING SUM(CASE WHEN level = 'beginner' THEN 1 ELSE 0 END) = 0
    OR SUM(CASE WHEN level = 'intermediate' THEN 1 ELSE 0 END) = 0
    OR SUM(CASE WHEN level = 'advanced' THEN 1 ELSE 0 END) = 0;

-- 15. Success summary
SELECT 
    '✅ Database Setup Complete!' as status,
    COUNT(*) as total_questions,
    COUNT(DISTINCT skill) as total_skills,
    COUNT(DISTINCT level) as total_levels,
    COUNT(DISTINCT type) as question_types
FROM practice_questions;
