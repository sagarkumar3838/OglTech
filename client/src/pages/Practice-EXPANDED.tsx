import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Target, Briefcase } from 'lucide-react';

// EXPANDED: 45+ Languages across 10 categories
const LANGUAGES = [
  // Web Development (7)
  { value: 'html', label: 'HTML', category: 'Web Development' },
  { value: 'css', label: 'CSS', category: 'Web Development' },
  { value: 'javascript', label: 'JavaScript', category: 'Web Development' },
  { value: 'typescript', label: 'TypeScript', category: 'Web Development' },
  { value: 'react', label: 'React', category: 'Web Development' },
  { value: 'angular', label: 'Angular', category: 'Web Development' },
  { value: 'vue', label: 'Vue.js', category: 'Web Development' },
  
  // Backend (8)
  { value: 'java', label: 'Java', category: 'Backend' },
  { value: 'python', label: 'Python', category: 'Backend' },
  { value: 'nodejs', label: 'Node.js', category: 'Backend' },
  { value: 'csharp', label: 'C#', category: 'Backend' },
  { value: 'php', label: 'PHP', category: 'Backend' },
  { value: 'ruby', label: 'Ruby', category: 'Backend' },
  { value: 'go', label: 'Go', category: 'Backend' },
  { value: 'rust', label: 'Rust', category: 'Backend' },
  
  // Database (5)
  { value: 'sql', label: 'SQL', category: 'Database' },
  { value: 'oracle', label: 'Oracle Database', category: 'Database' },
  { value: 'postgresql', label: 'PostgreSQL', category: 'Database' },
  { value: 'mongodb', label: 'MongoDB', category: 'Database' },
  { value: 'redis', label: 'Redis', category: 'Database' },
  
  // Mobile (4)
  { value: 'kotlin', label: 'Kotlin', category: 'Mobile' },
  { value: 'swift', label: 'Swift', category: 'Mobile' },
  { value: 'flutter', label: 'Flutter', category: 'Mobile' },
  { value: 'reactnative', label: 'React Native', category: 'Mobile' },
  
  // DevOps (8)
  { value: 'docker', label: 'Docker', category: 'DevOps' },
  { value: 'kubernetes', label: 'Kubernetes', category: 'DevOps' },
  { value: 'linux', label: 'Linux', category: 'DevOps' },
  { value: 'aws', label: 'AWS', category: 'Cloud' },
  { value: 'azure', label: 'Azure', category: 'Cloud' },
  { value: 'gcp', label: 'Google Cloud', category: 'Cloud' },
  { value: 'terraform', label: 'Terraform', category: 'DevOps' },
  { value: 'ansible', label: 'Ansible', category: 'DevOps' },
  
  // Graphics & Game Dev (5)
  { value: 'opengl', label: 'OpenGL', category: 'Graphics' },
  { value: 'glsl', label: 'GLSL', category: 'Graphics' },
  { value: 'cpp', label: 'C++', category: 'Graphics' },
  { value: 'unity', label: 'Unity', category: 'Game Dev' },
  { value: 'unreal', label: 'Unreal Engine', category: 'Game Dev' },
  
  // DevTools (4)
  { value: 'devtools', label: 'Browser DevTools', category: 'DevTools' },
  { value: 'webpack', label: 'Webpack', category: 'DevTools' },
  { value: 'git', label: 'Git', category: 'DevTools' },
  { value: 'vscode', label: 'VS Code Extensions', category: 'DevTools' },
  
  // Testing (3)
  { value: 'selenium', label: 'Selenium', category: 'Testing' },
  { value: 'jest', label: 'Jest', category: 'Testing' },
  { value: 'cypress', label: 'Cypress', category: 'Testing' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate', icon: '🚀' },
  { value: 'advanced', label: 'Advanced', icon: '⭐' },
];

export default function Practice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState('javascript');
  const [level, setLevel] = useState('beginner');
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendedRoles, setRecommendedRoles] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    loadQuestions();
  }, [skill, level]);

  const loadQuestions = async () => {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    setStartTime(Date.now());
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('skill', skill)
        .eq('level', level)
        .limit(20);
      
      if (error) throw error;
      
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });
    
    const percentage = (correctCount / questions.length) * 100;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    setScore(correctCount);
    setShowResults(true);
    
    // Get job recommendations
    const { data: roles } = await supabase
      .from('job_roles')
      .select('*')
      .lte('min_score_percentage', percentage)
      .contains('required_skills', [skill])
      .order('min_score_percentage', { ascending: false })
      .limit(5);
    
    setRecommendedRoles(roles || []);
    
    // Save result
    if (user) {
      await supabase.from('practice_results').insert({
        user_id: user.id,
        skill,
        level,
        score: correctCount,
        total_questions: questions.length,
        percentage,
        time_taken_seconds: timeTaken,
        recommended_roles: roles
      });
    }
  };

  const allAnswered = questions.every(q => selectedAnswers[q.id]);
  const percentage = showResults ? ((score / questions.length) * 100).toFixed(1) : 0;

  // Group languages by category
  const languagesByCategory = LANGUAGES.reduce((acc, lang) => {
    if (!acc[lang.category]) acc[lang.category] = [];
    acc[lang.category].push(lang);
    return acc;
  }, {} as Record<string, typeof LANGUAGES>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Practice Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Test your skills and get job recommendations
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Target className="w-4 h-4" />
            <span>45+ Languages • 60+ Job Roles</span>
          </div>
        </div>

        {/* Selectors */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Language/Technology
                </label>
                <Select value={skill} onValueChange={setSkill}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languagesByCategory).map(([category, langs]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                          {category}
                        </div>
                        {langs.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Difficulty Level
                </label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(lvl => (
                      <SelectItem key={lvl.value} value={lvl.value}>
                        {lvl.icon} {lvl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Questions</span>
              {questions.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  {Object.keys(selectedAnswers).length} / {questions.length} answered
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading questions...</p>
              </div>
            )}
            
            {!loading && questions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No questions available for this combination.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please select a different language or level.
                </p>
              </div>
            )}
            
            {!loading && questions.length > 0 && (
              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <p className="font-medium text-lg">
                      {idx + 1}. {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, value]: [string, any]) => {
                        const isSelected = selectedAnswers[q.id] === key;
                        const isCorrect = showResults && q.correct_answer === key;
                        const isWrong = showResults && isSelected && !isCorrect;
                        
                        return (
                          <button
                            key={key}
                            onClick={() => !showResults && setSelectedAnswers(prev => ({
                              ...prev,
                              [q.id]: key
                            }))}
                            className={`w-full text-left border rounded-lg p-4 transition-all ${
                              isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                              isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                              isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                              'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                            }`}
                            disabled={showResults}
                          >
                            <span className="font-semibold">{key.toUpperCase()}.</span> {value}
                          </button>
                        );
                      })}
                    </div>
                    {showResults && q.explanation && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                        <strong className="text-blue-900 dark:text-blue-100">Explanation:</strong>
                        <p className="text-blue-800 dark:text-blue-200 mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!showResults && questions.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  size="lg"
                  className="px-8"
                >
                  Submit Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && (
          <>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">
                    {score} / {questions.length}
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Score: {percentage}%
                  </p>
                  <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Level: {level}</span>
                    <span>•</span>
                    <span>Skill: {LANGUAGES.find(l => l.value === skill)?.label}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {recommendedRoles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Recommended Job Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedRoles.map(role => (
                      <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{role.role_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {role.category}
                              </span>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                                {role.salary_range}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded">
                                {role.experience_level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={loadQuestions} variant="outline" size="lg">
                Try Again
              </Button>
              <Button onClick={() => navigate('/dashboard')} size="lg">
                View Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
