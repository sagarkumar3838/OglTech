import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Medal,
  Users
} from 'lucide-react';

interface CareerData {
  id: string;
  name: string;
  skills: any[];
}

interface SkillStats {
  skill: string;
  easy: { taken: boolean; passed: boolean; score: number; attempts: number };
  medium: { taken: boolean; passed: boolean; score: number; attempts: number };
  hard: { taken: boolean; passed: boolean; score: number; attempts: number };
  totalAttempts: number;
  avgScore: number;
  bestScore: number;
}

interface RankingData {
  userRank: number;
  totalUsers: number;
  userAvgScore: number;
  topScore: number;
  percentile: number;
}

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<CareerData[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerData | null>(null);
  const [skillStats, setSkillStats] = useState<SkillStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    avgScore: 0,
    testsPassedCount: 0,
    testsFailedCount: 0
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Load all careers
      const { data: careersData, error: careersError } = await supabase
        .from('careers')
        .select('*')
        .order('experience_level', { ascending: true });

      if (careersError) throw careersError;

      if (careersData) {
        setCareers(careersData);

        // Load user's scorecards
        const { data: scorecardsData, error: scorecardsError } = await supabase
          .from('scorecards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (scorecardsError) throw scorecardsError;

        if (scorecardsData && scorecardsData.length > 0) {
          // Find which career has the most tests
          const careerTestCounts = new Map<string, number>();
          scorecardsData.forEach(sc => {
            if (sc.career_id) {
              careerTestCounts.set(sc.career_id, (careerTestCounts.get(sc.career_id) || 0) + 1);
            }
          });

          // Select career with most tests, or first career if no career_id
          let primaryCareerId = null;
          if (careerTestCounts.size > 0) {
            primaryCareerId = Array.from(careerTestCounts.entries())
              .sort((a, b) => b[1] - a[1])[0][0];
          }

          const primaryCareer = careersData.find(c => c.id === primaryCareerId) || careersData[0];
          setSelectedCareer(primaryCareer);

          // Calculate overall stats for the selected career only
          const careerScorecards = scorecardsData.filter(sc => sc.career_id === primaryCareer.id);
          const totalTests = careerScorecards.length;
          const totalScore = careerScorecards.reduce((sum, sc) => sum + sc.overall_score, 0);
          const avgScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
          const testsPassedCount = careerScorecards.filter(sc => sc.level_readiness !== 'BELOW_EXPECTATION').length;
          const testsFailedCount = totalTests - testsPassedCount;

          setOverallStats({
            totalTests,
            avgScore,
            testsPassedCount,
            testsFailedCount
          });

          // Calculate skill-level stats for selected career
          if (primaryCareer) {
            calculateSkillStats(scorecardsData, primaryCareer);
            await calculateRanking(primaryCareer.id, avgScore);
          }
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSkillStats = (scorecards: any[], career: CareerData) => {
    const skillsMap = new Map<string, SkillStats>();

    // Initialize skills from career
    career.skills?.forEach((skill: any) => {
      const skillName = skill.name.toLowerCase();
      skillsMap.set(skillName, {
        skill: skill.name,
        easy: { taken: false, passed: false, score: 0, attempts: 0 },
        medium: { taken: false, passed: false, score: 0, attempts: 0 },
        hard: { taken: false, passed: false, score: 0, attempts: 0 },
        totalAttempts: 0,
        avgScore: 0,
        bestScore: 0
      });
    });

    // Process scorecards - ONLY for this specific career
    scorecards.forEach(sc => {
      const skillName = sc.skill?.toLowerCase();
      const level = sc.level_attempted?.toLowerCase();
      
      // IMPORTANT: Only process scorecards that belong to this career
      // This ensures HTML tests for "OGL Content Developer" don't show up in "OGL Tester"
      const belongsToThisCareer = sc.career_id === career.id;
      
      if (belongsToThisCareer && skillsMap.has(skillName) && (level === 'easy' || level === 'medium' || level === 'hard')) {
        const stats = skillsMap.get(skillName)!;
        const levelStats = stats[level];

        levelStats.taken = true;
        levelStats.attempts++;
        stats.totalAttempts++;

        // Update best score
        if (sc.overall_score > levelStats.score) {
          levelStats.score = sc.overall_score;
          levelStats.passed = sc.level_readiness !== 'BELOW_EXPECTATION';
        }

        // Update best overall score
        if (sc.overall_score > stats.bestScore) {
          stats.bestScore = sc.overall_score;
        }
      }
    });

    // Calculate average scores
    skillsMap.forEach((stats, skillName) => {
      const scores = [stats.easy.score, stats.medium.score, stats.hard.score].filter(s => s > 0);
      stats.avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    });

    setSkillStats(Array.from(skillsMap.values()));
  };

  const calculateRanking = async (careerId: string, userAvgScore: number) => {
    try {
      // Get all users' scorecards for this career
      const { data: allScorecards, error } = await supabase
        .from('scorecards')
        .select('user_id, overall_score, career_id')
        .eq('career_id', careerId);

      if (error) throw error;

      if (allScorecards && allScorecards.length > 0) {
        // Calculate average score per user
        const userScores = new Map<string, number[]>();
        
        allScorecards.forEach(sc => {
          if (!userScores.has(sc.user_id)) {
            userScores.set(sc.user_id, []);
          }
          userScores.get(sc.user_id)!.push(sc.overall_score);
        });

        // Calculate average for each user
        const userAverages = Array.from(userScores.entries()).map(([userId, scores]) => ({
          userId,
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        }));

        // Sort by average score (descending)
        userAverages.sort((a, b) => b.avgScore - a.avgScore);

        // Find user's rank
        const userRank = userAverages.findIndex(u => u.userId === user?.id) + 1;
        const totalUsers = userAverages.length;
        const topScore = userAverages[0]?.avgScore || 0;
        const percentile = totalUsers > 1 ? Math.round(((totalUsers - userRank + 1) / totalUsers) * 100) : 100;

        setRankingData({
          userRank,
          totalUsers,
          userAvgScore,
          topScore,
          percentile
        });
      }
    } catch (error) {
      console.error('Error calculating ranking:', error);
    }
  };

  const handleCareerChange = (career: CareerData) => {
    setSelectedCareer(career);
    
    // Reload scorecards for this specific career
    if (user) {
      supabase
        .from('scorecards')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            // Filter scorecards for this career only
            const careerScorecards = data.filter(sc => sc.career_id === career.id);
            
            // Recalculate overall stats for this career
            const totalTests = careerScorecards.length;
            const totalScore = careerScorecards.reduce((sum, sc) => sum + sc.overall_score, 0);
            const avgScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
            const testsPassedCount = careerScorecards.filter(sc => sc.level_readiness !== 'BELOW_EXPECTATION').length;
            const testsFailedCount = totalTests - testsPassedCount;

            setOverallStats({
              totalTests,
              avgScore,
              testsPassedCount,
              testsFailedCount
            });
            
            // Calculate skill stats for this career
            calculateSkillStats(data, career);
            
            // Calculate ranking for this career
            calculateRanking(career.id, avgScore);
          }
        });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view analytics</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (overallStats.totalTests === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Test Data Yet</h2>
          <p className="text-gray-600 mb-6 text-center">
            Take some tests to see your analytics and track your progress
          </p>
          <button
            onClick={() => navigate('/careers')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Taking Tests
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Your Analytics
          </h1>
          <p className="text-gray-600">Track your progress and performance across skills and levels</p>
        </div>

        {/* Career Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Career</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {careers.map(career => (
                <button
                  key={career.id}
                  onClick={() => handleCareerChange(career)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedCareer?.id === career.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {career.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalTests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(overallStats.avgScore)}`}>
                    {overallStats.avgScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tests Passed</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.testsPassedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Need Practice</p>
                  <p className="text-2xl font-bold text-red-600">{overallStats.testsFailedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Component */}
        {rankingData && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Trophy className="w-6 h-6 text-amber-600" />
                Your Ranking
              </CardTitle>
              <p className="text-sm text-amber-700">
                See how you compare with other users in {selectedCareer?.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* User Rank */}
                <div className="bg-white rounded-lg p-5 border-2 border-amber-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Medal className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Your Rank</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    #{rankingData.userRank}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    out of {rankingData.totalUsers} users
                  </p>
                </div>

                {/* Percentile */}
                <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Percentile</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {rankingData.percentile}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {rankingData.percentile >= 75 ? 'Top performer!' : 
                     rankingData.percentile >= 50 ? 'Above average' : 
                     'Keep improving!'}
                  </p>
                </div>

                {/* Your Score */}
                <div className="bg-white rounded-lg p-5 border-2 border-purple-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Your Avg</p>
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(rankingData.userAvgScore)}`}>
                    {Math.round(rankingData.userAvgScore)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Average score
                  </p>
                </div>

                {/* Top Score */}
                <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Top Score</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(rankingData.topScore)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {rankingData.userRank === 1 ? "That's you!" : 
                     `${Math.round(rankingData.topScore - rankingData.userAvgScore)}% to reach`}
                  </p>
                </div>
              </div>

              {/* Progress to Top */}
              {rankingData.userRank > 1 && (
                <div className="mt-4 bg-white rounded-lg p-4 border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Progress to #1</p>
                    <p className="text-sm font-semibold text-amber-600">
                      {Math.round((rankingData.userAvgScore / rankingData.topScore) * 100)}%
                    </p>
                  </div>
                  <Progress 
                    value={(rankingData.userAvgScore / rankingData.topScore) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Keep practicing to climb the ranks! 🚀
                  </p>
                </div>
              )}

              {/* Achievement Badge */}
              {rankingData.userRank === 1 && (
                <div className="mt-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg p-4 text-center">
                  <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">🎉 You're #1! 🎉</p>
                  <p className="text-sm text-amber-900 mt-1">
                    You're the top performer in {selectedCareer?.name}!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Skills Breakdown */}
        {selectedCareer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                {selectedCareer.name} - Skills Progress
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Your performance across different skills and difficulty levels
              </p>
            </CardHeader>
            <CardContent>
              {skillStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No test data for this career yet</p>
                  <button
                    onClick={() => navigate('/careers')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Take a Test
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {skillStats.map((skill, idx) => (
                    <div key={idx} className="border rounded-lg p-5 bg-gray-50">
                      {/* Skill Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{skill.skill}</h3>
                          <p className="text-sm text-gray-600">
                            {skill.totalAttempts} attempt{skill.totalAttempts !== 1 ? 's' : ''} • 
                            Best: <span className={`font-semibold ${getScoreColor(skill.bestScore)}`}>
                              {skill.bestScore}%
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Average Score</p>
                          <p className={`text-3xl font-bold ${getScoreColor(skill.avgScore)}`}>
                            {skill.avgScore}%
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <Progress value={skill.avgScore} className="h-3" />
                      </div>

                      {/* Level Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Easy Level */}
                        <div className={`p-4 rounded-lg border-2 ${
                          skill.easy.taken 
                            ? skill.easy.passed 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-red-50 border-red-300'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getLevelColor('easy')}>Easy</Badge>
                            {skill.easy.taken && (
                              skill.easy.passed 
                                ? <CheckCircle className="w-5 h-5 text-green-600" />
                                : <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {skill.easy.taken ? (
                            <>
                              <p className={`text-2xl font-bold ${getScoreColor(skill.easy.score)}`}>
                                {skill.easy.score}%
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {skill.easy.attempts} attempt{skill.easy.attempts !== 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Not attempted</p>
                          )}
                        </div>

                        {/* Medium Level */}
                        <div className={`p-4 rounded-lg border-2 ${
                          skill.medium.taken 
                            ? skill.medium.passed 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-red-50 border-red-300'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getLevelColor('medium')}>Medium</Badge>
                            {skill.medium.taken && (
                              skill.medium.passed 
                                ? <CheckCircle className="w-5 h-5 text-green-600" />
                                : <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {skill.medium.taken ? (
                            <>
                              <p className={`text-2xl font-bold ${getScoreColor(skill.medium.score)}`}>
                                {skill.medium.score}%
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {skill.medium.attempts} attempt{skill.medium.attempts !== 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Not attempted</p>
                          )}
                        </div>

                        {/* Hard Level */}
                        <div className={`p-4 rounded-lg border-2 ${
                          skill.hard.taken 
                            ? skill.hard.passed 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-red-50 border-red-300'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getLevelColor('hard')}>Hard</Badge>
                            {skill.hard.taken && (
                              skill.hard.passed 
                                ? <CheckCircle className="w-5 h-5 text-green-600" />
                                : <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {skill.hard.taken ? (
                            <>
                              <p className={`text-2xl font-bold ${getScoreColor(skill.hard.score)}`}>
                                {skill.hard.score}%
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {skill.hard.attempts} attempt{skill.hard.attempts !== 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Not attempted</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Keep Improving!</h3>
                <p className="text-blue-100">
                  Practice more to improve your scores and master all skills
                </p>
              </div>
              <button
                onClick={() => navigate('/careers')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
              >
                Take More Tests
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
