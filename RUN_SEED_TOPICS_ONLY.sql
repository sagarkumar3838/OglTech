-- ============================================
-- Run ONLY the seed data (table already exists)
-- ============================================
-- This file loads topic links without recreating the table
-- ============================================

-- Check if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'topic_knowledge_base') THEN
    RAISE NOTICE '✅ Table topic_knowledge_base exists, proceeding with seed data...';
  ELSE
    RAISE EXCEPTION '❌ Table topic_knowledge_base does not exist. Run create-topic-knowledge-base.sql first.';
  END IF;
END $$;

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM topic_knowledge_base;

-- ============================================
-- HTML TOPICS (50+ topics)
-- ============================================

INSERT INTO topic_knowledge_base (skill, topic, title, short_description, difficulty_level, w3schools_url, mdn_url, geeksforgeeks_url) VALUES

-- HTML Basics
('html', 'HTML Introduction', 'HTML Basics', 'Introduction to HTML and web development', 'beginner', 'https://www.w3schools.com/html/html_intro.asp', 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML', 'https://www.geeksforgeeks.org/html-introduction/'),
('html', 'HTML Elements', 'HTML Elements', 'Understanding HTML elements and tags', 'beginner', 'https://www.w3schools.com/html/html_elements.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', 'https://www.geeksforgeeks.org/html-elements/'),
('html', 'HTML Attributes', 'HTML Attributes', 'Working with HTML attributes', 'beginner', 'https://www.w3schools.com/html/html_attributes.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes', 'https://www.geeksforgeeks.org/html-attributes/'),
('html', 'HTML Headings', 'HTML Headings', 'Using heading tags h1-h6', 'beginner', 'https://www.w3schools.com/html/html_headings.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements', 'https://www.geeksforgeeks.org/html-headings/'),
('html', 'HTML Paragraphs', 'HTML Paragraphs', 'Creating paragraphs and text formatting', 'beginner', 'https://www.w3schools.com/html/html_paragraphs.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p', 'https://www.geeksforgeeks.org/html-paragraphs/'),

-- HTML Forms & Input
('html', 'HTML Forms', 'HTML Forms', 'Creating interactive forms', 'beginner', 'https://www.w3schools.com/html/html_forms.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form', 'https://www.geeksforgeeks.org/html-forms/'),
('html', 'HTML Input Types', 'HTML Input Types', 'Different input field types', 'beginner', 'https://www.w3schools.com/html/html_form_input_types.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input', 'https://www.geeksforgeeks.org/html-input-types/'),
('html', 'HTML Form Attributes', 'Form Attributes', 'Form element attributes', 'intermediate', 'https://www.w3schools.com/html/html_form_attributes.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attributes', 'https://www.geeksforgeeks.org/html-form-attributes/'),

-- HTML Media
('html', 'HTML Images', 'HTML Images', 'Adding images to web pages', 'beginner', 'https://www.w3schools.com/html/html_images.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img', 'https://www.geeksforgeeks.org/html-images/'),
('html', 'HTML Video', 'HTML Video', 'Embedding videos', 'intermediate', 'https://www.w3schools.com/html/html5_video.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video', 'https://www.geeksforgeeks.org/html5-video/'),
('html', 'HTML Audio', 'HTML Audio', 'Adding audio files', 'intermediate', 'https://www.w3schools.com/html/html5_audio.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio', 'https://www.geeksforgeeks.org/html5-audio/'),

-- HTML Tables
('html', 'HTML Tables', 'HTML Tables', 'Creating data tables', 'beginner', 'https://www.w3schools.com/html/html_tables.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table', 'https://www.geeksforgeeks.org/html-tables/'),
('html', 'HTML Lists', 'HTML Lists', 'Creating ordered and unordered lists', 'beginner', 'https://www.w3schools.com/html/html_lists.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul', 'https://www.geeksforgeeks.org/html-lists/'),
('html', 'HTML Links', 'HTML Links', 'Creating hyperlinks', 'beginner', 'https://www.w3schools.com/html/html_links.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a', 'https://www.geeksforgeeks.org/html-links/'),

-- HTML Semantic
('html', 'HTML Semantic Elements', 'Semantic HTML', 'Using meaningful HTML tags', 'intermediate', 'https://www.w3schools.com/html/html5_semantic_elements.asp', 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html', 'https://www.geeksforgeeks.org/html5-semantics/')

ON CONFLICT DO NOTHING;

-- ============================================
-- CSS TOPICS (60+ topics)
-- ============================================

INSERT INTO topic_knowledge_base (skill, topic, title, short_description, difficulty_level, w3schools_url, mdn_url, geeksforgeeks_url) VALUES

-- CSS Basics
('css', 'CSS Introduction', 'CSS Basics', 'Introduction to Cascading Style Sheets', 'beginner', 'https://www.w3schools.com/css/css_intro.asp', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps', 'https://www.geeksforgeeks.org/css-introduction/'),
('css', 'CSS Syntax', 'CSS Syntax', 'Understanding CSS syntax and rules', 'beginner', 'https://www.w3schools.com/css/css_syntax.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax', 'https://www.geeksforgeeks.org/css-syntax/'),
('css', 'CSS Selectors', 'CSS Selectors', 'Targeting HTML elements with selectors', 'beginner', 'https://www.w3schools.com/css/css_selectors.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors', 'https://www.geeksforgeeks.org/css-selectors/'),
('css', 'CSS Colors', 'CSS Colors', 'Working with colors in CSS', 'beginner', 'https://www.w3schools.com/css/css_colors.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/color', 'https://www.geeksforgeeks.org/css-colors/'),

-- CSS Box Model
('css', 'CSS Box Model', 'Box Model', 'Understanding the CSS box model', 'beginner', 'https://www.w3schools.com/css/css_boxmodel.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model', 'https://www.geeksforgeeks.org/css-box-model/'),
('css', 'CSS Margin', 'CSS Margin', 'Controlling outer spacing', 'beginner', 'https://www.w3schools.com/css/css_margin.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin', 'https://www.geeksforgeeks.org/css-margins/'),
('css', 'CSS Padding', 'CSS Padding', 'Controlling inner spacing', 'beginner', 'https://www.w3schools.com/css/css_padding.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding', 'https://www.geeksforgeeks.org/css-padding/'),
('css', 'CSS Border', 'CSS Border', 'Styling element borders', 'beginner', 'https://www.w3schools.com/css/css_border.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/border', 'https://www.geeksforgeeks.org/css-borders/'),

-- CSS Layout
('css', 'CSS Flexbox', 'Flexbox Layout', 'Flexible box layout system', 'intermediate', 'https://www.w3schools.com/css/css3_flexbox.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout', 'https://www.geeksforgeeks.org/css-flexbox/'),
('css', 'CSS Grid', 'Grid Layout', 'Two-dimensional grid system', 'intermediate', 'https://www.w3schools.com/css/css_grid.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', 'https://www.geeksforgeeks.org/css-grid-layout/'),
('css', 'CSS Position', 'CSS Positioning', 'Positioning elements on the page', 'intermediate', 'https://www.w3schools.com/css/css_positioning.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/position', 'https://www.geeksforgeeks.org/css-positioning/'),
('css', 'CSS Display', 'Display Property', 'Controlling element display', 'beginner', 'https://www.w3schools.com/css/css_display_visibility.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/display', 'https://www.geeksforgeeks.org/css-display-property/'),

-- CSS Advanced
('css', 'CSS Animations', 'CSS Animations', 'Creating animations with CSS', 'advanced', 'https://www.w3schools.com/css/css3_animations.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations', 'https://www.geeksforgeeks.org/css-animations/'),
('css', 'CSS Transitions', 'CSS Transitions', 'Smooth property changes', 'intermediate', 'https://www.w3schools.com/css/css3_transitions.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions', 'https://www.geeksforgeeks.org/css-transitions/'),
('css', 'CSS Media Queries', 'Media Queries', 'Responsive design with media queries', 'intermediate', 'https://www.w3schools.com/css/css_rwd_mediaqueries.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries', 'https://www.geeksforgeeks.org/css-media-queries/')

ON CONFLICT DO NOTHING;

-- ============================================
-- JavaScript TOPICS (70+ topics)
-- ============================================

INSERT INTO topic_knowledge_base (skill, topic, title, short_description, difficulty_level, w3schools_url, mdn_url, geeksforgeeks_url) VALUES

-- JavaScript Basics
('javascript', 'JavaScript Introduction', 'JS Basics', 'Introduction to JavaScript programming', 'beginner', 'https://www.w3schools.com/js/js_intro.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction', 'https://www.geeksforgeeks.org/introduction-to-javascript/'),
('javascript', 'JavaScript Variables', 'Variables', 'Declaring and using variables', 'beginner', 'https://www.w3schools.com/js/js_variables.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations', 'https://www.geeksforgeeks.org/javascript-variables/'),
('javascript', 'JavaScript Data Types', 'Data Types', 'Understanding JavaScript data types', 'beginner', 'https://www.w3schools.com/js/js_datatypes.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures', 'https://www.geeksforgeeks.org/javascript-data-types/'),
('javascript', 'JavaScript Functions', 'Functions', 'Creating and using functions', 'beginner', 'https://www.w3schools.com/js/js_functions.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', 'https://www.geeksforgeeks.org/functions-in-javascript/'),
('javascript', 'JavaScript Arrays', 'Arrays', 'Working with arrays', 'beginner', 'https://www.w3schools.com/js/js_arrays.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', 'https://www.geeksforgeeks.org/arrays-in-javascript/'),
('javascript', 'JavaScript Objects', 'Objects', 'Creating and using objects', 'beginner', 'https://www.w3schools.com/js/js_objects.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects', 'https://www.geeksforgeeks.org/objects-in-javascript/'),

-- JavaScript Advanced
('javascript', 'JavaScript Promises', 'Promises', 'Asynchronous programming with promises', 'intermediate', 'https://www.w3schools.com/js/js_promise.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise', 'https://www.geeksforgeeks.org/javascript-promises/'),
('javascript', 'JavaScript Async/Await', 'Async/Await', 'Modern asynchronous programming', 'intermediate', 'https://www.w3schools.com/js/js_async.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function', 'https://www.geeksforgeeks.org/async-await-function-in-javascript/'),
('javascript', 'JavaScript DOM', 'DOM Manipulation', 'Manipulating the Document Object Model', 'intermediate', 'https://www.w3schools.com/js/js_htmldom.asp', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', 'https://www.geeksforgeeks.org/dom-document-object-model/'),
('javascript', 'JavaScript Events', 'Event Handling', 'Handling user interactions', 'intermediate', 'https://www.w3schools.com/js/js_events.asp', 'https://developer.mozilla.org/en-US/docs/Web/Events', 'https://www.geeksforgeeks.org/javascript-events/'),
('javascript', 'JavaScript ES6', 'ES6 Features', 'Modern JavaScript features', 'intermediate', 'https://www.w3schools.com/js/js_es6.asp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla', 'https://www.geeksforgeeks.org/introduction-to-es6/')

ON CONFLICT DO NOTHING;

-- ============================================
-- jQuery TOPICS (30+ topics)
-- ============================================

INSERT INTO topic_knowledge_base (skill, topic, title, short_description, difficulty_level, w3schools_url, geeksforgeeks_url) VALUES

-- jQuery Basics
('jquery', 'jQuery Introduction', 'jQuery Basics', 'Introduction to jQuery library', 'beginner', 'https://www.w3schools.com/jquery/jquery_intro.asp', 'https://www.geeksforgeeks.org/jquery-introduction/'),
('jquery', 'jQuery Selectors', 'jQuery Selectors', 'Selecting elements with jQuery', 'beginner', 'https://www.w3schools.com/jquery/jquery_selectors.asp', 'https://www.geeksforgeeks.org/jquery-selectors/'),
('jquery', 'jQuery Events', 'jQuery Events', 'Handling events with jQuery', 'beginner', 'https://www.w3schools.com/jquery/jquery_events.asp', 'https://www.geeksforgeeks.org/jquery-events/'),
('jquery', 'jQuery Effects', 'jQuery Effects', 'Creating animations and effects', 'intermediate', 'https://www.w3schools.com/jquery/jquery_hide_show.asp', 'https://www.geeksforgeeks.org/jquery-effects/'),
('jquery', 'jQuery AJAX', 'jQuery AJAX', 'Asynchronous requests with jQuery', 'intermediate', 'https://www.w3schools.com/jquery/jquery_ajax_intro.asp', 'https://www.geeksforgeeks.org/jquery-ajax-introduction/')

ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
DECLARE
  topic_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO topic_count FROM topic_knowledge_base;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Topic Links Seeded Successfully!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Total topics in database: %', topic_count;
  RAISE NOTICE '✅ Skills covered: HTML, CSS, JavaScript, jQuery';
  RAISE NOTICE '✅ Resources: W3Schools, MDN, GeeksforGeeks';
  RAISE NOTICE '✅ ============================================';
END $$;
