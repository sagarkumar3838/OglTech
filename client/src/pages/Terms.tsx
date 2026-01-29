import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Scale, UserX, RefreshCw } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

const Terms = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: 'By accessing and using SkillEval, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
    },
    {
      icon: UserX,
      title: 'User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information and keep it updated. You are responsible for all activities under your account.',
    },
    {
      icon: Scale,
      title: 'Acceptable Use',
      content: 'You agree not to misuse our services, including attempting to cheat on assessments, sharing assessment content, or using the platform for any illegal purposes. We reserve the right to suspend accounts that violate these terms.',
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: 'All content, features, and functionality on SkillEval are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.',
    },
    {
      icon: AlertCircle,
      title: 'Disclaimer of Warranties',
      content: 'SkillEval is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Assessment results are for informational purposes only.',
    },
    {
      icon: RefreshCw,
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the new terms.',
    },
  ];

  const additionalTerms = [
    {
      title: 'Assessment Integrity',
      points: [
        'Tab switching during assessments is monitored',
        'Multiple attempts may be flagged for review',
        'Sharing assessment questions is prohibited',
        'Results may be invalidated for suspicious activity',
      ],
    },
    {
      title: 'Payment Terms',
      points: [
        'Subscription fees are billed monthly or annually',
        'Refunds are provided within 14 days of purchase',
        'Prices may change with 30 days notice',
        'Cancellation takes effect at end of billing period',
      ],
    },
    {
      title: 'Data Usage',
      points: [
        'We collect data to improve our services',
        'Assessment results may be used for analytics',
        'Personal data is protected per our Privacy Policy',
        'You can request data deletion at any time',
      ],
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
                <FileText className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </FadeIn>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <FadeIn delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Welcome to SkillEval. These Terms of Service govern your use of our AI-powered skill assessment platform. Please read them carefully.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
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
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {additionalTerms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {term.title}
              </h3>
              <ul className="space-y-2">
                {term.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Questions About Terms?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <p>Email: legal@skilleval.com</p>
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
            By using SkillEval, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
