# 🚀 Generate Questions for All Skills & All Levels

## 📋 Complete ChatGPT Mega Prompt

Copy this ENTIRE prompt to ChatGPT to generate **750 questions** (5 skills × 3 levels × 50 questions):

---

### CHATGPT MEGA PROMPT (Copy Everything Below):

```
I need you to generate technical evaluation questions for 5 skills at 3 difficulty levels each.

**TOTAL: 750 questions (5 skills × 3 levels × 50 questions)**

**CSV FORMAT:**
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

**REQUIREMENTS:**
- Each question must have 4 distinct options (A, B, C, D)
- correct_answer must match one of the options exactly
- explanation should be 1-2 sentences
- type: Multiple Choice

---

## SKILL 1: HTML (150 questions)

### HTML - BASIC (50 questions)
Topics: HTML fundamentals, basic tags (div, span, p, h1-h6), attributes (id, class, style), links (a href), images (img src alt), lists (ul, ol, li), tables (table, tr, td, th), forms basics (form, input, button), semantic tags (header, footer, nav, main, section, article)

### HTML - MEDIUM (50 questions)
Topics: HTML5 semantic elements, form validation (required, pattern, min, max), input types (email, number, date, color, range), data attributes, meta tags, accessibility (ARIA, alt text, semantic HTML), iframe, audio/video tags, canvas basics, SVG basics

### HTML - ADVANCED (50 questions)
Topics: HTML5 APIs (localStorage, sessionStorage, geolocation, drag and drop), web workers, service workers, custom elements, shadow DOM, web components, template tag, slot, HTML performance optimization, SEO best practices, microdata/schema.org

Generate all 150 HTML questions now.

---

## SKILL 2: CSS (150 questions)

### CSS - BASIC (50 questions)
Topics: CSS syntax, selectors (element, class, id, descendant), colors (hex, rgb, named), text properties (color, font-size, font-family, font-weight, text-align, text-decoration), background (background-color, background-image), box model (margin, padding, border, width, height), display (block, inline, inline-block, none), positioning basics

### CSS - MEDIUM (50 questions)
Topics: Flexbox (display flex, flex-direction, justify-content, align-items, flex-wrap, flex-grow, flex-shrink, align-self), CSS Grid basics (display grid, grid-template-columns, grid-gap, grid-area), positioning (relative, absolute, fixed, sticky), z-index, pseudo-classes (:hover, :focus, :nth-child), pseudo-elements (::before, ::after), transitions, transforms, media queries, responsive design, CSS units (em, rem, vh, vw, %), box-sizing

### CSS - ADVANCED (50 questions)
Topics: Advanced Grid layouts (grid-template-areas, auto-fit, auto-fill, minmax), advanced Flexbox patterns, CSS custom properties (variables), complex animations and keyframes, CSS architecture (BEM, SMACSS, CSS modules), performance optimization, CSS preprocessors concepts, advanced selectors (:not, :has, :is, :where), CSS containment, clipping and masking, filters and blend modes, modern CSS features (container queries, aspect-ratio, gap, clamp), CSS-in-JS concepts

Generate all 150 CSS questions now.

---

## SKILL 3: JavaScript (150 questions)

### JavaScript - BASIC (50 questions)
Topics: Variables (var, let, const), data types (string, number, boolean, null, undefined), operators (arithmetic, comparison, logical), conditionals (if, else, switch), loops (for, while, do-while), functions (declaration, expression, arrow functions), arrays (creation, access, length, push, pop), objects (creation, property access, methods), string methods, number methods, basic DOM manipulation (getElementById, querySelector, innerHTML, textContent)

### JavaScript - MEDIUM (50 questions)
Topics: Array methods (map, filter, reduce, forEach, find, some, every), object methods (Object.keys, Object.values, Object.entries), destructuring, spread operator, rest parameters, template literals, closures, scope (global, function, block), hoisting, this keyword, prototypes, classes, inheritance, async/await, promises, fetch API, error handling (try-catch), JSON (parse, stringify), ES6+ features

### JavaScript - ADVANCED (50 questions)
Topics: Advanced async patterns (Promise.all, Promise.race, Promise.allSettled), generators and iterators, symbols, proxies and reflect, WeakMap and WeakSet, design patterns (module, singleton, factory, observer), functional programming concepts, currying, composition, memoization, event loop and call stack, memory management, performance optimization, debugging techniques, testing concepts, module systems (CommonJS, ES modules), advanced DOM manipulation, Web APIs

Generate all 150 JavaScript questions now.

---

## SKILL 4: jQuery (150 questions)

### jQuery - BASIC (50 questions)
Topics: jQuery basics ($ function, document ready), selectors (element, class, id, attribute), DOM manipulation (html, text, val, append, prepend, after, before, remove), CSS manipulation (css, addClass, removeClass, toggleClass), show/hide/toggle, events (click, hover, focus, blur, submit), event handling (on, off), animations (fadeIn, fadeOut, slideUp, slideDown), traversing (parent, children, siblings, find)

### jQuery - MEDIUM (50 questions)
Topics: Advanced selectors (:first, :last, :even, :odd, :eq, :gt, :lt), AJAX ($.ajax, $.get, $.post, $.getJSON), effects and animations (animate, stop, delay), event delegation, custom events, jQuery plugins basics, data attributes (data method), form validation, chaining, each method, filtering (filter, not, has), dimensions (width, height, innerWidth, outerWidth), position and offset

### jQuery - ADVANCED (50 questions)
Topics: Creating jQuery plugins, advanced AJAX (error handling, promises, deferred objects), performance optimization, jQuery vs vanilla JavaScript, migration from jQuery to vanilla JS, jQuery UI basics, custom animations, advanced event handling, namespaced events, jQuery best practices, jQuery with modern frameworks, jQuery utilities ($.extend, $.grep, $.map, $.merge), advanced DOM manipulation, jQuery internals

Generate all 150 jQuery questions now.

---

## SKILL 5: OGL Knowledge (150 questions)

### OGL - BASIC (50 questions)
Topics: OGL fundamentals, basic OGL concepts, OGL terminology, OGL development basics, OGL project structure, OGL best practices for beginners, OGL tools and setup, OGL documentation basics, OGL community standards, OGL coding conventions, basic OGL workflows, OGL version control basics, OGL testing basics, OGL debugging basics, OGL deployment basics

### OGL - MEDIUM (50 questions)
Topics: OGL architecture patterns, OGL component design, OGL state management, OGL routing concepts, OGL API integration, OGL authentication and authorization, OGL data flow, OGL performance considerations, OGL security basics, OGL testing strategies, OGL CI/CD basics, OGL monitoring and logging, OGL error handling patterns, OGL code organization, OGL scalability concepts

### OGL - ADVANCED (50 questions)
Topics: Advanced OGL architecture, OGL microservices patterns, OGL performance optimization, OGL security best practices, advanced OGL testing (unit, integration, e2e), OGL deployment strategies, OGL monitoring and observability, OGL scalability and load balancing, OGL caching strategies, OGL database optimization, OGL advanced debugging, OGL code review practices, OGL documentation standards, OGL team collaboration, OGL production best practices

Generate all 150 OGL questions now.

---

**IMPORTANT INSTRUCTIONS:**
1. Generate ALL 750 questions
2. Clearly separate each skill and level with headers
3. Use the exact CSV format provided
4. Ensure correct_answer matches one of the four options exactly
5. Make questions realistic and practical
6. Vary question difficulty within each level
7. Include both conceptual and practical questions

Start generating now!
```

---

## 📁 How to Save ChatGPT's Output

ChatGPT will generate questions in sections. Save them to these files:

### HTML Questions:
- `client/dist/assets/html_basic_questions.csv`
- `client/dist/assets/html_medium_questions.csv`
- `client/dist/assets/html_advanced_questions.csv`

### CSS Questions:
- `client/dist/assets/css_basic_questions.csv`
- `client/dist/assets/css_medium_questions.csv`
- `client/dist/assets/css_advanced_questions.csv`

### JavaScript Questions:
- `client/dist/assets/javascript_basic_questions.csv`
- `client/dist/assets/javascript_medium_questions.csv`
- `client/dist/assets/javascript_advanced_questions.csv`

### jQuery Questions:
- `client/dist/assets/jquery_basic_questions.csv`
- `client/dist/assets/jquery_medium_questions.csv`
- `client/dist/assets/jquery_advanced_questions.csv`

### OGL Questions:
- `client/dist/assets/ogl_basic_questions.csv`
- `client/dist/assets/ogl_medium_questions.csv`
- `client/dist/assets/ogl_advanced_questions.csv`

**IMPORTANT:** Add this header line at the top of each CSV file:
```
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
```

---

## 🚀 Upload All Questions

After saving all CSV files, run these batch files:

```bash
UPLOAD_ALL_HTML_LEVELS.bat
UPLOAD_ALL_CSS_LEVELS.bat
UPLOAD_ALL_JS_LEVELS.bat
UPLOAD_ALL_JQUERY_LEVELS.bat
UPLOAD_ALL_OGL_LEVELS.bat
```

Or use the master upload script (I'll create it for you).

---

## 📊 Expected Results

After uploading, you'll have:

| Skill | BASIC | MEDIUM | ADVANCED | Total |
|-------|-------|--------|----------|-------|
| HTML | 50 | 50 | 50 | 150 |
| CSS | 50 | 50 | 50 | 150 |
| JavaScript | 50 | 50 | 50 | 150 |
| jQuery | 50 | 50 | 50 | 150 |
| OGL | 50 | 50 | 50 | 150 |
| **TOTAL** | **250** | **250** | **250** | **750** |

---

## 💡 Pro Tips

### If ChatGPT Stops Mid-Generation:
Say: "Continue generating the remaining questions"

### If You Want More Questions:
Say: "Generate 30 more [SKILL] [LEVEL] questions in the same CSV format"

### If Questions Are Too Easy/Hard:
Say: "Make the [LEVEL] questions more challenging and realistic"

### If You Want Specific Topics:
Say: "Generate 20 CSS Flexbox questions at MEDIUM level in CSV format"

---

## ⚡ Quick Alternative: Generate One Skill at a Time

If the mega prompt is too large, use individual prompts from `QUICK_CHATGPT_COMMANDS.txt`
