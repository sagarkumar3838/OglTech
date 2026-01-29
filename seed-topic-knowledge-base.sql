-- ============================================
-- Seed Topic Knowledge Base
-- ============================================
-- Sample data with LINKS (legal) and YOUR OWN summaries
-- ============================================

INSERT INTO topic_knowledge_base (
  skill, topic, subtopic, title, short_description, difficulty_level,
  w3schools_url, mdn_url, geeksforgeeks_url,
  youtube_en, youtube_hi,
  key_points, code_examples, common_mistakes, best_practices,
  tags, prerequisites, estimated_time_minutes
) VALUES

-- HTML Forms
(
  'html',
  'HTML Forms',
  'Form Elements',
  'HTML Forms Complete Guide',
  'Learn how to create interactive forms with HTML form elements',
  'beginner',
  'https://www.w3schools.com/html/html_forms.asp',
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
  'https://www.geeksforgeeks.org/html-forms/',
  'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
  'https://www.youtube.com/watch?v=YwbIeMlxZAU',
  '["Forms collect user input", "Use <form> element as container", "Input types: text, email, password, etc.", "Submit button sends data to server"]'::jsonb,
  '[{"title": "Basic Form", "code": "<form action=\"/submit\" method=\"POST\">\n  <input type=\"text\" name=\"username\">\n  <button type=\"submit\">Submit</button>\n</form>"}]'::jsonb,
  '["Forgetting name attribute on inputs", "Not specifying form method", "Missing labels for accessibility"]'::jsonb,
  '["Always use labels for inputs", "Validate on both client and server", "Use appropriate input types"]'::jsonb,
  ARRAY['forms', 'input', 'validation'],
  ARRAY['HTML Basics'],
  30
),

-- CSS Flexbox
(
  'css',
  'CSS Flexbox',
  'Flex Container',
  'CSS Flexbox Layout',
  'Master flexible box layout for responsive designs',
  'intermediate',
  'https://www.w3schools.com/css/css3_flexbox.asp',
  'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout',
  'https://www.geeksforgeeks.org/css-flexbox-and-its-properties/',
  'https://www.youtube.com/watch?v=JJSoEo8JSnc',
  'https://www.youtube.com/watch?v=Y8zMYaD1bz0',
  '["display: flex creates flex container", "flex-direction controls main axis", "justify-content aligns items on main axis", "align-items aligns on cross axis"]'::jsonb,
  '[{"title": "Flex Container", "code": ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}"}]'::jsonb,
  '["Forgetting display: flex", "Confusing justify-content and align-items", "Not understanding flex-direction"]'::jsonb,
  '["Use flexbox for one-dimensional layouts", "Combine with CSS Grid for complex layouts", "Test on different screen sizes"]'::jsonb,
  ARRAY['flexbox', 'layout', 'responsive'],
  ARRAY['CSS Basics', 'CSS Box Model'],
  45
),

-- JavaScript Promises
(
  'javascript',
  'JavaScript Promises',
  'Async Programming',
  'JavaScript Promises',
  'Handle asynchronous operations with Promises',
  'intermediate',
  'https://www.w3schools.com/js/js_promise.asp',
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
  'https://www.geeksforgeeks.org/javascript-promises/',
  'https://www.youtube.com/watch?v=DHvZLI7Db8E',
  'https://www.youtube.com/watch?v=NOzi4wBHn0o',
  '["Promise represents eventual completion of async operation", "Three states: pending, fulfilled, rejected", "Use .then() for success, .catch() for errors", "async/await is syntactic sugar over promises"]'::jsonb,
  '[{"title": "Basic Promise", "code": "const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve(\"Done!\"), 1000);\n});\n\npromise.then(result => console.log(result));"}]'::jsonb,
  '["Not handling errors with .catch()", "Forgetting to return in .then()", "Creating unnecessary promise wrappers"]'::jsonb,
  '["Always handle errors", "Use async/await for cleaner code", "Chain promises properly"]'::jsonb,
  ARRAY['promises', 'async', 'callbacks'],
  ARRAY['JavaScript Basics', 'Functions'],
  60
)

ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Knowledge Base Seeded!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Added topics:';
  RAISE NOTICE '✅   - HTML Forms';
  RAISE NOTICE '✅   - CSS Flexbox';
  RAISE NOTICE '✅   - JavaScript Promises';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Contains LINKS (legal) + YOUR summaries';
  RAISE NOTICE '✅ ============================================';
END $$;
