-- Fix Java questions for Practice page
-- This will copy Java questions from practice_questions to questions table if needed

-- First, check if Java questions exist in practice_questions but not in questions
DO $$
DECLARE
  practice_count INTEGER;
  questions_count INTEGER;
BEGIN
  -- Count Java questions in practice_questions
  SELECT COUNT(*) INTO practice_count
  FROM practice_questions
  WHERE skill = 'java';
  
  -- Count Java questions in questions
  SELECT COUNT(*) INTO questions_count
  FROM questions
  WHERE skill = 'java';
  
  RAISE NOTICE 'Java questions in practice_questions: %', practice_count;
  RAISE NOTICE 'Java questions in questions: %', questions_count;
  
  -- If practice_questions has Java but questions doesn't, copy them
  IF practice_count > 0 AND questions_count = 0 THEN
    RAISE NOTICE 'Copying Java questions from practice_questions to questions...';
    
    INSERT INTO questions (
      skill,
      level,
      type,
      question,
      options,
      correct_answer,
      explanation,
      topic,
      mdn_link,
      youtube_english,
      youtube_hindi,
      youtube_kannada,
      youtube_tamil,
      youtube_telugu
    )
    SELECT 
      skill,
      level,
      'mcq' as type,
      question,
      options,
      correct_answer,
      explanation,
      topic,
      mdn_link,
      youtube_english,
      youtube_hindi,
      youtube_kannada,
      youtube_tamil,
      youtube_telugu
    FROM practice_questions
    WHERE skill = 'java'
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Java questions copied successfully!';
  END IF;
END $$;

-- Verify the copy
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
WHERE skill = 'java'
GROUP BY skill, level
ORDER BY level;
