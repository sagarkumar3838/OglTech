# ChatGPT Prompt: Regenerate CSV Questions with Randomized Answer Patterns

## Instructions for ChatGPT

I need you to generate 100 unique multiple-choice questions for **[SKILL_NAME]** at **[LEVEL]** level in CSV format.

### CRITICAL REQUIREMENTS:

1. **RANDOMIZE CORRECT ANSWER POSITION**: 
   - DO NOT make all correct answers "A"
   - Distribute correct answers randomly across A, B, C, D
   - Aim for roughly 25% each (A: ~25, B: ~25, C: ~25, D: ~25)
   - Users should NOT be able to detect any pattern

2. **CSV FORMAT** (MUST MATCH EXACTLY):
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
```

3. **FIELD REQUIREMENTS**:
   - `skill`: [SKILL_NAME] (e.g., "Java", "Angular", "Python")
   - `level`: [LEVEL] (must be "Basic", "Intermediate", or "Advanced")
   - `question_text`: Clear, specific question (20-150 characters)
   - `option_a`, `option_b`, `option_c`, `option_d`: ACTUAL answer choices (NOT topic names)
   - `correct_answer`: Single letter A, B, C, or D (RANDOMIZED!)
   - `explanation`: Why the answer is correct (50-200 characters)
   - `mdn_link`: Relevant documentation URL (use official docs)
   - `youtube_english`: https://youtube.com/results?search_query=[topic]+english
   - `youtube_hindi`: https://youtube.com/results?search_query=[topic]+hindi
   - `youtube_kannada`: https://youtube.com/results?search_query=[topic]+kannada
   - `youtube_tamil`: https://youtube.com/results?search_query=[topic]+tamil
   - `youtube_telugu`: https://youtube.com/results?search_query=[topic]+telugu

4. **QUESTION QUALITY**:
   - All questions must be UNIQUE (no duplicates)
   - Questions should test actual knowledge, not memorization
   - Options should be plausible (no obvious wrong answers)
   - Cover different topics within the skill
   - Mix question types: conceptual, practical, syntax, best practices

5. **WRONG ANSWER OPTIONS**:
   - Make them plausible but clearly incorrect
   - Avoid joke answers or obviously wrong choices
   - Test common misconceptions
   - Similar length to correct answer

### EXAMPLE (CORRECT FORMAT):

```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
Java,Basic,"Which component executes bytecode?","JRE","JDK","JVM","JAR",C,"JVM (Java Virtual Machine) executes bytecode",https://docs.oracle.com/javase/specs/jvms/se21/html/index.html,https://youtube.com/results?search_query=jvm+bytecode,https://youtube.com/results?search_query=jvm+hindi,https://youtube.com/results?search_query=jvm+kannada,https://youtube.com/results?search_query=jvm+tamil,https://youtube.com/results?search_query=jvm+telugu
Java,Basic,"What is the default value of boolean?","true","false","null","0",B,"Instance variables of type boolean default to false",https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html,https://youtube.com/results?search_query=java+boolean+default,https://youtube.com/results?search_query=boolean+default+hindi,https://youtube.com/results?search_query=boolean+default+kannada,https://youtube.com/results?search_query=boolean+default+tamil,https://youtube.com/results?search_query=boolean+default+telugu
Java,Basic,"Which keyword prevents inheritance?","static","abstract","final","private",C,"final keyword prevents class from being extended",https://docs.oracle.com/javase/tutorial/java/IandI/final.html,https://youtube.com/results?search_query=final+keyword+java,https://youtube.com/results?search_query=final+hindi,https://youtube.com/results?search_query=final+kannada,https://youtube.com/results?search_query=final+tamil,https://youtube.com/results?search_query=final+telugu
Java,Basic,"What does % operator return?","Quotient","Remainder","Division","Modulus value",B,"% returns remainder after division",https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html,https://youtube.com/results?search_query=modulus+operator,https://youtube.com/results?search_query=modulus+hindi,https://youtube.com/results?search_query=modulus+kannada,https://youtube.com/results?search_query=modulus+tamil,https://youtube.com/results?search_query=modulus+telugu
```

### WRONG FORMAT (DO NOT USE):

```csv
❌ WRONG - Options are topic names, not answers:
Java,Advanced,"How does VarHandle work?","Concurrency","VarHandle","CompareAndExchange","CAS",A,"Explanation",https://...

✅ CORRECT - Options are actual answer choices:
Java,Advanced,"How does VarHandle work?","Provides atomic operations","Manages threads","Handles exceptions","Compiles bytecode",A,"VarHandle provides low-level atomic operations",https://...
```

### ANSWER DISTRIBUTION EXAMPLE:

Out of 100 questions, aim for:
- Questions with answer A: ~25
- Questions with answer B: ~25
- Questions with answer C: ~25
- Questions with answer D: ~25

### TOPICS TO COVER FOR [SKILL_NAME] - [LEVEL]:

**For Basic Level:**
- Fundamentals and syntax
- Basic concepts and terminology
- Common commands/methods
- Simple use cases
- Installation and setup

**For Intermediate Level:**
- Advanced features
- Best practices
- Common patterns
- Performance considerations
- Integration with other tools

**For Advanced Level:**
- Architecture and internals
- Optimization techniques
- Edge cases and gotchas
- Advanced patterns
- Expert-level concepts

---

## NOW GENERATE:

Generate 100 unique questions for:
- **Skill**: [SKILL_NAME]
- **Level**: [LEVEL]

Remember:
1. ✅ Randomize correct answers (A, B, C, D)
2. ✅ Use actual answer choices in options
3. ✅ Make questions unique and valuable
4. ✅ Follow CSV format exactly
5. ✅ Include all required fields
6. ✅ No patterns in answer distribution

Start with the CSV header, then provide all 100 questions.
