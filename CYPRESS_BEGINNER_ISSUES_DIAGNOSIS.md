# Cypress Beginner CSV Issues - Complete Diagnosis

## File: `questions/cypress-beginner.csv`

---

## 🔴 CRITICAL ISSUES FOUND

### Issue 1: WRONG LEVEL NAME
- **Current**: `Basic`
- **Required**: `beginner`
- **Impact**: ALL questions in this file have wrong level name
- **Result**: Questions won't match the database constraint

### Issue 2: WRONG SKILL NAME CASE
- **Current**: `Cypress` (capital C)
- **Required**: `cypress` (lowercase)
- **Impact**: ALL questions in this file have wrong skill case
- **Result**: Questions will be split from other cypress questions

### Issue 3: INVALID correct_answer FORMAT
- **Current**: Text descriptions (e.g., "Scrolling", "Coordinates", "Page navigation")
- **Required**: Single letter only (A, B, C, or D)
- **Impact**: ALL questions have invalid answer format
- **Result**: Questions are technically uploaded but unusable in the app

---

## 📋 EXAMPLE OF WRONG FORMAT (Current)

```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
Cypress,Basic,How do you scroll the page to specific coordinates?,Scrolling,Coordinates,Page navigation,A,cy.scrollTo(0,500),Scrolling,https://...
```

**Problems**:
1. `Cypress` should be `cypress`
2. `Basic` should be `beginner`
3. `correct_answer` column has "Scrolling" instead of "A"

---

## ✅ CORRECT FORMAT (What's Needed)

```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
cypress,beginner,How do you scroll the page to specific coordinates?,cy.scrollTo(0 500),cy.scroll(500),window.scrollTo(0 500),cy.moveToCoordinates(0 500),A,cy.scrollTo() is the Cypress command for scrolling to coordinates
```

**Fixed**:
1. Skill: `cypress` (lowercase)
2. Level: `beginner` (lowercase, correct term)
3. correct_answer: `A` (single letter only)
4. Options contain actual answer choices, not categories

---

## 🔧 WHAT NEEDS TO BE DONE

### Step 1: Delete ALL Invalid Questions
Run this SQL to remove all questions with invalid answers:

```sql
DELETE FROM practice_questions 
WHERE correct_answer NOT IN ('A', 'B', 'C', 'D');
```

### Step 2: Regenerate CSV File
The entire `cypress-beginner.csv` file needs to be regenerated with:
- Proper skill name: `cypress` (lowercase)
- Proper level: `beginner` (not "Basic")
- Proper correct_answer: A, B, C, or D only
- Proper options: Actual answer choices, not category names

---

## 🎯 THIS AFFECTS ALL YOUR CSV FILES

This same problem exists in ALL 44+ skills in your questions folder because they were all AI-generated with the wrong format.

You need to regenerate ALL CSV files with the correct format.
