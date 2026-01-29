import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, Briefcase, Moon, Sun, Menu, X, 
  LayoutDashboard, Home, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';
import { cn } from '../lib/utils';

export const ResizableNavbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle scroll visibility
  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollY.getPrevious() ?? 0;
      const direction = current - previous;

      // Show navbar when scrolling up or at top
      if (current < 50) {
        setVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);
        if (direction < 0) {
          setVisible(true);
        } else if (direction > 5) {
          setVisible(false);
        }
      }
    }
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home, show: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: !!user },
    { name: 'Careers', path: '/careers', icon: Briefcase, show: true },
    { name: 'About', path: '/about', icon: Sparkles, show: true },
    { name: 'Contact', path: '/contact', icon: User, show: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ 
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "py-1" 
            : "py-2"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className={cn(
              "relative rounded-full border transition-all duration-300",
              scrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-lg"
                : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-700/30"
            )}
            layout
          >
            <div className="flex justify-between items-center px-6 py-3">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Logo size={scrolled ? "sm" : "md"} showText={true} />
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.filter(item => item.show).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative"
                  >
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5 text-indigo-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* User Actions */}
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/profile">
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <User className="w-4 h-4" />
                        <span className="max-w-[100px] truncate">{user.email}</span>
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={handleLogout}
                      className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <LogOut className="w-5 h-5" />
                    </motion.button>
                  </div>
                ) : (
                  <Link to="/login" className="hidden md:block">
                    <motion.button
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden"
          >
            <div className="mx-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              <div className="p-4 space-y-2">
                {navItems.filter(item => item.show).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <motion.div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <User className="w-5 h-5" />
                        <span className="truncate">{user.email}</span>
                      </motion.div>
                    </Link>
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </motion.button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Sign In</span>
                    </motion.div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
