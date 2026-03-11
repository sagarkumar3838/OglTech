-- ============================================
-- FIX: Standardize ALL skill names to match frontend
-- ============================================

-- Step 1: Check current skill name variations
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%react%'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Standardize React variations
-- reactjs, react.js, ReactJS → React
UPDATE practice_questions
SET skill = 'React'
WHERE LOWER(skill) IN ('reactjs', 'react.js', 'react js', 'react-js')
   OR skill IN ('ReactJS', 'React.js', 'React.JS');

-- Step 3: Standardize ALL skill names to match frontend exactly
-- Frontend uses: JavaScript, TypeScript, React, Angular, Vue, etc.
UPDATE practice_questions
SET skill = CASE 
  -- Web Development
  WHEN LOWER(skill) IN ('html', 'html5') THEN 'HTML'
  WHEN LOWER(skill) IN ('css', 'css3') THEN 'CSS'
  WHEN LOWER(skill) IN ('javascript', 'js') THEN 'JavaScript'
  WHEN LOWER(skill) IN ('typescript', 'ts') THEN 'TypeScript'
  WHEN LOWER(skill) IN ('react', 'reactjs', 'react.js', 'react js') THEN 'React'
  WHEN LOWER(skill) IN ('angular', 'angularjs', 'angular.js') THEN 'Angular'
  WHEN LOWER(skill) IN ('vue', 'vuejs', 'vue.js') THEN 'Vue'
  
  -- Backend
  WHEN LOWER(skill) = 'java' THEN 'Java'
  WHEN LOWER(skill) IN ('python', 'py') THEN 'Python'
  WHEN LOWER(skill) IN ('nodejs', 'node.js', 'node js', 'node') THEN 'Node.js'
  WHEN LOWER(skill) IN ('csharp', 'c#', 'c sharp') THEN 'C#'
  WHEN LOWER(skill) = 'php' THEN 'PHP'
  WHEN LOWER(skill) = 'ruby' THEN 'Ruby'
  WHEN LOWER(skill) = 'go' THEN 'Go'
  WHEN LOWER(skill) = 'rust' THEN 'Rust'
  
  -- Database
  WHEN LOWER(skill) = 'sql' THEN 'SQL'
  WHEN LOWER(skill) IN ('oracle', 'oracle db', 'oracle database') THEN 'Oracle'
  WHEN LOWER(skill) IN ('postgresql', 'postgres') THEN 'PostgreSQL'
  WHEN LOWER(skill) IN ('mongodb', 'mongo') THEN 'MongoDB'
  WHEN LOWER(skill) = 'redis' THEN 'Redis'
  
  -- Mobile
  WHEN LOWER(skill) = 'kotlin' THEN 'Kotlin'
  WHEN LOWER(skill) = 'swift' THEN 'Swift'
  WHEN LOWER(skill) = 'flutter' THEN 'Flutter'
  WHEN LOWER(skill) IN ('react native', 'reactnative', 'react-native') THEN 'React Native'
  
  -- DevOps & Cloud
  WHEN LOWER(skill) = 'docker' THEN 'Docker'
  WHEN LOWER(skill) IN ('kubernetes', 'k8s') THEN 'Kubernetes'
  WHEN LOWER(skill) = 'linux' THEN 'Linux'
  WHEN LOWER(skill) = 'aws' THEN 'AWS'
  WHEN LOWER(skill) = 'azure' THEN 'Azure'
  WHEN LOWER(skill) IN ('gcp', 'google cloud', 'googlecloud') THEN 'GCP'
  WHEN LOWER(skill) = 'terraform' THEN 'Terraform'
  WHEN LOWER(skill) = 'ansible' THEN 'Ansible'
  
  -- Graphics & Game Dev
  WHEN LOWER(skill) = 'opengl' THEN 'OpenGL'
  WHEN LOWER(skill) = 'glsl' THEN 'GLSL'
  WHEN LOWER(skill) IN ('cpp', 'c++', 'cplusplus') THEN 'C++'
  WHEN LOWER(skill) = 'unity' THEN 'Unity'
  WHEN LOWER(skill) IN ('unreal', 'unreal engine', 'unrealengine') THEN 'Unreal'
  
  -- DevTools
  WHEN LOWER(skill) IN ('devtools', 'dev tools', 'browser devtools') THEN 'DevTools'
  WHEN LOWER(skill) = 'webpack' THEN 'Webpack'
  WHEN LOWER(skill) = 'git' THEN 'Git'
  WHEN LOWER(skill) IN ('vscode', 'vs code', 'visual studio code') THEN 'VSCode'
  
  -- Testing
  WHEN LOWER(skill) = 'selenium' THEN 'Selenium'
  WHEN LOWER(skill) = 'jest' THEN 'Jest'
  WHEN LOWER(skill) = 'cypress' THEN 'Cypress'
  
  ELSE skill
END;

-- Step 4: Verify React is now unified
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'React'
GROUP BY skill, level
ORDER BY level;

-- Step 5: Check all skills are standardized
SELECT 
  skill,
  COUNT(*) as total_questions,
  SUM(CASE WHEN level = 'beginner' THEN 1 ELSE 0 END) as beginner,
  SUM(CASE WHEN level = 'intermediate' THEN 1 ELSE 0 END) as intermediate,
  SUM(CASE WHEN level = 'advanced' THEN 1 ELSE 0 END) as advanced
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Step 6: Show any remaining non-standard skill names
SELECT DISTINCT skill
FROM practice_questions
WHERE skill NOT IN (
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
  'Java', 'Python', 'Node.js', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'SQL', 'Oracle', 'PostgreSQL', 'MongoDB', 'Redis',
  'Kotlin', 'Swift', 'Flutter', 'React Native',
  'Docker', 'Kubernetes', 'Linux', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible',
  'OpenGL', 'GLSL', 'C++', 'Unity', 'Unreal',
  'DevTools', 'Webpack', 'Git', 'VSCode',
  'Selenium', 'Jest', 'Cypress'
)
ORDER BY skill;
