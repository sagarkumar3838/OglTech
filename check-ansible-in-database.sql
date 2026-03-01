-- Check if Ansible Advanced questions exist in database

-- Check practice_questions table
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as total_questions
FROM practice_questions
WHERE skill = 'Ansible' AND level = 'Advanced';

-- Check questions table
SELECT 
  'questions' as table_name,
  COUNT(*) as total_questions
FROM questions
WHERE skill = 'Ansible' AND level = 'Advanced';

-- Show sample questions if they exist
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 50) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'Ansible' AND level = 'Advanced'
ORDER BY created_at DESC
LIMIT 5;

-- Check all Ansible questions by level
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Ansible'
GROUP BY level
ORDER BY level;
