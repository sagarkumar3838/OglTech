-- Seed Career Progression Paths and Learning Resources
-- This populates the database with real career progression data

-- ============================================
-- Career Progression Paths
-- ============================================

-- From OGL Content Developer to Advanced OGL Roles
INSERT INTO public.career_progression_paths (
  from_career_id,
  to_career_id,
  to_career_name,
  required_skills,
  recommended_skills,
  difficulty_level,
  estimated_time_months,
  description
) VALUES
-- OGL Content Developer Progressions
(
  'ogl-content-developer',
  'ogl-technical-artist',
  'OGL Technical Artist',
  ARRAY['ogl', 'shaders', '3d-modeling'],
  ARRAY['blender', 'unity', 'unreal'],
  'medium',
  6,
  'Advance to creating technical art and visual effects using OpenGL shaders and 3D tools'
),
(
  'ogl-content-developer',
  'ogl-game-engine-developer',
  'OGL Game Engine Developer',
  ARRAY['ogl', 'c++', 'algorithms'],
  ARRAY['physics', 'networking', 'optimization'],
  'hard',
  12,
  'Build complete game engines using OpenGL, C++, and advanced computer graphics'
),
(
  'ogl-content-developer',
  'graphics-programmer',
  'Graphics Programmer',
  ARRAY['ogl', 'glsl', 'mathematics'],
  ARRAY['vulkan', 'directx', 'ray-tracing'],
  'hard',
  18,
  'Specialize in advanced graphics programming and rendering techniques'
),

-- Frontend Developer Progressions
(
  'frontend-developer',
  'fullstack-developer',
  'Full Stack Developer',
  ARRAY['html', 'css', 'javascript', 'nodejs'],
  ARRAY['databases', 'apis', 'deployment'],
  'medium',
  8,
  'Expand to backend development and become a full-stack engineer'
),
(
  'frontend-developer',
  'ui-ux-developer',
  'UI/UX Developer',
  ARRAY['html', 'css', 'javascript', 'design'],
  ARRAY['figma', 'user-research', 'prototyping'],
  'easy',
  4,
  'Specialize in user interface design and user experience'
),
(
  'frontend-developer',
  'react-specialist',
  'React Specialist',
  ARRAY['javascript', 'react', 'redux'],
  ARRAY['nextjs', 'typescript', 'testing'],
  'medium',
  6,
  'Become an expert in React ecosystem and modern frontend architecture'
),

-- Backend Developer Progressions
(
  'backend-developer',
  'fullstack-developer',
  'Full Stack Developer',
  ARRAY['nodejs', 'databases', 'apis', 'html', 'css'],
  ARRAY['react', 'vue', 'angular'],
  'medium',
  8,
  'Add frontend skills to become a complete full-stack developer'
),
(
  'backend-developer',
  'devops-engineer',
  'DevOps Engineer',
  ARRAY['nodejs', 'linux', 'docker', 'ci-cd'],
  ARRAY['kubernetes', 'aws', 'monitoring'],
  'hard',
  10,
  'Transition to infrastructure, deployment, and operations'
),
(
  'backend-developer',
  'cloud-architect',
  'Cloud Architect',
  ARRAY['nodejs', 'aws', 'architecture', 'security'],
  ARRAY['microservices', 'serverless', 'cost-optimization'],
  'hard',
  12,
  'Design and implement cloud-based solutions and architectures'
);

-- ============================================
-- Learning Resources
-- ============================================

-- OGL Learning Resources
INSERT INTO public.learning_resources (
  skill_name,
  level,
  title,
  description,
  resource_type,
  resource_url,
  duration_minutes,
  is_free
) VALUES
('ogl', 'easy', 'OpenGL Basics Tutorial', 'Introduction to OpenGL graphics programming', 'video', 'https://learnopengl.com', 120, true),
('ogl', 'easy', 'Setting Up OpenGL', 'Complete guide to setting up OpenGL development environment', 'article', 'https://learnopengl.com/Getting-started', 30, true),
('ogl', 'medium', 'OpenGL Shaders', 'Learn GLSL and shader programming', 'course', 'https://learnopengl.com/Getting-started/Shaders', 180, true),
('ogl', 'medium', '3D Transformations', 'Master matrices and 3D transformations', 'video', 'https://learnopengl.com/Getting-started/Transformations', 90, true),
('ogl', 'hard', 'Advanced Lighting', 'Implement advanced lighting techniques', 'course', 'https://learnopengl.com/Lighting', 240, true),
('ogl', 'hard', 'PBR Rendering', 'Physically Based Rendering with OpenGL', 'course', 'https://learnopengl.com/PBR', 300, true),

-- HTML Learning Resources
('html', 'easy', 'HTML Fundamentals', 'Learn HTML basics and structure', 'course', 'https://developer.mozilla.org/en-US/docs/Learn/HTML', 60, true),
('html', 'easy', 'HTML Forms', 'Master HTML forms and input elements', 'article', 'https://developer.mozilla.org/en-US/docs/Learn/Forms', 45, true),
('html', 'medium', 'Semantic HTML', 'Write accessible and semantic HTML', 'video', 'https://web.dev/learn/html', 90, true),
('html', 'hard', 'HTML5 APIs', 'Advanced HTML5 APIs and features', 'course', 'https://developer.mozilla.org/en-US/docs/Web/API', 120, true),

-- CSS Learning Resources
('css', 'easy', 'CSS Basics', 'Introduction to CSS styling', 'course', 'https://developer.mozilla.org/en-US/docs/Learn/CSS', 60, true),
('css', 'easy', 'CSS Flexbox', 'Master Flexbox layout', 'video', 'https://flexboxfroggy.com', 30, true),
('css', 'medium', 'CSS Grid', 'Learn CSS Grid layout system', 'course', 'https://cssgridgarden.com', 45, true),
('css', 'medium', 'CSS Animations', 'Create smooth CSS animations', 'video', 'https://web.dev/learn/css/animations', 90, true),
('css', 'hard', 'Advanced CSS', 'CSS architecture and best practices', 'course', 'https://web.dev/learn/css', 180, true),

-- JavaScript Learning Resources
('javascript', 'easy', 'JavaScript Basics', 'Learn JavaScript fundamentals', 'course', 'https://javascript.info', 120, true),
('javascript', 'easy', 'DOM Manipulation', 'Work with the Document Object Model', 'video', 'https://javascript.info/document', 60, true),
('javascript', 'medium', 'ES6+ Features', 'Modern JavaScript features', 'course', 'https://javascript.info/advanced', 150, true),
('javascript', 'medium', 'Async JavaScript', 'Promises, async/await, and APIs', 'video', 'https://javascript.info/async', 120, true),
('javascript', 'hard', 'JavaScript Patterns', 'Design patterns and architecture', 'course', 'https://javascript.info/patterns', 240, true),

-- jQuery Learning Resources
('jquery', 'easy', 'jQuery Basics', 'Introduction to jQuery library', 'course', 'https://learn.jquery.com', 60, true),
('jquery', 'medium', 'jQuery Effects', 'Animations and effects with jQuery', 'video', 'https://learn.jquery.com/effects', 45, true),
('jquery', 'hard', 'jQuery Plugins', 'Create custom jQuery plugins', 'course', 'https://learn.jquery.com/plugins', 90, true);

-- ============================================
-- Verify Data Inserted
-- ============================================
SELECT 
  'Career Progression Paths' as table_name,
  COUNT(*) as record_count
FROM public.career_progression_paths
UNION ALL
SELECT 
  'Learning Resources' as table_name,
  COUNT(*) as record_count
FROM public.learning_resources;

-- Show sample career progressions
SELECT 
  from_career_id,
  to_career_name,
  difficulty_level,
  estimated_time_months,
  array_length(required_skills, 1) as required_skills_count
FROM public.career_progression_paths
ORDER BY from_career_id, difficulty_level;
