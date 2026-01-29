const openai = require('../config/openai');

async function generateScorecard(evaluationData) {
  const { answers, questions, skill, level, candidateName, userId } = evaluationData;
  
  // Calculate scores
  let correctCount = 0;
  let totalMarks = 0;
  let earnedMarks = 0;
  
  const questionAnalysis = questions.map((q, idx) => {
    const userAnswer = answers[idx];
    const isCorrect = userAnswer === q.correct_answer;
    const marks = q.difficulty_weight || 10;
    
    if (isCorrect) {
      correctCount++;
      earnedMarks += marks;
    }
    totalMarks += marks;
    
    return {
      question_id: q.question_id,
      type: q.type,
      max_marks: marks,
      awarded_marks: isCorrect ? marks : 0,
      is_correct: isCorrect
    };
  });
  
  const overallScore = Math.round((earnedMarks / totalMarks) * 100);
  
  // Generate AI analysis
  const analysisPrompt = `Analyze this candidate's performance:
Skill: ${skill}
Level: ${level}
Score: ${overallScore}%
Correct: ${correctCount}/${questions.length}

Question types attempted: ${questions.map(q => q.type).join(', ')}
Skills tested: ${[...new Set(questions.flatMap(q => q.expected_skills))].join(', ')}

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

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert technical evaluator.' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const aiAnalysis = JSON.parse(completion.choices[0].message.content);
    
    return {
      candidate_name: candidateName,
      user_id: userId,
      skill,
      level_attempted: level,
      overall_score: overallScore,
      correct_count: correctCount,
      total_questions: questions.length,
      ...aiAnalysis,
      question_breakdown: questionAnalysis,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating scorecard:', error);
    throw new Error('Failed to generate scorecard');
  }
}

module.exports = { generateScorecard };
