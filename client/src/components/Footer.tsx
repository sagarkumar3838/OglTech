import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Github, Linkedin, Twitter, Moon, Sun, ArrowDownLeft, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';

const data = () => ({
  navigation: {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Careers', href: '/careers' },
      { name: 'Assessments', href: '/practice' },
      { name: 'Dashboard', href: '/dashboard' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Contact', href: '#contact' },
      { name: 'AI Assistant', href: '/ai-assistant' },
      { name: 'Analytics', href: '/analytics' },
    ],
    resources: [
      { name: 'Learning Path', href: '/learning-path' },
      { name: 'Profile', href: '/profile' },
      { name: 'Settings', href: '/settings' },
      { name: 'Help', href: '#help' },
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
    ],
  },
  socialLinks: [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ],
  bottomLinks: [
    { href: '#privacy', label: 'Privacy Policy' },
    { href: '#terms', label: 'Terms of Service' },
    { href: '#cookies', label: 'Cookie Policy' },
  ],
});

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    setEmail('');
  };

  if (!mounted) return null;

  return (
    <footer className="mt-20 w-full">
      <div className="animate-energy-flow via-indigo-500 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      <div className="relative w-full px-5">
        {/* Top Section */}
        <div className="container m-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <Logo />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Building innovative AI-powered skill assessment solutions. Fast, reliable, and scalable.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {data().socialLinks.map(({ icon: Icon, label, href }) => (
                  <button
                    key={label}
                    className="hover:bg-indigo-600 dark:hover:bg-indigo-600 !border-indigo-500/30 hover:!border-indigo-500 cursor-pointer shadow-none transition-all duration-500 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md size-10 inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800"
                    onClick={() => window.open(href, '_blank')}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="hover:bg-indigo-600 dark:hover:bg-indigo-600 !border-indigo-500/30 hover:!border-indigo-500 cursor-pointer shadow-none transition-all duration-1000 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md size-10 inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </button>
            </div>
            <form onSubmit={handleSubscribe} className="w-full max-w-md space-y-3">
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white">
                Subscribe to our newsletter
              </label>
              <div className="relative w-full">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute top-1.5 right-1.5 cursor-pointer transition-all duration-1000 hover:px-10 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Get the latest updates, tutorials, and exclusive offers.
              </p>
            </form>
            <h1 className="from-slate-900/15 dark:from-slate-100/15 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl">
              SkillEval
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3">
            {(['product', 'company', 'resources', 'legal'] as const).map((section) => (
              <div key={section} className="w-full">
                <h3 className="border-indigo-500 mb-4 -ml-5 border-l-2 pl-5 text-sm font-semibold tracking-wider uppercase text-slate-900 dark:text-white">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <ul className="space-y-3">
                  {data().navigation[section].map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white decoration-indigo-500 -ml-5 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 hover:pl-5 hover:underline"
                      >
                        <ArrowDownLeft className="text-indigo-500 rotate-[225deg] opacity-30 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 sm:group-hover:rotate-[225deg] md:rotate-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="animate-rotate-3d via-indigo-500 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
        <div className="text-slate-600 dark:text-slate-400 container m-auto flex flex-col items-center justify-between gap-4 p-4 text-xs md:flex-row md:px-0 md:text-sm">
          <p>&copy; {currentYear} SkillEval | All rights reserved</p>
          <div className="flex items-center gap-4">
            {data().bottomLinks.map(({ href, label }) => (
              <Link key={href} to={href} className="hover:text-slate-900 dark:hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <span className="from-indigo-500/20 absolute inset-x-0 bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
      </div>

      {/* Animations */}
      <style>{`
        .animate-rotate-3d {
          animation: rotate3d 8s linear infinite;
        }
        .animate-energy-flow {
          animation: energy-flow 4s linear infinite;
          background-size: 200% 100%;
        }
        @keyframes rotate3d {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes energy-flow {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </footer>
  );
}
