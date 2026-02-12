-- ============================================
-- STEP 1: Check Current Database State
-- ============================================

-- See all skills currently in database
SELECT DISTINCT skill, COUNT(*) as total_questions
FROM questions
GROUP BY skill
ORDER BY skill;

-- See which skills have MCQ questions
SELECT 
  skill,
  COUNT(*) as mcq_count,
  COUNT(DISTINCT level) as levels_available
FROM questions
WHERE type = 'mcq'
GROUP BY skill
ORDER BY skill;

-- ============================================
-- STEP 2: Delete Skills Without Enough Questions
-- ============================================

-- Delete skills that have less than 10 MCQ questions total
-- (These won't work well for practice tests)
DELETE FROM questions
WHERE skill IN (
  SELECT skill
  FROM questions
  WHERE type = 'mcq'
  GROUP BY skill
  HAVING COUNT(*) < 10
);

-- Delete non-MCQ questions (fill_blank, etc.) if you only want MCQ
-- UNCOMMENT if you want to remove all non-MCQ questions:
-- DELETE FROM questions WHERE type != 'mcq';

-- ============================================
-- STEP 3: Verify Cleanup
-- ============================================

-- Check what's left
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- ============================================
-- STEP 4: Upload New Questions
-- ============================================

-- Now you can upload new questions using the format below
-- Replace with your actual questions

-- Example: HTML Questions
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation, mdn_link, youtube_english)
VALUES 
  (
    'html-easy-' || gen_random_uuid()::text,
    'html',
    'easy',
    'mcq',
    'What does HTML stand for?',
    '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]',
    '0',
    'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.',
    'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'https://www.youtube.com/results?search_query=what+is+html'
  ),
  (
    'html-easy-' || gen_random_uuid()::text,
    'html',
    'easy',
    'mcq',
    'Which HTML element is used for the largest heading?',
    '["<h1>", "<h6>", "<head>", "<heading>"]',
    '0',
    'The <h1> element defines the most important heading.',
    'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements',
    'https://www.youtube.com/results?search_query=html+headings'
  );

-- Add more questions here...

-- ============================================
-- STEP 5: Final Verification
-- ============================================

-- Check final state
SELECT 
  skill,
  COUNT(DISTINCT level) as levels,
  SUM(CASE WHEN level = 'easy' THEN 1 ELSE 0 END) as beginner,
  SUM(CASE WHEN level = 'medium' THEN 1 ELSE 0 END) as intermediate,
  SUM(CASE WHEN level = 'hard' THEN 1 ELSE 0 END) as advanced,
  COUNT(*) as total
FROM questions
WHERE type = 'mcq'
GROUP BY skill
ORDER BY skill;
