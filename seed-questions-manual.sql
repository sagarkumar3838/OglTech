-- ============================================
-- SEED QUESTIONS - Manual Insert
-- Fast way to populate questions table
-- ============================================

-- HTML Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('html-basic-1', 'HTML', 'BASIC', 'mcq', 'What does HTML stand for?', 
 '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]'::jsonb,
 '"Hyper Text Markup Language"'::jsonb, 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.', true),

('html-basic-2', 'HTML', 'BASIC', 'mcq', 'Which HTML tag is used to define an internal style sheet?',
 '["<style>", "<css>", "<script>", "<link>"]'::jsonb,
 '"<style>"'::jsonb, 'The <style> tag is used to define internal CSS styles within an HTML document.', true),

('html-intermediate-1', 'HTML', 'INTERMEDIATE', 'mcq', 'Which HTML5 element is used to specify a footer for a document or section?',
 '["<footer>", "<bottom>", "<section>", "<div>"]'::jsonb,
 '"<footer>"'::jsonb, 'The <footer> element represents a footer for its nearest sectioning content or sectioning root element.', true),

('html-advanced-1', 'HTML', 'ADVANCED', 'mcq', 'What is the purpose of the data-* attributes in HTML5?',
 '["To store custom data private to the page or application", "To define database connections", "To create data tables", "To validate form data"]'::jsonb,
 '"To store custom data private to the page or application"'::jsonb, 'Data attributes allow you to store extra information on standard HTML elements without using non-standard attributes.', true);

-- CSS Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('css-basic-1', 'CSS', 'BASIC', 'mcq', 'What does CSS stand for?',
 '["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"]'::jsonb,
 '"Cascading Style Sheets"'::jsonb, 'CSS stands for Cascading Style Sheets, used to style and layout web pages.', true),

('css-basic-2', 'CSS', 'BASIC', 'mcq', 'Which CSS property is used to change the text color of an element?',
 '["color", "text-color", "font-color", "text-style"]'::jsonb,
 '"color"'::jsonb, 'The color property is used to set the color of text.', true),

('css-intermediate-1', 'CSS', 'INTERMEDIATE', 'mcq', 'Which CSS property controls the text size?',
 '["font-size", "text-size", "font-style", "text-style"]'::jsonb,
 '"font-size"'::jsonb, 'The font-size property sets the size of the font.', true),

('css-advanced-1', 'CSS', 'ADVANCED', 'mcq', 'What is the purpose of CSS Grid Layout?',
 '["To create two-dimensional layouts", "To add animations", "To style text", "To create responsive images"]'::jsonb,
 '"To create two-dimensional layouts"'::jsonb, 'CSS Grid Layout is a two-dimensional layout system for the web, handling both columns and rows.', true);

-- JavaScript Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('js-basic-1', 'JavaScript', 'BASIC', 'mcq', 'Which company developed JavaScript?',
 '["Netscape", "Microsoft", "Google", "Apple"]'::jsonb,
 '"Netscape"'::jsonb, 'JavaScript was developed by Brendan Eich at Netscape in 1995.', true),

('js-basic-2', 'JavaScript', 'BASIC', 'mcq', 'Which symbol is used for single line comments in JavaScript?',
 '["//", "/*", "#", "<!--"]'::jsonb,
 '"//"'::jsonb, 'Double forward slashes (//) are used for single-line comments in JavaScript.', true),

('js-intermediate-1', 'JavaScript', 'INTERMEDIATE', 'mcq', 'What is the difference between let and var?',
 '["let has block scope, var has function scope", "let is faster", "var is newer", "No difference"]'::jsonb,
 '"let has block scope, var has function scope"'::jsonb, 'let is block-scoped while var is function-scoped, making let more predictable in modern JavaScript.', true),

('js-advanced-1', 'JavaScript', 'ADVANCED', 'mcq', 'What is a closure in JavaScript?',
 '["A function that has access to variables in its outer scope", "A way to close browser windows", "A type of loop", "A CSS property"]'::jsonb,
 '"A function that has access to variables in its outer scope"'::jsonb, 'A closure gives you access to an outer function''s scope from an inner function.', true);

-- TypeScript Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('ts-basic-1', 'TypeScript', 'BASIC', 'mcq', 'What is TypeScript?',
 '["A superset of JavaScript with static typing", "A replacement for JavaScript", "A CSS framework", "A database language"]'::jsonb,
 '"A superset of JavaScript with static typing"'::jsonb, 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.', true),

('ts-intermediate-1', 'TypeScript', 'INTERMEDIATE', 'mcq', 'What is an interface in TypeScript?',
 '["A way to define the structure of an object", "A type of class", "A function declaration", "A variable type"]'::jsonb,
 '"A way to define the structure of an object"'::jsonb, 'Interfaces define contracts in your code and provide explicit names for type checking.', true),

('ts-advanced-1', 'TypeScript', 'ADVANCED', 'mcq', 'What are generics in TypeScript?',
 '["A way to create reusable components that work with multiple types", "A type of variable", "A CSS feature", "A database concept"]'::jsonb,
 '"A way to create reusable components that work with multiple types"'::jsonb, 'Generics provide a way to make components work with any data type while maintaining type safety.', true);

-- React Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('react-basic-1', 'React', 'BASIC', 'mcq', 'What is React?',
 '["A JavaScript library for building user interfaces", "A database", "A CSS framework", "A programming language"]'::jsonb,
 '"A JavaScript library for building user interfaces"'::jsonb, 'React is a JavaScript library developed by Facebook for building user interfaces.', true),

('react-intermediate-1', 'React', 'INTERMEDIATE', 'mcq', 'What is a React Hook?',
 '["A function that lets you use state and lifecycle features in functional components", "A way to style components", "A type of class", "A routing method"]'::jsonb,
 '"A function that lets you use state and lifecycle features in functional components"'::jsonb, 'Hooks let you use state and other React features without writing a class.', true),

('react-advanced-1', 'React', 'ADVANCED', 'mcq', 'What is the Virtual DOM in React?',
 '["A lightweight copy of the actual DOM kept in memory", "A database", "A CSS technique", "A testing tool"]'::jsonb,
 '"A lightweight copy of the actual DOM kept in memory"'::jsonb, 'The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM.', true);

-- Node.js Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('node-basic-1', 'Node.js', 'BASIC', 'mcq', 'What is Node.js?',
 '["A JavaScript runtime built on Chrome''s V8 engine", "A database", "A CSS framework", "A web browser"]'::jsonb,
 '"A JavaScript runtime built on Chrome''s V8 engine"'::jsonb, 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.', true),

('node-intermediate-1', 'Node.js', 'INTERMEDIATE', 'mcq', 'What is npm?',
 '["Node Package Manager", "New Programming Method", "Node Programming Module", "Network Protocol Manager"]'::jsonb,
 '"Node Package Manager"'::jsonb, 'npm is the default package manager for Node.js, used to install and manage dependencies.', true),

('node-advanced-1', 'Node.js', 'ADVANCED', 'mcq', 'What is the event loop in Node.js?',
 '["A mechanism that handles asynchronous operations", "A type of loop statement", "A database query", "A CSS animation"]'::jsonb,
 '"A mechanism that handles asynchronous operations"'::jsonb, 'The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.', true);

-- Python Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('python-basic-1', 'Python', 'BASIC', 'mcq', 'What is Python?',
 '["A high-level programming language", "A snake", "A database", "A web browser"]'::jsonb,
 '"A high-level programming language"'::jsonb, 'Python is a high-level, interpreted programming language known for its simplicity and readability.', true),

('python-intermediate-1', 'Python', 'INTERMEDIATE', 'mcq', 'What is a list in Python?',
 '["An ordered, mutable collection of items", "A function", "A class", "A module"]'::jsonb,
 '"An ordered, mutable collection of items"'::jsonb, 'Lists are ordered, mutable collections that can contain items of different types.', true),

('python-advanced-1', 'Python', 'ADVANCED', 'mcq', 'What is a decorator in Python?',
 '["A function that modifies another function", "A CSS style", "A database table", "A variable type"]'::jsonb,
 '"A function that modifies another function"'::jsonb, 'Decorators allow you to modify the behavior of a function or class without permanently modifying it.', true);

-- Java Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('java-basic-1', 'Java', 'BASIC', 'mcq', 'What is Java?',
 '["An object-oriented programming language", "A coffee brand", "A database", "A web browser"]'::jsonb,
 '"An object-oriented programming language"'::jsonb, 'Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible.', true),

('java-intermediate-1', 'Java', 'INTERMEDIATE', 'mcq', 'What is the JVM?',
 '["Java Virtual Machine", "Java Variable Method", "Java Version Manager", "Java Visual Module"]'::jsonb,
 '"Java Virtual Machine"'::jsonb, 'The JVM is an abstract computing machine that enables a computer to run Java programs.', true),

('java-advanced-1', 'Java', 'ADVANCED', 'mcq', 'What is polymorphism in Java?',
 '["The ability of an object to take many forms", "A type of loop", "A database concept", "A CSS property"]'::jsonb,
 '"The ability of an object to take many forms"'::jsonb, 'Polymorphism allows objects of different classes to be treated as objects of a common superclass.', true);

-- Testing Tools Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('test-basic-1', 'Testing Tools', 'BASIC', 'mcq', 'What is unit testing?',
 '["Testing individual components in isolation", "Testing the entire application", "Testing user interface", "Testing databases"]'::jsonb,
 '"Testing individual components in isolation"'::jsonb, 'Unit testing involves testing individual units or components of software in isolation.', true),

('test-intermediate-1', 'Testing Tools', 'INTERMEDIATE', 'mcq', 'What is Jest?',
 '["A JavaScript testing framework", "A CSS framework", "A database", "A web server"]'::jsonb,
 '"A JavaScript testing framework"'::jsonb, 'Jest is a delightful JavaScript testing framework with a focus on simplicity.', true),

('test-advanced-1', 'Testing Tools', 'ADVANCED', 'mcq', 'What is Test-Driven Development (TDD)?',
 '["Writing tests before writing code", "Testing after deployment", "Manual testing only", "Database testing"]'::jsonb,
 '"Writing tests before writing code"'::jsonb, 'TDD is a software development process where tests are written before the actual code.', true);

-- Docker Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('docker-basic-1', 'Docker', 'BASIC', 'mcq', 'What is Docker?',
 '["A containerization platform", "A database", "A programming language", "A web browser"]'::jsonb,
 '"A containerization platform"'::jsonb, 'Docker is a platform for developing, shipping, and running applications in containers.', true),

('docker-intermediate-1', 'Docker', 'INTERMEDIATE', 'mcq', 'What is a Docker image?',
 '["A template for creating containers", "A photo file", "A database backup", "A CSS file"]'::jsonb,
 '"A template for creating containers"'::jsonb, 'A Docker image is a lightweight, standalone package that includes everything needed to run an application.', true),

('docker-advanced-1', 'Docker', 'ADVANCED', 'mcq', 'What is Docker Compose?',
 '["A tool for defining multi-container applications", "A music application", "A database tool", "A CSS framework"]'::jsonb,
 '"A tool for defining multi-container applications"'::jsonb, 'Docker Compose is a tool for defining and running multi-container Docker applications.', true);

-- Kubernetes Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('k8s-basic-1', 'Kubernetes', 'BASIC', 'mcq', 'What is Kubernetes?',
 '["A container orchestration platform", "A database", "A programming language", "A web browser"]'::jsonb,
 '"A container orchestration platform"'::jsonb, 'Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.', true),

('k8s-intermediate-1', 'Kubernetes', 'INTERMEDIATE', 'mcq', 'What is a Pod in Kubernetes?',
 '["The smallest deployable unit", "A database", "A programming language", "A CSS framework"]'::jsonb,
 '"The smallest deployable unit"'::jsonb, 'A Pod is the smallest deployable unit in Kubernetes that can contain one or more containers.', true),

('k8s-advanced-1', 'Kubernetes', 'ADVANCED', 'mcq', 'What is a Kubernetes Service?',
 '["An abstraction that defines a logical set of Pods", "A web server", "A database", "A CSS file"]'::jsonb,
 '"An abstraction that defines a logical set of Pods"'::jsonb, 'A Service is an abstract way to expose an application running on a set of Pods as a network service.', true);

-- Cloud Platforms Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('cloud-basic-1', 'Cloud Platforms', 'BASIC', 'mcq', 'What is cloud computing?',
 '["Delivery of computing services over the internet", "Weather forecasting", "A database", "A programming language"]'::jsonb,
 '"Delivery of computing services over the internet"'::jsonb, 'Cloud computing is the delivery of computing services including servers, storage, databases, networking, and software over the internet.', true),

('cloud-intermediate-1', 'Cloud Platforms', 'INTERMEDIATE', 'mcq', 'What is AWS?',
 '["Amazon Web Services", "A Web Server", "A database", "A programming language"]'::jsonb,
 '"Amazon Web Services"'::jsonb, 'AWS is a comprehensive cloud computing platform provided by Amazon.', true),

('cloud-advanced-1', 'Cloud Platforms', 'ADVANCED', 'mcq', 'What is serverless computing?',
 '["Running code without managing servers", "A server without power", "A database", "A CSS framework"]'::jsonb,
 '"Running code without managing servers"'::jsonb, 'Serverless computing allows you to build and run applications without thinking about servers.', true);

-- jQuery Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('jquery-basic-1', 'jQuery', 'BASIC', 'mcq', 'What is jQuery?',
 '["A JavaScript library", "A database", "A programming language", "A web browser"]'::jsonb,
 '"A JavaScript library"'::jsonb, 'jQuery is a fast, small, and feature-rich JavaScript library that simplifies HTML document traversal and manipulation.', true),

('jquery-intermediate-1', 'jQuery', 'INTERMEDIATE', 'mcq', 'What does the $ symbol represent in jQuery?',
 '["The jQuery function", "A variable", "A CSS selector", "A database query"]'::jsonb,
 '"The jQuery function"'::jsonb, 'The $ symbol is an alias for the jQuery function, used to select and manipulate HTML elements.', true),

('jquery-advanced-1', 'jQuery', 'ADVANCED', 'mcq', 'What is AJAX in jQuery?',
 '["Asynchronous JavaScript and XML", "A database", "A CSS framework", "A programming language"]'::jsonb,
 '"Asynchronous JavaScript and XML"'::jsonb, 'AJAX allows you to load data from the server without refreshing the page.', true);

-- OGL Knowledge Questions
INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES
('ogl-basic-1', 'OGL Knowledge', 'BASIC', 'mcq', 'What does OGL stand for in the context of this platform?',
 '["OGL Tech Career Development", "Open Graphics Library", "Online Gaming League", "Optical Graphics Layer"]'::jsonb,
 '"OGL Tech Career Development"'::jsonb, 'OGL refers to the career development and skill evaluation platform for tech professionals.', true),

('ogl-intermediate-1', 'OGL Knowledge', 'INTERMEDIATE', 'mcq', 'How many difficulty levels are there in OGL evaluations?',
 '["3 levels: Basic, Intermediate, Advanced", "2 levels", "4 levels", "5 levels"]'::jsonb,
 '"3 levels: Basic, Intermediate, Advanced"'::jsonb, 'OGL uses a 3-level progressive system to evaluate skills at different proficiency levels.', true),

('ogl-advanced-1', 'OGL Knowledge', 'ADVANCED', 'mcq', 'What is the purpose of the OGL skill evaluation system?',
 '["To assess and track technical skill proficiency across career paths", "To play games", "To manage databases", "To design websites"]'::jsonb,
 '"To assess and track technical skill proficiency across career paths"'::jsonb, 'The OGL system provides comprehensive skill evaluation and career progression tracking for tech professionals.', true);

-- Success message
SELECT 'Successfully inserted ' || COUNT(*) || ' questions!' as message FROM questions;
