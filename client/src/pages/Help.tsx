import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail,
  FileText,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Help() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of using SkillEval platform',
      topics: [
        'Creating your account',
        'Taking your first assessment',
        'Understanding your dashboard',
        'Setting up your profile',
      ],
    },
    {
      icon: FileText,
      title: 'Assessments',
      description: 'Everything about skill evaluations',
      topics: [
        'How assessments work',
        'Difficulty levels explained',
        'Scoring system',
        'Retaking assessments',
      ],
    },
    {
      icon: Video,
      title: 'Learning Paths',
      description: 'Navigate your career development',
      topics: [
        'Choosing a career path',
        'Following roadmaps',
        'Tracking progress',
        'Recommended resources',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How are assessments scored?',
      answer: 'Assessments are scored based on correctness, time taken, and difficulty level. Each question is weighted according to its complexity.',
    },
    {
      question: 'Can I retake an assessment?',
      answer: 'Yes, you can retake assessments after a 24-hour cooldown period to track your improvement over time.',
    },
    {
      question: 'How do I access my results?',
      answer: 'All your assessment results are available in your dashboard under the Analytics section with detailed breakdowns.',
    },
    {
      question: 'What technologies are covered?',
      answer: 'We cover 50+ programming languages and technologies including JavaScript, Python, Java, React, Node.js, and many more.',
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
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Find answers to common questions and learn how to make the most of SkillEval.
          </p>
        </motion.div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {category.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {category.description}
              </p>
              <ul className="space-y-2">
                {category.topics.map((topic) => (
                  <li key={topic} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    {topic}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-12 text-center"
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
