-- Quick check of uploaded practice questions

-- Total count
SELECT COUNT(*) as total_questions FROM practice_questions;

-- By skill
SELECT 
    skill,
    COUNT(*) as total,
    COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic,
    COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced
FROM practice_questions
GROUP BY skill
ORDER BY total DESC
LIMIT 20;

-- Sample questions
SELECT 
    skill,
    level,
    LEFT(question_text, 60) as question_preview,
    CASE WHEN mdn_link IS NOT NULL THEN '✓' ELSE '✗' END as has_mdn,
    CASE WHEN youtube_english IS NOT NULL THEN '✓' ELSE '✗' END as has_video
FROM practice_questions
LIMIT 10;
