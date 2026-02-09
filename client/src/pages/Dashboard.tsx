import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { AdminLayout } from '../components/AdminLayout';
import { UserProfileCard } from '../components/UserProfileCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Loader2,
  AlertCircle,
  History,
  Trophy,
  XCircle
} from 'lucide-react';

interface UserProgress {
  id: string;
  user_id: string;
  career_id: string;
  skill_progress: SkillProgress[];
  overall_completion: number;
}

interface SkillProgress {
  skill_name: string;
  unlocked_levels: string[];
  levels_completed: LevelCompletion[];
}

interface LevelCompletion {
  level: string;
  completed: boolean;
  best_score: number;
  attempts: number;
  last_attempt_date?: string;
}

interface Career {
  id: string;
  name: string;
  description: string;
  skills: any[];
}

interface RecentTest {
  skill: string;
  level_attempted: string;
  overall_score: number;
  level_readiness: string;
  created_at: string;
  correct_count: number;
  total_questions: number;
}

interface PracticeResult {
  id: string;
  skill: string;
  level: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  created_at: string;
  recommended_roles: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [career, setCareer] = useState<Career | null>(null);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [practiceResults, setPracticeResults] = useState<PracticeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // DON'T use user_progress - it causes 406 errors
      // Instead, build progress from scorecards which works fine
      console.log('Loading dashboard data from scorecards only...');
      
      const { data: scorecardsData, error: scorecardsError } = await supabase
        .from('scorecards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scorecardsError) {
        console.error('Error loading scorecards:', scorecardsError);
        setIsLoading(false);
        return;
      }

      // Store recent 5 tests for history display
      if (scorecardsData && scorecardsData.length > 0) {
        const recentTestsData = scorecardsData.slice(0, 5).map(sc => ({
          skill: sc.skill,
          level_attempted: sc.level_attempted,
          overall_score: sc.overall_score,
          level_readiness: sc.level_readiness,
          created_at: sc.created_at,
          correct_count: sc.correct_count,
          total_questions: sc.total_questions
        }));
        setRecentTests(recentTestsData);
      }
      
      // Load practice results
      const { data: practiceData, error: practiceError } = await supabase
        .from('practice_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!practiceError && practiceData) {
        setPracticeResults(practiceData);
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
            }
          }
        });
        
        // Create progress object from scorecards
        const progressFromScorecards: UserProgress = {
          id: 'from-scorecards',
          user_id: user.id,
          career_id: scorecardsData[0].career_id || '',
          skill_progress: Array.from(skillsMap.values()),
          overall_completion: 0
        };
        
        // Calculate overall completion
        let totalLevels = 0;
        let completedLevels = 0;
        progressFromScorecards.skill_progress.forEach(sp => {
          sp.levels_completed.forEach((lc: any) => {
            totalLevels++;
            if (lc.completed) completedLevels++;
          });
        });
        progressFromScorecards.overall_completion = totalLevels > 0 
          ? (completedLevels / totalLevels) * 100 
          : 0;
        
        setUserProgress(progressFromScorecards);
        
        // Get career from first scorecard
        if (scorecardsData[0].career_id) {
          const { data: careerData } = await supabase
            .from('careers')
            .select('*')
            .eq('id', scorecardsData[0].career_id)
            .single();
          
          if (careerData) {
            setCareer(careerData);
          }
        } else {
          // Use default career
          const { data: defaultCareer } = await supabase
            .from('careers')
            .select('*')
            .limit(1)
            .single();
          
          if (defaultCareer) {
            setCareer(defaultCareer);
          }
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  if (!userProgress || !career) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Progress Data</h2>
          <p className="text-gray-600 mb-6 text-center">
            Start by selecting a career and taking some tests
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/careers')}>
              Choose Career
            </Button>
            <Button variant="outline" onClick={() => navigate('/practice')}>
              Take a Test
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const skillProgress = userProgress.skill_progress || [];
  const overallCompletion = userProgress.overall_completion || 0;

  // Calculate stats
  const totalSkills = skillProgress.length;
  const completedSkills = skillProgress.filter(sp => 
    sp.levels_completed?.some(lc => lc.completed)
  ).length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        {/* User Profile Card */}
        <UserProfileCard />

        {/* Career Header */}
        <Card className="bg-white shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{career.name}</h1>
              <p className="text-gray-600 mt-1">{career.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/careers')}
            >
              Change Career
            </Button>
          </div>

          {/* Overall Progress */}
          <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Overall Progress: {Math.round(overallCompletion)}%
                </span>
              </div>
              <span className="text-sm font-medium">
                {completedSkills}/{totalSkills} Skills Started
              </span>
            </div>
            <Progress value={overallCompletion} className="h-2" />
          </div>
        </Card>

        {/* Recent Test History */}
        {recentTests.length > 0 && (
          <Card className="bg-white shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Recent Test History
            </h2>
            <p className="text-sm text-gray-600 mb-4">Your last 5 test results</p>
            
            <div className="space-y-3">
              {recentTests.map((test, index) => {
                const passed = test.level_readiness !== 'BELOW_EXPECTATION';
                const scoreColor = test.overall_score >= 80 ? 'text-green-600' : 
                                  test.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600';
                const bgColor = passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                
                // Format date
                const testDate = new Date(test.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - testDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let timeAgo = '';
                if (diffDays === 0) timeAgo = 'Today';
                else if (diffDays === 1) timeAgo = 'Yesterday';
                else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
                else timeAgo = testDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${bgColor} hover:shadow-md transition-shadow`}
                  >
                    {/* Left: Test Info */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        passed ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {passed ? (
                          <Trophy className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>

                      {/* Test Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {test.skill} - {test.level_attempted}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            test.level_attempted === 'easy' ? 'bg-green-100 text-green-700' :
                            test.level_attempted === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {test.level_attempted}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{test.correct_count}/{test.total_questions} correct</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo}
                          </span>
                          <span>•</span>
                          <span className="text-xs">
                            {testDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })} at {testDate.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score */}
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${scoreColor}`}>
                        {test.overall_score}%
                      </div>
                      <div className={`text-xs font-semibold ${
                        passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {passed ? '✓ Passed' : '✗ Failed'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Button */}
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/analytics')}
                className="text-blue-600 hover:text-blue-700"
              >
                View All Test History →
              </Button>
            </div>
          </Card>
        )}

        {/* Skills Progress */}
        <Card className="bg-white shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Skills Progress
          </h2>

          {skillProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No skills progress yet. Take a test to get started!</p>
              <Button className="mt-4" onClick={() => navigate('/practice')}>
                Start Testing
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {skillProgress.map((skill, index) => {
                const levelsCompleted = skill.levels_completed || [];
                const completedCount = levelsCompleted.filter(lc => lc.completed).length;
                const totalLevels = levelsCompleted.length;
                const progressPercent = totalLevels > 0 
                  ? Math.round((completedCount / totalLevels) * 100)
                  : 0;

                return (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{skill.skill_name}</h3>
                          {completedCount > 0 ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <span className="text-gray-600">
                            {completedCount} of {totalLevels} levels completed
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/practice?skill=${skill.skill_name}`)}
                      >
                        Practice
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      
                      {/* Level Details */}
                      {levelsCompleted.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                          {levelsCompleted.map((level, idx) => (
                            <div 
                              key={idx}
                              className={`p-2 rounded ${level.completed ? 'bg-green-50' : 'bg-gray-50'}`}
                            >
                              <div className="font-medium text-gray-700 capitalize">{level.level}</div>
                              <div className={level.completed ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                                {level.best_score}%
                              </div>
                              <div className="text-gray-400">
                                {level.attempts} attempt{level.attempts > 1 ? 's' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Practice Results History */}
        {practiceResults.length > 0 && (
          <Card className="bg-white shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Practice Test Results
            </h2>
            <div className="space-y-3">
              {practiceResults.map((result, index) => {
                const percentage = result.percentage;
                const passed = percentage >= 60; // Pass threshold: 60%
                const excellent = percentage >= 80;
                const status = excellent ? 'Excellent' : passed ? 'Pass' : 'Fail';
                const statusColor = excellent ? 'text-green-600' : passed ? 'text-blue-600' : 'text-red-600';
                const bgColor = excellent ? 'bg-green-50' : passed ? 'bg-blue-50' : 'bg-red-50';
                const borderColor = excellent ? 'border-green-200' : passed ? 'border-blue-200' : 'border-red-200';
                
                // Format date
                const testDate = new Date(result.created_at);
                const timeAgo = testDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                // Map database level to display level
                const displayLevel = result.level === 'easy' ? 'Beginner' :
                                   result.level === 'medium' ? 'Intermediate' :
                                   result.level === 'hard' ? 'Advanced' : result.level;

                return (
                  <div 
                    key={result.id}
                    className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left: Test Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {result.skill}
                          </h3>
                          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700 border">
                            {displayLevel}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold">
                            Score: {result.score}/{result.total_questions}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Right: Score Circle */}
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                          excellent ? 'bg-green-100 text-green-700' :
                          passed ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {Math.round(percentage)}%
                        </div>
                      </div>
                    </div>

                    {/* Learning Roadmap based on score */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">📍 Next Steps:</p>
                      {excellent ? (
                        <p className="text-xs text-gray-600">
                          ✅ Excellent! Try the next level or explore related skills.
                        </p>
                      ) : passed ? (
                        <p className="text-xs text-gray-600">
                          👍 Good job! Review weak areas and try again for a higher score.
                        </p>
                      ) : (
                        <p className="text-xs text-gray-600">
                          📚 Study the materials and retake the test. Focus on fundamentals.
                        </p>
                      )}
                    </div>

                    {/* Job Recommendations */}
                    {result.recommended_roles && result.recommended_roles.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💼 Recommended Jobs:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.recommended_roles.slice(0, 3).map((role: any, idx: number) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {role.role_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall Practice Stats */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Your Practice Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {practiceResults.length}
                  </div>
                  <div className="text-xs text-gray-600">Total Tests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {practiceResults.filter(r => r.percentage >= 60).length}
                  </div>
                  <div className="text-xs text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(practiceResults.reduce((sum, r) => sum + r.percentage, 0) / practiceResults.length)}%
                  </div>
                  <div className="text-xs text-gray-600">Avg Score</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/practice')}
            >
              <Target className="w-6 h-6" />
              <span>Take Assessment</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/learning-path')}
            >
              <TrendingUp className="w-6 h-6" />
              <span>View Learning Path</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/careers')}
            >
              <CheckCircle className="w-6 h-6" />
              <span>View All Careers</span>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
