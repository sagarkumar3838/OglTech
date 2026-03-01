-- Quick Test: Insert 10 JavaScript Easy MCQ Questions
-- Run this in Supabase SQL Editor to test Practice page immediately

-- This will add 10 questions so you can test the Practice page right away

INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation) VALUES

-- Question 1
('javascript', 'easy', 'mcq', 
 'What is the correct syntax for referring to an external script called "app.js"?',
 '["<script src=\"app.js\">", "<script href=\"app.js\">", "<script name=\"app.js\">", "<script file=\"app.js\">"]',
 0,
 'The src attribute specifies the URL of an external script file.'),

-- Question 2
('javascript', 'easy', 'mcq',
 'How do you create a function in JavaScript?',
 '["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"]',
 0,
 'Functions are declared using the function keyword followed by the function name and parentheses.'),

-- Question 3
('javascript', 'easy', 'mcq',
 'How do you call a function named "myFunction"?',
 '["myFunction()", "call myFunction()", "call function myFunction()", "execute myFunction()"]',
 0,
 'Functions are called by writing the function name followed by parentheses.'),

-- Question 4
('javascript', 'easy', 'mcq',
 'How to write an IF statement in JavaScript?',
 '["if (i == 5)", "if i = 5 then", "if i == 5 then", "if (i = 5)"]',
 0,
 'IF statements use the if keyword followed by a condition in parentheses.'),

-- Question 5
('javascript', 'easy', 'mcq',
 'How does a WHILE loop start?',
 '["while (i <= 10)", "while i = 1 to 10", "while (i <= 10; i++)", "while i <= 10"]',
 0,
 'WHILE loops use the while keyword followed by a condition in parentheses.'),

-- Question 6
('javascript', 'easy', 'mcq',
 'How do you write a comment in JavaScript?',
 '["// This is a comment", "<!-- This is a comment -->", "# This is a comment", "/* This is a comment"]',
 0,
 'Single-line comments in JavaScript start with //.'),

-- Question 7
('javascript', 'easy', 'mcq',
 'What is the correct way to declare a JavaScript variable?',
 '["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"]',
 0,
 'Variables are declared using var, let, or const keywords.'),

-- Question 8
('javascript', 'easy', 'mcq',
 'Which operator is used to assign a value to a variable?',
 '["=", "==", "===", "=>"]',
 0,
 'The = operator is used for assignment, while == and === are used for comparison.'),

-- Question 9
('javascript', 'easy', 'mcq',
 'How do you round the number 7.25 to the nearest integer?',
 '["Math.round(7.25)", "round(7.25)", "Math.rnd(7.25)", "rnd(7.25)"]',
 0,
 'Math.round() rounds a number to the nearest integer.'),

-- Question 10
('javascript', 'easy', 'mcq',
 'How do you find the length of a string in JavaScript?',
 '["str.length", "str.size", "length(str)", "size(str)"]',
 0,
 'The length property returns the number of characters in a string.');

-- Verify insertion
SELECT 
  'Questions inserted successfully!' as message,
  COUNT(*) as total_questions
FROM questions;

-- Show the inserted questions
SELECT 
  id,
  skill,
  level,
  LEFT(question, 50) as question_preview
FROM questions
WHERE skill = 'javascript' AND level = 'easy'
ORDER BY id DESC
LIMIT 10;
