import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BookOpen,
  Target,
  BarChart3,
  FileCheck,
  HelpCircle,
  Home,
  BarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const email = user.email || '';
    return email[0]?.toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    return user?.email?.split('@')[0] || 'User';
  };

  // Get email
  const getEmail = () => {
    return user?.email || 'user@example.com';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Careers', href: '/careers', icon: Target },
    { name: 'Practice', href: '/practice', icon: HelpCircle },
    { name: 'Learning Path', href: '/learning-path', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
 
    { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#1E293B] relative overflow-hidden transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 dark:from-green-600/20 dark:to-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 dark:from-purple-600/20 dark:to-pink-800/20 rounded-full blur-3xl"></div>
      </div>

    

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-slate-700/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">OGL SkillEval</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                  >
                    <Icon className={`mr-1.5 h-4 w-4 ${isActive(item.href) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Home Button */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-600 flex-shrink-0 whitespace-nowrap text-gray-700 dark:text-gray-300"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm">
          <div className="fixed top-20 right-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 max-h-[calc(100vh-6rem)] overflow-y-auto transition-colors duration-300">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Navigation
              </div>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon 
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'
                      }`} 
                    />
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 rounded-xl transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20 min-h-screen relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
