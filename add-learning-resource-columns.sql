-- ============================================
-- Add Learning Resource Columns to Questions Table
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check current columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- STEP 2: Add missing columns for learning resources
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS mdn_link TEXT,
ADD COLUMN IF NOT EXISTS youtube_english TEXT,
ADD COLUMN IF NOT EXISTS youtube_hindi TEXT,
ADD COLUMN IF NOT EXISTS youtube_kannada TEXT,
ADD COLUMN IF NOT EXISTS youtube_tamil TEXT,
ADD COLUMN IF NOT EXISTS youtube_telugu TEXT;

-- STEP 3: Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions'
AND column_name IN ('mdn_link', 'youtube_english', 'youtube_hindi', 'youtube_kannada', 'youtube_tamil', 'youtube_telugu')
ORDER BY column_name;

-- STEP 4: Now you can insert questions with learning resources
-- Example:
/*
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation, mdn_link, youtube_english)
VALUES 
  (
    'html-easy-001',
    'html',
    'easy',
    'mcq',
    'What does HTML stand for?',
    '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]',
    '0',
    'HTML stands for Hyper Text Markup Language.',
    'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'https://www.youtube.com/results?search_query=what+is+html'
  );
*/

-- ============================================
-- SUCCESS! Columns added.
-- Now you can add questions with learning resources.
-- ============================================
