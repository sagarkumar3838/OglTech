const openai = require('../config/openai');
const { v4: uuidv4 } = require('uuid');

const SYSTEM_PROMPT = `You are a Senior Front-End Engineer and Technical Interviewer with 10+ years of experience in building production-grade web applications.

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

async function generateQuestions(skill, level, count = 10) {
  const userPrompt = `Generate ${count} ${level} level questions for ${skill}.

Return ONLY valid JSON in this exact format:
{
  "evaluation_id": "<unique_uuid>",
  "evaluation_level": "${level}",
  "skill": "${skill}",
  "question_count": ${count},
  "questions": [
    {
      "question_id": "<unique_id>",
      "level": "${level}",
      "skill_area": "${skill}",
      "type": "mcq | multi_select | scenario | code_reasoning | assertion_reason",
      "question": "<question text>",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "<for internal use only>",
      "expected_skills": ["skill1", "skill2"],
      "difficulty_weight": <1-10>
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
      response_format: { type: 'json_object' }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    
    // Add timestamps and IDs
    response.evaluation_id = uuidv4();
    response.generated_at = new Date().toISOString();
    response.questions = response.questions.map(q => ({
      ...q,
      question_id: uuidv4(),
      created_at: new Date().toISOString()
    }));

    return response;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}

module.exports = { generateQuestions };
