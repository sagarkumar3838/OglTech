import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getScorecard } from '../services/api';
import { supabase } from '../config/supabase';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Download,
  Calendar,
  Target,
  BarChart3,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  ExternalLink
} from 'lucide-react';

const Scorecard = () => {
  const { scorecardSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [scorecard, setScorecard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [learningResources, setLearningResources] = useState<any[]>([]);
  const [topicsToLearn, setTopicsToLearn] = useState<string[]>([]);

  useEffect(() => {
    loadScorecard();
  }, [scorecardSlug]);

  useEffect(() => {
    if (scorecard) {
      analyzeTopicsAndLoadResources();
    }
  }, [scorecard]);

  const analyzeTopicsAndLoadResources = async () => {
    if (!scorecard || !scorecard.question_breakdown) return;

    // Extract topics from wrong answers
    const wrongTopics = scorecard.question_breakdown
      .filter((q: any) => !q.is_correct && q.topic && q.topic !== 'General')
      .map((q: any) => q.topic);

    // Get unique topics
    const uniqueTopics = [...new Set(wrongTopics)];
    setTopicsToLearn(uniqueTopics);

    // Load learning resources from database for these topics
    if (uniqueTopics.length > 0) {
      try {
        const { data, error } = await supabase
          .from('topic_knowledge_base')
          .select('*')
          .eq('skill', scorecard.skill?.toLowerCase())
          .in('topic', uniqueTopics);

        if (error) {
          console.error('Error loading learning resources:', error);
        } else if (data) {
          setLearningResources(data);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    }
  };

  const loadScorecard = async () => {
    try {
      // First, check if scorecard data was passed via navigation state
      if (location.state?.scorecard) {
        setScorecard(location.state.scorecard);
        setLoading(false);
        return;
      }

      // Second, check sessionStorage for latest scorecard
      if (scorecardSlug === 'latest') {
        const storedScorecard = sessionStorage.getItem('latestScorecard');
        if (storedScorecard) {
          setScorecard(JSON.parse(storedScorecard));
          setLoading(false);
          return;
        }
      }

      // Third, try to fetch from API
      const response = await getScorecard(scorecardSlug);
      setScorecard(response.data);
    } catch (error) {
      console.error('Error loading scorecard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG_HIRE': return 'bg-green-100 text-green-800 border-green-300';
      case 'CONSIDER': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'NO_HIRE': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'EXCEEDS_EXPECTATION': return 'text-green-600 bg-green-50';
      case 'MEETS_EXPECTATION': return 'text-blue-600 bg-blue-50';
      case 'BELOW_EXPECTATION': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  };

  if (!scorecard) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Scorecard not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-4">
      {/* Header Section - Identity */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 print:bg-blue-600">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{scorecard.candidate_name}</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{scorecard.skill}</span>
              </span>
              <span>•</span>
              <span className="font-semibold">{scorecard.level_attempted}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(scorecard.created_at)}</span>
              </span>
            </div>
            <p className="text-sm text-blue-200 mt-2">Evaluation ID: {scorecardSlug}</p>
          </div>
          
          {/* Overall Score - Big Visible Metric */}
          <div className="text-center bg-white/10 backdrop-blur rounded-lg p-6 min-w-[180px]">
            <div className="text-6xl font-bold mb-2">{scorecard.overall_score}%</div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getReadinessColor(scorecard.level_readiness)}`}>
              {scorecard.level_readiness?.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Correct Answers</p>
            <p className="text-2xl font-bold">{scorecard.correct_count} / {scorecard.total_questions}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Skill Maturity</p>
            <p className="text-2xl font-bold">{scorecard.observed_maturity}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Recommendation</p>
            <p className="text-2xl font-bold">{scorecard.hiring_recommendation?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>

      {/* Skill Dimension Scores */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Skill Dimension Scores</h2>
        </div>
        
        <div className="space-y-6">
          {Object.entries(scorecard.dimension_scores || {}).map(([dimension, score]) => {
            const numScore = Number(score);
            const interpretations: Record<string, string> = {
              correctness: numScore >= 80 ? 'Answers largely accurate' : numScore >= 60 ? 'Moderate accuracy' : 'Needs improvement',
              reasoning: numScore >= 80 ? 'Strong logical thinking' : numScore >= 60 ? 'Logical but incomplete' : 'Weak reasoning',
              debugging: numScore >= 80 ? 'Excellent problem identification' : numScore >= 60 ? 'Identifies issues correctly' : 'Struggles with debugging',
              design_thinking: numScore >= 80 ? 'Strong architectural thinking' : numScore >= 60 ? 'Needs structure' : 'Limited design skills'
            };

            return (
              <div key={dimension} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg capitalize">{dimension.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-600">{interpretations[dimension]}</p>
                  </div>
                  <span className={`text-3xl font-bold ${getScoreColor(numScore)}`}>{numScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`${getProgressBarColor(numScore)} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${numScore}%` }}
                  >
                    {numScore >= 20 && <span className="text-xs text-white font-semibold">{numScore}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-Wise Breakdown (Expandable) */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={() => setExpandedSection(expandedSection === 'questions' ? null : 'questions')}
          className="w-full flex items-center justify-between text-left"
        >
          <h2 className="text-2xl font-semibold">Question-Wise Breakdown</h2>
          <span className="text-gray-500">{expandedSection === 'questions' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'questions' && (
          <div className="mt-6 space-y-4">
            {scorecard.question_breakdown?.map((q, idx) => (
              <div key={q.question_id} className={`p-5 rounded-lg border-2 ${q.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg text-gray-700">Q{idx + 1}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">{q.type}</span>
                    {q.topic && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-semibold">
                        {q.topic}
                      </span>
                    )}
                    {q.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-lg ${q.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                      {q.awarded_marks} / {q.max_marks}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">marks</span>
                  </div>
                </div>
                
                {/* Question Text */}
                {q.question_text && (
                  <div className="mb-3">
                    <p className="text-gray-800 font-medium">{q.question_text}</p>
                  </div>
                )}
                
                {/* Answers */}
                {!q.is_correct && (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start space-x-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-red-700">Your Answer: </span>
                        <span className="text-sm text-red-600">{q.user_answer || 'Not answered'}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-green-700">Correct Answer: </span>
                        <span className="text-sm text-green-600">{q.correct_answer}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Explanation */}
                {!q.is_correct && q.explanation && q.explanation !== 'No explanation available' && (
                  <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-1">💡 Explanation:</p>
                    <p className="text-sm text-blue-800">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">✅ Demonstrated Strengths</h3>
          </div>
          
          {/* Show topic-based strengths if available */}
          {scorecard.question_breakdown && scorecard.question_breakdown.some((q: any) => q.is_correct && q.topic) ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Topics you've mastered:</p>
              {[...new Set(scorecard.question_breakdown
                .filter((q: any) => q.is_correct && q.topic && q.topic !== 'General')
                .map((q: any) => q.topic))]
                .map((topic: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">{topic}</span>
                  </div>
                ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {scorecard.strengths?.map((strength, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold">⚠️ Identified Gaps</h3>
          </div>
          
          {/* Show topic-based gaps with links if available */}
          {topicsToLearn.length > 0 && learningResources.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-3">Topics that need more practice:</p>
              {topicsToLearn.map((topic: string, idx: number) => {
                // Find resources for this topic
                const topicResources = learningResources.filter((r: any) => r.topic === topic);
                
                return (
                  <div key={idx} className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <div className="flex items-start space-x-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 font-bold text-lg">{topic}</span>
                    </div>
                    
                    {/* Show learning resource links for this topic */}
                    {topicResources.length > 0 ? (
                      <div className="ml-8 space-y-3">
                        {/* Documentation Links */}
                        {topicResources.map((resource: any, resIdx: number) => (
                          <div key={resIdx} className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {resource.w3schools_url && (
                                <a
                                  href={resource.w3schools_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition text-sm font-semibold"
                                >
                                  W3Schools
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              
                              {resource.mdn_url && (
                                <a
                                  href={resource.mdn_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                                >
                                  MDN Docs
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              
                              {resource.geeksforgeeks_url && (
                                <a
                                  href={resource.geeksforgeeks_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition text-sm font-semibold"
                                >
                                  GeeksforGeeks
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            
                            {/* YouTube Video Links */}
                            {(resource.youtube_en || resource.youtube_hi || resource.youtube_ml || resource.youtube_te || resource.youtube_kn) && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs text-gray-600 font-semibold mr-1">Videos:</span>
                                {resource.youtube_en && (
                                  <a
                                    href={resource.youtube_en}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition text-xs font-semibold"
                                  >
                                    🎥 English
                                  </a>
                                )}
                                
                                {resource.youtube_hi && (
                                  <a
                                    href={resource.youtube_hi}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition text-xs font-semibold"
                                  >
                                    🎥 हिंदी
                                  </a>
                                )}
                                
                                {resource.youtube_ml && (
                                  <a
                                    href={resource.youtube_ml}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition text-xs font-semibold"
                                  >
                                    🎥 മലയാളം
                                  </a>
                                )}
                                
                                {resource.youtube_te && (
                                  <a
                                    href={resource.youtube_te}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition text-xs font-semibold"
                                  >
                                    🎥 తెలుగు
                                  </a>
                                )}
                                
                                {resource.youtube_kn && (
                                  <a
                                    href={resource.youtube_kn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition text-xs font-semibold"
                                  >
                                    🎥 ಕನ್ನಡ
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="ml-8 text-sm text-gray-500 italic">
                        Resources for this topic will be added soon
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : topicsToLearn.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Topics that need more practice:</p>
              {topicsToLearn.map((topic: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">{topic}</span>
                </div>
              ))}
              <p className="text-sm text-gray-500 italic mt-3">
                Loading learning resources...
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {scorecard.gaps?.map((gap, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{gap}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Readiness & Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-semibold">🎯 Level Readiness & Recommendations</h3>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Target className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-lg mb-2">Ready For:</p>
              <p className="text-gray-700">{scorecard.observed_maturity} level roles</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-lg mb-4">📚 Learning Recommendations</h4>
        <ul className="space-y-3">
          {scorecard.recommendations?.map((rec, idx) => (
            <li key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Final Hiring Recommendation */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold mb-6">Final Hiring Recommendation</h3>
        
        <div className="flex items-center justify-center mb-6">
          <span className={`px-8 py-4 rounded-lg font-bold text-2xl border-2 ${getRecommendationColor(scorecard.hiring_recommendation)}`}>
            {scorecard.hiring_recommendation?.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-700 leading-relaxed italic text-lg">
            "{scorecard.evaluator_summary}"
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="font-semibold text-red-800">NO_HIRE</p>
            <p className="text-gray-600 mt-1">Fundamentals missing</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-semibold text-yellow-800">CONSIDER</p>
            <p className="text-gray-600 mt-1">Trainable, role-dependent</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-semibold text-green-800">STRONG_HIRE</p>
            <p className="text-gray-600 mt-1">Production-ready</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center gap-4 print:hidden">
        <button
          onClick={() => {
            // Navigate back to career detail page
            const careerSlug = 'ogl-content-developer'; // You can make this dynamic based on scorecard data
            navigate(`/careers/${careerSlug}`);
          }}
          className="flex items-center space-x-2 px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-md transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Career Path</span>
        </button>

        <button
          onClick={() => {
            // Retest - navigate back to evaluation with same parameters
            const skillSlug = scorecard.skill?.toLowerCase().replace(/\s+/g, '-');
            const levelSlug = scorecard.level_attempted?.toLowerCase();
            const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            navigate(`/evaluation/${skillSlug}/${levelSlug}/${sessionId}`, {
              state: { 
                careerId: 'ogl-content-developer',
                careerName: 'OGL Content Developer',
                skillName: scorecard.skill?.toLowerCase().replace(/\s+/g, ''),
                skillDisplayName: scorecard.skill,
                level: scorecard.level_attempted?.toLowerCase(),
                source: 'Database'
              }
            });
          }}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Retest</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF Report</span>
        </button>
      </div>
    </div>
  );
};

export default Scorecard;
