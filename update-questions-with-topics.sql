-- ============================================
-- Update Existing Questions with Topics
-- ============================================
-- This assigns topics to existing questions based on keywords
-- ============================================

-- HTML Questions
UPDATE questions 
SET topic = 'HTML Forms', 
    explanation = 'Forms are used to collect user input in HTML'
WHERE (question ILIKE '%form%' OR question ILIKE '%input%' OR question ILIKE '%button%' OR question ILIKE '%submit%') 
  AND skill = 'html' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'HTML Tables', 
    explanation = 'Tables are used to display data in rows and columns'
WHERE (question ILIKE '%table%' OR question ILIKE '%tr%' OR question ILIKE '%td%' OR question ILIKE '%th%') 
  AND skill = 'html' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'HTML Images', 
    explanation = 'Images are added using the img tag with src attribute'
WHERE (question ILIKE '%image%' OR question ILIKE '%img%' OR question ILIKE '%src%' OR question ILIKE '%alt%') 
  AND skill = 'html' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'HTML Links', 
    explanation = 'Links are created using the anchor tag with href attribute'
WHERE (question ILIKE '%link%' OR question ILIKE '%anchor%' OR question ILIKE '%href%' OR question ILIKE '%<a%') 
  AND skill = 'html' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'HTML Lists', 
    explanation = 'Lists can be ordered (ol) or unordered (ul)'
WHERE (question ILIKE '%list%' OR question ILIKE '%<ul%' OR question ILIKE '%<ol%' OR question ILIKE '%<li%') 
  AND skill = 'html' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'HTML Semantic Elements', 
    explanation = 'Semantic elements clearly describe their meaning to both browser and developer'
WHERE (question ILIKE '%semantic%' OR question ILIKE '%header%' OR question ILIKE '%footer%' OR question ILIKE '%article%' OR question ILIKE '%section%') 
  AND skill = 'html' 
  AND topic IS NULL;

-- CSS Questions
UPDATE questions 
SET topic = 'CSS Flexbox', 
    explanation = 'Flexbox is a layout model for arranging items in rows or columns'
WHERE (question ILIKE '%flex%' OR question ILIKE '%flexbox%') 
  AND skill = 'css' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'CSS Grid', 
    explanation = 'Grid is a two-dimensional layout system for creating complex layouts'
WHERE (question ILIKE '%grid%') 
  AND skill = 'css' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'CSS Box Model', 
    explanation = 'The box model describes how elements are sized with content, padding, border, and margin'
WHERE (question ILIKE '%box model%' OR question ILIKE '%margin%' OR question ILIKE '%padding%' OR question ILIKE '%border%') 
  AND skill = 'css' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'CSS Selectors', 
    explanation = 'Selectors are patterns used to select elements you want to style'
WHERE (question ILIKE '%selector%' OR question ILIKE '%class%' OR question ILIKE '%id%') 
  AND skill = 'css' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'CSS Position', 
    explanation = 'Position property specifies how an element is positioned in the document'
WHERE (question ILIKE '%position%' OR question ILIKE '%absolute%' OR question ILIKE '%relative%' OR question ILIKE '%fixed%') 
  AND skill = 'css' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'CSS Animations', 
    explanation = 'Animations allow elements to gradually change from one style to another'
WHERE (question ILIKE '%animation%' OR question ILIKE '%keyframe%' OR question ILIKE '%transition%') 
  AND skill = 'css' 
  AND topic IS NULL;

-- JavaScript Questions
UPDATE questions 
SET topic = 'JavaScript Arrays', 
    explanation = 'Arrays are used to store multiple values in a single variable'
WHERE (question ILIKE '%array%' OR question ILIKE '%push%' OR question ILIKE '%pop%' OR question ILIKE '%map%' OR question ILIKE '%filter%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'JavaScript Functions', 
    explanation = 'Functions are reusable blocks of code that perform specific tasks'
WHERE (question ILIKE '%function%' OR question ILIKE '%return%' OR question ILIKE '%parameter%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'JavaScript Objects', 
    explanation = 'Objects are collections of key-value pairs'
WHERE (question ILIKE '%object%' OR question ILIKE '%property%' OR question ILIKE '%method%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'JavaScript Promises', 
    explanation = 'Promises represent the eventual completion or failure of an asynchronous operation'
WHERE (question ILIKE '%promise%' OR question ILIKE '%async%' OR question ILIKE '%await%' OR question ILIKE '%then%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'JavaScript DOM', 
    explanation = 'DOM manipulation allows you to dynamically change HTML and CSS'
WHERE (question ILIKE '%dom%' OR question ILIKE '%document%' OR question ILIKE '%getElementById%' OR question ILIKE '%querySelector%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'JavaScript Events', 
    explanation = 'Events are actions that happen in the browser that you can respond to'
WHERE (question ILIKE '%event%' OR question ILIKE '%click%' OR question ILIKE '%addEventListener%') 
  AND skill = 'javascript' 
  AND topic IS NULL;

-- jQuery Questions
UPDATE questions 
SET topic = 'jQuery Selectors', 
    explanation = 'jQuery selectors allow you to select and manipulate HTML elements'
WHERE (question ILIKE '%selector%' OR question ILIKE '%$(%') 
  AND skill = 'jquery' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'jQuery Events', 
    explanation = 'jQuery provides methods to handle events like click, hover, etc.'
WHERE (question ILIKE '%event%' OR question ILIKE '%click%' OR question ILIKE '%on(%') 
  AND skill = 'jquery' 
  AND topic IS NULL;

UPDATE questions 
SET topic = 'jQuery AJAX', 
    explanation = 'AJAX allows you to load data from the server without refreshing the page'
WHERE (question ILIKE '%ajax%' OR question ILIKE '%$.get%' OR question ILIKE '%$.post%') 
  AND skill = 'jquery' 
  AND topic IS NULL;

-- Set default topic for remaining questions
UPDATE questions 
SET topic = 'General' 
WHERE topic IS NULL;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count FROM questions WHERE topic IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Questions Updated with Topics!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Total questions with topics: %', updated_count;
  RAISE NOTICE '✅ Topics assigned based on keywords';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Step:';
  RAISE NOTICE 'Take a new test to see topics in scorecard!';
  RAISE NOTICE '✅ ============================================';
END $$;
