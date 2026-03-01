# Grok Prompt: Regenerate CSV Questions with Randomized Answer Patterns

## Instructions for Grok

Generate 100 unique multiple-choice questions for **[SKILL_NAME]** at **[LEVEL]** level in CSV format.

### CRITICAL REQUIREMENTS:

1. **RANDOMIZE CORRECT ANSWER POSITION**: 
   - Distribute correct answers randomly: A (~25%), B (~25%), C (~25%), D (~25%)
   - NO PATTERNS - users should not be able to guess
   - Mix it up naturally throughout the list

2. **CSV FORMAT** (EXACT STRUCTURE):
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
```

3. **FIELD SPECIFICATIONS**:
   - `skill`: [SKILL_NAME] (capitalize properly: "Java", "Angular", "Python")
   - `level`: Must be exactly "Basic", "Intermediate", or "Advanced"
   - `question_text`: Clear question (20-150 chars, use quotes if contains commas)
   - `option_a`, `option_b`, `option_c`, `option_d`: Real answer choices (NOT topic names!)
   - `correct_answer`: Single letter A, B, C, or D (RANDOMIZED DISTRIBUTION!)
   - `explanation`: Brief reason why answer is correct (50-200 chars)
   - `mdn_link`: Official documentation URL
   - `youtube_*`: Search URLs for different languages

4. **QUESTION QUALITY STANDARDS**:
   - 100% unique questions (zero duplicates)
   - Test understanding, not just memorization
   - All options must be plausible
   - Cover diverse topics within the skill
   - Mix: concepts, syntax, best practices, real-world scenarios

5. **DISTRACTOR OPTIONS** (Wrong Answers):
   - Make them believable but incorrect
   - Test common misconceptions
   - Similar complexity to correct answer
   - No joke answers or obviously wrong choices

### CORRECT EXAMPLE:

```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
Angular,Basic,"What is Angular?","JavaScript library","TypeScript framework","CSS preprocessor","Database system",B,"Angular is a TypeScript-based web framework",https://angular.io/docs,https://youtube.com/results?search_query=angular+basics,https://youtube.com/results?search_query=angular+hindi,https://youtube.com/results?search_query=angular+kannada,https://youtube.com/results?search_query=angular+tamil,https://youtube.com/results?search_query=angular+telugu
Angular,Basic,"Which decorator defines a component?","@Component","@Directive","@NgModule","@Injectable",A,"@Component decorator marks a class as Angular component",https://angular.io/api/core/Component,https://youtube.com/results?search_query=angular+component+decorator,https://youtube.com/results?search_query=component+decorator+hindi,https://youtube.com/results?search_query=component+decorator+kannada,https://youtube.com/results?search_query=component+decorator+tamil,https://youtube.com/results?search_query=component+decorator+telugu
Angular,Basic,"What is data binding?","Connecting data to DOM","Routing mechanism","HTTP service","Form validation",A,"Data binding synchronizes data between component and view",https://angular.io/guide/binding-syntax,https://youtube.com/results?search_query=angular+data+binding,https://youtube.com/results?search_query=data+binding+hindi,https://youtube.com/results?search_query=data+binding+kannada,https://youtube.com/results?search_query=data+binding+tamil,https://youtube.com/results?search_query=data+binding+telugu
Angular,Basic,"Which file bootstraps Angular app?","app.component.ts","main.ts","index.html","angular.json",B,"main.ts is the entry point that bootstraps the application",https://angular.io/guide/bootstrapping,https://youtube.com/results?search_query=angular+bootstrap,https://youtube.com/results?search_query=angular+bootstrap+hindi,https://youtube.com/results?search_query=angular+bootstrap+kannada,https://youtube.com/results?search_query=angular+bootstrap+tamil,https://youtube.com/results?search_query=angular+bootstrap+telugu
```

### WRONG FORMAT (AVOID):

```csv
❌ BAD - Options are topic names:
Angular,Basic,"What is Angular?","Framework","Library","Tool","Platform",A,"Angular is a framework",https://...

✅ GOOD - Options are actual answers:
Angular,Basic,"What is Angular?","JavaScript library","TypeScript framework","CSS preprocessor","Database",B,"Angular is a TypeScript-based framework",https://...
```

### ANSWER DISTRIBUTION TARGET:

For 100 questions:
- Answer A: 23-27 questions
- Answer B: 23-27 questions
- Answer C: 23-27 questions
- Answer D: 23-27 questions

Shuffle randomly - no sequential patterns!

### TOPIC COVERAGE BY LEVEL:

**Basic Level Topics:**
- Core concepts and definitions
- Basic syntax and commands
- Common use cases
- Getting started
- Fundamental features

**Intermediate Level Topics:**
- Advanced features
- Design patterns
- Performance optimization
- Integration techniques
- Best practices

**Advanced Level Topics:**
- Internal architecture
- Complex scenarios
- Expert techniques
- Edge cases
- Advanced optimization

### YOUTUBE LINK FORMAT:

Replace spaces with `+` in search queries:
```
https://youtube.com/results?search_query=angular+component+lifecycle
https://youtube.com/results?search_query=angular+component+lifecycle+hindi
https://youtube.com/results?search_query=angular+component+lifecycle+kannada
https://youtube.com/results?search_query=angular+component+lifecycle+tamil
https://youtube.com/results?search_query=angular+component+lifecycle+telugu
```

### CSV FORMATTING RULES:

1. Use double quotes around fields containing commas
2. Escape internal quotes by doubling them: `"He said ""hello"""`
3. No line breaks inside fields
4. Consistent column count (15 columns per row)

---

## GENERATE NOW:

Create 100 questions for:
- **Skill**: [SKILL_NAME]
- **Level**: [LEVEL]

### Checklist:
- [ ] 100 unique questions
- [ ] Correct answers randomized (A/B/C/D ~25% each)
- [ ] All options are actual answer choices
- [ ] CSV format perfect
- [ ] All 15 columns present
- [ ] No duplicate questions
- [ ] Plausible wrong answers
- [ ] Clear explanations

Output the CSV starting with the header row, followed by all 100 question rows.
