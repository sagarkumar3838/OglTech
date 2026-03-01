import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, RotateCcw, Lightbulb, CheckCircle } from 'lucide-react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: javascript },
  { value: 'python', label: 'Python', extension: python },
  { value: 'java', label: 'Java', extension: java },
  { value: 'cpp', label: 'C++', extension: cpp },
];

const SAMPLE_PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};',
    },
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]' },
    ],
  },
];

export default function CodingPractice() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SAMPLE_PROBLEMS[0].starterCode.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showHint, setShowHint] = useState(false);

  const currentProblem = SAMPLE_PROBLEMS[0];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(currentProblem.starterCode[newLanguage as keyof typeof currentProblem.starterCode]);
    setOutput('');
    setTestResults([]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Call backend API to execute code
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          testCases: currentProblem.testCases,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setOutput(`Error:\n${result.error}`);
      } else {
        setOutput(result.stdout || 'Code executed successfully!');
        setTestResults(result.testResults || []);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(currentProblem.starterCode[language as keyof typeof currentProblem.starterCode]);
    setOutput('');
    setTestResults([]);
  };

  const handleGetHint = async () => {
    setShowHint(true);
    // Call OpenAI API for hint
    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: currentProblem.description,
          code,
        }),
      });

      const result = await response.json();
      setOutput(`💡 Hint:\n${result.hint}`);
    } catch (error) {
      setOutput('Error getting hint');
    }
  };

  const getLanguageExtension = () => {
    const lang = LANGUAGES.find(l => l.value === language);
    return lang ? [lang.extension()] : [javascript()];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Coding Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Solve coding problems with live code execution
            </p>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentProblem.title}</span>
                <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                  {currentProblem.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentProblem.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Examples</h3>
                {currentProblem.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-2">
                    <p className="text-sm">
                      <span className="font-semibold">Input:</span> {example.input}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Output:</span> {example.output}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Test Cases</h3>
                {testResults.length > 0 ? (
                  <div className="space-y-2">
                    {testResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded flex items-center gap-2 ${
                          result.passed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Test {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Run code to see test results</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeMirror
                  value={code}
                  height="400px"
                  theme={oneDark}
                  extensions={getLanguageExtension()}
                  onChange={(value) => setCode(value)}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightSpecialChars: true,
                    foldGutter: true,
                    drawSelection: true,
                    indentOnInput: true,
                    syntaxHighlighting: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    highlightActiveLine: true,
                  }}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleRunCode} disabled={isRunning} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleGetHint} variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint
              </Button>
            </div>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-64">
                  {output || 'Output will appear here...'}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
