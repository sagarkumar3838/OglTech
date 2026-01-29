-- Seed Sample Questions for Testing
-- Run this in your Supabase SQL Editor

-- HTML Easy Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation) VALUES
('html-easy-1', 'html', 'easy', 'mcq', 'What does HTML stand for?', 
 '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]'::jsonb,
 '"Hyper Text Markup Language"'::jsonb,
 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.'),

('html-easy-2', 'html', 'easy', 'mcq', 'Which HTML tag is used to define an internal style sheet?',
 '["<style>", "<css>", "<script>", "<link>"]'::jsonb,
 '"<style>"'::jsonb,
 'The <style> tag is used to define internal CSS styles within an HTML document.'),

('html-easy-3', 'html', 'easy', 'mcq', 'Which HTML element is used to specify a footer for a document?',
 '["<footer>", "<bottom>", "<section>", "<div>"]'::jsonb,
 '"<footer>"'::jsonb,
 'The <footer> element represents a footer for a document or section.'),

('html-easy-4', 'html', 'easy', 'mcq', 'What is the correct HTML element for inserting a line break?',
 '["<br>", "<break>", "<lb>", "<newline>"]'::jsonb,
 '"<br>"'::jsonb,
 'The <br> tag inserts a single line break in HTML.'),

('html-easy-5', 'html', 'easy', 'mcq', 'Which HTML attribute specifies an alternate text for an image?',
 '["alt", "title", "src", "longdesc"]'::jsonb,
 '"alt"'::jsonb,
 'The alt attribute provides alternative text for an image if it cannot be displayed.'),

('html-easy-6', 'html', 'easy', 'mcq', 'Which HTML element defines the title of a document?',
 '["<title>", "<head>", "<meta>", "<header>"]'::jsonb,
 '"<title>"'::jsonb,
 'The <title> element defines the title shown in the browser tab.'),

('html-easy-7', 'html', 'easy', 'mcq', 'What is the correct HTML for creating a hyperlink?',
 '["<a href=\"url\">link text</a>", "<link>url</link>", "<hyperlink>url</hyperlink>", "<url>link text</url>"]'::jsonb,
 '"<a href=\"url\">link text</a>"'::jsonb,
 'The <a> tag with href attribute creates a hyperlink.'),

('html-easy-8', 'html', 'easy', 'mcq', 'Which HTML element is used to define important text?',
 '["<strong>", "<important>", "<b>", "<i>"]'::jsonb,
 '"<strong>"'::jsonb,
 'The <strong> element defines text with strong importance, typically displayed as bold.'),

('html-easy-9', 'html', 'easy', 'mcq', 'What is the correct HTML for making a checkbox?',
 '["<input type=\"checkbox\">", "<checkbox>", "<check>", "<input type=\"check\">"]'::jsonb,
 '"<input type=\"checkbox\">"'::jsonb,
 'The <input type="checkbox"> creates a checkbox input element.'),

('html-easy-10', 'html', 'easy', 'mcq', 'Which HTML element defines navigation links?',
 '["<nav>", "<navigation>", "<navigate>", "<menu>"]'::jsonb,
 '"<nav>"'::jsonb,
 'The <nav> element defines a set of navigation links.');

-- CSS Easy Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation) VALUES
('css-easy-1', 'css', 'easy', 'mcq', 'What does CSS stand for?',
 '["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"]'::jsonb,
 '"Cascading Style Sheets"'::jsonb,
 'CSS stands for Cascading Style Sheets, used to style HTML elements.'),

('css-easy-2', 'css', 'easy', 'mcq', 'Which CSS property is used to change the text color?',
 '["color", "text-color", "font-color", "text-style"]'::jsonb,
 '"color"'::jsonb,
 'The color property sets the color of text.'),

('css-easy-3', 'css', 'easy', 'mcq', 'How do you add a background color in CSS?',
 '["background-color: red;", "bg-color: red;", "color-background: red;", "background: color red;"]'::jsonb,
 '"background-color: red;"'::jsonb,
 'The background-color property sets the background color of an element.'),

('css-easy-4', 'css', 'easy', 'mcq', 'Which CSS property controls the text size?',
 '["font-size", "text-size", "font-style", "text-style"]'::jsonb,
 '"font-size"'::jsonb,
 'The font-size property sets the size of text.'),

('css-easy-5', 'css', 'easy', 'mcq', 'How do you make text bold in CSS?',
 '["font-weight: bold;", "text-style: bold;", "font: bold;", "text-weight: bold;"]'::jsonb,
 '"font-weight: bold;"'::jsonb,
 'The font-weight property with value bold makes text bold.'),

('css-easy-6', 'css', 'easy', 'mcq', 'Which CSS property is used to change the font?',
 '["font-family", "font-type", "font-style", "typeface"]'::jsonb,
 '"font-family"'::jsonb,
 'The font-family property specifies the font for text.'),

('css-easy-7', 'css', 'easy', 'mcq', 'How do you center align text in CSS?',
 '["text-align: center;", "align: center;", "text: center;", "center-align: true;"]'::jsonb,
 '"text-align: center;"'::jsonb,
 'The text-align property with value center centers text horizontally.'),

('css-easy-8', 'css', 'easy', 'mcq', 'Which CSS property adds space inside an element?',
 '["padding", "margin", "spacing", "border"]'::jsonb,
 '"padding"'::jsonb,
 'Padding adds space inside an element, between content and border.'),

('css-easy-9', 'css', 'easy', 'mcq', 'Which CSS property adds space outside an element?',
 '["margin", "padding", "spacing", "border"]'::jsonb,
 '"margin"'::jsonb,
 'Margin adds space outside an element, between the element and others.'),

('css-easy-10', 'css', 'easy', 'mcq', 'How do you make a list not display bullet points?',
 '["list-style-type: none;", "list: none;", "bullet: none;", "list-style: no-bullet;"]'::jsonb,
 '"list-style-type: none;"'::jsonb,
 'The list-style-type property with value none removes bullet points.');

-- JavaScript Easy Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation) VALUES
('js-easy-1', 'javascript', 'easy', 'mcq', 'Inside which HTML element do we put JavaScript?',
 '["<script>", "<javascript>", "<js>", "<code>"]'::jsonb,
 '"<script>"'::jsonb,
 'JavaScript code is placed inside <script> tags.'),

('js-easy-2', 'javascript', 'easy', 'mcq', 'How do you write "Hello World" in an alert box?',
 '["alert(\"Hello World\");", "msg(\"Hello World\");", "alertBox(\"Hello World\");", "msgBox(\"Hello World\");"]'::jsonb,
 '"alert(\"Hello World\");"'::jsonb,
 'The alert() function displays an alert dialog with a message.'),

('js-easy-3', 'javascript', 'easy', 'mcq', 'How do you create a variable in JavaScript?',
 '["var x;", "variable x;", "v x;", "x = var;"]'::jsonb,
 '"var x;"'::jsonb,
 'Variables are declared using var, let, or const keywords.'),

('js-easy-4', 'javascript', 'easy', 'mcq', 'Which operator is used to assign a value to a variable?',
 '["=", "==", "===", "x"]'::jsonb,
 '"="'::jsonb,
 'The = operator assigns a value to a variable.'),

('js-easy-5', 'javascript', 'easy', 'mcq', 'How do you write a comment in JavaScript?',
 '["// This is a comment", "<!-- This is a comment -->", "# This is a comment", "/* This is a comment"]'::jsonb,
 '"// This is a comment"'::jsonb,
 'Single-line comments in JavaScript start with //.'),

('js-easy-6', 'javascript', 'easy', 'mcq', 'What is the correct way to write an array?',
 '["var colors = [\"red\", \"green\", \"blue\"]", "var colors = \"red\", \"green\", \"blue\"", "var colors = (\"red\", \"green\", \"blue\")", "var colors = {\"red\", \"green\", \"blue\"}"]'::jsonb,
 '"var colors = [\"red\", \"green\", \"blue\"]"'::jsonb,
 'Arrays are created using square brackets [].'),

('js-easy-7', 'javascript', 'easy', 'mcq', 'How do you call a function named "myFunction"?',
 '["myFunction()", "call myFunction()", "call function myFunction", "myFunction"]'::jsonb,
 '"myFunction()"'::jsonb,
 'Functions are called by writing the function name followed by parentheses.'),

('js-easy-8', 'javascript', 'easy', 'mcq', 'How do you write an IF statement in JavaScript?',
 '["if (i == 5)", "if i = 5 then", "if i == 5 then", "if (i = 5)"]'::jsonb,
 '"if (i == 5)"'::jsonb,
 'IF statements use the syntax: if (condition) { code }.'),

('js-easy-9', 'javascript', 'easy', 'mcq', 'How does a FOR loop start?',
 '["for (i = 0; i < 5; i++)", "for (i = 0; i <= 5)", "for i = 1 to 5", "for (i <= 5; i++)"]'::jsonb,
 '"for (i = 0; i < 5; i++)"'::jsonb,
 'FOR loops have three parts: initialization, condition, and increment.'),

('js-easy-10', 'javascript', 'easy', 'mcq', 'What is the correct way to write a JavaScript object?',
 '["var person = {firstName:\"John\", lastName:\"Doe\"}", "var person = (firstName:\"John\", lastName:\"Doe\")", "var person = [firstName=\"John\", lastName=\"Doe\"]", "var person = firstName:\"John\", lastName:\"Doe\""]'::jsonb,
 '"var person = {firstName:\"John\", lastName:\"Doe\"}"'::jsonb,
 'Objects are created using curly braces {} with key-value pairs.');

-- Mark all questions as verified
UPDATE questions SET verified = true WHERE skill IN ('html', 'css', 'javascript') AND level = 'easy';

-- Display count
SELECT skill, level, COUNT(*) as question_count 
FROM questions 
WHERE skill IN ('html', 'css', 'javascript') AND level = 'easy'
GROUP BY skill, level;
