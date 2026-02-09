import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Target, Briefcase } from 'lucide-react';
import { VoiceInputButton } from '../components/VoiceInputButton';

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
  
  // DevOps & Cloud (8)
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
      // Map Practice page levels to database levels
      const dbLevel = level === 'beginner' ? 'easy' : 
                      level === 'intermediate' ? 'medium' : 
                      level === 'advanced' ? 'hard' : level;
      
      // ONLY use questions table (has proper MCQ format with options object/array)
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('skill', skill)
        .eq('level', dbLevel)
        .eq('type', 'mcq')  // Only get MCQ questions
        .limit(10); // 10 questions per test as requested
      
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
    
    // Map level for database storage
    const dbLevel = level === 'beginner' ? 'easy' : 
                    level === 'intermediate' ? 'medium' : 
                    level === 'advanced' ? 'hard' : level;
    
    // Get job recommendations based on skill and score
    const { data: roles } = await supabase
      .from('job_roles')
      .select('*')
      .lte('min_score_percentage', percentage)
      .contains('required_skills', [skill])
      .order('min_score_percentage', { ascending: false })
      .limit(5);
    
    setRecommendedRoles(roles || []);
    
    // Save result to practice_results table
    if (user) {
      await supabase.from('practice_results').insert({
        user_id: user.id,
        skill,
        level: dbLevel,  // Use database level format
        score: correctCount,
        total_questions: questions.length,
        percentage,
        time_taken_seconds: timeTaken,
        recommended_roles: roles
      });
      
      // Also save to user_progress for tracking
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        skill,
        level: dbLevel,  // Use database level format
        score: correctCount,
        total_questions: questions.length,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,skill,level'
      });
    }
  };

  // Check if all questions are answered
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
                    <div>
                      <p className="font-medium text-lg">
                        {idx + 1}. {q.question}
                      </p>
                      {q.topic && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                          Topic: {q.topic}
                        </span>
                      )}
                    </div>
                    
                    {/* MCQ Options with Voice Input */}
                    <div className="space-y-2">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          💡 Click an option or use the microphone to speak your choice (e.g., "A", "Option A", "First option")
                        </p>
                      </div>
                      
                      {/* Voice Input Button */}
                      <div className="flex justify-center mb-3">
                        <VoiceInputButton
                          onTranscript={(text) => {
                            // Parse voice input to select option
                            const lowerText = text.toLowerCase().trim();
                            
                            // Handle both array format (options: ["A", "B", "C"]) and object format (options: {a: "...", b: "..."})
                            const isArrayFormat = Array.isArray(q.options);
                            
                            let selectedOption = null;
                            
                            if (isArrayFormat) {
                              // Array format: match by index
                              const numbers = ['first', 'second', 'third', 'fourth', 'fifth'];
                              const letters = ['a', 'b', 'c', 'd', 'e'];
                              
                              q.options.forEach((option: string, idx: number) => {
                                // Match by number (1, 2, 3, 4)
                                if (lowerText === String(idx + 1) || lowerText === `option ${idx + 1}`) {
                                  selectedOption = idx;
                                }
                                // Match by position (first, second, third, fourth)
                                if (lowerText === numbers[idx] || lowerText === `${numbers[idx]} option`) {
                                  selectedOption = idx;
                                }
                                // Match by letter (a, b, c, d)
                                if (lowerText === letters[idx] || lowerText === `option ${letters[idx]}`) {
                                  selectedOption = idx;
                                }
                                // Match by partial text
                                if (option.toLowerCase().includes(lowerText) && lowerText.length > 3) {
                                  selectedOption = idx;
                                }
                              });
                            } else {
                              // Object format: match by key
                              const optionEntries = Object.entries(q.options || {});
                              
                              optionEntries.forEach(([key, value]: [string, any], idx: number) => {
                                // Match by letter (a, b, c, d)
                                if (lowerText === key.toLowerCase() || lowerText === `option ${key.toLowerCase()}`) {
                                  selectedOption = key;
                                }
                                
                                // Match by number (1, 2, 3, 4 or first, second, third, fourth)
                                const numbers = ['first', 'second', 'third', 'fourth', 'fifth'];
                                if (lowerText === String(idx + 1) || 
                                    lowerText === `option ${idx + 1}` ||
                                    lowerText === numbers[idx] ||
                                    lowerText === `${numbers[idx]} option`) {
                                  selectedOption = key;
                                }
                                
                                // Match by partial text of the option itself
                                if (value.toLowerCase().includes(lowerText) && lowerText.length > 3) {
                                  selectedOption = key;
                                }
                              });
                            }
                            
                            if (selectedOption !== null) {
                              setSelectedAnswers(prev => ({
                                ...prev,
                                [q.id]: selectedOption
                              }));
                            } else {
                              alert(`Could not understand "${text}". Try saying "A", "B", "C", "D" or "First", "Second", etc.`);
                            }
                          }}
                        />
                      </div>
                      
                      {/* MCQ Options - Handle both array and object formats */}
                      {Array.isArray(q.options) ? (
                        // Array format: ["Option A", "Option B", "Option C", "Option D"]
                        q.options.map((option: string, idx: number) => {
                          const letters = ['A', 'B', 'C', 'D', 'E'];
                          const selectedValue = String(selectedAnswers[q.id]);
                          const isSelected = selectedValue === String(idx);
                          const correctValue = String(q.correct_answer);
                          const isCorrect = showResults && correctValue === String(idx);
                          const isWrong = showResults && isSelected && !isCorrect;
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => !showResults && setSelectedAnswers(prev => ({
                                ...prev,
                                [q.id]: idx
                              }))}
                              className={`w-full text-left border rounded-lg p-4 transition-all ${
                                isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                              }`}
                              disabled={showResults}
                            >
                              <span className="font-semibold">{letters[idx]}.</span> {option}
                            </button>
                          );
                        })
                      ) : (
                        // Object format: {a: "Option A", b: "Option B", ...}
                        Object.entries(q.options || {}).map(([key, value]: [string, any]) => {
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
                        })
                      )}
                    </div>
                    
                    {/* Show explanation and resources after submission */}
                    {showResults && (
                      <div className="space-y-3">
                        {q.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                            <strong className="text-blue-900 dark:text-blue-100">Explanation:</strong>
                            <p className="text-blue-800 dark:text-blue-200 mt-1">{q.explanation}</p>
                          </div>
                        )}
                        {/* Multimedia Resources */}
                        {(q.mdn_link || q.youtube_english) && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm">
                            <strong className="text-purple-900 dark:text-purple-100 block mb-2">📚 Learn More:</strong>
                            <div className="flex flex-wrap gap-2">
                              {q.mdn_link && (
                                <a
                                  href={q.mdn_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  📖 Documentation
                                </a>
                              )}
                              {q.youtube_english && (
                                <a
                                  href={q.youtube_english}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  🎥 Video (EN)
                                </a>
                              )}
                              {q.youtube_hindi && (
                                <a
                                  href={q.youtube_hindi}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  🎥 हिंदी
                                </a>
                              )}
                              {q.youtube_kannada && (
                                <a
                                  href={q.youtube_kannada}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  🎥 ಕನ್ನಡ
                                </a>
                              )}
                              {q.youtube_tamil && (
                                <a
                                  href={q.youtube_tamil}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  🎥 தமிழ்
                                </a>
                              )}
                              {q.youtube_telugu && (
                                <a
                                  href={q.youtube_telugu}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs"
                                >
                                  🎥 తెలుగు
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!showResults && questions.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  size="lg"
                  className="px-8"
                >
                  Submit Test
                </Button>
                {!allAnswered && (
                  <p className="text-sm text-gray-500">
                    Please answer all questions before submitting
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && (
          <>
            {/* Score Card */}
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

            {/* Review Wrong Answers - Show BEFORE other recommendations */}
            {questions.some((q, idx) => selectedAnswers[q.id] !== q.correct_answer) && (
              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
                  <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                    📚 Review Your Mistakes - Learn & Improve
                  </CardTitle>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                    Study these questions you got wrong. Watch videos in your preferred language and read the documentation to understand better.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {questions.map((q, idx) => {
                      const isWrong = selectedAnswers[q.id] !== q.correct_answer;
                      if (!isWrong) return null;

                      return (
                        <div key={q.id} className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                          {/* Question */}
                          <div className="mb-3">
                            <p className="font-semibold text-lg text-red-900 dark:text-red-100">
                              ❌ Question {idx + 1}: {q.question}
                            </p>
                          </div>

                          {/* Your Answer vs Correct Answer */}
                          <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Your Answer:</p>
                              <p className="text-sm text-red-900 dark:text-red-100">
                                {Array.isArray(q.options) 
                                  ? q.options[selectedAnswers[q.id]] || 'Not answered'
                                  : q.options?.[selectedAnswers[q.id]] || 'Not answered'}
                              </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded border border-green-300 dark:border-green-700">
                              <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Correct Answer:</p>
                              <p className="text-sm text-green-900 dark:text-green-100 font-semibold">
                                {Array.isArray(q.options) 
                                  ? q.options[q.correct_answer]
                                  : q.options?.[q.correct_answer]}
                              </p>
                            </div>
                          </div>

                          {/* Explanation */}
                          {q.explanation && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Explanation:</p>
                              <p className="text-sm text-blue-800 dark:text-blue-200">{q.explanation}</p>
                            </div>
                          )}

                          {/* Learning Resources - Documentation & Videos */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3">
                              📖 Learn This Topic:
                            </p>
                            
                            {/* Documentation Link */}
                            {q.mdn_link && (
                              <div className="mb-3">
                                <a
                                  href={q.mdn_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                  📖 Read Documentation
                                </a>
                              </div>
                            )}

                            {/* Video Tutorials in 5 Languages */}
                            {(q.youtube_english || q.youtube_hindi || q.youtube_kannada || q.youtube_tamil || q.youtube_telugu) && (
                              <div>
                                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                  🎥 Watch Video Tutorial (Choose Your Language):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {q.youtube_english && (
                                    <a
                                      href={q.youtube_english}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                      🎥 English
                                    </a>
                                  )}
                                  {q.youtube_hindi && (
                                    <a
                                      href={q.youtube_hindi}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                      🎥 हिंदी
                                    </a>
                                  )}
                                  {q.youtube_kannada && (
                                    <a
                                      href={q.youtube_kannada}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                      🎥 ಕನ್ನಡ
                                    </a>
                                  )}
                                  {q.youtube_tamil && (
                                    <a
                                      href={q.youtube_tamil}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                      🎥 தமிழ்
                                    </a>
                                  )}
                                  {q.youtube_telugu && (
                                    <a
                                      href={q.youtube_telugu}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                      🎥 తెలుగు
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to Action */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                    <p className="text-center font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      🎯 Ready to Try Again?
                    </p>
                    <p className="text-center text-sm text-orange-700 dark:text-orange-300 mb-3">
                      After studying the materials above, click "Try Again" to retake the test and improve your score!
                    </p>
                    <div className="flex justify-center">
                      <Button onClick={loadQuestions} size="lg" className="bg-orange-600 hover:bg-orange-700">
                        🔄 Try Again After Learning
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Learning Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Learning Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Analysis */}
                  <div className={`p-4 rounded-lg border-2 ${
                    Number(percentage) >= 80 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                    Number(percentage) >= 60 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                    'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  }`}>
                    <h4 className="font-semibold mb-2">
                      {Number(percentage) >= 80 ? '🎉 Excellent Performance!' :
                       Number(percentage) >= 60 ? '👍 Good Job!' :
                       '💪 Keep Learning!'}
                    </h4>
                    <p className="text-sm">
                      {Number(percentage) >= 80 ? 
                        `You scored ${percentage}%! You have a strong understanding of ${LANGUAGES.find(l => l.value === skill)?.label} at ${level} level. You're ready for the next level!` :
                       Number(percentage) >= 60 ?
                        `You scored ${percentage}%. You have a good grasp of ${LANGUAGES.find(l => l.value === skill)?.label} fundamentals. With more practice, you'll master this level!` :
                        `You scored ${percentage}%. Don't worry! Learning takes time. Review the explanations and try again. You'll improve with practice!`
                      }
                    </p>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold mb-3">🎯 Recommended Next Steps:</h4>
                    <ul className="space-y-2 text-sm">
                      {Number(percentage) >= 80 ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Try the {level === 'beginner' ? 'intermediate' : 'advanced'} level to challenge yourself further</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Explore related technologies to broaden your skills</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Build a real-world project using {LANGUAGES.find(l => l.value === skill)?.label}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Consider taking the evaluation test for certification</span>
                          </li>
                        </>
                      ) : Number(percentage) >= 60 ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Review the questions you got wrong and study the explanations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Watch the video tutorials provided for each question</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Practice more with similar questions at this level</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Try again after reviewing the material</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>Start with the basics - review fundamental concepts</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>Watch all the video tutorials in your preferred language</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>Read the MDN documentation links provided</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>Practice daily for 30 minutes to build consistency</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>Retake this test after studying to track your improvement</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Study Resources */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-3">📖 Study Resources:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">📚</span>
                        <div>
                          <p className="font-medium">Documentation</p>
                          <p className="text-gray-600 dark:text-gray-400">Review official docs and guides</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-600">🎥</span>
                        <div>
                          <p className="font-medium">Video Tutorials</p>
                          <p className="text-gray-600 dark:text-gray-400">Watch in 5 languages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">💻</span>
                        <div>
                          <p className="font-medium">Practice Projects</p>
                          <p className="text-gray-600 dark:text-gray-400">Build real applications</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">🎯</span>
                        <div>
                          <p className="font-medium">More Practice</p>
                          <p className="text-gray-600 dark:text-gray-400">Take more tests to improve</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
