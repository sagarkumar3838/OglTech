# Complete CSV Regeneration Guide - All 54 Files

## Overview

This guide provides ready-to-use prompts for regenerating all 54 CSV files with wrong structure. Each prompt is customized with the skill name and existing question topics from the current CSV.

## How to Use This Guide

1. Find your skill in the list below
2. Copy the ENTIRE prompt (including the existing questions context)
3. Paste into ChatGPT or Grok
4. Copy the generated CSV output
5. Save to `questions/[filename].csv`
6. Verify and upload

---

## ANGULAR (3 files)

### 1. Angular Beginner

**File:** `questions/angular-beginner.csv`

**Current Topics in CSV:**
- What is Angular?
- Components and decorators
- Data binding
- Directives
- Services
- Modules
- Routing
- Forms

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Angular at Basic level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER (from existing questions):
- What is Angular and its purpose
- Components and @Component decorator
- Data binding (interpolation, property, event, two-way)
- Directives (structural and attribute)
- Services and dependency injection
- NgModules and their purpose
- Routing and navigation
- Template-driven and reactive forms
- Angular CLI commands
- Component lifecycle hooks
- Pipes and transformations
- HTTP client and API calls

EXAMPLE FORMAT (CORRECT):
Angular,Basic,"What is Angular?","JavaScript library","TypeScript framework","CSS preprocessor","Database system",B,"Angular is a TypeScript-based web framework",https://angular.io/docs,https://youtube.com/results?search_query=angular+basics,https://youtube.com/results?search_query=angular+hindi,https://youtube.com/results?search_query=angular+kannada,https://youtube.com/results?search_query=angular+tamil,https://youtube.com/results?search_query=angular+telugu

WRONG FORMAT (AVOID):
Angular,Basic,"What is Angular?","Framework","Library","Tool","Platform",A,"Angular is a framework",https://...

Generate 100 questions now. Ensure correct answers are randomized (A: ~25, B: ~25, C: ~25, D: ~25).
```

---

### 2. Angular Intermediate

**File:** `questions/angular-intermediate.csv`

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Angular at Intermediate level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
- Advanced component communication
- RxJS operators and observables
- State management patterns
- Change detection strategies
- Custom directives and pipes
- Route guards and resolvers
- Lazy loading modules
- HTTP interceptors
- Form validation techniques
- Angular animations
- Content projection (ng-content)
- ViewChild and ContentChild
- Dynamic components

Generate 100 questions now. Ensure correct answers are randomized.
```

---

### 3. Angular Advanced

**File:** `questions/angular-advanced.csv`

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Angular at Advanced level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
- Change detection internals (OnPush, NgZone)
- AOT vs JIT compilation
- Tree shaking and optimization
- Custom decorators
- Advanced RxJS patterns
- Server-side rendering (Angular Universal)
- Web workers
- Service workers and PWA
- Micro-frontends with Angular
- Performance optimization techniques
- Memory leak prevention
- Advanced routing strategies
- Custom form controls (ControlValueAccessor)

Generate 100 questions now. Ensure correct answers are randomized.
```

---

## JAVA (3 files)

### 4. Java Beginner

**File:** `questions/java-beginner.csv`

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Java at Basic level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
- JVM, JRE, JDK differences
- Compilation and execution (javac, java commands)
- Data types and variables
- Operators (arithmetic, logical, bitwise)
- Control flow (if, switch, loops)
- Arrays and strings
- Methods and parameters
- Classes and objects basics
- Access modifiers (public, private, protected, default)
- Constructors
- this and super keywords
- Inheritance basics
- Method overloading
- Exception handling basics (try-catch)
- Collections basics (ArrayList, HashMap)

Generate 100 questions now. Ensure correct answers are randomized.
```

---

### 5. Java Intermediate

**File:** `questions/java-intermediate.csv`

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Java at Intermediate level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
- Interfaces and abstract classes
- Polymorphism and method overriding
- Collections framework (List, Set, Map)
- Generics
- Lambda expressions
- Stream API
- File I/O operations
- Multithreading basics (Thread, Runnable)
- Synchronization
- Exception handling (custom exceptions, throws)
- Annotations
- Enums
- Inner classes
- Reflection basics
- JDBC basics

Generate 100 questions now. Ensure correct answers are randomized.
```

---

### 6. Java Advanced

**File:** `questions/java-advanced.csv`

**PROMPT TO USE:**

```
Generate 100 unique multiple-choice questions for Java at Advanced level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
- Garbage collection algorithms (G1GC, CMS, ZGC)
- JVM internals and memory model
- Module system (JPMS/Jigsaw)
- CompletableFuture and async programming
- VarHandle and atomic operations
- ClassLoader hierarchy
- Reflection and dynamic proxies
- Concurrency utilities (ExecutorService, ForkJoinPool)
- Lock-free algorithms
- Memory leaks and profiling
- JIT compilation
- Method handles
- Weak/Soft/Phantom references
- Performance tuning
- Records and sealed classes (Java 14+)

Generate 100 questions now. Ensure correct answers are randomized.
```

---

## QUICK REFERENCE: All 54 Files

I'll create individual prompts for each. Here's the complete list:

### AWS (3 files)
- aws-beginner.csv
- aws-intermediate.csv
- aws-advanced.csv

### Azure (3 files)
- azure-beginner.csv
- azure-intermediate.csv
- azure-advanced.csv

### Ansible (3 files)
- ansible-beginner.csv
- ansible-intermediate.csv
- ansible-advanced.csv

### C++ (3 files)
- cpp-beginner.csv
- cpp-intermediate.csv
- cpp-advanced.csv

### C# (2 files)
- csharp-beginner.csv
- csharp-advanced.csv

### CSS (2 files)
- css-beginner.csv
- css-advanced.csv

### Cypress (2 files)
- cypress-advanced.csv
- cypress-intermediate.csv

### DevTools (3 files)
- devtools-beginner.csv
- devtools-intermediate.csv
- devtools-advanced.csv

### Docker (2 files)
- docker-advanced.csv
- docker-intermediate.csv

### Flutter (3 files)
- flutter-beginner.csv
- flutter-intermediate.csv
- flutter-advanced.csv

### GCP (1 file)
- gcp-advanced.csv

### Git (3 files)
- git-beginner.csv
- git-intermediate.csv
- git-advanced.csv

### GLSL (3 files)
- glsl-beginner.csv
- glsl-intermediate.csv
- glsl-advanced.csv

### Go (2 files)
- go-advanced.csv
- go-intermediate.csv

### HTML (3 files)
- html-beginner.csv
- html-intermediate.csv
- html-advanced.csv

### JavaScript (1 file)
- javascript-advanced.csv

### Jest (2 files)
- jest-advanced.csv
- jest-intermediate.csv

### Kubernetes (2 files)
- kubernetes-advanced.csv
- kubernetes-intermediate.csv

### MongoDB (2 files)
- mongodb-advanced.csv
- mongodb-intermediate.csv

### Node.js (1 file)
- nodejs-intermediate.csv

### PHP (1 file)
- php-intermediate.csv

### Python (1 file)
- python-intermediate.csv

---

## Next Steps

1. Use the prompts above for Angular and Java (6 files done)
2. For remaining 48 files, I'll create a separate document with all prompts
3. Or use the template below to create your own prompts

## Template for Creating Your Own Prompts

```
Generate 100 unique multiple-choice questions for [SKILL_NAME] at [LEVEL] level in CSV format.

CRITICAL REQUIREMENTS:
1. RANDOMIZE correct answers across A, B, C, D (roughly 25% each)
2. Use ACTUAL answer choices in options (NOT topic names)
3. Follow this EXACT CSV format:

skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

TOPICS TO COVER:
[List 10-15 topics relevant to the skill and level]

Generate 100 questions now. Ensure correct answers are randomized.
```

Replace:
- `[SKILL_NAME]` with: AWS, Azure, Docker, etc.
- `[LEVEL]` with: Basic, Intermediate, or Advanced
- `[List topics]` with relevant topics for that skill/level
