import { AIProvider, Evaluation } from '../../types';

export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  
  protected readonly SYSTEM_PROMPT = `You are a Senior Front-End Engineer and Technical Interviewer with 10+ years of experience in building production-grade web applications.

CRITICAL RULES:
- Questions must be original and change every time
- Avoid trivia and textbook definitions
- Focus on practical, real-world front-end development scenarios
- Do NOT reveal correct answers
- Do NOT explain answers

EVALUATION LEVELS:

BASIC - Target: Beginners / fresh developers
Focus on:
- HTML fundamentals (semantic tags, forms, accessibility basics)
- CSS fundamentals (box model, basic selectors, layout basics)
- JavaScript fundamentals (variables, functions, conditionals, loops, basic DOM usage)
- Understanding how browsers render web pages

INTERMEDIATE - Target: Working front-end developers
Focus on:
- HTML accessibility (ARIA basics, semantic correctness)
- CSS layouts (Flexbox, Grid), responsive design
- JavaScript DOM manipulation, events, async basics
- Browser behavior, state handling, form validation
- Debugging common front-end issues

ADVANCED - Target: Senior front-end developers
Focus on:
- JavaScript execution model (event loop, closures, scope)
- Performance optimization (reflows, repaint, bundle size)
- Advanced CSS (layout performance, complex responsiveness)
- Accessibility at scale
- Cross-browser issues
- Security basics (XSS, CSRF from front-end perspective)
- Design and architecture decisions

QUESTION TYPES:
- mcq (single correct answer)
- multi_select (multiple correct answers)
- scenario (real-world problem)
- code_reasoning (analyze code snippet)
- assertion_reason (statement + reasoning)`;

  abstract generateQuestions(skill: string, level: string, count: number): Promise<Evaluation>;
  abstract analyzePerformance(data: any): Promise<any>;
  
  protected createUserPrompt(skill: string, level: string, count: number): string {
    return `Generate ${count} ${level} level questions for ${skill}.

IMPORTANT: Create a MIX of different question types:
- 40% MCQ (single correct answer)
- 20% Multi-select (multiple correct answers)
- 20% Coding questions (write/debug code)
- 10% Fill in the blank
- 10% Matching questions

Return ONLY valid JSON in this exact format:
{
  "evaluation_id": "<unique_uuid>",
  "evaluation_level": "${level}",
  "skill": "${skill}",
  "question_count": ${count},
  "questions": [
    // MCQ Example
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "mcq",
      "question": "<question text>",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "<one option>",
      "expected_skills": ["skill1", "skill2"],
      "difficulty_weight": <1-10>
    },
    // Multi-select Example
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "multi_select",
      "question": "<question text>",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": ["Option A", "Option C"],
      "expected_skills": ["skill1"],
      "difficulty_weight": <1-10>
    },
    // Coding Example
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "coding",
      "question": "Write a function that...",
      "code_snippet": "// Starter code or code to debug",
      "test_cases": [
        {"input": "test input", "expected_output": "expected result", "description": "Test case 1"}
      ],
      "correct_answer": "// Solution code",
      "expected_skills": ["skill1"],
      "difficulty_weight": <1-10>
    },
    // Fill in the Blank Example
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "fill_blank",
      "question": "Complete the code",
      "blanks": {
        "text": "const x = __BLANK__; console.log(__BLANK__);",
        "answers": ["10", "x"]
      },
      "correct_answer": ["10", "x"],
      "expected_skills": ["skill1"],
      "difficulty_weight": <1-10>
    },
    // Matching Example
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "matching",
      "question": "Match the ${skill} concepts with their descriptions",
      "matching_pairs": {
        "left": ["Concept 1", "Concept 2", "Concept 3"],
        "right": ["Description A", "Description B", "Description C"],
        "correct_matches": {
          "Concept 1": "Description A",
          "Concept 2": "Description C",
          "Concept 3": "Description B"
        }
      },
      "correct_answer": {"Concept 1": "Description A", "Concept 2": "Description C", "Concept 3": "Description B"},
      "expected_skills": ["skill1"],
      "difficulty_weight": <1-10>
    }
  ]
}

CRITICAL RULES:
- Each question must be unique and practical
- Coding questions should be realistic and testable
- Fill in the blank should test understanding, not memorization
- Matching questions should have clear, unambiguous pairs
- NO placeholder text, NO example.com, NO lorem ipsum
- Questions must be production-ready`;
  }
  
  protected createAnalysisPrompt(data: any): string {
    const { skill, level, overallScore, correctCount, totalQuestions, questions } = data;
    
    return `Analyze this candidate's performance:
Skill: ${skill}
Level: ${level}
Score: ${overallScore}%
Correct: ${correctCount}/${totalQuestions}

Question types attempted: ${questions.map((q: any) => q.type).join(', ')}
Skills tested: ${[...new Set(questions.flatMap((q: any) => q.expected_skills))].join(', ')}

Provide a JSON response with:
{
  "level_readiness": "EXCEEDS_EXPECTATION | MEETS_EXPECTATION | BELOW_EXPECTATION",
  "observed_maturity": "string",
  "dimension_scores": {
    "correctness": <0-100>,
    "reasoning": <0-100>,
    "debugging": <0-100>,
    "design_thinking": <0-100>
  },
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "recommendations": ["rec1", "rec2"],
  "hiring_recommendation": "STRONG_HIRE | CONSIDER | NO_HIRE",
  "evaluator_summary": "brief summary"
}`;
  }
}
