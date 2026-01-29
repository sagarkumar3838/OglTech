import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateQuestions } from '../services/api';
import { Briefcase, Code, Loader, Lock, CheckCircle, Trophy, Home, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CareerDetail = () => {
  const { careerSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [career, setCareer] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCareerAndProgress();
  }, [careerSlug, user]);

  // Update document title when career loads
  useEffect(() => {
    if (career) {
      document.title = `${career.name} - OGL Career Path`;
    }
    return () => {
      document.title = 'OGL Career Platform';
    };
  }, [career]);

  const loadCareerAndProgress = async () => {
    try {
      // Create slug from career name for lookup
      // First try to find by slug, if that fails, try by ID for backward compatibility
      let careerData;
      
      // Try to find by matching slug pattern
      const { data: allCareers, error: fetchError } = await supabase
        .from('careers')
        .select('*');

      if (fetchError) throw fetchError;

      // Find career by creating slug from name and matching
      careerData = allCareers?.find(c => {
        const slug = c.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        return slug === careerSlug;
      });

      // Fallback: try to find by ID if slug doesn't match (backward compatibility)
      if (!careerData) {
        const { data: careerById, error: careerError } = await supabase
          .from('careers')
          .select('*')
          .eq('id', careerSlug)
          .single();

        if (!careerError && careerById) {
          careerData = careerById;
          // Redirect to proper slug URL
          const properSlug = careerById.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          navigate(`/careers/${properSlug}`, { replace: true });
          return;
        }
      }

      if (careerData) {
        setCareer({
          id: careerData.id,
          name: careerData.name,
          description: careerData.description,
          experienceLevel: careerData.experience_level,
          skills: careerData.skills
        });
      }

      if (user && careerData) {
        // DON'T query user_progress - it causes 406 errors
        // Build progress from scorecards (don't filter by career_id - it doesn't exist)
        const { data: scorecardsData } = await supabase
          .from('scorecards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (scorecardsData && scorecardsData.length > 0) {
          // Build progress from scorecards
          const skillsMap = new Map();
          const levelOrder = ['easy', 'medium', 'hard'];
          
          console.log('📊 Building progress from scorecards:', scorecardsData.length, 'scorecards found');
          
          scorecardsData.forEach(scorecard => {
            const skillName = scorecard.skill;
            const level = scorecard.level_attempted?.toLowerCase(); // Normalize to lowercase
            const score = scorecard.overall_score;
            const passed = scorecard.level_readiness !== 'BELOW_EXPECTATION';
            
            console.log(`Processing scorecard: skill="${skillName}", level="${level}", score=${score}, passed=${passed}`);
            
            if (!skillsMap.has(skillName)) {
              skillsMap.set(skillName, {
                skill_name: skillName,
                unlocked_levels: ['easy'], // Easy is always unlocked
                levels_completed: []
              });
            }
            
            const skill = skillsMap.get(skillName);
            if (!skill.unlocked_levels.includes(level)) {
              skill.unlocked_levels.push(level);
            }
            
            const existingLevel = skill.levels_completed.find((l: any) => l.level === level);
            if (!existingLevel) {
              skill.levels_completed.push({
                level: level,
                completed: passed,
                best_score: score,
                attempts: 1
              });
            } else {
              existingLevel.attempts++;
              if (score > existingLevel.best_score) {
                existingLevel.best_score = score;
                existingLevel.completed = passed;
              }
            }
            
            // Auto-unlock next level if current level is passed (score >= 70%)
            if (score >= 70) {
              const currentLevelIndex = levelOrder.indexOf(level);
              if (currentLevelIndex >= 0 && currentLevelIndex < levelOrder.length - 1) {
                const nextLevel = levelOrder[currentLevelIndex + 1];
                if (!skill.unlocked_levels.includes(nextLevel)) {
                  console.log(`🔓 Unlocking ${nextLevel} for ${skillName} (scored ${score}% on ${level})`);
                  skill.unlocked_levels.push(nextLevel);
                }
              }
            }
          });
          
          const progressFromScorecards = {
            id: 'from-scorecards',
            user_id: user.id,
            career_id: careerData.id,
            skill_progress: Array.from(skillsMap.values()),
            overall_completion: 0
          };
          
          console.log('✅ Final progress:', progressFromScorecards);
          
          setProgress(progressFromScorecards);
        }
      }
    } catch (error) {
      console.error('Error loading career:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLevelUnlocked = (skillName, level) => {
    const normalizedLevel = level.toLowerCase();
    
    if (!progress) {
      console.log(`🔒 No progress data, only easy unlocked for ${skillName}`);
      return normalizedLevel === 'easy';
    }

    const skillProgress = progress.skill_progress?.find(
      (sp) => sp.skill_name === skillName
    );

    if (!skillProgress) {
      console.log(`🔒 No skill progress found for ${skillName}, only easy unlocked`);
      return normalizedLevel === 'easy';
    }

    const isUnlocked = skillProgress.unlocked_levels?.includes(normalizedLevel) || false;
    console.log(`🔑 Checking ${skillName} - ${normalizedLevel}: unlocked=${isUnlocked}, unlocked_levels=`, skillProgress.unlocked_levels);
    
    return isUnlocked;
  };

  const getLevelCompletion = (skillName, level) => {
    if (!progress) return null;

    const skillProgress = progress.skill_progress?.find(
      (sp) => sp.skill_name === skillName
    );

    if (!skillProgress) return null;

    return skillProgress.levels_completed?.find((lc) => lc.level === level);
  };

  const startEvaluation = async (skill, level, useAI = true) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isLevelUnlocked(skill.name, level)) {
      alert(`${level} level is locked. Complete the previous level first!`);
      return;
    }

    setGenerating(true);
    try {
      // Normalize skill name: remove spaces, convert to lowercase
      // "OGL Knowledge" -> "oglknowledge", "HTML" -> "html"
      const normalizedSkill = skill.name.toLowerCase().replace(/\s+/g, '');
      
      // Create URL-friendly slug for skill
      const skillSlug = skill.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      // Create session ID
      const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For "From Database" option, directly navigate to evaluation page
      // The evaluation page will load questions from Supabase
      if (!useAI) {
        navigate(`/evaluation/${skillSlug}/${level.toLowerCase()}/${sessionId}`, {
          state: { 
            careerId: career.id,
            careerName: career.name,
            skillName: normalizedSkill,
            skillDisplayName: skill.name,
            level: level.toLowerCase(), 
            source: 'Database' 
          }
        });
        return;
      }

      // For AI generation, call the backend API
      const response = await generateQuestions(normalizedSkill, level, 10, useAI);
      navigate(`/evaluation/${skillSlug}/${level.toLowerCase()}/${sessionId}`, {
        state: { 
          careerId: career.id,
          careerName: career.name,
          skillName: normalizedSkill,
          skillDisplayName: skill.name,
          level, 
          source: 'AI' 
        }
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('AI question generation requires the backend server.\n\nYou can still use existing questions from the database by clicking "Start Test".');
    } finally {
      setGenerating(false);
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Career not found</h2>
      </div>
    );
  }

  const levels = ['easy', 'medium', 'hard'];

  // Check if this is OGL Content Developer career
  const isOGLCareer = careerSlug === 'ogl-content-developer' || career.name?.toLowerCase().includes('ogl content');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
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
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-semibold">{career.name}</span>
      </nav>

      {/* OGL Content Developer Navigation Bar */}
      {isOGLCareer ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white mb-2">OGL Content Developer Learning Path</h2>
            <p className="text-blue-100 text-base">
              Master game development, content creation, and interactive media design
            </p>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap bg-gray-50">
            <button
              onClick={() => navigate('/careers/ogl-content-developer/journey')}
              className="flex items-center space-x-3 px-8 py-5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b-3 border-transparent hover:border-blue-600 transition-all duration-200 flex-1 min-w-[200px] justify-center"
            >
              <span className="text-2xl">🗺️</span>
              <span className="font-semibold">Course Journey</span>
            </button>

            <button
              onClick={() => navigate('/careers/ogl-content-developer/evaluations')}
              className="flex items-center space-x-3 px-8 py-5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border-b-3 border-transparent hover:border-purple-600 transition-all duration-200 flex-1 min-w-[200px] justify-center"
            >
              <span className="text-2xl">🏆</span>
              <span className="font-semibold">Skill Evaluations</span>
            </button>

            <button
              onClick={() => navigate('/careers/ogl-content-developer/courses')}
              className="flex items-center space-x-3 px-8 py-5 text-gray-700 hover:bg-green-50 hover:text-green-600 border-b-3 border-transparent hover:border-green-600 transition-all duration-200 flex-1 min-w-[200px] justify-center"
            >
              <span className="text-2xl">📚</span>
              <span className="font-semibold">OGL Courses</span>
            </button>

            <button
              onClick={() => navigate('/careers/ogl-content-developer/hands-on')}
              className="flex items-center space-x-3 px-8 py-5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b-3 border-transparent hover:border-orange-600 transition-all duration-200 flex-1 min-w-[200px] justify-center"
            >
              <span className="text-2xl">🎮</span>
              <span className="font-semibold">Hands-on Environment</span>
            </button>

            <button
              onClick={() => navigate('/careers/ogl-content-developer/progress')}
              className="flex items-center space-x-3 px-8 py-5 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border-b-3 border-transparent hover:border-pink-600 transition-all duration-200 flex-1 min-w-[200px] justify-center"
            >
              <span className="text-2xl">📊</span>
              <span className="font-semibold">Progress</span>
            </button>
          </nav>
        </div>
      ) : null}

      {/* Career Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{career.name}</h1>
            <p className="text-gray-600">{career.description}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {career.experienceLevel}
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-xl text-blue-900">Your Progress</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-blue-700 font-medium mb-2">Skills Completed</p>
                <p className="text-3xl font-bold text-blue-900">
                  {progress.skill_progress?.filter(sp => 
                    sp.levels_completed?.every(lc => lc.completed)
                  ).length || 0} / {progress.skill_progress?.length || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-blue-700 font-medium mb-2">Levels Completed</p>
                <p className="text-3xl font-bold text-blue-900">
                  {progress.skill_progress?.reduce((acc, sp) => 
                    acc + (sp.levels_completed?.filter(lc => lc.completed).length || 0), 0
                  ) || 0} / {(progress.skill_progress?.length || 0) * 3}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-blue-700 font-medium mb-2">Average Score</p>
                <p className="text-3xl font-bold text-blue-900">
                  {Math.round(
                    progress.skill_progress?.reduce((acc, sp) => {
                      const scores = sp.levels_completed?.filter(lc => lc.best_score > 0).map(lc => lc.best_score) || [];
                      return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
                    }, 0) / (progress.skill_progress?.length || 1)
                  ) || 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
          <h2 className="text-3xl font-bold text-gray-900">Required Skills</h2>
        </div>
        
        {career.skills?.map((skill, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{skill.name}</h3>
                  {skill.required && (
                    <span className="inline-block mt-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {levels.map((level) => {
                const unlocked = isLevelUnlocked(skill.name, level);
                const completion = getLevelCompletion(skill.name, level);
                const completed = completion?.completed || false;
                const bestScore = completion?.best_score || 0;
                const attempts = completion?.attempts || 0;

                return (
                  <div
                    key={level}
                    className={`p-6 border-2 rounded-xl relative transition-all duration-300 ${
                      !unlocked
                        ? 'border-gray-300 bg-gray-50 opacity-60'
                        : completed
                        ? 'border-green-400 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="absolute top-3 right-3">
                      {!unlocked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getLevelBadgeColor(level)}`}>
                        Level {levels.indexOf(level) + 1}
                      </span>
                    </div>

                    <h4 className="font-bold text-xl mb-3 capitalize">{level}</h4>
                    
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {level === 'easy' && 'Understands the script and basic concepts'}
                      {level === 'medium' && 'Can alter, debug, and modify code'}
                      {level === 'hard' && 'Can create complete applications from scratch'}
                    </p>

                    {unlocked && attempts > 0 && (
                      <div className="text-sm space-y-2 pt-3 mb-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Best Score:</span>
                          <span className={`font-bold text-lg ${bestScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                            {bestScore}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Attempts:</span>
                          <span className="font-semibold text-gray-900">{attempts}</span>
                        </div>
                        {completed && (
                          <div className="flex items-center space-x-2 text-green-600 font-semibold pt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    )}

                    {unlocked ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => startEvaluation(skill, level, true)}
                          disabled={generating}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                        >
                          <span>🤖</span>
                          <span>AI Generated</span>
                        </button>
                        <button
                          onClick={() => startEvaluation(skill, level, false)}
                          disabled={generating}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                        >
                          <span>📚</span>
                          <span>Generated</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 pt-3 border-t border-gray-200 flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Complete previous level to unlock</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <Loader className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-semibold">Generating questions...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerDetail;
