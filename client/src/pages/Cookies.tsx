import { motion } from 'framer-motion';
import { Cookie, Settings, BarChart, Shield, Eye, CheckCircle } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

const Cookies = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly',
      examples: ['Authentication tokens', 'Session management', 'Security features'],
      required: true,
    },
    {
      icon: BarChart,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      examples: ['Page views', 'User interactions', 'Performance metrics'],
      required: false,
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Remember your preferences and settings',
      examples: ['Theme preference', 'Language selection', 'Layout choices'],
      required: false,
    },
    {
      icon: Eye,
      title: 'Targeting Cookies',
      description: 'Used to deliver relevant content and ads',
      examples: ['Ad preferences', 'Content recommendations', 'Marketing campaigns'],
      required: false,
    },
  ];

  const managementOptions = [
    {
      title: 'Browser Settings',
      description: 'Most browsers allow you to control cookies through settings',
      action: 'Check your browser help section',
    },
    {
      title: 'Cookie Preferences',
      description: 'Manage your cookie preferences directly on our platform',
      action: 'Visit Settings > Privacy',
    },
    {
      title: 'Opt-Out Tools',
      description: 'Use industry opt-out tools for advertising cookies',
      action: 'Visit aboutads.info or youronlinechoices.eu',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                <Cookie className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </FadeIn>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <FadeIn delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              This Cookie Policy explains how SkillEval uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>
          </FadeIn>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us remember your preferences, understand how you use our platform, and improve your experience.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Types of Cookies We Use
          </h2>
          {cookieTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {type.title}
                    </h3>
                    {type.required && (
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {type.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Examples:</p>
                    <ul className="space-y-1">
                      {type.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-indigo-500" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            How to Manage Cookies
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {managementOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {option.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {option.description}
                </p>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {option.action}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Important Note
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            If you choose to disable cookies, some features of SkillEval may not function properly. Essential cookies are required for the platform to work and cannot be disabled. However, you can control analytics, functional, and targeting cookies through your browser settings or our cookie preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            If you have any questions about our use of cookies, please contact us:
          </p>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <p>Email: privacy@skilleval.com</p>
            <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500"
        >
          <p>
            By continuing to use SkillEval, you consent to our use of cookies as described in this Cookie Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Cookies;
