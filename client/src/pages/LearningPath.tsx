import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Lock, Play, Code, Loader2 } from 'lucide-react';

export default function LearningPath() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // Load all careers from database
      const { data: careersData, error: careersError } = await supabase
        .from('careers')
        .select('*')
        .order('experience_level', { ascending: true });

      if (careersError) throw careersError;

      if (careersData) {
        setCareers(careersData);

        // Load user's test progress if logged in
        if (user) {
          const { data: scorecardsData } = await supabase
            .from('scorecards')
            .select('*')
            .eq('user_id', user.id);

          if (scorecardsData) {
            // Group scorecards by career_id (now stored in scorecards table)
            const progressMap = new Map();
            
            scorecardsData.forEach(scorecard => {
              const skill = scorecard.skill?.toLowerCase();
              const level = scorecard.level_attempted?.toLowerCase();
              const careerId = scorecard.career_id;
              
              // If scorecard has career_id, use it directly
              // Otherwise, fall back to matching by skill
              let career = null;
              if (careerId) {
                career = careersData.find(c => c.id === careerId);
              } else {
                // Fallback: Find which career this skill belongs to
                // For old scorecards without career_id
                const matchingCareers = careersData.filter(c => 
                  c.skills?.some((s: any) => 
                    s.name?.toLowerCase() === skill
                  )
                );
                
                // Prefer career with fewer skills (more specific)
                if (matchingCareers.length > 0) {
                  career = matchingCareers.sort((a, b) => 
                    (a.skills?.length || 0) - (b.skills?.length || 0)
                  )[0];
                }
              }

              if (career) {
                if (!progressMap.has(career.id)) {
                  progressMap.set(career.id, {
                    career_name: career.name,
                    tests_taken: 0,
                    tests_passed: 0,
                    total_score: 0,
                    skills_progress: new Map() // Track each skill's progress
                  });
                }

                const progress = progressMap.get(career.id);
                progress.tests_taken++;
                progress.total_score += scorecard.overall_score;
                
                if (scorecard.level_readiness !== 'BELOW_EXPECTATION') {
                  progress.tests_passed++;
                }

                // Track skill-level progress
                if (!progress.skills_progress.has(skill)) {
                  progress.skills_progress.set(skill, {
                    easy: { taken: false, passed: false, score: 0 },
                    medium: { taken: false, passed: false, score: 0 },
                    hard: { taken: false, passed: false, score: 0 }
                  });
                }

                const skillProgress = progress.skills_progress.get(skill);
                if (skillProgress[level]) {
                  skillProgress[level].taken = true;
                  skillProgress[level].passed = scorecard.level_readiness !== 'BELOW_EXPECTATION';
                  skillProgress[level].score = Math.max(skillProgress[level].score, scorecard.overall_score);
                }
              }
            });

            // Calculate averages and completion status
            progressMap.forEach((progress, careerId) => {
              progress.avg_score = Math.round(progress.total_score / progress.tests_taken);
              
              // Check if all skills at medium level are completed
              const career = careersData.find(c => c.id === careerId);
              if (career) {
                const totalSkills = career.skills?.length || 0;
                let mediumCompleted = 0;
                
                progress.skills_progress.forEach((levels, skillName) => {
                  if (levels.medium.taken && levels.medium.passed) {
                    mediumCompleted++;
                  }
                });
                
                progress.medium_completion = totalSkills > 0 ? (mediumCompleted / totalSkills) * 100 : 0;
                progress.is_qualified = mediumCompleted === totalSkills && totalSkills > 0;
              }
            });

            setUserProgress(progressMap);
          }
        }
      }
    } catch (error) {
      console.error('Error loading learning path data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'fresher':
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'entry-level':
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'mid-level':
      case 'advanced':
        return 'bg-yellow-100 text-yellow-700';
      case 'senior':
      case 'expert':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCareerProgress = (careerId: string) => {
    const progress = userProgress.get(careerId);
    if (!progress) return 0;
    
    // Progress is based on medium level completion
    return Math.round(progress.medium_completion || 0);
  };

  const isCareerCompleted = (careerId: string) => {
    const progress = userProgress.get(careerId);
    return progress?.is_qualified || false;
  };

  const hasCareerProgress = (careerId: string) => {
    return userProgress.has(careerId);
  };

  const getQualificationStatus = (careerId: string) => {
    const progress = userProgress.get(careerId);
    if (!progress) return null;
    
    const career = careers.find(c => c.id === careerId);
    if (!career) return null;
    
    const totalSkills = career.skills?.length || 0;
    let mediumCompleted = 0;
    
    progress.skills_progress.forEach((levels: any) => {
      if (levels.medium.taken && levels.medium.passed) {
        mediumCompleted++;
      }
    });
    
    return {
      completed: mediumCompleted,
      total: totalSkills,
      qualified: mediumCompleted === totalSkills && totalSkills > 0
    };
  };

  const handleCareerClick = (career: any) => {
    const slug = career.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    navigate(`/careers/${slug}`);
  };

  const overallProgress = careers.length > 0
    ? Math.round(careers.reduce((acc, career) => acc + getCareerProgress(career.id), 0) / careers.length)
    : 0;

  const completedCount = careers.filter(c => isCareerCompleted(c.id)).length;
  const inProgressCount = careers.filter(c => !isCareerCompleted(c.id) && getCareerProgress(c.id) > 0).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Learning Journey</h1>
            <p className="text-xl text-blue-100 mb-4">
              Master {careers.length} career paths and build your skills
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-3xl font-bold">{completedCount}</div>
                <div className="text-sm text-blue-100">Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-3xl font-bold">{inProgressCount}</div>
                <div className="text-sm text-blue-100">In Progress</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-3xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-blue-100">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career, index) => {
            const progress = getCareerProgress(career.id);
            const completed = isCareerCompleted(career.id);
            const hasProgress = hasCareerProgress(career.id);
            const qualStatus = getQualificationStatus(career.id);
            const userCareerProgress = userProgress.get(career.id);

            return (
              <Card
                key={career.id}
                className={`border-2 transition-all duration-300 ${
                  completed
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 hover:scale-105 cursor-pointer'
                    : hasProgress
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-xl hover:scale-105 cursor-pointer'
                    : 'border-gray-300 bg-white hover:shadow-lg hover:scale-105 cursor-pointer'
                }`}
                onClick={() => handleCareerClick(career)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{index + 1}</div>
                      <Badge className={getLevelColor(career.experience_level)} variant="secondary">
                        {career.experience_level}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{career.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{career.description}</p>
                </CardHeader>
                <CardContent>
                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.skills?.slice(0, 3).map((skill: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                      {career.skills?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{career.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Qualification Roadmap */}
                  {hasProgress && qualStatus && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-blue-900">Qualification Progress</p>
                        <span className="text-xs font-bold text-blue-700">
                          {qualStatus.completed}/{qualStatus.total} Skills
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <p className="text-xs text-blue-800">
                        {qualStatus.qualified 
                          ? '✅ Qualified! All skills at Medium level completed'
                          : `Complete all ${qualStatus.total} skills at Medium level to qualify`
                        }
                      </p>
                    </div>
                  )}

                  {/* Progress for careers with tests */}
                  {hasProgress && userCareerProgress && (
                    <div className="mb-4 text-xs space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Tests Taken:</span>
                        <span className="font-semibold">{userCareerProgress.tests_taken}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Average Score:</span>
                        <span className="font-semibold">{userCareerProgress.avg_score}%</span>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mb-3">
                    {completed ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">✅ Qualified</span>
                      </div>
                    ) : hasProgress ? (
                      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                        <Circle className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">In Progress</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-2 rounded">
                        <Circle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Not Started</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    variant={completed ? 'outline' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCareerClick(career);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {completed ? 'Review Career' : hasProgress ? 'Continue Tests' : 'Start Career Path'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overall Progress Card */}
        <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              Overall Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Completed Careers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount} / {careers.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Skills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {careers.reduce((acc, c) => acc + (c.skills?.length || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
                </div>
              </div>
              <div>
                <Progress value={overallProgress} className="h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
