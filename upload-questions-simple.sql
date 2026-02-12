-- ============================================
-- Simple Question Upload (Works with Current Schema)
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check what columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- STEP 2: Upload questions using ONLY existing columns
-- Basic format without learning resources

-- Example: HTML Questions
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation)
VALUES 
  (
    'html-easy-001',
    'html',
    'easy',
    'mcq',
    'What does HTML stand for?',
    '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]',
    '0',
    'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.'
  ),
  (
    'html-easy-002',
    'html',
    'easy',
    'mcq',
    'Which HTML element is used for the largest heading?',
    '["<h1>", "<h6>", "<head>", "<heading>"]',
    '0',
    'The <h1> element defines the most important heading.'
  ),
  (
    'html-easy-003',
    'html',
    'easy',
    'mcq',
    'What is the correct HTML element for inserting a line break?',
    '["<br>", "<break>", "<lb>", "<newline>"]',
    '0',
    'The <br> tag inserts a single line break.'
  ),
  (
    'html-easy-004',
    'html',
    'easy',
    'mcq',
    'Which HTML attribute specifies an alternate text for an image?',
    '["alt", "title", "src", "longdesc"]',
    '0',
    'The alt attribute provides alternative text for an image.'
  ),
  (
    'html-easy-005',
    'html',
    'easy',
    'mcq',
    'What does the <a> tag define?',
    '["A hyperlink", "An anchor", "An article", "An address"]',
    '0',
    'The <a> tag defines a hyperlink.'
  ),
  (
    'html-easy-006',
    'html',
    'easy',
    'mcq',
    'Which HTML element defines the title of a document?',
    '["<title>", "<head>", "<meta>", "<header>"]',
    '0',
    'The <title> element defines the title of the document.'
  ),
  (
    'html-easy-007',
    'html',
    'easy',
    'mcq',
    'Which HTML tag is used to define an unordered list?',
    '["<ul>", "<ol>", "<list>", "<li>"]',
    '0',
    'The <ul> tag defines an unordered (bulleted) list.'
  ),
  (
    'html-easy-008',
    'html',
    'easy',
    'mcq',
    'What is the correct HTML for creating a hyperlink?',
    '["<a href=\"url\">text</a>", "<link>url</link>", "<hyperlink>url</hyperlink>", "<url>text</url>"]',
    '0',
    'The correct syntax is <a href="url">text</a>.'
  ),
  (
    'html-easy-009',
    'html',
    'easy',
    'mcq',
    'Which HTML element is used to specify a footer for a document?',
    '["<footer>", "<bottom>", "<section>", "<end>"]',
    '0',
    'The <footer> element defines a footer for a document or section.'
  ),
  (
    'html-easy-010',
    'html',
    'easy',
    'mcq',
    'What is the correct HTML for making a checkbox?',
    '["<input type=\"checkbox\">", "<checkbox>", "<check>", "<input type=\"check\">"]',
    '0',
    'The correct syntax is <input type="checkbox">.'
  );

-- STEP 3: Verify upload
SELECT skill, level, COUNT(*) as count
FROM questions
WHERE skill = 'html' AND level = 'easy'
GROUP BY skill, level;

-- STEP 4: Add more skills (CSS, JavaScript, etc.)
-- Copy the pattern above and change skill name

-- CSS Questions
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation)
VALUES 
  (
    'css-easy-001',
    'css',
    'easy',
    'mcq',
    'What does CSS stand for?',
    '["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"]',
    '0',
    'CSS stands for Cascading Style Sheets.'
  ),
  (
    'css-easy-002',
    'css',
    'easy',
    'mcq',
    'Which HTML attribute is used to define inline styles?',
    '["style", "css", "class", "font"]',
    '0',
    'The style attribute is used to add inline CSS styles.'
  ),
  (
    'css-easy-003',
    'css',
    'easy',
    'mcq',
    'Which CSS property is used to change the text color?',
    '["color", "text-color", "font-color", "text-style"]',
    '0',
    'The color property is used to change text color.'
  ),
  (
    'css-easy-004',
    'css',
    'easy',
    'mcq',
    'Which CSS property controls the text size?',
    '["font-size", "text-size", "font-style", "text-style"]',
    '0',
    'The font-size property controls the size of text.'
  ),
  (
    'css-easy-005',
    'css',
    'easy',
    'mcq',
    'How do you make text bold in CSS?',
    '["font-weight: bold", "text-style: bold", "font: bold", "text-weight: bold"]',
    '0',
    'Use font-weight: bold to make text bold.'
  ),
  (
    'css-easy-006',
    'css',
    'easy',
    'mcq',
    'Which CSS property is used to change the background color?',
    '["background-color", "bgcolor", "color", "background"]',
    '0',
    'The background-color property sets the background color.'
  ),
  (
    'css-easy-007',
    'css',
    'easy',
    'mcq',
    'How do you select an element with id "demo"?',
    '["#demo", ".demo", "demo", "*demo"]',
    '0',
    'Use #demo to select an element with id="demo".'
  ),
  (
    'css-easy-008',
    'css',
    'easy',
    'mcq',
    'How do you select elements with class "test"?',
    '[".test", "#test", "test", "*test"]',
    '0',
    'Use .test to select elements with class="test".'
  ),
  (
    'css-easy-009',
    'css',
    'easy',
    'mcq',
    'Which CSS property is used to change the font?',
    '["font-family", "font-style", "font-weight", "font"]',
    '0',
    'The font-family property specifies the font.'
  ),
  (
    'css-easy-010',
    'css',
    'easy',
    'mcq',
    'How do you make a list not display bullet points?',
    '["list-style-type: none", "list-type: none", "list: none", "bullet: none"]',
    '0',
    'Use list-style-type: none to remove bullet points.'
  );

-- JavaScript Questions
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation)
VALUES 
  (
    'javascript-easy-001',
    'javascript',
    'easy',
    'mcq',
    'What is JavaScript?',
    '["A programming language", "A markup language", "A database", "An operating system"]',
    '0',
    'JavaScript is a programming language used for web development.'
  ),
  (
    'javascript-easy-002',
    'javascript',
    'easy',
    'mcq',
    'How do you write "Hello World" in an alert box?',
    '["alert(\"Hello World\")", "msg(\"Hello World\")", "alertBox(\"Hello World\")", "msgBox(\"Hello World\")"]',
    '0',
    'Use alert("Hello World") to display an alert box.'
  ),
  (
    'javascript-easy-003',
    'javascript',
    'easy',
    'mcq',
    'How do you create a function in JavaScript?',
    '["function myFunction()", "def myFunction()", "function:myFunction()", "create myFunction()"]',
    '0',
    'Use function myFunction() to create a function.'
  ),
  (
    'javascript-easy-004',
    'javascript',
    'easy',
    'mcq',
    'How do you call a function named "myFunction"?',
    '["myFunction()", "call myFunction()", "call function myFunction", "execute myFunction()"]',
    '0',
    'Use myFunction() to call the function.'
  ),
  (
    'javascript-easy-005',
    'javascript',
    'easy',
    'mcq',
    'How do you write a comment in JavaScript?',
    '["// This is a comment", "<!-- This is a comment -->", "# This is a comment", "/* This is a comment"]',
    '0',
    'Use // for single-line comments in JavaScript.'
  ),
  (
    'javascript-easy-006',
    'javascript',
    'easy',
    'mcq',
    'What is the correct way to declare a variable?',
    '["var x", "variable x", "v x", "dim x"]',
    '0',
    'Use var, let, or const to declare variables.'
  ),
  (
    'javascript-easy-007',
    'javascript',
    'easy',
    'mcq',
    'Which operator is used to assign a value to a variable?',
    '["=", "==", "===", "=>"]',
    '0',
    'The = operator assigns a value to a variable.'
  ),
  (
    'javascript-easy-008',
    'javascript',
    'easy',
    'mcq',
    'What will typeof null return?',
    '["object", "null", "undefined", "number"]',
    '0',
    'typeof null returns "object" (this is a known quirk in JavaScript).'
  ),
  (
    'javascript-easy-009',
    'javascript',
    'easy',
    'mcq',
    'How do you round the number 7.25 to the nearest integer?',
    '["Math.round(7.25)", "round(7.25)", "Math.rnd(7.25)", "rnd(7.25)"]',
    '0',
    'Use Math.round() to round to the nearest integer.'
  ),
  (
    'javascript-easy-010',
    'javascript',
    'easy',
    'mcq',
    'How do you find the length of a string?',
    '["str.length", "len(str)", "str.size", "length(str)"]',
    '0',
    'Use the .length property to get string length.'
  );

-- STEP 5: Verify all uploads
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
WHERE type = 'mcq'
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- SUCCESS! Questions uploaded.
-- Refresh Practice page to see them.
-- ============================================
