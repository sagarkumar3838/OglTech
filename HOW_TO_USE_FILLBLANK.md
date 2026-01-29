# 📝 How to Use Fill-in-the-Blank Questions

## For Test Takers

### When You See a Fill-Blank Question:

```
Question: To create a form in HTML, you can use the _____ tag.

[Type your answer here...]
```

**Tips:**
1. ✅ Type just the answer: `form` (not `<form>`)
2. ✅ Case doesn't matter: `form`, `Form`, `FORM` all work
3. ✅ Spaces are trimmed automatically
4. ✅ You'll see a green checkmark when your answer is recorded

### Example Answers:

| Question | Correct Answer | Also Accepts |
|----------|---------------|--------------|
| To create a form in HTML you can use the _____ tag. | `form` | `Form`, `FORM` |
| The _____ tag is used to create a hyperlink. | `a` | `A` |
| To display an image you use the _____ tag. | `img` | `Img`, `IMG` |

## For Question Creators

### CSV Format:

```csv
skill,level,type,question,correct_answer,explanation
HTML,BASIC,fill_blank,To create a form in HTML you can use the _____ tag.,form,The <form> tag is used to create an HTML form.
CSS,BASIC,fill_blank,The _____ property changes text color.,color,The color property sets the text color.
```

### Rules:

1. **Use `_____` (5 underscores)** to mark where the blank goes
2. **correct_answer** should be the exact word/phrase expected
3. **Don't include** HTML tags like `<>` in the answer
4. **Keep answers short** - single words or short phrases work best
5. **Add explanation** to help users learn

### Upload Your Questions:

```bash
# 1. Create your CSV file in client/dist/assets/
# 2. Update the script path if needed
# 3. Run:
npx tsx scripts/upload-fillblank-questions.ts
```

## Question Types Comparison

### Multiple Choice (MCQ)
```
What does HTML stand for?
○ HyperText Markup Language  ← Click to select
○ High Tech Modern Language
○ Home Tool Markup Language
○ Hyperlinks and Text Markup Language
```

### Fill in the Blank
```
HTML stands for _____ Markup Language.
[Type: HyperText]  ← Type your answer
✓ Answer recorded: "HyperText"
```

## Scoring

- **MCQ:** Exact match required
- **Fill-blank:** Case-insensitive, whitespace-trimmed match
- **Both types:** 1 point per correct answer

## Advanced: Multiple Blanks (Future)

You can prepare for multiple blanks per question:

```csv
skill,level,type,question,correct_answer,explanation
HTML,MEDIUM,fill_blank,The _____ tag with _____ attribute creates a link.,a;href,The <a> tag with href attribute creates hyperlinks.
```

Note: Current version supports single blank per question. Multiple blank support coming soon!

## Testing Your Questions

1. Upload questions to database
2. Start an evaluation for that skill
3. Questions will be randomly mixed with MCQ
4. Complete the test to see scoring
5. Check scorecard for results

## Common Issues

### Issue: Answer marked wrong even though it's correct
**Solution:** Check for:
- Extra spaces in CSV
- Special characters
- HTML tags in answer field

### Issue: Question not showing up in tests
**Solution:** Verify:
- Skill name matches exactly (lowercase)
- Level is: easy, medium, or hard
- Type is: fill_blank
- Question has _____ placeholder

### Issue: Blank not visible in question
**Solution:** 
- Use exactly 5 underscores: `_____`
- Don't use spaces: `_ _ _ _ _` won't work
- Check CSV parsing didn't break the underscores
