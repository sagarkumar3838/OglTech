import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

// Debug component to test Practice page queries
export default function PracticeDebug() {
  const { user } = useAuth();
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const diagnostics: any = {};

    // Test 1: Check authentication
    diagnostics.auth = {
      isLoggedIn: !!user,
      userId: user?.id || 'Not logged in',
      email: user?.email || 'N/A'
    };

    // Test 2: Check Supabase connection
    try {
      const { data, error } = await supabase.from('questions').select('count');
      diagnostics.connection = {
        status: error ? 'Failed' : 'Success',
        error: error?.message || null
      };
    } catch (err: any) {
      diagnostics.connection = {
        status: 'Failed',
        error: err.message
      };
    }

    // Test 3: Count total questions
    try {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      
      diagnostics.totalQuestions = {
        count: count || 0,
        error: error?.message || null
      };
    } catch (err: any) {
      diagnostics.totalQuestions = {
        count: 0,
        error: err.message
      };
    }

    // Test 4: Query JavaScript easy MCQ questions (default on Practice page)
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('skill', 'javascript')
        .eq('level', 'easy')
        .eq('type', 'mcq')
        .limit(5);
      
      diagnostics.javascriptEasyMCQ = {
        count: data?.length || 0,
        questions: data || [],
        error: error?.message || null,
        errorDetails: error || null
      };
    } catch (err: any) {
      diagnostics.javascriptEasyMCQ = {
        count: 0,
        questions: [],
        error: err.message
      };
    }

    // Test 5: Check available skills
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('skill')
        .limit(100);
      
      const uniqueSkills = [...new Set(data?.map(q => q.skill) || [])];
      
      diagnostics.availableSkills = {
        skills: uniqueSkills,
        count: uniqueSkills.length,
        error: error?.message || null
      };
    } catch (err: any) {
      diagnostics.availableSkills = {
        skills: [],
        count: 0,
        error: err.message
      };
    }

    // Test 6: Check available levels
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('level')
        .limit(100);
      
      const uniqueLevels = [...new Set(data?.map(q => q.level) || [])];
      
      diagnostics.availableLevels = {
        levels: uniqueLevels,
        count: uniqueLevels.length,
        error: error?.message || null
      };
    } catch (err: any) {
      diagnostics.availableLevels = {
        levels: [],
        count: 0,
        error: err.message
      };
    }

    // Test 7: Sample any 5 questions
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, skill, level, type, question')
        .limit(5);
      
      diagnostics.sampleQuestions = {
        questions: data || [],
        error: error?.message || null
      };
    } catch (err: any) {
      diagnostics.sampleQuestions = {
        questions: [],
        error: err.message
      };
    }

    setResults(diagnostics);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Running Diagnostics...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Practice Page Diagnostics
        </h1>

        {/* Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            {results.auth?.isLoggedIn ? '✅' : '❌'} Authentication
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results.auth, null, 2)}
          </pre>
        </div>

        {/* Connection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            {results.connection?.status === 'Success' ? '✅' : '❌'} Supabase Connection
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results.connection, null, 2)}
          </pre>
        </div>

        {/* Total Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            {results.totalQuestions?.count > 0 ? '✅' : '❌'} Total Questions in Database
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results.totalQuestions, null, 2)}
          </pre>
        </div>

        {/* JavaScript Easy MCQ */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            {results.javascriptEasyMCQ?.count > 0 ? '✅' : '❌'} JavaScript Easy MCQ Questions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            This is what Practice page loads by default
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(results.javascriptEasyMCQ, null, 2)}
          </pre>
        </div>

        {/* Available Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3">Available Skills</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results.availableSkills, null, 2)}
          </pre>
        </div>

        {/* Available Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3">Available Levels</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results.availableLevels, null, 2)}
          </pre>
        </div>

        {/* Sample Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow">
          <h2 className="text-xl font-semibold mb-3">Sample Questions</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(results.sampleQuestions, null, 2)}
          </pre>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          <div className="space-y-2 text-sm">
            <p>✅ = Working | ❌ = Issue Found</p>
            <p className="font-semibold mt-4">Common Issues:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>If "Total Questions" is 0: Database is empty, need to upload questions</li>
              <li>If "JavaScript Easy MCQ" is 0: Wrong skill/level/type values in database</li>
              <li>If errors mention "permission denied": RLS policy issue</li>
              <li>If "Not logged in": Need to sign in first</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={runDiagnostics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 Run Again
          </button>
          <a
            href="/practice"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go to Practice Page
          </a>
        </div>
      </div>
    </div>
  );
}
