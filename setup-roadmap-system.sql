-- ========================================
-- LEARNING ROADMAP SYSTEM
-- Visual learning paths for tech careers
-- ========================================

-- 1. Create Roadmaps Table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT,
  estimated_months INTEGER,
  icon TEXT,
  color TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Roadmap Topics Table
CREATE TABLE IF NOT EXISTS roadmap_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  order_index INTEGER,
  level INTEGER DEFAULT 1,
  prerequisites JSONB,
  resources JSONB,
  estimated_hours INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create User Progress Table
CREATE TABLE IF NOT EXISTS user_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES roadmap_topics(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 4. Insert Roadmaps
INSERT INTO roadmaps (title, slug, description, category, difficulty, estimated_months, icon, color, is_popular) VALUES
('Frontend Developer', 'frontend', 'Master HTML, CSS, JavaScript and modern frameworks to build beautiful user interfaces', 'web', 'Beginner', 6, '🎨', 'blue', true),
('Backend Developer', 'backend', 'Learn server-side programming, databases, and API development', 'web', 'Intermediate', 8, '⚙️', 'green', true),
('Full Stack Developer', 'fullstack', 'Combine frontend and backend skills to build complete applications', 'web', 'Intermediate', 12, '🚀', 'purple', true),
('DevOps Engineer', 'devops', 'Master CI/CD, cloud platforms, and infrastructure automation', 'infrastructure', 'Advanced', 10, '☁️', 'orange', true),
('AI/ML Engineer', 'ai-ml', 'Learn machine learning, deep learning, and AI model development', 'ai', 'Advanced', 14, '🤖', 'pink', true),
('Mobile Developer', 'mobile', 'Build native and cross-platform mobile applications', 'mobile', 'Intermediate', 8, '📱', 'indigo', false),
('Data Scientist', 'data-science', 'Analyze data, build models, and extract insights', 'data', 'Advanced', 12, '📊', 'cyan', false),
('Cybersecurity Specialist', 'cybersecurity', 'Protect systems and networks from security threats', 'security', 'Advanced', 10, '🔒', 'red', false),
('Cloud Engineer', 'cloud', 'Design and manage cloud infrastructure and services', 'infrastructure', 'Intermediate', 9, '☁️', 'sky', false),
('Game Developer', 'game-dev', 'Create video games and interactive experiences', 'gaming', 'Intermediate', 10, '🎮', 'violet', false);

-- 5. Insert Frontend Roadmap Topics
INSERT INTO roadmap_topics (roadmap_id, title, description, category, order_index, level, prerequisites, resources, estimated_hours) VALUES
-- Fundamentals
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'HTML Basics', 'Learn HTML structure, tags, and semantic markup', 'fundamentals', 1, 1, '[]', '[{"title": "MDN HTML Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"}]', 20),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'CSS Fundamentals', 'Master CSS selectors, box model, and layouts', 'fundamentals', 2, 1, '["HTML Basics"]', '[{"title": "CSS Tricks", "url": "https://css-tricks.com"}]', 30),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'JavaScript Basics', 'Learn JS syntax, data types, and functions', 'fundamentals', 3, 1, '["HTML Basics"]', '[{"title": "JavaScript.info", "url": "https://javascript.info"}]', 40),

-- Intermediate
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'Responsive Design', 'Build mobile-friendly layouts with Flexbox and Grid', 'intermediate', 4, 2, '["CSS Fundamentals"]', '[]', 25),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'DOM Manipulation', 'Interact with HTML elements using JavaScript', 'intermediate', 5, 2, '["JavaScript Basics"]', '[]', 20),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'Git & GitHub', 'Version control and collaboration', 'tools', 6, 2, '[]', '[]', 15),

-- Advanced
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'React Fundamentals', 'Learn components, props, and state management', 'frameworks', 7, 3, '["JavaScript Basics", "DOM Manipulation"]', '[]', 50),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'State Management', 'Redux, Context API, and modern state solutions', 'frameworks', 8, 3, '["React Fundamentals"]', '[]', 30),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'TypeScript', 'Add type safety to your JavaScript code', 'advanced', 9, 3, '["JavaScript Basics"]', '[]', 35),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'Testing', 'Unit testing, integration testing, and E2E testing', 'advanced', 10, 3, '["React Fundamentals"]', '[]', 25),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'Build Tools', 'Webpack, Vite, and modern build systems', 'tools', 11, 3, '["JavaScript Basics"]', '[]', 20),
((SELECT id FROM roadmaps WHERE slug = 'frontend'), 'Performance Optimization', 'Optimize loading speed and runtime performance', 'advanced', 12, 3, '["React Fundamentals"]', '[]', 30);

-- 6. Insert Backend Roadmap Topics
INSERT INTO roadmap_topics (roadmap_id, title, description, category, order_index, level, prerequisites, resources, estimated_hours) VALUES
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Programming Language', 'Choose and master Python, Java, or Node.js', 'fundamentals', 1, 1, '[]', '[]', 60),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'HTTP & APIs', 'Understand REST, HTTP methods, and API design', 'fundamentals', 2, 1, '[]', '[]', 25),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Databases - SQL', 'Learn relational databases and SQL queries', 'databases', 3, 2, '[]', '[]', 40),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Databases - NoSQL', 'MongoDB, Redis, and document databases', 'databases', 4, 2, '[]', '[]', 30),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Authentication', 'JWT, OAuth, and session management', 'security', 5, 2, '["HTTP & APIs"]', '[]', 25),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'API Development', 'Build RESTful APIs with frameworks', 'intermediate', 6, 2, '["Programming Language", "HTTP & APIs"]', '[]', 45),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Caching', 'Redis, Memcached, and caching strategies', 'advanced', 7, 3, '["Databases - NoSQL"]', '[]', 20),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Message Queues', 'RabbitMQ, Kafka, and async processing', 'advanced', 8, 3, '["API Development"]', '[]', 30),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Microservices', 'Design and build microservice architectures', 'advanced', 9, 3, '["API Development"]', '[]', 40),
((SELECT id FROM roadmaps WHERE slug = 'backend'), 'Testing & CI/CD', 'Automated testing and deployment pipelines', 'devops', 10, 3, '["API Development"]', '[]', 35);

-- 7. Enable RLS
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies
CREATE POLICY "Anyone can read roadmaps"
  ON roadmaps FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read roadmap topics"
  ON roadmap_topics FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their progress"
  ON user_roadmap_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. Create helper functions
CREATE OR REPLACE FUNCTION get_roadmap_progress(p_user_id UUID, p_roadmap_id UUID)
RETURNS TABLE (
  total_topics INTEGER,
  completed_topics INTEGER,
  progress_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_topics,
    COUNT(CASE WHEN urp.completed THEN 1 END)::INTEGER as completed_topics,
    ROUND((COUNT(CASE WHEN urp.completed THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as progress_percentage
  FROM roadmap_topics rt
  LEFT JOIN user_roadmap_progress urp ON rt.id = urp.topic_id AND urp.user_id = p_user_id
  WHERE rt.roadmap_id = p_roadmap_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Verification
-- ========================================

SELECT 
  r.title,
  r.category,
  r.difficulty,
  COUNT(rt.id) as topic_count
FROM roadmaps r
LEFT JOIN roadmap_topics rt ON r.id = rt.roadmap_id
GROUP BY r.id, r.title, r.category, r.difficulty
ORDER BY r.is_popular DESC, r.title;

-- ========================================
-- Setup Complete! 🎉
-- 10 Roadmaps with topics ready
-- ========================================
