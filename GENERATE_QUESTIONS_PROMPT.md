# ChatGPT Prompt Generator - Add Questions

## How to Use

1. Choose your skill and level below
2. Copy the generated prompt
3. Paste into ChatGPT
4. Get 50 questions in CSV format
5. Save as `questions/{skill}-{level}.csv`
6. Upload to Supabase

---

## Universal Prompt Template

```
Generate 50 multiple-choice questions for {SKILL} at {LEVEL} level.

Requirements:
- Format: CSV with these exact columns: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
- Skill: {SKILL}
- Level: {LEVEL}
- Difficulty: {DIFFICULTY_DESCRIPTION}
- Each question must have 4 options (A, B, C, D)
- Correct answer must be A, B, C, or D
- Include brief explanation for each answer
- Add relevant topic for each question
- Include MDN documentation link (if applicable)
- Include YouTube search URLs for each language

Level Guidelines:
- Basic: Fundamental concepts, syntax, basic usage
- Intermediate: Practical applications, common patterns, best practices
- Advanced: Complex scenarios, optimization, architecture, edge cases

CSV Format Example:
{SKILL},{LEVEL},What is a variable?,A storage location,A function,A loop,A class,A,Variables store data values in memory,Variables,https://developer.mozilla.org/...,https://youtube.com/results?search_query={skill}+variables,https://youtube.com/results?search_query={skill}+variables+hindi,https://youtube.com/results?search_query={skill}+variables+kannada,https://youtube.com/results?search_query={skill}+variables+tamil,https://youtube.com/results?search_query={skill}+variables+telugu

Important:
- NO quotes around any field
- NO commas in question text or options
- NO line breaks within fields
- Start directly with CSV data (no headers needed if adding to existing file)
```

---

## Quick Prompts by Skill & Level

### Example 1: JavaScript - Basic
```
Generate 50 multiple-choice questions for JavaScript at Basic level.

Requirements:
- Format: CSV with columns: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
- Skill: JavaScript
- Level: Basic
- Difficulty: Fundamental concepts like variables, data types, operators, basic functions, conditionals, loops
- Each question must have 4 options (A, B, C, D)
- Correct answer must be A, B, C, or D
- Include brief explanation
- Add relevant topic
- Include MDN link and YouTube search URLs

Start directly with CSV data.
```

### Example 2: React - Intermediate
```
Generate 50 multiple-choice questions for React at Intermediate level.

Requirements:
- Format: CSV with columns: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
- Skill: React
- Level: Intermediate
- Difficulty: Hooks, state management, component lifecycle, props, context API, common patterns
- Each question must have 4 options (A, B, C, D)
- Correct answer must be A, B, C, or D
- Include brief explanation
- Add relevant topic
- Include documentation link and YouTube search URLs

Start directly with CSV data.
```

### Example 3: Python - Advanced
```
Generate 50 multiple-choice questions for Python at Advanced level.

Requirements:
- Format: CSV with columns: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
- Skill: Python
- Level: Advanced
- Difficulty: Decorators, generators, metaclasses, async/await, performance optimization, design patterns
- Each question must have 4 options (A, B, C, D)
- Correct answer must be A, B, C, or D
- Include brief explanation
- Add relevant topic
- Include documentation link and YouTube search URLs

Start directly with CSV data.
```

---

## Fill-in Template

Replace {SKILL}, {LEVEL}, and {TOPICS} with your values:

```
Generate 50 multiple-choice questions for {SKILL} at {LEVEL} level.

Requirements:
- Format: CSV with columns: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
- Skill: {SKILL}
- Level: {LEVEL}
- Difficulty: {TOPICS - e.g., "basics, syntax, core concepts" OR "advanced patterns, optimization, architecture"}
- Each question must have 4 options (A, B, C, D)
- Correct answer must be A, B, C, or D
- Include brief explanation
- Add relevant topic
- Include documentation link and YouTube search URLs

Start directly with CSV data.
```

---

## After Getting Questions

1. Save the output as: `questions/{skill}-{level}.csv`
   - Example: `questions/javascript-basic.csv`
   - Example: `questions/react-intermediate.csv`

2. Verify the format:
   - 16 columns per row
   - No quotes
   - No extra commas

3. Upload using your existing upload script

---

## Skills You Can Generate For

Angular, Ansible, AWS, Azure, C++, C#, CSS, Cypress, Devtools, Docker, Flutter, GCP, Git, GLSL, Go, HTML, Java, JavaScript, Jest, Kubernetes, Kotlin, Linux, MongoDB, Node.js, OpenGL, Oracle, PHP, PostgreSQL, Python, React, React Native, Redis, Ruby, Rust, Selenium, SQL, Swift, Terraform, TypeScript, Unity, Unreal, Vue, Webpack, VS Code

## Levels

- Basic (beginner-friendly, fundamentals)
- Intermediate (practical applications, common patterns)
- Advanced (complex scenarios, optimization, architecture)
