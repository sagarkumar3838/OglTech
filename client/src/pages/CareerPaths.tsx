import { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '../config/supabase';
import { 
  Rocket, Brain, Coffee, Zap, Smartphone, Shield, 
  Palette, Cloud, TrendingUp, Lightbulb, Target, CheckCircle2
} from 'lucide-react';

const INTEREST_OPTIONS = [
  { 
    id: 'coding-building-apps', 
    label: 'Coding + Building Apps', 
    icon: Rocket,
    description: 'I love creating web applications and products'
  },
  { 
    id: 'math-logic-future-tech', 
    label: 'Math + Logic + Future Tech', 
    icon: Brain,
    description: 'I\'m interested in AI, ML, and data science'
  },
  { 
    id: 'big-companies-stable-jobs', 
    label: 'Big Companies / Stable Jobs', 
    icon: Coffee,
    description: 'I want to work in established enterprises'
  },
  { 
    id: 'core-programming-problem-solving', 
    label: 'Core Programming / Problem Solving', 
    icon: Zap,
    description: 'I enjoy algorithms and competitive programming'
  },
  { 
    id: 'design-creativity', 
    label: 'Design + Creativity', 
    icon: Palette,
    description: 'I want to combine design with development'
  },
  { 
    id: 'security-hacking-defense', 
    label: 'Security / Hacking / Defense', 
    icon: Shield,
    description: 'I\'m passionate about cybersecurity'
  },
];

const ICON_MAP: Record<string, string> = {
  '⚛️': 'React',
  '🤖': 'AI',
  '☕': 'Java',
  '⚡': 'Performance',
  '📱': 'Mobile',
  '🔒': 'Security',
  '🎨': 'Design',
  '☁️': 'Cloud',
  '🚀': 'Rocket',
  '💰': 'Money',
  '✨': 'Sparkles',
  '🛡️': 'Shield',
};

export default function CareerPaths() {
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [careerFormulas, setCareerFormulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedInterest) {
      loadRecommendations(selectedInterest);
    }
  }, [selectedInterest]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all career paths
      const { data: paths } = await supabase
        .from('career_paths')
        .select('*')
        .order('popularity_score', { ascending: false });
      
      setCareerPaths(paths || []);

      // Load career formulas
      const { data: formulas } = await supabase
        .from('career_formulas')
        .select('*');
      
      setCareerFormulas(formulas || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (interest: string) => {
    try {
      const { data } = await supabase
        .rpc('get_recommended_path', { user_interest: interest });
      
      setRecommendedPaths(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Career Path Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find your perfect tech career based on your interests and skills
          </p>
        </div>

        {/* Interest Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              What interests you most?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INTEREST_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedInterest === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedInterest(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className="font-semibold mb-1">{option.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Paths */}
        {selectedInterest && recommendedPaths.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedPaths.map((path, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{path.path_name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{path.description}</p>
                      </div>
                      <span className="text-4xl">{path.icon || '🎯'}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Skills Required:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(path.skill_combo || []).map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">You Can Become:</h4>
                        <ul className="space-y-1">
                          {(path.job_roles || []).slice(0, 3).map((role: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {role}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {path.salary_range}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Best for: {(path.best_for || []).slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Career Paths */}
        <Card>
          <CardHeader>
            <CardTitle>All Career Paths</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {careerPaths.map((path) => (
                  <div key={path.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{path.path_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {path.description}
                        </p>
                      </div>
                      <span className="text-3xl ml-4">{path.icon}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(path.skill_combo || []).map((skill: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Job Roles:</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {(path.job_roles || []).slice(0, 3).join(', ')}
                          {(path.job_roles || []).length > 3 && '...'}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(path.difficulty_level)}`}>
                          {path.difficulty_level}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                          {path.salary_range}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded">
                          {path.time_to_learn}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Formulas */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Golden Career Formulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {careerFormulas.map((formula) => (
                <div key={formula.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{formula.formula_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formula.description}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mb-2">
                    <div className="flex flex-wrap gap-2 items-center text-sm">
                      {(formula.components || []).map((comp: string, i: number) => (
                        <span key={i}>
                          <span className="font-semibold text-blue-800 dark:text-blue-200">{comp}</span>
                          {i < formula.components.length - 1 && <span className="mx-2">+</span>}
                        </span>
                      ))}
                      <span className="mx-2">=</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{formula.result}</span>
                    </div>
                  </div>
                  {formula.example && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Example: {formula.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
            <p className="mb-4">Take a practice test to see which path suits you best!</p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = '/practice'}
            >
              Start Practice Test
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
