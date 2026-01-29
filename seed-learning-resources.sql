-- ============================================
-- Seed Learning Resources
-- ============================================
-- Sample learning resources for HTML, CSS, JavaScript
-- ============================================

-- HTML Resources
INSERT INTO learning_resources (skill, topic, resource_type, language, title, url, description, difficulty_level) VALUES

-- HTML Forms
('html', 'HTML Forms', 'mdn', 'en', 'HTML Forms - MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form', 'Complete guide to HTML forms', 'beginner'),
('html', 'HTML Forms', 'quickref', 'en', 'HTML Forms Cheat Sheet', 'https://quickref.me/html#forms', 'Quick reference for HTML forms', 'beginner'),
('html', 'HTML Forms', 'youtube', 'en', 'HTML Forms Tutorial', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', 'Complete HTML forms tutorial', 'beginner'),
('html', 'HTML Forms', 'youtube', 'hi', 'HTML Forms - Hindi', 'https://www.youtube.com/watch?v=YwbIeMlxZAU', 'HTML forms tutorial in Hindi', 'beginner'),

-- HTML Semantic Elements
('html', 'HTML Semantic Elements', 'mdn', 'en', 'Semantic HTML - MDN', 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html', 'Understanding semantic HTML', 'beginner'),
('html', 'HTML Semantic Elements', 'youtube', 'en', 'Semantic HTML Tutorial', 'https://www.youtube.com/watch?v=kGW8Al_cga4', 'Learn semantic HTML elements', 'beginner'),

-- HTML Tables
('html', 'HTML Tables', 'mdn', 'en', 'HTML Tables - MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table', 'Complete guide to HTML tables', 'beginner'),
('html', 'HTML Tables', 'youtube', 'en', 'HTML Tables Tutorial', 'https://www.youtube.com/watch?v=iO1mwxPNP5A', 'Learn HTML tables', 'beginner'),

-- CSS Resources

-- CSS Flexbox
('css', 'CSS Flexbox', 'mdn', 'en', 'CSS Flexbox - MDN', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout', 'Complete flexbox guide', 'intermediate'),
('css', 'CSS Flexbox', 'quickref', 'en', 'Flexbox Cheat Sheet', 'https://quickref.me/css#flexbox', 'Quick flexbox reference', 'intermediate'),
('css', 'CSS Flexbox', 'youtube', 'en', 'Flexbox Tutorial', 'https://www.youtube.com/watch?v=JJSoEo8JSnc', 'Complete flexbox tutorial', 'intermediate'),
('css', 'CSS Flexbox', 'youtube', 'hi', 'CSS Flexbox - Hindi', 'https://www.youtube.com/watch?v=Y8zMYaD1bz0', 'Flexbox tutorial in Hindi', 'intermediate'),

-- CSS Grid
('css', 'CSS Grid', 'mdn', 'en', 'CSS Grid - MDN', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', 'Complete CSS Grid guide', 'intermediate'),
('css', 'CSS Grid', 'youtube', 'en', 'CSS Grid Tutorial', 'https://www.youtube.com/watch?v=EFafSYg-PkI', 'Learn CSS Grid', 'intermediate'),

-- CSS Selectors
('css', 'CSS Selectors', 'mdn', 'en', 'CSS Selectors - MDN', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors', 'All about CSS selectors', 'beginner'),
('css', 'CSS Selectors', 'youtube', 'en', 'CSS Selectors Tutorial', 'https://www.youtube.com/watch?v=l1mER1bV0N0', 'Master CSS selectors', 'beginner'),

-- JavaScript Resources

-- JavaScript Promises
('javascript', 'JavaScript Promises', 'mdn', 'en', 'Promises - MDN', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise', 'Understanding JavaScript Promises', 'intermediate'),
('javascript', 'JavaScript Promises', 'youtube', 'en', 'JavaScript Promises Tutorial', 'https://www.youtube.com/watch?v=DHvZLI7Db8E', 'Learn JavaScript Promises', 'intermediate'),
('javascript', 'JavaScript Promises', 'youtube', 'hi', 'JavaScript Promises - Hindi', 'https://www.youtube.com/watch?v=NOzi4wBHn0o', 'Promises tutorial in Hindi', 'intermediate'),

-- JavaScript Arrays
('javascript', 'JavaScript Arrays', 'mdn', 'en', 'JavaScript Arrays - MDN', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', 'Complete array methods guide', 'beginner'),
('javascript', 'JavaScript Arrays', 'youtube', 'en', 'JavaScript Arrays Tutorial', 'https://www.youtube.com/watch?v=R8rmfD9Y5-c', 'Master JavaScript arrays', 'beginner'),

-- JavaScript DOM
('javascript', 'JavaScript DOM', 'mdn', 'en', 'DOM Manipulation - MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', 'DOM manipulation guide', 'beginner'),
('javascript', 'JavaScript DOM', 'youtube', 'en', 'DOM Manipulation Tutorial', 'https://www.youtube.com/watch?v=5fb2aPlgoys', 'Learn DOM manipulation', 'beginner'),

-- jQuery Resources

-- jQuery Selectors
('jquery', 'jQuery Selectors', 'quickref', 'en', 'jQuery Selectors', 'https://quickref.me/jquery#selectors', 'jQuery selectors reference', 'beginner'),
('jquery', 'jQuery Selectors', 'youtube', 'en', 'jQuery Selectors Tutorial', 'https://www.youtube.com/watch?v=hMxGhHNOkCU', 'Learn jQuery selectors', 'beginner'),

-- jQuery AJAX
('jquery', 'jQuery AJAX', 'quickref', 'en', 'jQuery AJAX', 'https://quickref.me/jquery#ajax', 'jQuery AJAX reference', 'intermediate'),
('jquery', 'jQuery AJAX', 'youtube', 'en', 'jQuery AJAX Tutorial', 'https://www.youtube.com/watch?v=fEYx8dQr_cQ', 'Master jQuery AJAX', 'intermediate')

ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Learning Resources Seeded!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Added resources for:';
  RAISE NOTICE '✅   - HTML (Forms, Semantic, Tables)';
  RAISE NOTICE '✅   - CSS (Flexbox, Grid, Selectors)';
  RAISE NOTICE '✅   - JavaScript (Promises, Arrays, DOM)';
  RAISE NOTICE '✅   - jQuery (Selectors, AJAX)';
  RAISE NOTICE '✅ Languages: English, Hindi';
  RAISE NOTICE '✅ ============================================';
END $$;
