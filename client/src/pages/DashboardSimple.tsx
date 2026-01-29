import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Loader2,
  AlertCircle
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

const DashboardSimple = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [career, setCareer] = useState<Career | null>(null);
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
      // Get user progress from existing table
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError) {
        console.log('No progress found:', progressError);
        setIsLoading(false);
        return;
      }

      setUserProgress(progressData);

      // Get career details
      if (progressData.career_id) {
        const { data: careerData } = await supabase
          .from('careers')
          .select('*')
          .eq('id', progressData.career_id)
          .single();

        if (careerData) {
          setCareer(careerData);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'hard':
      case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'medium':
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'easy':
      case 'basic': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
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
              onClick={() => navigate('/scorecard')}
            >
              <CheckCircle className="w-6 h-6" />
              <span>View Scorecards</span>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardSimple;
