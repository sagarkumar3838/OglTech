import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export default function Practice(): JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('web-development');
  const [difficulty, setDifficulty] = useState('beginner');

  // Mock questions for now
  useEffect(() => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'What is React?',
        type: 'multiple-choice',
        options: ['A library', 'A framework', 'A language', 'A database'],
        correctAnswer: 0,
        category: 'web-development',
        difficulty: 'beginner'
      },
      // Add more mock questions as needed
    ];
    setQuestions(mockQuestions);
    const initial: Record<string, number | null> = {};
    mockQuestions.forEach((q) => (initial[q.id] = null));
    setSelectedAnswers(initial);
  }, [category, difficulty]);

  const score = useMemo(() => {
    if (!showResults) return 0;
    return questions.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0), 0);
  }, [showResults, questions, selectedAnswers]);

  const allAnswered = useMemo(() => {
    return questions.every((q) => selectedAnswers[q.id] !== null && selectedAnswers[q.id] !== undefined);
  }, [questions, selectedAnswers]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-64">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="ai-ml">AI / ML</SelectItem>
                <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>MCQ Practice</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading questions...</p>}
            {!loading && questions.length === 0 && <p>No questions available.</p>}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <p className="font-medium text-lg">{idx + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = selectedAnswers[q.id] === i;
                      const isCorrect = showResults && q.correctAnswer === i;
                      const isWrong = showResults && isSelected && !isCorrect;
                      return (
                        <button
                          key={i}
                          onClick={() => !showResults && setSelectedAnswers((prev) => ({ ...prev, [q.id]: i }))}
                          className={`w-full text-left border rounded-xl p-2 font-medium transition-all ${
                            isCorrect ? 'border-green-500 bg-green-100' :
                            isWrong ? 'border-red-500 bg-red-100' :
                            isSelected ? 'border-blue-500 bg-blue-100' :
                            'border-gray-200 hover:border-blue-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              {!showResults ? (
                <Button
                  disabled={!allAnswered}
                  onClick={() => setShowResults(true)}
                >
                  Submit
                </Button>
              ) : (
                <>
                  <span className="text-sm font-semibold text-green-600">
                    Score: {score} / {questions.length}
                  </span>
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
