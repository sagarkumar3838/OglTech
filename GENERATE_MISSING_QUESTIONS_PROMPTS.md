# ChatGPT Prompts to Generate Missing Questions

## Instructions
1. Run `CHECK_ALL_SKILLS_COMPLETE_STATUS.sql` to identify which skills need questions
2. Use the appropriate prompt below for each skill
3. Copy the output to a CSV file in the `questions/` folder
4. Run the upload script

## Universal Prompt Template

```
Generate [NUMBER] [LEVEL] level multiple-choice questions for [SKILL].

Requirements:
- Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
- skill: "[SKILL]" (lowercase)
- level: "[LEVEL]" (beginner/intermediate/advanced)
- correct_answer: Must be exactly "A", "B", "C", or "D"
- Questions should be practical, real-world scenarios
- Explanations should be clear and educational
- No duplicate questions
- Escape any commas in text with quotes

Example format:
skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
[SKILL],[LEVEL],"What is...?","Option A","Option B","Option C","Option D","A","Explanation here"
```

## Specific Prompts for Deficient Skills

### Swift (Needs: 35 beginner, 40 intermediate)

**Beginner:**
```
Generate 35 beginner level multiple-choice questions for Swift programming.

Focus on:
- Basic syntax and data types
- Variables and constants (var vs let)
- Optionals and optional binding
- Basic control flow (if, switch, loops)
- Functions and closures basics
- Arrays and dictionaries
- String manipulation
- Basic error handling

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "swift" (lowercase)
level: "beginner"
correct_answer: Must be "A", "B", "C", or "D"
```

**Intermediate:**
```
Generate 40 intermediate level multiple-choice questions for Swift programming.

Focus on:
- Protocols and protocol-oriented programming
- Generics
- Advanced closures and higher-order functions
- Memory management (ARC, weak/strong references)
- Error handling patterns
- Extensions and protocol extensions
- Enumerations with associated values
- Property observers and computed properties
- SwiftUI basics

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "swift" (lowercase)
level: "intermediate"
correct_answer: Must be "A", "B", "C", or "D"
```

### Rust (Needs: 35 advanced)

```
Generate 35 advanced level multiple-choice questions for Rust programming.

Focus on:
- Advanced ownership and borrowing patterns
- Lifetime annotations and elision rules
- Unsafe Rust and FFI
- Advanced trait implementations
- Macro programming (declarative and procedural)
- Async/await and futures
- Performance optimization techniques
- Concurrency patterns (Arc, Mutex, channels)
- Zero-cost abstractions
- Advanced type system features

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "rust" (lowercase)
level: "advanced"
correct_answer: Must be "A", "B", "C", or "D"
```

### Selenium (Needs: 30 intermediate)

```
Generate 30 intermediate level multiple-choice questions for Selenium WebDriver.

Focus on:
- Page Object Model patterns
- Explicit and implicit waits
- Handling dynamic elements
- Working with iframes and windows
- JavaScript executor usage
- TestNG/JUnit integration
- Data-driven testing
- Cross-browser testing strategies
- Handling alerts and popups
- Screenshot and reporting

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "selenium" (lowercase)
level: "intermediate"
correct_answer: Must be "A", "B", "C", or "D"
```

### TypeScript (Needs: 15 mixed levels - 5 each)

**Beginner (5 more):**
```
Generate 5 beginner level multiple-choice questions for TypeScript.

Focus on:
- Basic type annotations
- Interfaces vs types
- Type inference
- Union types
- Basic generics

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "typescript" (lowercase)
level: "beginner"
```

**Intermediate (5 more):**
```
Generate 5 intermediate level multiple-choice questions for TypeScript.

Focus on:
- Advanced generics
- Conditional types
- Mapped types
- Utility types
- Type guards

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "typescript" (lowercase)
level: "intermediate"
```

**Advanced (5 more):**
```
Generate 5 advanced level multiple-choice questions for TypeScript.

Focus on:
- Template literal types
- Recursive types
- Variance and covariance
- Advanced type inference
- Compiler API

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "typescript" (lowercase)
level: "advanced"
```

### Unity (Needs: 10 mixed - 3-4 each level)

```
Generate 10 Unity game development questions (3 beginner, 4 intermediate, 3 advanced).

Beginner topics:
- GameObjects and Components
- Transform operations
- Basic scripting (MonoBehaviour)

Intermediate topics:
- Physics and collisions
- Coroutines
- ScriptableObjects
- Animation system

Advanced topics:
- Custom editors
- Shader programming
- Performance optimization

Format: CSV with columns: skill,level,question,option_a,option_b,option_c,option_d,correct_answer,explanation
skill: "unity" (lowercase)
level: "beginner"/"intermediate"/"advanced"
```

## After Generation

1. Save each output as `questions/[skill]-[level].csv`
2. Verify CSV format is correct
3. Run: `UPLOAD_ALL_MISSING_QUESTIONS.bat`
4. Verify with: `CHECK_ALL_SKILLS_COMPLETE_STATUS.sql`

## Quality Checklist

- [ ] All questions are unique and non-duplicate
- [ ] correct_answer is exactly "A", "B", "C", or "D"
- [ ] skill name is lowercase
- [ ] level is "beginner", "intermediate", or "advanced"
- [ ] Explanations are clear and educational
- [ ] CSV format is valid (proper escaping)
- [ ] Questions are practical and relevant
