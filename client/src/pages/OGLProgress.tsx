import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { 
  calculateProgressStats, 
  getTestHistory, 
  getSkillProficiency,
  getRecentAchievements 
} from '../services/userProgressService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, BookOpen, Award, TrendingUp, Clock, Home, ChevronRight } from 'lucide-react';

const OGLProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [skillProficiency, setSkillProficiency] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load progress from scorecards instead of user_progress
      // This avoids the UUID vs slug issue
      const { data: scorecardsData, error: scorecardsError } = await supabase
        .from('scorecards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scorecardsError) {
        console.error('Error loading scorecards:', scorecardsError);
        setLoading(false);
        return;
      }

      if (scorecardsData && scorecardsData.length > 0) {
        // Build progress from scorecards
        const skillsMap = new Map();
        
        scorecardsData.forEach(scorecard => {
          const skillName = scorecard.skill;
          const level = scorecard.level_attempted;
          const score = scorecard.overall_score;
          const passed = scorecard.level_readiness !== 'BELOW_EXPECTATION';
          
          if (!skillsMap.has(skillName)) {
            skillsMap.set(skillName, {
              skill_name: skillName,
              unlocked_levels: [],
              levels_completed: []
            });
          }
          
          const skill = skillsMap.get(skillName);
          const existingLevel = skill.levels_completed.find((l: any) => l.level === level);
          
          if (!existingLevel) {
            skill.levels_completed.push({
              level: level,
              completed: passed,
              best_score: score,
              attempts: 1,
              last_attempt_date: scorecard.created_at
            });
          } else {
            existingLevel.attempts++;
            if (score > existingLevel.best_score) {
              existingLevel.best_score = score;
              existingLevel.completed = passed;
              existingLevel.last_attempt_date = scorecard.created_at;
            }
          }
        });
        
        // Create progress object from scorecards
        const progressFromScorecards = {
          id: 'from-scorecards',
          user_id: user.id,
          career_id: 'ogl-content-developer',
          skill_progress: Array.from(skillsMap.values()),
          overall_completion: 0,
          created_at: scorecardsData[0].created_at,
          updated_at: scorecardsData[0].created_at
        };
        
        // Calculate overall completion
        let totalLevels = 0;
        let completedLevels = 0;
        progressFromScorecards.skill_progress.forEach((sp: any) => {
          sp.levels_completed.forEach((lc: any) => {
            totalLevels++;
            if (lc.completed) completedLevels++;
          });
        });
        progressFromScorecards.overall_completion = totalLevels > 0 
          ? (completedLevels / totalLevels) * 100 
          : 0;
        
        setProgress(progressFromScorecards);
        setStats(calculateProgressStats(progressFromScorecards));
        setTestHistory(getTestHistory(progressFromScorecards));
        setSkillProficiency(getSkillProficiency(progressFromScorecards));
        setAchievements(getRecentAchievements(progressFromScorecards));
      } else {
        // No progress yet - set empty stats
        setStats({
          completedCourses: 0,
          evaluationsPassed: 0,
          totalEvaluations: 0,
          averageScore: 0,
          totalAttempts: 0,
          skillsCompleted: 0,
          totalSkills: 0,
          overallProgress: 0
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your progress</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Log In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button onClick={() => navigate('/')} className="flex items-center hover:text-blue-600 transition p-2">
          <Home className="w-5 h-5" />
        </button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate('/careers')} className="hover:text-blue-600 transition">
          Careers
        </button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate('/careers/ogl-content-developer')} className="hover:text-blue-600 transition">
          OGL Content Developer
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-semibold">Progress</span>
      </nav>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">OGL Content Developer - Your Progress</CardTitle>
          <p className="text-gray-600 mt-2">
            Track your test results and skill development in the OGL Content Developer career path.
          </p>
        </CardHeader>
        <CardContent>
          {/* Show progress only if user has taken tests */}
          {progress && stats?.totalAttempts > 0 ? (
            <>
              {/* Overall Progress Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="font-semibold text-lg">Overall Progress</span>
                    <p className="text-sm text-gray-600 mt-1">
                      You've completed {stats.evaluationsPassed} evaluation{stats.evaluationsPassed !== 1 ? 's' : ''} with an average score of {stats.averageScore}%
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{Math.round(stats.overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all" 
                    style={{ width: `${stats.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-3">Test Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-4xl font-bold text-green-700 mb-1">{stats.evaluationsPassed}</p>
                    <p className="text-sm font-semibold text-green-900">Tests Passed</p>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-4xl font-bold text-blue-700 mb-1">{stats.averageScore}%</p>
                    <p className="text-sm font-semibold text-blue-900">Average Score</p>
                  </div>

                  <div className="p-5 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-4xl font-bold text-purple-700 mb-1">{stats.skillsCompleted}/{stats.totalSkills}</p>
                    <p className="text-sm font-semibold text-purple-900">Skills Completed</p>
                  </div>

                  <div className="p-5 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-4xl font-bold text-orange-700 mb-1">{stats.totalAttempts}</p>
                    <p className="text-sm font-semibold text-orange-900">Total Attempts</p>
                  </div>
                </div>
              </div>

              {/* Skills Proficiency - Show only skills with actual test data */}
              {skillProficiency.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3">Skills Progress</h4>
                  <div className="space-y-4">
                    {skillProficiency.map((skill, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium capitalize text-lg">{skill.name}</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {skill.completedLevels}/{skill.totalLevels} levels completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className={`h-3 rounded-full ${
                              skill.percentage >= 80 ? 'bg-green-500' :
                              skill.percentage >= 50 ? 'bg-blue-500' :
                              skill.percentage >= 25 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Average Score: {skill.avgScore}%</span>
                          <span className="font-medium">{skill.proficiency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test History - Show actual test results */}
              {testHistory.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3">Test History</h4>
                  <div className="space-y-2">
                    {testHistory.map((test, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            test.passed ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {test.passed ? (
                              <Trophy className="w-6 h-6 text-green-600" />
                            ) : (
                              <Target className="w-6 h-6 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{test.skill} - {test.level}</p>
                            <p className="text-sm text-gray-600">{formatDate(test.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            test.score >= 80 ? 'text-green-600' :
                            test.score >= 60 ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {test.score}%
                          </p>
                          <p className="text-xs text-gray-600">
                            {test.passed ? 'Passed' : 'In Progress'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
                <h4 className="font-semibold text-lg mb-3 text-indigo-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Continue Your Progress
                </h4>
                <p className="text-sm text-indigo-800 mb-4">
                  {stats.averageScore >= 80 
                    ? 'Excellent work! Keep challenging yourself with more advanced levels.'
                    : stats.averageScore >= 60
                    ? 'Good progress! Continue practicing to improve your scores.'
                    : 'Keep learning and practicing to build your skills.'}
                </p>
                <button
                  onClick={() => navigate('/careers/ogl-content-developer')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Take More Tests
                </button>
              </div>
            </>
          ) : (
            /* No Tests Taken Yet */
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-lg border-2 border-indigo-200 text-center">
              <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-semibold text-xl mb-3 text-indigo-900">No Tests Taken Yet</h4>
              <p className="text-indigo-800 mb-6">
                You haven't taken any evaluations for the OGL Content Developer career yet. Start testing your skills to track your progress.
              </p>
              <button
                onClick={() => navigate('/careers/ogl-content-developer')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                Start Your First Test
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OGLProgress;
