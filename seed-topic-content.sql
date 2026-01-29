-- ============================================
-- SEED TOPIC CONTENT WITH REAL DATA
-- Detailed content sections and examples
-- ============================================

-- Get topic IDs (you'll need to run this after inserting topics)
-- Example: HTML Variables topic content

-- HTML Structure Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Basic HTML Document', 'explanation', 
'Every HTML document follows a standard structure with DOCTYPE, html, head, and body elements.',
1 FROM topic_references WHERE slug = 'html-structure';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'HTML Document Structure', 'code',
'<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>',
'html', 2 FROM topic_references WHERE slug = 'html-structure';

-- HTML Links Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Anchor Tags', 'explanation',
'The <a> tag creates hyperlinks to other pages, files, locations, or URLs.',
1 FROM topic_references WHERE slug = 'html-links';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Basic Link Syntax', 'code',
'<!-- External link -->
<a href="https://example.com">Visit Example</a>

<!-- Internal link -->
<a href="/about.html">About Page</a>

<!-- Email link -->
<a href="mailto:email@example.com">Send Email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Open in new tab -->
<a href="https://example.com" target="_blank">Open in New Tab</a>',
'html', 2 FROM topic_references WHERE slug = 'html-links';

-- CSS Flexbox Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Flexbox Layout', 'explanation',
'Flexbox is a one-dimensional layout method for arranging items in rows or columns.',
1 FROM topic_references WHERE slug = 'css-flexbox';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Flex Container Properties', 'code',
'.container {
  display: flex;
  flex-direction: row; /* row | column | row-reverse | column-reverse */
  justify-content: center; /* flex-start | flex-end | center | space-between | space-around */
  align-items: center; /* flex-start | flex-end | center | stretch | baseline */
  flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
  gap: 10px; /* Space between items */
}',
'css', 2 FROM topic_references WHERE slug = 'css-flexbox';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Flex Item Properties', 'code',
'.item {
  flex-grow: 1; /* Growth factor */
  flex-shrink: 1; /* Shrink factor */
  flex-basis: auto; /* Initial size */
  flex: 1 1 auto; /* Shorthand: grow shrink basis */
  align-self: center; /* Override align-items */
  order: 0; /* Change visual order */
}',
'css', 3 FROM topic_references WHERE slug = 'css-flexbox';

-- JavaScript Variables Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Variable Declarations', 'explanation',
'JavaScript has three ways to declare variables: var, let, and const. Each has different scoping rules.',
1 FROM topic_references WHERE slug = 'js-variables';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'var, let, const', 'code',
'// var - function scoped, can be redeclared
var name = "John";
var name = "Jane"; // OK

// let - block scoped, cannot be redeclared
let age = 25;
age = 26; // OK
// let age = 27; // Error

// const - block scoped, cannot be reassigned
const PI = 3.14159;
// PI = 3.14; // Error

// const with objects (properties can change)
const person = { name: "John" };
person.name = "Jane"; // OK
// person = {}; // Error',
'javascript', 2 FROM topic_references WHERE slug = 'js-variables';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Scope Differences', 'tip',
'Use const by default, let when you need to reassign, and avoid var in modern JavaScript.',
3 FROM topic_references WHERE slug = 'js-variables';

-- JavaScript Array Methods Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Array Methods', 'explanation',
'JavaScript arrays have many built-in methods for manipulation and iteration.',
1 FROM topic_references WHERE slug = 'js-array-methods';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Common Array Methods', 'code',
'const arr = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - keep elements that pass test
const evens = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce - reduce to single value
const sum = arr.reduce((acc, x) => acc + x, 0); // 15

// find - first element that passes test
const found = arr.find(x => x > 3); // 4

// some - check if any element passes test
const hasEven = arr.some(x => x % 2 === 0); // true

// every - check if all elements pass test
const allPositive = arr.every(x => x > 0); // true

// includes - check if array contains value
const hasThree = arr.includes(3); // true',
'javascript', 2 FROM topic_references WHERE slug = 'js-array-methods';

-- JavaScript Promises Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'Promises', 'explanation',
'Promises represent the eventual completion or failure of an asynchronous operation.',
1 FROM topic_references WHERE slug = 'js-promises';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Creating and Using Promises', 'code',
'// Creating a promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

// Using a promise
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));

// Promise chaining
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promise.all - wait for all promises
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results));

// Promise.race - first to complete
Promise.race([promise1, promise2])
  .then(result => console.log(result));',
'javascript', 2 FROM topic_references WHERE slug = 'js-promises';

-- CSS Grid Content
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, order_index)
SELECT id, 'CSS Grid Layout', 'explanation',
'CSS Grid is a two-dimensional layout system for creating complex responsive layouts.',
1 FROM topic_references WHERE slug = 'css-grid';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Grid Container', 'code',
'.grid-container {
  display: grid;
  
  /* Define columns */
  grid-template-columns: 200px 1fr 1fr; /* Fixed, flexible, flexible */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive */
  
  /* Define rows */
  grid-template-rows: 100px auto 100px;
  
  /* Gap between items */
  gap: 20px; /* row and column gap */
  row-gap: 10px;
  column-gap: 20px;
  
  /* Alignment */
  justify-items: center; /* Horizontal alignment */
  align-items: center; /* Vertical alignment */
}',
'css', 2 FROM topic_references WHERE slug = 'css-grid';

INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index)
SELECT id, 'Grid Items', 'code',
'.grid-item {
  /* Span multiple columns */
  grid-column: 1 / 3; /* Start at 1, end at 3 */
  grid-column: span 2; /* Span 2 columns */
  
  /* Span multiple rows */
  grid-row: 1 / 3;
  grid-row: span 2;
  
  /* Shorthand */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}',
'css', 3 FROM topic_references WHERE slug = 'css-grid';
