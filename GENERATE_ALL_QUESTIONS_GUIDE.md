# 📚 Generate All Questions - Complete Guide

## Overview
Create CSV files with 10 questions for each language at 3 difficulty levels.

## 🎯 Requirements Per CSV File

### Structure:
- **10 questions** per file
- **3 levels**: beginner, intermediate, advanced
- **Learning resources**: MDN + 5 YouTube languages

### Columns:
1. skill
2. level
3. question_text
4. option_a, option_b, option_c, option_d
5. correct_answer (a, b, c, or d)
6. explanation
7. topic
8. mdn_link
9. youtube_english
10. youtube_hindi
11. youtube_kannada
12. youtube_tamil
13. youtube_telugu

## 📁 Files to Create (135 total)

### Web Development (21 files)
- HTML: beginner, intermediate, advanced
- CSS: beginner, intermediate, advanced
- JavaScript: ✅ beginner, ✅ intermediate, ✅ advanced
- TypeScript: beginner, intermediate, advanced
- React: beginner, intermediate, advanced
- Angular: beginner, intermediate, advanced
- Vue.js: beginner, intermediate, advanced

### Backend (24 files)
- Java: beginner, intermediate, advanced
- Python: ✅ beginner, intermediate, advanced
- Node.js: beginner, intermediate, advanced
- C#: beginner, intermediate, advanced
- PHP: beginner, intermediate, advanced
- Ruby: beginner, intermediate, advanced
- Go: beginner, intermediate, advanced
- Rust: beginner, intermediate, advanced

### Database (15 files)
- SQL: beginner, intermediate, advanced
- Oracle: beginner, intermediate, advanced
- PostgreSQL: beginner, intermediate, advanced
- MongoDB: beginner, intermediate, advanced
- Redis: beginner, intermediate, advanced

### Mobile (12 files)
- Kotlin: beginner, intermediate, advanced
- Swift: beginner, intermediate, advanced
- Flutter: beginner, intermediate, advanced
- React Native: beginner, intermediate, advanced

### DevOps & Cloud (27 files)
- Docker: beginner, intermediate, advanced
- Kubernetes: beginner, intermediate, advanced
- Linux: beginner, intermediate, advanced
- AWS: beginner, intermediate, advanced
- Azure: beginner, intermediate, advanced
- GCP: beginner, intermediate, advanced
- Terraform: beginner, intermediate, advanced
- Ansible: beginner, intermediate, advanced
- Git: beginner, intermediate, advanced

### Graphics & Game Dev (15 files)
- OpenGL: beginner, intermediate, advanced
- GLSL: beginner, intermediate, advanced
- C++: beginner, intermediate, advanced
- Unity: beginner, intermediate, advanced
- Unreal: beginner, intermediate, advanced

### DevTools (12 files)
- DevTools: beginner, intermediate, advanced
- Webpack: beginner, intermediate, advanced
- VS Code: beginner, intermediate, advanced
- Jest: beginner, intermediate, advanced

### Testing (9 files)
- Selenium: beginner, intermediate, advanced
- Cypress: beginner, intermediate, advanced
- Jest: beginner, intermediate, advanced

## 🤖 ChatGPT Prompt Template

```
Create a CSV file with 10 multiple-choice questions for [LANGUAGE] at [LEVEL] level.

Format:
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

Requirements:
1. 10 questions covering different topics
2. 4 options per question (a, b, c, d)
3. Clear explanations
4. Topic name for each question
5. documentation link (or official docs)
6. YouTube tutorial links in 5 languages:
   - English (international)
   - Hindi (हिंदी)
   - Kannada (ಕನ್ನಡ)
   - Tamil (தமிழ்)
   - Telugu (తెలుగు)

Example row:
javascript,beginner,What is JavaScript?,A programming language,A markup language,A database,A framework,a,JavaScript is a high-level programming language,JavaScript Basics,https://developer.mozilla.org/en-US/docs/Web/JavaScript,https://youtube.com/...,https://youtube.com/...,https://youtube.com/...,https://youtube.com/...,https://youtube.com/...

Generate for: [LANGUAGE] - [LEVEL]
```

## 📝 Quick Generation Commands

### For JavaScript (Already Done ✅):
- javascript-beginner.csv ✅
- javascript-intermediate.csv ✅
- javascript-advanced.csv ✅

### For Python (Partially Done):
- python-beginner.csv ✅
- python-intermediate.csv (need to create)
- python-advanced.csv (need to create)

### Priority Languages (Create Next):
1. HTML (3 files)
2. CSS (3 files)
3. React (3 files)
4. Node.js (3 files)
5. SQL (3 files)

## 🎥 Finding YouTube Videos

### Search Terms:
- English: "[Language] tutorial for beginners"
- Hindi: "[Language] tutorial in Hindi"
- Kannada: "[Language] tutorial in Kannada"
- Tamil: "[Language] tutorial in Tamil"
- Telugu: "[Language] tutorial in Telugu"

### Quality Channels:
- **English**: freeCodeCamp, Traversy Media, Programming with Mosh
- **Hindi**: CodeWithHarry, Apna College, Thapa Technical
- **Kannada**: Kannada Tech Guru, Kannada Programming
- **Tamil**: Tamil Programming, Tech Tamil
- **Telugu**: Telugu Tech, Telugu Programming

## 📊 Progress Tracker

### Completed: 6/135 (4.4%)
- ✅ javascript-beginner.csv
- ✅ javascript-intermediate.csv
- ✅ javascript-advanced.csv
- ✅ python-beginner.csv
- ⏳ python-intermediate.csv
- ⏳ python-advanced.csv

### Next Batch (15 files):
- HTML (3)
- CSS (3)
- React (3)
- Node.js (3)
- SQL (3)

## 🚀 Batch Creation Strategy

### Week 1: Core Web (21 files)
- HTML, CSS, JavaScript, TypeScript, React, Angular, Vue

### Week 2: Backend (24 files)
- Java, Python, Node.js, C#, PHP, Ruby, Go, Rust

### Week 3: Database & Mobile (27 files)
- SQL, Oracle, PostgreSQL, MongoDB, Redis
- Kotlin, Swift, Flutter, React Native

### Week 4: DevOps & Tools (63 files)
- Docker, Kubernetes, Linux, AWS, Azure, GCP
- Terraform, Ansible, Git, DevTools, Testing

## 💡 Tips for Quality Questions

### Beginner Level:
- Basic syntax
- Simple concepts
- Common operations
- Getting started topics

### Intermediate Level:
- Advanced features
- Best practices
- Common patterns
- Problem-solving

### Advanced Level:
- Complex concepts
- Performance optimization
- Architecture patterns
- Expert-level topics

## 📦 File Naming Convention

```
questions/[language]-[level].csv

Examples:
- questions/javascript-beginner.csv
- questions/python-intermediate.csv
- questions/react-advanced.csv
```

## ✅ Validation Checklist

Before uploading each CSV:
- [ ] Exactly 10 questions
- [ ] All 4 options filled
- [ ] Correct answer specified (a, b, c, or d)
- [ ] Explanation provided
- [ ] Topic name included
- [ ] MDN/docs link added
- [ ] All 5 YouTube links added
- [ ] No special characters breaking CSV format
- [ ] Commas in text properly escaped

## 🎊 Completion Goal

**Target**: 135 CSV files = 1,350 questions total

**Current**: 6 files = 60 questions (4.4% complete)

**Remaining**: 129 files = 1,290 questions

Keep going! 🚀
