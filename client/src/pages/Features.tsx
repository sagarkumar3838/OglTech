import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  BarChart3,
  BookOpen
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessments',
      description: 'Advanced AI algorithms evaluate your technical skills with precision and provide personalized feedback.',
    },
    {
      icon: Target,
      title: 'Skill-Based Evaluations',
      description: 'Test your knowledge across 50+ programming languages and technologies with difficulty levels from beginner to advanced.',
    },
    {
      icon: TrendingUp,
      title: 'Career Progression Tracking',
      description: 'Monitor your skill development over time and get insights into your career growth trajectory.',
    },
    {
      icon: Users,
      title: 'Personalized Learning Paths',
      description: 'Receive customized roadmaps based on your current skills and career goals.',
    },
    {
      icon: Zap,
      title: 'Real-Time Feedback',
      description: 'Get instant evaluation results and detailed explanations for every question.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security measures.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Visualize your performance with comprehensive charts and detailed skill breakdowns.',
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Access curated learning materials and practice questions for continuous improvement.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Platform Features
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Discover the powerful features that make SkillEval the ultimate platform for technical skill assessment and career development.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who are already using SkillEval to advance their careers.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Start Your Assessment
          </a>
        </motion.div>
      </div>
    </div>
  );
}
