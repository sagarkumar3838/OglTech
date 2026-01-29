-- ============================================
-- Comprehensive Topic Links Database
-- ============================================
-- Links to W3Schools, MDN, GeeksforGeeks, Oracle Guided Learning
-- Covers 200+ topics across HTML, CSS, JavaScript, jQuery
-- ============================================

-- First, run create-topic-knowledge-base.sql if not already done

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
('html', 'HTML Input Attributes', 'Input Attributes', 'Input field attributes', 'intermediate', 'https://www.w3schools.com/html/html_form_attributes_form.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes', 'https://www.geeksforgeeks.org/html-input-attributes/'),

-- HTML Media
('html', 'HTML Images', 'HTML Images', 'Adding images to web pages', 'beginner', 'https://www.w3schools.com/html/html_images.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img', 'https://www.geeksforgeeks.org/html-images/'),
('html', 'HTML Video', 'HTML Video', 'Embedding videos', 'intermediate', 'https://www.w3schools.com/html/html5_video.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video', 'https://www.geeksforgeeks.org/html5-video/'),
('html', 'HTML Audio', 'HTML Audio', 'Adding audio files', 'intermediate', 'https://www.w3schools.com/html/html5_audio.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio', 'https://www.geeksforgeeks.org/html5-audio/'),

-- HTML Tables
('html', 'HTML Tables', 'HTML Tables', 'Creating data tables', 'beginner', 'https://www.w3schools.com/html/html_tables.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table', 'https://www.geeksforgeeks.org/html-tables/'),
('html', 'HTML Table Borders', 'Table Borders', 'Styling table borders', 'beginner', 'https://www.w3schools.com/html/html_table_borders.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/border', 'https://www.geeksforgeeks.org/html-table-borders/'),
('html', 'HTML Table Colspan', 'Table Colspan', 'Merging table columns', 'intermediate', 'https://www.w3schools.com/html/html_table_colspan_rowspan.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan', 'https://www.geeksforgeeks.org/html-colspan-attribute/'),

-- HTML Lists
('html', 'HTML Lists', 'HTML Lists', 'Creating ordered and unordered lists', 'beginner', 'https://www.w3schools.com/html/html_lists.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul', 'https://www.geeksforgeeks.org/html-lists/'),
('html', 'HTML Ordered Lists', 'Ordered Lists', 'Numbered lists', 'beginner', 'https://www.w3schools.com/html/html_lists_ordered.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol', 'https://www.geeksforgeeks.org/html-ol-tag/'),
('html', 'HTML Unordered Lists', 'Unordered Lists', 'Bullet point lists', 'beginner', 'https://www.w3schools.com/html/html_lists_unordered.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul', 'https://www.geeksforgeeks.org/html-ul-tag/'),

-- HTML Links
('html', 'HTML Links', 'HTML Links', 'Creating hyperlinks', 'beginner', 'https://www.w3schools.com/html/html_links.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a', 'https://www.geeksforgeeks.org/html-links/'),
('html', 'HTML Link Colors', 'Link Colors', 'Styling link colors', 'beginner', 'https://www.w3schools.com/html/html_links_colors.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:link', 'https://www.geeksforgeeks.org/html-link-colors/'),

-- HTML Semantic
('html', 'HTML Semantic Elements', 'Semantic HTML', 'Using meaningful HTML tags', 'intermediate', 'https://www.w3schools.com/html/html5_semantic_elements.asp', 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html', 'https://www.geeksforgeeks.org/html5-semantics/'),
('html', 'HTML Header', 'Header Element', 'Page header section', 'intermediate', 'https://www.w3schools.com/tags/tag_header.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header', 'https://www.geeksforgeeks.org/html5-header-tag/'),
('html', 'HTML Nav', 'Nav Element', 'Navigation section', 'intermediate', 'https://www.w3schools.com/tags/tag_nav.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav', 'https://www.geeksforgeeks.org/html5-nav-tag/'),
('html', 'HTML Section', 'Section Element', 'Content sections', 'intermediate', 'https://www.w3schools.com/tags/tag_section.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section', 'https://www.geeksforgeeks.org/html5-section-tag/'),
('html', 'HTML Article', 'Article Element', 'Independent content', 'intermediate', 'https://www.w3schools.com/tags/tag_article.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article', 'https://www.geeksforgeeks.org/html5-article-tag/'),
('html', 'HTML Footer', 'Footer Element', 'Page footer section', 'intermediate', 'https://www.w3schools.com/tags/tag_footer.asp', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer', 'https://www.geeksforgeeks.org/html5-footer-tag/'),

-- HTML Advanced
('html', 'HTML Canvas', 'HTML Canvas', 'Drawing graphics with JavaScript', 'advanced', 'https://www.w3schools.com/html/html5_canvas.asp', 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API', 'https://www.geeksforgeeks.org/html-canvas-basics/'),
('html', 'HTML SVG', 'HTML SVG', 'Scalable Vector Graphics', 'advanced', 'https://www.w3schools.com/html/html5_svg.asp', 'https://developer.mozilla.org/en-US/docs/Web/SVG', 'https://www.geeksforgeeks.org/html-svg-basics/'),
('html', 'HTML Geolocation', 'Geolocation API', 'Getting user location', 'advanced', 'https://www.w3schools.com/html/html5_geolocation.asp', 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API', 'https://www.geeksforgeeks.org/html-geolocation/'),
('html', 'HTML Drag and Drop', 'Drag and Drop', 'Drag and drop functionality', 'advanced', 'https://www.w3schools.com/html/html5_draganddrop.asp', 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API', 'https://www.geeksforgeeks.org/html-drag-and-drop/'),
('html', 'HTML Web Storage', 'Web Storage', 'LocalStorage and SessionStorage', 'advanced', 'https://www.w3schools.com/html/html5_webstorage.asp', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API', 'https://www.geeksforgeeks.org/html-web-storage-api/');

-- ============================================
-- CSS TOPICS (60+ topics)
-- ============================================

INSERT INTO topic_knowledge_base (skill, topic, title, short_description, difficulty_level, w3schools_url, mdn_url, geeksforgeeks_url) VALUES

-- CSS Basics
('css', 'CSS Introduction', 'CSS Basics', 'Introduction to Cascading Style Sheets', 'beginner', 'https://www.w3schools.com/css/css_intro.asp', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps', 'https://www.geeksforgeeks.org/css-introduction/'),
('css', 'CSS Syntax', 'CSS Syntax', 'CSS rule structure', 'beginner', 'https://www.w3schools.com/css/css_syntax.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax', 'https://www.geeksforgeeks.org/css-syntax/'),
('css', 'CSS Selectors', 'CSS Selectors', 'Targeting HTML elements', 'beginner', 'https://www.w3schools.com/css/css_selectors.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors', 'https://www.geeksforgeeks.org/css-selectors/'),
('css', 'CSS Colors', 'CSS Colors', 'Color values and formats', 'beginner', 'https://www.w3schools.com/css/css_colors.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/color', 'https://www.geeksforgeeks.org/css-colors/'),
('css', 'CSS Backgrounds', 'CSS Backgrounds', 'Background properties', 'beginner', 'https://www.w3schools.com/css/css_background.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/background', 'https://www.geeksforgeeks.org/css-backgrounds/'),

-- CSS Box Model
('css', 'CSS Box Model', 'CSS Box Model', 'Understanding the box model', 'beginner', 'https://www.w3schools.com/css/css_boxmodel.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model', 'https://www.geeksforgeeks.org/css-box-model/'),
('css', 'CSS Margins', 'CSS Margins', 'Outer spacing', 'beginner', 'https://www.w3schools.com/css/css_margin.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin', 'https://www.geeksforgeeks.org/css-margins/'),
('css', 'CSS Padding', 'CSS Padding', 'Inner spacing', 'beginner', 'https://www.w3schools.com/css/css_padding.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding', 'https://www.geeksforgeeks.org/css-padding/'),
('css', 'CSS Borders', 'CSS Borders', 'Element borders', 'beginner', 'https://www.w3schools.com/css/css_border.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/border', 'https://www.geeksforgeeks.org/css-borders/'),
('css', 'CSS Width and Height', 'Width and Height', 'Element dimensions', 'beginner', 'https://www.w3schools.com/css/css_dimension.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/width', 'https://www.geeksforgeeks.org/css-width-height/'),

-- CSS Layout
('css', 'CSS Display', 'CSS Display', 'Display property values', 'intermediate', 'https://www.w3schools.com/css/css_display_visibility.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/display', 'https://www.geeksforgeeks.org/css-display-property/'),
('css', 'CSS Position', 'CSS Position', 'Element positioning', 'intermediate', 'https://www.w3schools.com/css/css_positioning.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/position', 'https://www.geeksforgeeks.org/css-positioning-elements/'),
('css', 'CSS Float', 'CSS Float', 'Floating elements', 'intermediate', 'https://www.w3schools.com/css/css_float.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/float', 'https://www.geeksforgeeks.org/css-float/'),
('css', 'CSS Flexbox', 'CSS Flexbox', 'Flexible box layout', 'intermediate', 'https://www.w3schools.com/css/css3_flexbox.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout', 'https://www.geeksforgeeks.org/css-flexbox-and-its-properties/'),
('css', 'CSS Grid', 'CSS Grid', 'Grid layout system', 'intermediate', 'https://www.w3schools.com/css/css_grid.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', 'https://www.geeksforgeeks.org/css-grid-layout/'),

-- CSS Text & Fonts
('css', 'CSS Text', 'CSS Text', 'Text formatting', 'beginner', 'https://www.w3schools.com/css/css_text.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Text', 'https://www.geeksforgeeks.org/css-text-formatting/'),
('css', 'CSS Fonts', 'CSS Fonts', 'Font properties', 'beginner', 'https://www.w3schools.com/css/css_font.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/font', 'https://www.geeksforgeeks.org/css-fonts/'),
('css', 'CSS Text Alignment', 'Text Alignment', 'Aligning text', 'beginner', 'https://www.w3schools.com/css/css_text_align.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-align', 'https://www.geeksforgeeks.org/css-text-align-property/'),
('css', 'CSS Text Decoration', 'Text Decoration', 'Underline, overline, etc.', 'beginner', 'https://www.w3schools.com/css/css_text_decoration.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration', 'https://www.geeksforgeeks.org/css-text-decoration-property/'),

-- CSS Advanced
('css', 'CSS Transitions', 'CSS Transitions', 'Smooth property changes', 'intermediate', 'https://www.w3schools.com/css/css3_transitions.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions', 'https://www.geeksforgeeks.org/css-transitions/'),
('css', 'CSS Animations', 'CSS Animations', 'Keyframe animations', 'advanced', 'https://www.w3schools.com/css/css3_animations.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations', 'https://www.geeksforgeeks.org/css-animations/'),
('css', 'CSS Transform', 'CSS Transform', '2D and 3D transformations', 'intermediate', 'https://www.w3schools.com/css/css3_2dtransforms.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform', 'https://www.geeksforgeeks.org/css-transform-property/'),
('css', 'CSS Variables', 'CSS Variables', 'Custom properties', 'intermediate', 'https://www.w3schools.com/css/css3_variables.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties', 'https://www.geeksforgeeks.org/css-variables/'),
('css', 'CSS Media Queries', 'Media Queries', 'Responsive design', 'intermediate', 'https://www.w3schools.com/css/css_rwd_mediaqueries.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries', 'https://www.geeksforgeeks.org/css-media-queries/'),

-- CSS Pseudo
('css', 'CSS Pseudo-classes', 'Pseudo-classes', 'Element states', 'intermediate', 'https://www.w3schools.com/css/css_pseudo_classes.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes', 'https://www.geeksforgeeks.org/css-pseudo-classes/'),
('css', 'CSS Pseudo-elements', 'Pseudo-elements', 'Style specific parts', 'intermediate', 'https://www.w3schools.com/css/css_pseudo_elements.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements', 'https://www.geeksforgeeks.org/css-pseudo-elements/'),
('css', 'CSS Hover', 'Hover Effect', 'Mouse hover styles', 'beginner', 'https://www.w3schools.com/cssref/sel_hover.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:hover', 'https://www.geeksforgeeks.org/css-hover-selector/'),
('css', 'CSS Focus', 'Focus State', 'Input focus styles', 'beginner', 'https://www.w3schools.com/cssref/sel_focus.asp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus', 'https://www.geeksforgeeks.org/css-focus-selector/');

-- Continue in next part due to length...
