-- ============================================
-- SEED REAL TOPIC REFERENCES DATA
-- Similar to quickref.me structure
-- ============================================

-- HTML Topics
INSERT INTO topic_references (skill_name, category, topic_name, slug, description, difficulty_level, icon, color, order_index) VALUES
('HTML', 'Basics', 'HTML Structure', 'html-structure', 'Basic HTML document structure and elements', 'basic', '📄', '#E34F26', 1),
('HTML', 'Basics', 'HTML Tags', 'html-tags', 'Common HTML tags and their usage', 'basic', '🏷️', '#E34F26', 2),
('HTML', 'Basics', 'HTML Attributes', 'html-attributes', 'HTML attributes and their values', 'basic', '⚙️', '#E34F26', 3),
('HTML', 'Text', 'Headings', 'html-headings', 'H1 to H6 heading tags', 'basic', '📝', '#E34F26', 4),
('HTML', 'Text', 'Paragraphs', 'html-paragraphs', 'Paragraph and text formatting', 'basic', '📃', '#E34F26', 5),
('HTML', 'Text', 'Links', 'html-links', 'Anchor tags and hyperlinks', 'basic', '🔗', '#E34F26', 6),
('HTML', 'Text', 'Lists', 'html-lists', 'Ordered, unordered, and description lists', 'basic', '📋', '#E34F26', 7),
('HTML', 'Media', 'Images', 'html-images', 'Image tags and attributes', 'basic', '🖼️', '#E34F26', 8),
('HTML', 'Media', 'Audio', 'html-audio', 'Audio element and controls', 'intermediate', '🔊', '#E34F26', 9),
('HTML', 'Media', 'Video', 'html-video', 'Video element and controls', 'intermediate', '🎥', '#E34F26', 10),
('HTML', 'Forms', 'Form Basics', 'html-forms', 'Form elements and structure', 'intermediate', '📝', '#E34F26', 11),
('HTML', 'Forms', 'Input Types', 'html-input-types', 'Different input field types', 'intermediate', '⌨️', '#E34F26', 12),
('HTML', 'Forms', 'Form Validation', 'html-form-validation', 'HTML5 form validation attributes', 'intermediate', '✅', '#E34F26', 13),
('HTML', 'Tables', 'Table Structure', 'html-tables', 'Creating tables with rows and columns', 'intermediate', '📊', '#E34F26', 14),
('HTML', 'Semantic', 'Semantic HTML', 'html-semantic', 'Semantic HTML5 elements', 'intermediate', '🎯', '#E34F26', 15),
('HTML', 'Advanced', 'Canvas', 'html-canvas', 'Canvas API for graphics', 'advanced', '🎨', '#E34F26', 16),
('HTML', 'Advanced', 'SVG', 'html-svg', 'Scalable Vector Graphics', 'advanced', '🖌️', '#E34F26', 17),
('HTML', 'Advanced', 'Web Storage', 'html-web-storage', 'LocalStorage and SessionStorage', 'advanced', '💾', '#E34F26', 18),
('HTML', 'Advanced', 'Geolocation', 'html-geolocation', 'Geolocation API', 'advanced', '📍', '#E34F26', 19),
('HTML', 'Advanced', 'Drag and Drop', 'html-drag-drop', 'Drag and Drop API', 'advanced', '🖱️', '#E34F26', 20);

-- CSS Topics
INSERT INTO topic_references (skill_name, category, topic_name, slug, description, difficulty_level, icon, color, order_index) VALUES
('CSS', 'Basics', 'CSS Syntax', 'css-syntax', 'CSS syntax and selectors', 'basic', '🎨', '#1572B6', 1),
('CSS', 'Basics', 'Selectors', 'css-selectors', 'CSS selector types and specificity', 'basic', '🎯', '#1572B6', 2),
('CSS', 'Basics', 'Colors', 'css-colors', 'Color values and formats', 'basic', '🌈', '#1572B6', 3),
('CSS', 'Box Model', 'Box Model', 'css-box-model', 'Understanding the CSS box model', 'basic', '📦', '#1572B6', 4),
('CSS', 'Box Model', 'Margin & Padding', 'css-margin-padding', 'Spacing with margin and padding', 'basic', '📏', '#1572B6', 5),
('CSS', 'Box Model', 'Border', 'css-border', 'Border properties and styles', 'basic', '🔲', '#1572B6', 6),
('CSS', 'Typography', 'Fonts', 'css-fonts', 'Font properties and web fonts', 'basic', '🔤', '#1572B6', 7),
('CSS', 'Typography', 'Text Styling', 'css-text', 'Text decoration and alignment', 'basic', '✍️', '#1572B6', 8),
('CSS', 'Layout', 'Display', 'css-display', 'Display property values', 'intermediate', '📱', '#1572B6', 9),
('CSS', 'Layout', 'Position', 'css-position', 'Positioning elements', 'intermediate', '📍', '#1572B6', 10),
('CSS', 'Layout', 'Flexbox', 'css-flexbox', 'Flexible box layout', 'intermediate', '📊', '#1572B6', 11),
('CSS', 'Layout', 'Grid', 'css-grid', 'CSS Grid layout system', 'intermediate', '🎛️', '#1572B6', 12),
('CSS', 'Layout', 'Float', 'css-float', 'Float and clear properties', 'intermediate', '🎈', '#1572B6', 13),
('CSS', 'Responsive', 'Media Queries', 'css-media-queries', 'Responsive design with media queries', 'intermediate', '📱', '#1572B6', 14),
('CSS', 'Responsive', 'Viewport Units', 'css-viewport', 'Viewport-relative units', 'intermediate', '📐', '#1572B6', 15),
('CSS', 'Animation', 'Transitions', 'css-transitions', 'CSS transitions', 'intermediate', '🎬', '#1572B6', 16),
('CSS', 'Animation', 'Animations', 'css-animations', 'CSS keyframe animations', 'advanced', '🎭', '#1572B6', 17),
('CSS', 'Animation', 'Transforms', 'css-transforms', '2D and 3D transforms', 'advanced', '🔄', '#1572B6', 18),
('CSS', 'Advanced', 'Variables', 'css-variables', 'CSS custom properties', 'advanced', '🔧', '#1572B6', 19),
('CSS', 'Advanced', 'Pseudo-classes', 'css-pseudo-classes', 'Pseudo-class selectors', 'intermediate', '🎯', '#1572B6', 20),
('CSS', 'Advanced', 'Pseudo-elements', 'css-pseudo-elements', 'Pseudo-element selectors', 'advanced', '✨', '#1572B6', 21);

-- JavaScript Topics
INSERT INTO topic_references (skill_name, category, topic_name, slug, description, difficulty_level, icon, color, order_index) VALUES
('JavaScript', 'Basics', 'Variables', 'js-variables', 'var, let, and const declarations', 'basic', '📦', '#F7DF1E', 1),
('JavaScript', 'Basics', 'Data Types', 'js-data-types', 'Primitive and reference types', 'basic', '🔢', '#F7DF1E', 2),
('JavaScript', 'Basics', 'Operators', 'js-operators', 'Arithmetic, comparison, and logical operators', 'basic', '➕', '#F7DF1E', 3),
('JavaScript', 'Control Flow', 'Conditionals', 'js-conditionals', 'if, else, switch statements', 'basic', '🔀', '#F7DF1E', 4),
('JavaScript', 'Control Flow', 'Loops', 'js-loops', 'for, while, do-while loops', 'basic', '🔁', '#F7DF1E', 5),
('JavaScript', 'Functions', 'Function Basics', 'js-functions', 'Function declaration and expression', 'basic', '⚡', '#F7DF1E', 6),
('JavaScript', 'Functions', 'Arrow Functions', 'js-arrow-functions', 'ES6 arrow function syntax', 'intermediate', '➡️', '#F7DF1E', 7),
('JavaScript', 'Functions', 'Callbacks', 'js-callbacks', 'Callback functions', 'intermediate', '📞', '#F7DF1E', 8),
('JavaScript', 'Arrays', 'Array Methods', 'js-array-methods', 'Common array methods', 'intermediate', '📚', '#F7DF1E', 9),
('JavaScript', 'Arrays', 'Array Iteration', 'js-array-iteration', 'forEach, map, filter, reduce', 'intermediate', '🔄', '#F7DF1E', 10),
('JavaScript', 'Objects', 'Object Basics', 'js-objects', 'Creating and using objects', 'basic', '🎁', '#F7DF1E', 11),
('JavaScript', 'Objects', 'Object Methods', 'js-object-methods', 'Object.keys, values, entries', 'intermediate', '🔑', '#F7DF1E', 12),
('JavaScript', 'Objects', 'Destructuring', 'js-destructuring', 'Object and array destructuring', 'intermediate', '📦', '#F7DF1E', 13),
('JavaScript', 'DOM', 'DOM Selection', 'js-dom-selection', 'Selecting DOM elements', 'intermediate', '🎯', '#F7DF1E', 14),
('JavaScript', 'DOM', 'DOM Manipulation', 'js-dom-manipulation', 'Modifying DOM elements', 'intermediate', '✏️', '#F7DF1E', 15),
('JavaScript', 'DOM', 'Event Handling', 'js-events', 'Event listeners and handlers', 'intermediate', '👆', '#F7DF1E', 16),
('JavaScript', 'Async', 'Promises', 'js-promises', 'Promise API and chaining', 'advanced', '⏳', '#F7DF1E', 17),
('JavaScript', 'Async', 'Async/Await', 'js-async-await', 'Async/await syntax', 'advanced', '⏰', '#F7DF1E', 18),
('JavaScript', 'Async', 'Fetch API', 'js-fetch', 'Making HTTP requests', 'advanced', '🌐', '#F7DF1E', 19),
('JavaScript', 'ES6+', 'Classes', 'js-classes', 'ES6 class syntax', 'advanced', '🏛️', '#F7DF1E', 20),
('JavaScript', 'ES6+', 'Modules', 'js-modules', 'Import and export modules', 'advanced', '📦', '#F7DF1E', 21),
('JavaScript', 'ES6+', 'Spread/Rest', 'js-spread-rest', 'Spread and rest operators', 'intermediate', '...', '#F7DF1E', 22);

-- jQuery Topics
INSERT INTO topic_references (skill_name, category, topic_name, slug, description, difficulty_level, icon, color, order_index) VALUES
('jQuery', 'Basics', 'jQuery Syntax', 'jquery-syntax', 'Basic jQuery syntax and selectors', 'basic', '💎', '#0769AD', 1),
('jQuery', 'Basics', 'Selectors', 'jquery-selectors', 'jQuery selector methods', 'basic', '🎯', '#0769AD', 2),
('jQuery', 'DOM', 'DOM Manipulation', 'jquery-dom', 'Manipulating DOM with jQuery', 'basic', '✏️', '#0769AD', 3),
('jQuery', 'Events', 'Event Handling', 'jquery-events', 'jQuery event methods', 'intermediate', '👆', '#0769AD', 4),
('jQuery', 'Effects', 'Animations', 'jquery-animations', 'jQuery animation effects', 'intermediate', '🎬', '#0769AD', 5),
('jQuery', 'AJAX', 'AJAX Methods', 'jquery-ajax', 'Making AJAX requests with jQuery', 'advanced', '🌐', '#0769AD', 6);
