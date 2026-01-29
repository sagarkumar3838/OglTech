import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignup) {
        const { user, error } = await signUp(email, password, {
          full_name: displayName,
        });
        
        if (error) throw error;
        
        if (user) {
          setMessage('Account created! Please check your email to verify your account.');
          // Redirect to profile completion after a delay
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } else {
        const { user, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (user) {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">OGL Platform</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="John Doe"
                required={isSignup}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {isSignup && (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setMessage('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium transition"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
