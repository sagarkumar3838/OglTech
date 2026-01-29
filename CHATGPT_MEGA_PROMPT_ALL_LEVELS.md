# ChatGPT Mega Prompt - Generate Questions for All 3 Levels

## 🚀 Super Easy Method - One Command to ChatGPT

Copy this ENTIRE prompt to ChatGPT and it will generate questions for all three levels:

---

## MEGA PROMPT FOR CHATGPT:

```
I need you to generate CSS questions for a skill evaluation platform. Generate questions in CSV format for THREE difficulty levels: BASIC, MEDIUM, and ADVANCED.

**CSV FORMAT (IMPORTANT):**
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

**REQUIREMENTS:**
- skill: CSS
- level: BASIC, MEDIUM, or ADVANCED
- type: Multiple Choice
- question: Clear, concise question
- option_a, option_b, option_c, option_d: Four distinct answer choices
- correct_answer: Exact text of the correct option
- explanation: Brief explanation (1-2 sentences)

---

**LEVEL 1: BASIC (50 questions)**
Topics: CSS fundamentals for beginners
- What is CSS, basic syntax
- Selectors (element, class, id)
- Colors (hex, rgb, named colors)
- Text properties (color, font-size, font-family, font-weight)
- Background properties (background-color, background-image)
- Box model basics (margin, padding, border, width, height)
- Display property (block, inline, none)
- Text alignment and decoration
- Basic positioning concepts
- Common CSS properties

Generate 50 BASIC level questions now.

---

**LEVEL 2: MEDIUM (50 questions)**
Topics: Intermediate CSS for developers with some experience
- Advanced selectors (pseudo-classes, pseudo-elements, attribute selectors)
- Flexbox (display: flex, justify-content, align-items, flex-direction)
- CSS Grid basics (display: grid, grid-template-columns, grid-gap)
- Positioning (relative, absolute, fixed, sticky)
- Z-index and stacking context
- CSS transitions and basic animations
- Media queries and responsive design
- CSS units (em, rem, vh, vw, %)
- Box-sizing property
- Overflow and scrolling
- Transform property
- CSS specificity and cascade

Generate 50 MEDIUM level questions now.

---

**LEVEL 3: ADVANCED (50 questions)**
Topics: Advanced CSS for expert developers
- Complex CSS Grid layouts
- Advanced Flexbox patterns
- CSS custom properties (variables)
- Advanced animations and keyframes
- CSS architecture (BEM, SMACSS)
- Performance optimization
- CSS preprocessors concepts (Sass, Less)
- Advanced pseudo-selectors (:nth-child, :not, :has)
- CSS containment and isolation
- Clipping and masking
- CSS filters and blend modes
- Advanced responsive design patterns
- CSS-in-JS concepts
- Modern CSS features (container queries, aspect-ratio)

Generate 50 ADVANCED level questions now.

---

**OUTPUT FORMAT:**
Please output each level separately with a clear header:

### BASIC LEVEL QUESTIONS
[50 questions in CSV format]

### MEDIUM LEVEL QUESTIONS
[50 questions in CSV format]

### ADVANCED LEVEL QUESTIONS
[50 questions in CSV format]

Start generating now!
```

---

## 📋 What to Do After ChatGPT Responds:

### Step 1: Copy BASIC Questions
1. Copy all BASIC level questions from ChatGPT
2. Create file: `client/dist/assets/css_basic_questions.csv`
3. Paste the questions
4. Add CSV header at top:
   ```
   skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
   ```

### Step 2: Copy MEDIUM Questions
1. Copy all MEDIUM level questions from ChatGPT
2. Create file: `client/dist/assets/css_medium_questions.csv`
3. Paste the questions
4. Add CSV header at top

### Step 3: Copy ADVANCED Questions
1. Copy all ADVANCED level questions from ChatGPT
2. Create file: `client/dist/assets/css_advanced_questions.csv`
3. Paste the questions
4. Add CSV header at top

### Step 4: Upload All Levels
Run the batch file (I'll create it for you):
```bash
UPLOAD_ALL_CSS_LEVELS.bat
```

This will upload all 150 questions (50 per level) to Supabase!

---

## 🎯 Alternative: Generate One Level at a Time

If ChatGPT's response is too long, use these individual prompts:

### BASIC Level Only:
```
Generate 50 CSS BASIC level multiple choice questions in CSV format.

Format:
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Topics: CSS fundamentals, basic selectors, colors, text properties, box model basics, display property, simple positioning.

Requirements:
- skill: CSS
- level: BASIC
- type: Multiple Choice
- 4 options per question
- Include explanation

Generate now!
```

### MEDIUM Level Only:
```
Generate 50 CSS MEDIUM level multiple choice questions in CSV format.

Format:
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Topics: Flexbox, CSS Grid basics, advanced selectors, positioning, transitions, media queries, responsive design, CSS units.

Requirements:
- skill: CSS
- level: MEDIUM
- type: Multiple Choice
- 4 options per question
- Include explanation

Generate now!
```

### ADVANCED Level Only:
```
Generate 50 CSS ADVANCED level multiple choice questions in CSV format.

Format:
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Topics: Advanced Grid/Flexbox, CSS variables, complex animations, CSS architecture, performance, modern CSS features, advanced selectors.

Requirements:
- skill: CSS
- level: ADVANCED
- type: Multiple Choice
- 4 options per question
- Include explanation

Generate now!
```

---

## 💡 Pro Tips:

### 1. Generate in Batches
If ChatGPT stops mid-generation, say:
```
Continue generating the remaining questions
```

### 2. Request More Variety
```
Make questions more diverse - include:
- 40% conceptual questions (What is X?)
- 40% practical questions (How to do X?)
- 20% code-based questions (What does this CSS do?)
```

### 3. Avoid Duplicates
```
Generate questions that don't overlap with these topics:
[list topics you already have]
```

### 4. Request Specific Topics
```
Generate 20 questions specifically about CSS Flexbox at MEDIUM level
```

---

## 🔥 Super Fast Method (All Skills, All Levels)

Want questions for HTML, CSS, JavaScript, etc.? Use this:

```
Generate questions for a technical evaluation platform.

**SKILLS:** HTML, CSS, JavaScript
**LEVELS:** BASIC, MEDIUM, ADVANCED (50 questions each)
**FORMAT:** CSV

skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Generate questions for:
1. HTML - BASIC (50)
2. HTML - MEDIUM (50)
3. HTML - ADVANCED (50)
4. CSS - BASIC (50)
5. CSS - MEDIUM (50)
6. CSS - ADVANCED (50)
7. JavaScript - BASIC (50)
8. JavaScript - MEDIUM (50)
9. JavaScript - ADVANCED (50)

Total: 450 questions

Start with HTML BASIC and continue through all levels and skills.
```

---

## 📊 Expected Output:

After running the mega prompt, you'll get:

```csv
CSS,BASIC,Multiple Choice,What does CSS stand for?,Cascading Style Sheets,Computer Style Sheets,Creative Style Sheets,Colorful Style Sheets,Cascading Style Sheets,CSS stands for Cascading Style Sheets.
CSS,BASIC,Multiple Choice,Which property changes text color?,color,font-color,text-color,text-style,color,The color property is used to change text color in CSS.
...
CSS,MEDIUM,Multiple Choice,What does justify-content do in Flexbox?,Aligns items along main axis,Aligns items along cross axis,Changes flex direction,Sets flex wrap,Aligns items along main axis,justify-content aligns flex items along the main axis.
...
CSS,ADVANCED,Multiple Choice,What is CSS containment?,Performance optimization technique,Layout method,Selector type,Animation property,Performance optimization technique,CSS containment improves rendering performance by isolating elements.
```

---

## ✅ Verification Checklist:

Before uploading, check:
- [ ] All questions have the CSV header
- [ ] correct_answer matches one of the four options exactly
- [ ] No empty fields
- [ ] Level is spelled correctly (BASIC, MEDIUM, ADVANCED)
- [ ] Type is "Multiple Choice"
- [ ] Skill is "CSS"

---

## 🚀 Ready to Upload?

Once you have your CSV files, run:
```bash
UPLOAD_ALL_CSS_LEVELS.bat
```

Or upload individually:
```bash
UPLOAD_CSS_BASIC.bat
UPLOAD_CSS_MEDIUM.bat
UPLOAD_CSS_ADVANCED.bat
```
