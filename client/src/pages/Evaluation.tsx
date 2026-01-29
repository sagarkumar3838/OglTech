import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTabSwitchDetection } from '../hooks/useTabSwitchDetection';
import { supabase } from '../config/supabase';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye, EyeOff, Home, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Evaluation = () => {
  // Support both old and new URL formats
  const { evaluationId, skillSlug, levelSlug, sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes for 10 questions
  const [showWarning, setShowWarning] = useState(false);
  const [showOGLTabs, setShowOGLTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInstructionsPopup, setShowInstructionsPopup] = useState(true);

  // Tab switch detection
  const {
    switchCount,
    isTabActive,
    isTestInvalidated,
    shouldRestartTest,
    remainingSwitches
  } = useTabSwitchDetection({
    onTabSwitch: () => {
      setShowWarning(true);
      // Auto-hide warning after 5 seconds
      setTimeout(() => setShowWarning(false), 5000);
    },
    maxSwitches: 1, // Changed to 1 for immediate restart
    resetOnSwitch: true,
    restartOnFirstSwitch: true // Enable restart on first switch
  });

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [skillSlug, levelSlug, location.state]);

  // Timer countdown
  useEffect(() => {
    if (loading || isTestInvalidated) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isTestInvalidated]);

  // Reset test if invalidated
  useEffect(() => {
    if (isTestInvalidated) {
      setTimeout(() => {
        alert('Test invalidated due to tab switching. Returning to career page...');
        navigate(-1);
      }, 2000);
    }
  }, [isTestInvalidated, navigate]);

  // Restart test with different questions on first tab switch
  useEffect(() => {
    if (shouldRestartTest && !loading) {
      // Show alert
      alert('⚠️ Tab switch detected! The test will restart with different questions.');
      
      // Reset all state
      setCurrentQuestionIndex(0);
      setAnswers({});
      
      // Reload questions (this will fetch different questions)
      loadQuestions();
    }
  }, [shouldRestartTest, loading]);

  const loadQuestions = async () => {
    try {
      // Get evaluation details from location state
      const { careerId, careerName, skillName, skillDisplayName, level, source } = location.state || {};

      console.log('Evaluation state:', { careerId, careerName, skillName, skillDisplayName, level, source });

      // Determine skill and level from URL params or state
      const actualSkillName = skillName || skillSlug?.replace(/-/g, '');
      const actualLevel = level || levelSlug;
      const displayName = skillDisplayName || skillSlug?.replace(/-/g, ' ');

      // Update document title
      if (displayName && actualLevel) {
        document.title = `${displayName} - ${actualLevel.charAt(0).toUpperCase() + actualLevel.slice(1)} Evaluation`;
      }

      // Check if this is OGL Content Developer
      if (careerId === 'ogl-content-developer' || actualSkillName?.toLowerCase().includes('ogl')) {
        setShowOGLTabs(true);
        setLoading(false);
        return;
      }

      if (!actualSkillName || !actualLevel) {
        throw new Error('Missing evaluation details');
      }

      // Import the question loader service (uses Supabase)
      const { generateLevelTestQuestions } = await import('../services/questionLoaderService');
      
      console.log(`Attempting to load questions for: skill="${actualSkillName}", level="${actualLevel}"`);
      
      // Load 10 unique questions from Supabase for the specific skill and level
      const loadedQuestions = await generateLevelTestQuestions(actualSkillName, actualLevel, 10);
      
      console.log(`Loaded ${loadedQuestions.length} questions`);
      
      if (loadedQuestions.length === 0) {
        throw new Error(`No questions available for skill="${actualSkillName}" and level="${actualLevel}". Please check your database.`);
      }

      // Accept whatever questions we have (even if less than 10)
      if (loadedQuestions.length < 10) {
        console.warn(`Only ${loadedQuestions.length} questions available, proceeding anyway`);
      }

      // Transform questions to match the component's expected format
      const formattedQuestions = loadedQuestions.map((q, index) => ({
        id: q.id || index + 1,
        type: q.type || 'mcq',
        question: q.question || q.text,
        options: q.options || [],
        correct_answer: q.correct_answer || q.correctAnswer
      }));

      setQuestions(formattedQuestions);
      
      // Set timer based on number of questions (1 minute per question)
      setTimeRemaining(formattedQuestions.length * 60);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions: ' + (error as Error).message);
      navigate(-1);
    }
  };

  const handleAnswerSelect = (answer: any) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (isTestInvalidated) {
      alert('Test has been invalidated');
      return;
    }

    try {
      // Calculate score
      const correctCount = questions.filter((q, idx) => {
        const userAnswer = answers[idx];
        const correctAnswer = Array.isArray(q.correct_answer) ? q.correct_answer[0] : q.correct_answer;
        
        // For fill_blank, do case-insensitive comparison and trim whitespace
        if (q.type === 'fill_blank') {
          return userAnswer?.toString().toLowerCase().trim() === correctAnswer?.toString().toLowerCase().trim();
        }
        
        // For MCQ, exact match
        return userAnswer === correctAnswer;
      }).length;

      const score = Math.round((correctCount / questions.length) * 100);

      // Get evaluation details from location state or URL params
      const { careerId, careerName, skillName, skillDisplayName, level } = location.state || {};
      const actualSkillName = skillDisplayName || skillSlug?.replace(/-/g, ' ') || skillName;
      const actualLevel = level || levelSlug;

      // Create a mock scorecard for now (you can enhance this later with API)
      const scorecardData = {
        candidate_name: user?.displayName || user?.email || 'Anonymous',
        skill: actualSkillName,
        level_attempted: actualLevel,
        overall_score: score,
        correct_count: correctCount,
        total_questions: questions.length,
        level_readiness: score >= 80 ? 'EXCEEDS_EXPECTATION' : score >= 60 ? 'MEETS_EXPECTATION' : 'BELOW_EXPECTATION',
        observed_maturity: score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner',
        hiring_recommendation: score >= 80 ? 'STRONG_HIRE' : score >= 60 ? 'CONSIDER' : 'NO_HIRE',
        dimension_scores: {
          correctness: score,
          reasoning: Math.max(0, score - 5),
          debugging: Math.max(0, score - 10),
          design_thinking: Math.max(0, score - 15)
        },
        strengths: score >= 80 ? [
          `Strong understanding of ${actualSkillName} fundamentals`,
          'Excellent problem-solving skills',
          'Ready for production work'
        ] : score >= 60 ? [
          `Good grasp of ${actualSkillName} basics`,
          'Can work with guidance'
        ] : [
          'Shows potential for growth',
          'Willing to learn'
        ],
        gaps: score < 80 ? [
          `Needs more practice with ${actualSkillName} concepts`,
          'Should review fundamental topics',
          'Practice more coding exercises'
        ] : [],
        recommendations: [
          `Continue practicing ${actualSkillName} daily`,
          'Work on real-world projects',
          'Review documentation and best practices'
        ],
        evaluator_summary: score >= 80 
          ? `Candidate demonstrates strong proficiency in ${actualSkillName}. Ready for ${actualLevel} level work.`
          : score >= 60
          ? `Candidate shows good understanding of ${actualSkillName} but needs more practice for ${actualLevel} level.`
          : `Candidate needs significant improvement in ${actualSkillName} fundamentals before attempting ${actualLevel} level work.`,
        question_breakdown: questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const correctAnswer = Array.isArray(q.correct_answer) ? q.correct_answer[0] : q.correct_answer;
          const isCorrect = q.type === 'fill_blank' 
            ? userAnswer?.toString().toLowerCase().trim() === correctAnswer?.toString().toLowerCase().trim()
            : userAnswer === correctAnswer;
          
          return {
            question_id: q.id,
            question_text: q.question,
            type: q.type,
            topic: q.topic || 'General',
            explanation: q.explanation || 'No explanation available',
            user_answer: userAnswer,
            correct_answer: correctAnswer,
            is_correct: isCorrect,
            awarded_marks: isCorrect ? 1 : 0,
            max_marks: 1
          };
        }),
        created_at: new Date().toISOString()
      };

      // Store in sessionStorage for the scorecard page
      sessionStorage.setItem('latestScorecard', JSON.stringify(scorecardData));

      // Save to Supabase database for persistence
      try {
        // Generate unique IDs
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substr(2, 9);
        const scorecardId = `scorecard_${timestamp}_${randomStr}`;
        const submissionId = `submission_${timestamp}_${randomStr}`;

        const { error: insertError } = await supabase
          .from('scorecards')
          .insert([{
            scorecard_id: scorecardId,
            submission_id: submissionId,
            user_id: user?.id,
            career_id: careerId, // Add career_id to track which career this test is for
            candidate_name: scorecardData.candidate_name,
            skill: actualSkillName, // Use display name (e.g., "HTML") not normalized name
            level_attempted: actualLevel?.toLowerCase(), // Normalize level to lowercase
            overall_score: scorecardData.overall_score,
            correct_count: scorecardData.correct_count,
            total_questions: scorecardData.total_questions,
            level_readiness: scorecardData.level_readiness,
            observed_maturity: scorecardData.observed_maturity,
            dimension_scores: scorecardData.dimension_scores,
            question_breakdown: scorecardData.question_breakdown,
            strengths: scorecardData.strengths,
            gaps: scorecardData.gaps,
            recommendations: scorecardData.recommendations,
            hiring_recommendation: scorecardData.hiring_recommendation,
            evaluator_summary: scorecardData.evaluator_summary,
            created_at: scorecardData.created_at
          }]);

        if (insertError) {
          console.error('❌ Error saving scorecard to database:', insertError);
          console.error('Insert data:', { user_id: user?.id, career_id: careerId, skill: skillName, level_attempted: level });
        } else {
          console.log('✅ Scorecard saved to database successfully');
          console.log('Saved with career_id:', careerId, 'skill:', skillName, 'level:', level);
        }
      } catch (dbError) {
        console.error('❌ Database save error:', dbError);
      }

      // Navigate to scorecard with the data
      navigate('/scorecard/latest', { state: { scorecard: scorecardData } });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show OGL Developer Tabs if this is OGL career
  if (showOGLTabs) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">OGL Content Developer Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="journey">Course Journey</TabsTrigger>
                <TabsTrigger value="evaluations">Skill Evaluations</TabsTrigger>
                <TabsTrigger value="courses">OGL Courses</TabsTrigger>
                <TabsTrigger value="hands-on">Hands-on OGL Environment</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to OGL Content Developer Path</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      The OGL (Open Game License) Content Developer path is designed to help you master
                      game development, content creation, and interactive media design.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">📚 Comprehensive Curriculum</h3>
                        <p className="text-sm text-blue-800">
                          Learn game mechanics, storytelling, level design, and content creation
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">🎮 Hands-on Projects</h3>
                        <p className="text-sm text-green-800">
                          Build real games and interactive experiences
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2">🏆 Skill Evaluations</h3>
                        <p className="text-sm text-purple-800">
                          Test your knowledge and track your progress
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-semibold text-orange-900 mb-2">🚀 Career Ready</h3>
                        <p className="text-sm text-orange-800">
                          Get certified and showcase your portfolio
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journey" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Learning Journey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Foundation Phase</h3>
                          <p className="text-gray-600">Learn the basics of game development and OGL principles</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Game Design</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">OGL Basics</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">2</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Intermediate Phase</h3>
                          <p className="text-gray-600">Build interactive content and game mechanics</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Level Design</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Scripting</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">3</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Advanced Phase</h3>
                          <p className="text-gray-600">Master complex systems and publish your content</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Advanced Mechanics</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Publishing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Evaluations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Test your knowledge and earn certifications in various OGL development skills.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
                        <h3 className="font-semibold mb-2">Game Design Fundamentals</h3>
                        <p className="text-sm text-gray-600 mb-3">10 questions • 30 minutes</p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Start Evaluation
                        </button>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
                        <h3 className="font-semibold mb-2">OGL Content Creation</h3>
                        <p className="text-sm text-gray-600 mb-3">10 questions • 30 minutes</p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Start Evaluation
                        </button>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
                        <h3 className="font-semibold mb-2">Level Design Mastery</h3>
                        <p className="text-sm text-gray-600 mb-3">10 questions • 30 minutes</p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Start Evaluation
                        </button>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
                        <h3 className="font-semibold mb-2">Game Mechanics & Systems</h3>
                        <p className="text-sm text-gray-600 mb-3">10 questions • 30 minutes</p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Start Evaluation
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>OGL Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Comprehensive courses to master OGL content development.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Introduction to OGL</h3>
                            <p className="text-sm text-gray-600 mb-2">Learn the fundamentals of Open Game License</p>
                            <div className="flex gap-2 mb-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Beginner</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">4 hours</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Start Course
                          </button>
                        </div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Game Mechanics Design</h3>
                            <p className="text-sm text-gray-600 mb-2">Create engaging game mechanics and systems</p>
                            <div className="flex gap-2 mb-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Intermediate</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">6 hours</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Start Course
                          </button>
                        </div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Advanced Content Publishing</h3>
                            <p className="text-sm text-gray-600 mb-2">Publish and monetize your OGL content</p>
                            <div className="flex gap-2 mb-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Advanced</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">8 hours</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Start Course
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hands-on" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hands-on OGL Environment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4">
                      <h3 className="text-xl font-semibold mb-2">🎮 Interactive Development Environment</h3>
                      <p className="text-gray-700 mb-4">
                        Practice your skills in a real OGL development environment with instant feedback.
                      </p>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold">
                        Launch Environment
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">🛠️ Build Tools</h4>
                        <p className="text-sm text-gray-600">Access professional game development tools</p>
                      </div>
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">📝 Code Editor</h4>
                        <p className="text-sm text-gray-600">Write and test your game scripts</p>
                      </div>
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">🎨 Asset Library</h4>
                        <p className="text-sm text-gray-600">Use pre-built assets and templates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Learning Progress</CardTitle>
                    <p className="text-gray-600 mt-2">
                      Track your journey through the OGL Content Developer path. Complete courses, pass evaluations, 
                      and build projects to advance your skills and earn certifications.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Overall Progress Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="font-semibold text-lg">Overall Progress</span>
                            <p className="text-sm text-gray-600 mt-1">
                              Your completion across all learning activities
                            </p>
                          </div>
                          <span className="text-3xl font-bold text-blue-600">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all" style={{ width: '35%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Keep going! You're making great progress on your OGL development journey.
                        </p>
                      </div>

                      {/* Key Metrics Grid */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Learning Milestones</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-green-900">Completed Courses</h4>
                              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Active</span>
                            </div>
                            <p className="text-4xl font-bold text-green-700 mb-2">3</p>
                            <p className="text-sm text-green-800">
                              You've finished 3 comprehensive courses covering game design fundamentals, 
                              OGL basics, and content creation principles.
                            </p>
                          </div>

                          <div className="p-5 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-900">Evaluations Passed</h4>
                              <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">Certified</span>
                            </div>
                            <p className="text-4xl font-bold text-blue-700 mb-2">2</p>
                            <p className="text-sm text-blue-800">
                              Successfully passed 2 skill evaluations demonstrating your knowledge 
                              in game mechanics and level design.
                            </p>
                          </div>

                          <div className="p-5 bg-purple-50 rounded-lg border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-purple-900">Projects Built</h4>
                              <span className="text-sm text-purple-700 bg-purple-100 px-2 py-1 rounded">Portfolio</span>
                            </div>
                            <p className="text-4xl font-bold text-purple-700 mb-2">5</p>
                            <p className="text-sm text-purple-800">
                              Created 5 hands-on projects including game prototypes, interactive scenarios, 
                              and content modules ready for your portfolio.
                            </p>
                          </div>

                          <div className="p-5 bg-orange-50 rounded-lg border-2 border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-orange-900">Certifications Earned</h4>
                              <span className="text-sm text-orange-700 bg-orange-100 px-2 py-1 rounded">Verified</span>
                            </div>
                            <p className="text-4xl font-bold text-orange-700 mb-2">1</p>
                            <p className="text-sm text-orange-800">
                              Earned 1 official certification in OGL Game Design Fundamentals. 
                              Complete more courses to unlock additional certifications.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills Breakdown */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Skill Proficiency Levels</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">Game Design Fundamentals</span>
                              <span className="text-sm text-gray-600">Advanced - 85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Strong understanding of core game design principles</p>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">OGL Content Creation</span>
                              <span className="text-sm text-gray-600">Intermediate - 60%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Developing skills in creating OGL-compliant content</p>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">Level Design & Mechanics</span>
                              <span className="text-sm text-gray-600">Beginner - 40%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Building foundation in level design concepts</p>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">Interactive Storytelling</span>
                              <span className="text-sm text-gray-600">Beginner - 25%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-orange-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Just getting started with narrative design</p>
                          </div>
                        </div>
                      </div>

                      {/* Recent Achievements */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Recent Achievements</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Celebrate your latest accomplishments and milestones in your learning journey.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <span className="text-3xl">🏆</span>
                            <div className="flex-1">
                              <p className="font-semibold text-yellow-900">Game Design Fundamentals Completed</p>
                              <p className="text-sm text-yellow-800 mt-1">
                                Successfully completed the foundational course with a score of 92%. 
                                You now understand core game design principles and mechanics.
                              </p>
                              <p className="text-xs text-yellow-700 mt-2">Completed 2 days ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <span className="text-3xl">⭐</span>
                            <div className="flex-1">
                              <p className="font-semibold text-yellow-900">First Game Published</p>
                              <p className="text-sm text-yellow-800 mt-1">
                                Published your first complete game project! Your "Dungeon Explorer" prototype 
                                is now live and showcases your understanding of basic game mechanics.
                              </p>
                              <p className="text-xs text-yellow-700 mt-2">Completed 1 week ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <span className="text-3xl">🎯</span>
                            <div className="flex-1">
                              <p className="font-semibold text-yellow-900">Level Design Evaluation Passed</p>
                              <p className="text-sm text-yellow-800 mt-1">
                                Passed the Level Design evaluation with 78%. You demonstrated solid 
                                understanding of spatial design and player flow concepts.
                              </p>
                              <p className="text-xs text-yellow-700 mt-2">Completed 2 weeks ago</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
                        <h4 className="font-semibold text-lg mb-3 text-indigo-900">🚀 Recommended Next Steps</h4>
                        <ul className="space-y-2 text-sm text-indigo-800">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Complete the "Advanced Game Mechanics" course to unlock the next certification</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Take the "OGL Content Creation" evaluation to test your knowledge</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Build 2 more projects to strengthen your portfolio</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Practice interactive storytelling techniques in the hands-on environment</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTestInvalidated) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Test Invalidated</h2>
          <p className="text-red-700 mb-4">
            You switched tabs. The test has been reset.
          </p>
          <p className="text-red-600 text-sm">
            Redirecting you back...
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Get display information from state or URL params
  const { careerName, skillDisplayName, level } = location.state || {};
  const displaySkill = skillDisplayName || skillSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const displayLevel = (level || levelSlug)?.charAt(0).toUpperCase() + (level || levelSlug)?.slice(1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Popup */}
      {showInstructionsPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  Important Instructions
                </h3>
                <button
                  onClick={() => setShowInstructionsPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>You have <strong>{Math.floor(timeRemaining / 60)} minutes</strong> to answer <strong>{questions.length} questions</strong> (1 minute per question)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Do not switch tabs</strong> or minimize the browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-red-600">If you switch tabs even once, the test will restart with different questions!</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>All progress will be <strong>lost</strong> if you switch tabs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>The timer will <strong>continue</strong> even if you switch tabs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowInstructionsPopup(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                I Understand, Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center hover:text-blue-600 transition"
        >
          <Home className="w-4 h-4" />
        </button>
        <ChevronRight className="w-4 h-4" />
        <button 
          onClick={() => navigate('/careers')}
          className="hover:text-blue-600 transition"
        >
          Careers
        </button>
        {careerName && (
          <>
            <ChevronRight className="w-4 h-4" />
            <button 
              onClick={() => navigate(-1)}
              className="hover:text-blue-600 transition"
            >
              {careerName}
            </button>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-semibold">
          {displaySkill} - {displayLevel} Evaluation
        </span>
      </nav>

      {/* Warning Banner for Tab Switches */}
      {showWarning && !isTestInvalidated && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border-2 border-red-500 rounded-lg p-4 shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Tab Switch Detected!</p>
              <p className="text-sm text-red-700">
                Test will restart with different questions!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Timer and Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className={`text-lg font-semibold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isTabActive ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm text-gray-600">
                Tab Active: {isTabActive ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* MCQ Options */}
        {currentQuestion.type === 'mcq' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestionIndex] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestionIndex] === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === option && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentQuestion.type === 'fill_blank' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 Type your answer in the box below. Be precise with spelling and formatting.
              </p>
            </div>
            <input
              type="text"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            {answers[currentQuestionIndex] && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Answer recorded: "{answers[currentQuestionIndex]}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} / {questions.length} answered
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
        <h3 className="font-semibold text-red-900 mb-2">⚠️ Critical Warning:</h3>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• <strong>Do NOT switch tabs or minimize the browser!</strong></li>
          <li>• <strong className="text-red-900">If you switch tabs even ONCE, the test will restart with different questions</strong></li>
          <li>• All your progress will be lost immediately</li>
          <li>• You have {Math.floor(timeRemaining / 60)} minutes to answer {questions.length} questions</li>
          <li>• Stay focused on this tab until you complete the test</li>
        </ul>
      </div>
    </div>
  );
};

export default Evaluation;
