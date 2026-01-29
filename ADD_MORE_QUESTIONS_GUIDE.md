# How to Add More Questions Using ChatGPT

## Method 1: Add to CSV (Recommended) ✅

### Step 1: Prepare ChatGPT Prompt

Copy this prompt to ChatGPT:

```
Generate 50 CSS BASIC level multiple choice questions in CSV format.

Format (one question per line):
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Example:
CSS,BASIC,Multiple Choice,What does CSS stand for?,Cascading Style Sheets,Computer Style Sheets,Creative Style Sheets,Colorful Style Sheets,Cascading Style Sheets,CSS stands for Cascading Style Sheets.

Requirements:
- skill: CSS
- level: BASIC (or MEDIUM, ADVANCED)
- type: Multiple Choice
- question: Clear question text
- option_a, option_b, option_c, option_d: Four answer choices
- correct_answer: The exact text of the correct option
- explanation: Brief explanation of why the answer is correct

Topics to cover:
- CSS selectors
- Box model (margin, padding, border)
- Positioning (static, relative, absolute, fixed)
- Display properties
- Flexbox basics
- Colors and backgrounds
- Typography
- CSS units (px, em, rem, %)
- Pseudo-classes and pseudo-elements
- CSS specificity

Generate 50 unique questions now.
```

### Step 2: Add to CSV File

1. Open `client/dist/assets/css_easy_questions.csv`
2. Copy the questions ChatGPT generated
3. Paste at the end of the file (after existing questions)
4. Save the file

### Step 3: Run Transformation Script

```bash
UPLOAD_CSS_QUESTIONS.bat
```

The script will:
- Read all questions (old + new)
- Remove duplicates automatically
- Generate unique question_ids
- Upload to Supabase

---

## Method 2: Add Directly to JSON (Advanced) ⚠️

### Step 1: Get Last Question ID

Open `css_easy_questions_transformed.json` and find the last question_id:
```json
"question_id": "css_basic_1769353214354_44"
```

Note the number at the end (44).

### Step 2: ChatGPT Prompt

```
Generate 50 CSS BASIC level questions in JSON format.

Start question_id numbering from: css_basic_1769353214354_45

Format for each question:
{
  "question_id": "css_basic_1769353214354_45",
  "skill": "CSS",
  "level": "BASIC",
  "type": "mcq",
  "question": "What does CSS stand for?",
  "options": [
    "Cascading Style Sheets",
    "Computer Style Sheets",
    "Creative Style Sheets",
    "Colorful Style Sheets"
  ],
  "correct_answer": "Cascading Style Sheets",
  "explanation": "CSS stands for Cascading Style Sheets."
}

Requirements:
- Increment question_id for each question (45, 46, 47, ...)
- type must be "mcq" (lowercase, not "Multiple Choice")
- options must be a JSON array with 4 items
- correct_answer must match one of the options exactly
- All fields are required

Generate 50 questions now.
```

### Step 3: Add to JSON File

1. Open `css_easy_questions_transformed.json`
2. Find the last question object (before the closing `]`)
3. Add a comma after the last `}`
4. Paste the new questions
5. Make sure the JSON is valid (use a JSON validator)
6. Save the file

### Step 4: Create Upload Script for JSON

Create a new script to upload the JSON directly:

```typescript
// scripts/upload-json-questions.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function uploadJSON() {
  const data = JSON.parse(
    fs.readFileSync('client/dist/assets/css_easy_questions_transformed.json', 'utf-8')
  );
  
  const { error } = await supabase.from('questions').insert(data);
  
  if (error) console.error('Error:', error);
  else console.log('✅ Uploaded', data.length, 'questions');
}

uploadJSON();
```

Run: `npx tsx scripts/upload-json-questions.ts`

---

## Method 3: Generate Different Question Types

### Fill in the Blank Questions

ChatGPT Prompt:
```
Generate 30 CSS fill-in-the-blank questions in CSV format:

skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
CSS,BASIC,Fill Blank,The _____ property is used to change text color.,color,font-color,text-color,style-color,color,The color property changes text color in CSS.

Requirements:
- Use _____ to indicate the blank
- Provide 4 possible answers
- Mark the correct answer
```

### Multi-Select Questions

ChatGPT Prompt:
```
Generate 20 CSS multi-select questions in CSV format:

skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
CSS,BASIC,Multi Select,Which are valid CSS units? (Select all that apply),px,em,%,meter,"px,em,%","px, em, and % are valid CSS units. 'meter' is not a CSS unit."

Requirements:
- Multiple correct answers separated by commas
- Clear indication that multiple answers are correct
```

---

## Tips for ChatGPT Question Generation

### 1. Be Specific About Difficulty
```
Generate BASIC level questions (for beginners)
Generate MEDIUM level questions (for intermediate developers)
Generate ADVANCED level questions (for experts)
```

### 2. Request Specific Topics
```
Generate 20 questions about CSS Flexbox
Generate 15 questions about CSS Grid
Generate 25 questions about CSS selectors
```

### 3. Avoid Duplicates
```
Generate questions that are different from these topics:
- background-color
- font-size
- margin/padding
```

### 4. Request Variety
```
Mix question types:
- 50% conceptual (what is X?)
- 30% practical (how to do X?)
- 20% debugging (what's wrong with this code?)
```

---

## Validation Checklist

Before uploading, verify:

- [ ] All questions have unique text
- [ ] correct_answer matches one of the options exactly
- [ ] No empty fields
- [ ] Proper CSV/JSON format
- [ ] question_id is unique (if JSON)
- [ ] type is "mcq" (if JSON) or "Multiple Choice" (if CSV)

---

## Recommended Workflow

1. **Start with CSV** - Easier to edit and review
2. **Generate 50-100 questions** at a time
3. **Review for quality** - Check for duplicates and errors
4. **Run transformation script** - Converts and uploads
5. **Verify in Supabase** - Check the questions table
6. **Repeat** - Add more questions as needed

---

## Example: Complete Workflow

```bash
# 1. Generate questions with ChatGPT
# 2. Add to css_easy_questions.csv
# 3. Run upload script
UPLOAD_CSS_QUESTIONS.bat

# 4. Verify upload
# Check Supabase dashboard → questions table

# 5. Generate more questions
# Repeat steps 1-4
```

---

## Need Help?

- CSV format issues? Check `question-template.csv`
- JSON format issues? Check `css_easy_questions_transformed.json`
- Upload errors? Check `.env` file for Supabase credentials
