# ChatGPT Prompts for Generating 25,000 Questions

## 🎯 Goal
Generate 25,000 questions for 8 OGL careers:
- **8 careers** × **3 levels** × **~1,042 questions per level** = **25,000 questions**

## 📊 Distribution Plan

| Career | BASIC | INTERMEDIATE | ADVANCED | Total |
|--------|-------|--------------|----------|-------|
| OGL Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL Tester | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL Frontend Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL Backend Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL DevOps Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL Cloud Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL QA Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| OGL Content Developer | 1,042 | 1,042 | 1,042 | 3,126 |
| **TOTAL** | | | | **25,008** |

---

## 🚀 Master Prompt Template

Use this template for each career/level combination:

```
I need you to generate 100 technical evaluation questions for [CAREER] at [LEVEL] level.

Career: [CAREER NAME]
Level: [BASIC/INTERMEDIATE/ADVANCED]
Skills to cover: [LIST OF SKILLS]

Level Guidelines:
- BASIC: Understanding concepts, reading code, identifying syntax, basic terminology
- INTERMEDIATE: Modifying code, debugging, applying concepts, problem-solving
- ADVANCED: Creating solutions from scratch, architecture, best practices, optimization

Output Format (CSV):
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Requirements:
1. All questions must be multiple choice (MCQ) with 4 options
2. Questions should be practical and real-world focused
3. Avoid trivial or overly theoretical questions
4. Include clear, detailed explanations
5. Ensure correct_answer matches exactly one of the options
6. Make questions progressively harder within the level
7. Cover all skills listed for this career
8. No duplicate questions

Generate 100 questions now in CSV format.
```

---

## 📝 Specific Prompts for Each Career

### 1. OGL Developer (Full-Stack)

**Skills:** HTML, CSS, JavaScript, TypeScript, React, Node.js

#### BASIC Level (1,042 questions)
```
I need you to generate 100 technical evaluation questions for OGL Developer at BASIC level.

Career: OGL Developer (Full-Stack)
Level: BASIC
Skills to cover: HTML, CSS, JavaScript, TypeScript, React, Node.js

Level Guidelines:
- Understanding HTML structure and semantic tags
- Basic CSS selectors and properties
- JavaScript fundamentals (variables, functions, loops)
- TypeScript basic types
- React component basics
- Node.js fundamentals

Output Format (CSV):
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Generate 100 questions covering all skills. Make them practical and suitable for entry-level developers.
```

**Repeat 10 times** with variations to get 1,000+ questions

#### INTERMEDIATE Level
```
I need you to generate 100 technical evaluation questions for OGL Developer at INTERMEDIATE level.

Career: OGL Developer (Full-Stack)
Level: INTERMEDIATE
Skills to cover: HTML, CSS, JavaScript, TypeScript, React, Node.js

Level Guidelines:
- HTML5 APIs and advanced features
- CSS Grid, Flexbox, animations
- JavaScript ES6+, async/await, promises
- TypeScript interfaces, generics
- React hooks, state management, lifecycle
- Node.js Express, middleware, REST APIs

Focus on: Debugging, modifying code, applying concepts, problem-solving

Generate 100 questions in CSV format.
```

#### ADVANCED Level
```
I need you to generate 100 technical evaluation questions for OGL Developer at ADVANCED level.

Career: OGL Developer (Full-Stack)
Level: ADVANCED
Skills to cover: HTML, CSS, JavaScript, TypeScript, React, Node.js

Level Guidelines:
- Performance optimization
- Security best practices
- Architecture patterns
- Scalability considerations
- Advanced TypeScript patterns
- React performance optimization
- Node.js clustering, streams

Focus on: System design, best practices, optimization, architecture

Generate 100 questions in CSV format.
```

---

### 2. OGL Tester

**Skills:** Testing Tools, JavaScript, TypeScript, HTML, CSS

```
I need you to generate 100 technical evaluation questions for OGL Tester at [LEVEL] level.

Career: OGL Tester
Level: [BASIC/INTERMEDIATE/ADVANCED]
Skills to cover: Testing Tools (Jest, Mocha, Selenium, Cypress), JavaScript, TypeScript, HTML, CSS

BASIC Level Focus:
- Testing fundamentals and terminology
- Basic test case writing
- Understanding test types (unit, integration, E2E)
- Basic JavaScript for testing
- HTML/CSS inspection

INTERMEDIATE Level Focus:
- Writing automated tests
- Test frameworks (Jest, Mocha)
- E2E testing with Selenium/Cypress
- Mocking and stubbing
- Test coverage

ADVANCED Level Focus:
- Test strategy and planning
- Performance testing
- Security testing
- CI/CD integration
- Test architecture

Generate 100 questions in CSV format.
```

---

### 3. OGL Frontend Developer

**Skills:** HTML, CSS, JavaScript, TypeScript, React, jQuery

```
I need you to generate 100 technical evaluation questions for OGL Frontend Developer at [LEVEL] level.

Career: OGL Frontend Developer
Level: [LEVEL]
Skills to cover: HTML, CSS, JavaScript, TypeScript, React, jQuery

BASIC Level Focus:
- HTML semantic elements
- CSS basics (selectors, box model, positioning)
- JavaScript DOM manipulation
- TypeScript basic types
- React JSX and components
- jQuery selectors and events

INTERMEDIATE Level Focus:
- Responsive design
- CSS preprocessors
- JavaScript ES6+ features
- TypeScript interfaces
- React hooks and state
- jQuery AJAX

ADVANCED Level Focus:
- CSS architecture (BEM, CSS-in-JS)
- JavaScript design patterns
- TypeScript advanced types
- React performance optimization
- Accessibility (WCAG)
- Progressive Web Apps

Generate 100 questions in CSV format.
```

---

### 4. OGL Backend Developer

**Skills:** JavaScript, TypeScript, Python, Java, Node.js

```
I need you to generate 100 technical evaluation questions for OGL Backend Developer at [LEVEL] level.

Career: OGL Backend Developer
Level: [LEVEL]
Skills to cover: JavaScript, TypeScript, Python, Java, Node.js

BASIC Level Focus:
- Server-side programming basics
- HTTP fundamentals
- Database basics (SQL)
- API concepts
- Node.js basics

INTERMEDIATE Level Focus:
- RESTful API design
- Authentication & authorization
- Database optimization
- Error handling
- Middleware patterns

ADVANCED Level Focus:
- Microservices architecture
- API security
- Database scaling
- Caching strategies
- Message queues

Generate 100 questions in CSV format.
```

---

### 5. OGL DevOps Developer

**Skills:** Cloud Platforms, Docker, Kubernetes, CI/CD, Python

```
I need you to generate 100 technical evaluation questions for OGL DevOps Developer at [LEVEL] level.

Career: OGL DevOps Developer
Level: [LEVEL]
Skills to cover: Cloud Platforms (AWS, Azure, GCP), Docker, Kubernetes, CI/CD, Python

BASIC Level Focus:
- DevOps fundamentals
- Basic Docker commands
- Cloud computing basics
- Version control (Git)
- Basic scripting

INTERMEDIATE Level Focus:
- Docker Compose
- Kubernetes basics
- CI/CD pipelines
- Infrastructure as Code
- Monitoring basics

ADVANCED Level Focus:
- Kubernetes orchestration
- Multi-cloud strategies
- Advanced CI/CD
- Security best practices
- Performance optimization

Generate 100 questions in CSV format.
```

---

### 6. OGL Cloud Developer

**Skills:** Cloud Platforms, JavaScript, Python, Serverless, Microservices

```
I need you to generate 100 technical evaluation questions for OGL Cloud Developer at [LEVEL] level.

Career: OGL Cloud Developer
Level: [LEVEL]
Skills to cover: Cloud Platforms (AWS, Azure, GCP), JavaScript, Python, Serverless, Microservices

BASIC Level Focus:
- Cloud computing concepts
- AWS/Azure/GCP basics
- Serverless fundamentals
- Cloud storage
- Basic networking

INTERMEDIATE Level Focus:
- Lambda/Functions
- API Gateway
- Cloud databases
- Event-driven architecture
- Cloud security basics

ADVANCED Level Focus:
- Multi-region deployment
- Cost optimization
- High availability
- Disaster recovery
- Cloud-native patterns

Generate 100 questions in CSV format.
```

---

### 7. OGL QA Developer

**Skills:** Testing Tools, TypeScript, JavaScript, Java, HTML, CSS

```
I need you to generate 100 technical evaluation questions for OGL QA Developer at [LEVEL] level.

Career: OGL QA Developer
Level: [LEVEL]
Skills to cover: Testing Tools, TypeScript, JavaScript, Java, HTML, CSS

BASIC Level Focus:
- QA fundamentals
- Test case design
- Bug reporting
- Basic automation
- Testing types

INTERMEDIATE Level Focus:
- Automated testing frameworks
- API testing
- Performance testing basics
- Test data management
- Continuous testing

ADVANCED Level Focus:
- Test automation architecture
- Performance engineering
- Security testing
- Test strategy
- Quality metrics

Generate 100 questions in CSV format.
```

---

### 8. OGL Content Developer

**Skills:** HTML, CSS, JavaScript, jQuery, OGL Knowledge

```
I need you to generate 100 technical evaluation questions for OGL Content Developer at [LEVEL] level.

Career: OGL Content Developer
Level: [LEVEL]
Skills to cover: HTML, CSS, JavaScript, jQuery, OGL Knowledge

BASIC Level Focus:
- HTML structure
- CSS styling basics
- JavaScript basics
- jQuery selectors
- Content management basics

INTERMEDIATE Level Focus:
- Responsive design
- CSS frameworks
- JavaScript DOM manipulation
- jQuery plugins
- SEO basics

ADVANCED Level Focus:
- Web accessibility
- Performance optimization
- Progressive enhancement
- Content strategy
- Analytics integration

Generate 100 questions in CSV format.
```

---

## 🔄 Batch Generation Strategy

### Phase 1: Generate in Batches of 100
```
For each career (8 careers):
  For each level (3 levels):
    Generate 10 batches of 100 questions = 1,000 questions
    Plus 1 batch of 42 questions = 1,042 questions per level
```

### Phase 2: Combine CSV Files
```bash
# Combine all CSV files
cat career1-basic.csv career1-intermediate.csv career1-advanced.csv > career1-all.csv
```

### Phase 3: Upload to Supabase
```bash
npx tsx scripts/upload-csv-to-supabase.ts all-questions-25000.csv
```

---

## 📋 Quality Control Prompts

### After generating 100 questions, use this to review:

```
Review the 100 questions you just generated and:
1. Remove any duplicate questions
2. Ensure all correct_answer values match exactly one option
3. Verify explanations are clear and detailed
4. Check that difficulty matches the level
5. Ensure good distribution across all skills

Output the corrected CSV.
```

---

## 🎯 Pro Tips for ChatGPT

1. **Generate in batches of 100** - Easier to manage and review
2. **Vary the prompts** - Add "Focus on [specific skill]" to get variety
3. **Request different question types** - "Focus on scenario-based questions"
4. **Ask for edge cases** - "Include questions about common mistakes"
5. **Request practical examples** - "Include real-world scenarios"

---

## 📊 Tracking Progress

Create a spreadsheet to track:

| Career | Level | Batch | Questions | Status | File |
|--------|-------|-------|-----------|--------|------|
| OGL Developer | BASIC | 1 | 100 | ✅ Done | dev-basic-1.csv |
| OGL Developer | BASIC | 2 | 100 | ⏳ In Progress | dev-basic-2.csv |

---

## 🚀 Quick Start

1. **Copy prompt for Career 1, Level BASIC**
2. **Paste into ChatGPT**
3. **Save output as CSV file**
4. **Repeat 10 times** (varying the prompt slightly)
5. **Move to next level**
6. **Repeat for all 8 careers**

---

## ✅ Final Checklist

- [ ] Generated 1,042 questions × 3 levels × 8 careers = 25,008 questions
- [ ] All questions in CSV format
- [ ] Combined into single CSV file
- [ ] Validated CSV format
- [ ] Uploaded to Supabase
- [ ] Verified in database

---

**With these prompts, you can generate 25,000 high-quality questions!** 🎉
