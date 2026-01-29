import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'support';
}

const faqItems: FaqItem[] = [
  {
    id: '1',
    question: 'What is SkillEval?',
    answer:
      'SkillEval is an AI-powered skill assessment platform that helps companies evaluate technical skills of candidates. It provides instant, detailed insights into candidate abilities across HTML, CSS, JavaScript, jQuery, and OpenGL.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Is SkillEval free to use?',
    answer:
      'Yes, SkillEval offers a free tier with basic assessments. Premium features and advanced analytics are available in our paid plans for organizations.',
    category: 'pricing',
  },
  {
    id: '3',
    question: 'How does the AI assessment work?',
    answer:
      'Our AI generates unique questions for each assessment, ensuring no memorization. It evaluates answers in real-time and provides detailed scorecards with strengths and skill gaps analysis.',
    category: 'technical',
  },
  {
    id: '4',
    question: 'What skills can be assessed?',
    answer:
      'Currently, we support HTML, CSS, JavaScript, jQuery, and OpenGL assessments. Each skill has multiple difficulty levels from Basic to Advanced, with over 5000+ unique questions.',
    category: 'technical',
  },
  {
    id: '5',
    question: 'How long does an assessment take?',
    answer:
      'Most assessments take 15-20 minutes to complete. The duration depends on the skill level and number of questions selected.',
    category: 'general',
  },
  {
    id: '6',
    question: 'Can I retake an assessment?',
    answer:
      'Yes, you can retake assessments to improve your score. Each attempt generates new questions to ensure fair evaluation.',
    category: 'general',
  },
  {
    id: '7',
    question: 'How is cheating prevented?',
    answer:
      'We use tab switching detection and time limits to ensure assessment integrity. Any suspicious activity is flagged in the final report.',
    category: 'technical',
  },
  {
    id: '8',
    question: 'How can I get support?',
    answer:
      'You can reach our support team through the contact form, email, or live chat. We typically respond within 24 hours.',
    category: 'support',
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'technical', label: 'Technical' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'support', label: 'Support' },
];

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs =
    activeCategory === 'all'
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-white dark:bg-[#0B1220] py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center">
          <div className="border-indigo-500 mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase border rounded-full text-indigo-600 dark:text-indigo-400">
            FAQs
          </div>
          <h2 className="text-slate-900 dark:text-white mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-center">
            Find answers to common questions about SkillEval and how to use our platform to assess technical skills.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border-slate-200 dark:border-slate-800 h-fit overflow-hidden rounded-xl border ${
                  expandedId === faq.id
                    ? 'shadow-xl bg-slate-50/50 dark:bg-slate-900/50'
                    : 'bg-white/50 dark:bg-slate-900/30'
                }`}
                style={{ minHeight: '88px' }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-slate-900 dark:text-white text-lg font-medium">{faq.question}</h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedId === faq.id ? (
                      <MinusIcon className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                    ) : (
                      <PlusIcon className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-slate-200 dark:border-slate-800 border-t px-6 pt-2 pb-6">
                        <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">Can't find what you're looking for?</p>
          <a
            href="#contact"
            className="border-indigo-600 text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white inline-flex items-center justify-center rounded-lg border-2 px-6 py-3 font-medium transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
