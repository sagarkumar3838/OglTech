-- ============================================
-- Transform CSV data to match Supabase schema
-- ============================================
-- This script helps transform your CSV with option_a, option_b, option_c, option_d
-- into the format expected by the questions table (options as JSONB array)

-- INSTRUCTIONS:
-- 1. First, create a temporary table to load your CSV
-- 2. Then transform and insert into the questions table

-- Step 1: Create temporary table matching your CSV structure
CREATE TEMP TABLE temp_questions_csv (
  question_id TEXT,
  skill TEXT,
  level TEXT,
  type TEXT,
  question TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT,
  explanation TEXT,
  code_snippet TEXT
);

-- Step 2: Import your CSV into temp_questions_csv
-- In Supabase dashboard: Use the SQL editor to run this, then use the UI to import CSV into temp_questions_csv

-- Step 3: Transform and insert into questions table
INSERT INTO questions (
  question_id,
  skill,
  level,
  type,
  question,
  options,
  correct_answer,
  explanation,
  code_snippet,
  verified
)
SELECT 
  question_id,
  skill,
  level,
  type,
  question,
  -- Transform option_a, option_b, option_c, option_d into JSONB array
  jsonb_build_array(
    CASE WHEN option_a IS NOT NULL AND option_a != '' THEN option_a ELSE NULL END,
    CASE WHEN option_b IS NOT NULL AND option_b != '' THEN option_b ELSE NULL END,
    CASE WHEN option_c IS NOT NULL AND option_c != '' THEN option_c ELSE NULL END,
    CASE WHEN option_d IS NOT NULL AND option_d != '' THEN option_d ELSE NULL END
  ) - NULL AS options, -- Remove NULL values from array
  -- Transform correct_answer to JSONB
  CASE 
    WHEN type = 'mcq' THEN to_jsonb(correct_answer)
    WHEN type = 'multi_select' THEN to_jsonb(string_to_array(correct_answer, ','))
    ELSE to_jsonb(correct_answer)
  END AS correct_answer,
  explanation,
  code_snippet,
  TRUE AS verified
FROM temp_questions_csv
ON CONFLICT (question_id) DO UPDATE SET
  skill = EXCLUDED.skill,
  level = EXCLUDED.level,
  type = EXCLUDED.type,
  question = EXCLUDED.question,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  code_snippet = EXCLUDED.code_snippet,
  verified = EXCLUDED.verified;

-- Step 4: Clean up
DROP TABLE temp_questions_csv;

-- Verify the import
SELECT COUNT(*) as total_questions FROM questions;
SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;
