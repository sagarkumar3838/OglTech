import { aiProviderManager } from './aiProviders/AIProviderManager';
import { Question, Scorecard, DimensionScores } from '../types';

interface EvaluationData {
  answers: (string | null)[];
  questions: Question[];
  skill: string;
  level: string;
  candidateName: string;
  userId: string;
}

/**
 * Determine level readiness based on score and level attempted
 */
function determineLevelReadiness(
  score: number,
  level: string
): 'EXCEEDS_EXPECTATION' | 'MEETS_EXPECTATION' | 'BELOW_EXPECTATION' {
  if (level === 'BASIC') {
    if (score >= 80) return 'EXCEEDS_EXPECTATION';
    if (score >= 60) return 'MEETS_EXPECTATION';
    return 'BELOW_EXPECTATION';
  } else if (level === 'INTERMEDIATE') {
    if (score >= 85) return 'EXCEEDS_EXPECTATION';
    if (score >= 70) return 'MEETS_EXPECTATION';
    return 'BELOW_EXPECTATION';
  } else {
    // ADVANCED
    if (score >= 90) return 'EXCEEDS_EXPECTATION';
    if (score >= 75) return 'MEETS_EXPECTATION';
    return 'BELOW_EXPECTATION';
  }
}

/**
 * Determine observed maturity based on performance
 */
function determineObservedMaturity(
  score: number,
  level: string,
  dimensionScores: DimensionScores
): string {
  const avgDimensionScore =
    Object.values(dimensionScores).reduce((a, b) => a + b, 0) /
    Object.values(dimensionScores).length;

  if (level === 'BASIC') {
    if (score >= 85 && avgDimensionScore >= 80) return 'Upper-Basic';
    if (score >= 60) return 'Basic';
    return 'Below-Basic';
  } else if (level === 'INTERMEDIATE') {
    if (score >= 85 && avgDimensionScore >= 80) return 'Upper-Intermediate';
    if (score >= 70) return 'Intermediate';
    if (score >= 60) return 'Lower-Intermediate';
    return 'Basic';
  } else {
    // ADVANCED
    if (score >= 90 && avgDimensionScore >= 85) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Upper-Intermediate';
    return 'Intermediate';
  }
}

/**
 * Calculate dimension scores based on question types and performance
 */
function calculateDimensionScores(
  questions: Question[],
  answers: (string | null)[]
): DimensionScores {
  const dimensions = {
    correctness: { total: 0, earned: 0 },
    reasoning: { total: 0, earned: 0 },
    debugging: { total: 0, earned: 0 },
    design_thinking: { total: 0, earned: 0 },
  };

  questions.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.correct_answer;
    const marks = q.difficulty_weight || 10;

    // Map question types to dimensions
    if (q.type === 'mcq' || q.type === 'multi_select') {
      dimensions.correctness.total += marks;
      if (isCorrect) dimensions.correctness.earned += marks;
    }

    if (q.type === 'code_reasoning' || q.type === 'assertion_reason') {
      dimensions.reasoning.total += marks;
      if (isCorrect) dimensions.reasoning.earned += marks;
    }

    if (q.type === 'scenario' && q.question.toLowerCase().includes('debug')) {
      dimensions.debugging.total += marks;
      if (isCorrect) dimensions.debugging.earned += marks;
    }

    if (q.type === 'scenario' && q.question.toLowerCase().includes('design')) {
      dimensions.design_thinking.total += marks;
      if (isCorrect) dimensions.design_thinking.earned += marks;
    }
  });

  // Calculate percentages
  const scores: DimensionScores = {
    correctness: dimensions.correctness.total
      ? Math.round((dimensions.correctness.earned / dimensions.correctness.total) * 100)
      : 0,
    reasoning: dimensions.reasoning.total
      ? Math.round((dimensions.reasoning.earned / dimensions.reasoning.total) * 100)
      : 0,
    debugging: dimensions.debugging.total
      ? Math.round((dimensions.debugging.earned / dimensions.debugging.total) * 100)
      : 0,
  };

  // Only include design_thinking for ADVANCED level
  if (dimensions.design_thinking.total > 0) {
    scores.design_thinking = Math.round(
      (dimensions.design_thinking.earned / dimensions.design_thinking.total) * 100
    );
  }

  return scores;
}

/**
 * Determine hiring recommendation
 */
function determineHiringRecommendation(
  score: number,
  level: string,
  levelReadiness: string
): 'STRONG_HIRE' | 'CONSIDER' | 'NO_HIRE' {
  if (levelReadiness === 'BELOW_EXPECTATION') {
    return 'NO_HIRE';
  }

  if (level === 'ADVANCED' && score >= 85 && levelReadiness === 'EXCEEDS_EXPECTATION') {
    return 'STRONG_HIRE';
  }

  if (level === 'INTERMEDIATE' && score >= 80 && levelReadiness === 'EXCEEDS_EXPECTATION') {
    return 'STRONG_HIRE';
  }

  if (score >= 75 && levelReadiness === 'MEETS_EXPECTATION') {
    return 'CONSIDER';
  }

  if (score >= 60) {
    return 'CONSIDER';
  }

  return 'NO_HIRE';
}

/**
 * Generate evaluator summary
 */
function generateEvaluatorSummary(
  candidateName: string,
  skill: string,
  level: string,
  score: number,
  hiringRecommendation: string,
  observedMaturity: string
): string {
  const summaries = {
    STRONG_HIRE: `${candidateName} demonstrates exceptional ${skill} skills at the ${level} level with a score of ${score}%. Observed maturity: ${observedMaturity}. Production-ready and suitable for immediate hiring.`,
    CONSIDER: `${candidateName} shows solid ${skill} competency at the ${level} level (${score}%). Observed maturity: ${observedMaturity}. Trainable candidate suitable for junior to mid-level roles with mentoring.`,
    NO_HIRE: `${candidateName} scored ${score}% at the ${level} level, indicating gaps in fundamental ${skill} concepts. Observed maturity: ${observedMaturity}. Requires significant training before being production-ready.`,
  };

  return summaries[hiringRecommendation as keyof typeof summaries] || summaries.CONSIDER;
}

export async function generateScorecard(evaluationData: EvaluationData): Promise<Scorecard> {
  const { answers, questions, skill, level, candidateName, userId } = evaluationData;

  // Calculate basic scores
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
      is_correct: isCorrect,
    };
  });

  const overallScore = Math.round((earnedMarks / totalMarks) * 100);

  // Calculate dimension scores
  const dimensionScores = calculateDimensionScores(questions, answers);

  // Determine readiness and maturity
  const levelReadiness = determineLevelReadiness(overallScore, level);
  const observedMaturity = determineObservedMaturity(overallScore, level, dimensionScores);
  const hiringRecommendation = determineHiringRecommendation(
    overallScore,
    level,
    levelReadiness
  );

  // Generate AI analysis for strengths, gaps, and recommendations
  const aiAnalysis = await aiProviderManager.analyzePerformance({
    skill,
    level,
    overallScore,
    correctCount,
    totalQuestions: questions.length,
    questions,
    dimensionScores,
    levelReadiness,
    observedMaturity,
  });

  // Generate evaluator summary
  const evaluatorSummary = generateEvaluatorSummary(
    candidateName,
    skill,
    level,
    overallScore,
    hiringRecommendation,
    observedMaturity
  );

  return {
    candidate_name: candidateName,
    user_id: userId,
    skill,
    level_attempted: level,
    overall_score: overallScore,
    correct_count: correctCount,
    total_questions: questions.length,
    level_readiness: levelReadiness,
    observed_maturity: observedMaturity,
    dimension_scores: dimensionScores,
    question_breakdown: questionAnalysis,
    strengths: aiAnalysis.strengths || [],
    gaps: aiAnalysis.gaps || [],
    recommendations: aiAnalysis.recommendations || [],
    hiring_recommendation: hiringRecommendation,
    evaluator_summary: evaluatorSummary,
    created_at: new Date().toISOString(),
  } as Scorecard;
}
