import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account information (name, email, password)',
        'Assessment results and performance data',
        'Usage data and analytics',
        'Device and browser information',
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our services',
        'To generate personalized assessments',
        'To analyze and enhance user experience',
        'To communicate important updates',
      ],
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'Industry-standard encryption (SSL/TLS)',
        'Secure data storage with Supabase',
        'Regular security audits and updates',
        'Access controls and authentication',
      ],
    },
    {
      icon: Eye,
      title: 'Data Sharing',
      content: [
        'We never sell your personal data',
        'Limited sharing with service providers',
        'Aggregated, anonymized data for analytics',
        'Compliance with legal requirements only',
      ],
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Access your personal data anytime',
        'Request data correction or deletion',
        'Opt-out of marketing communications',
        'Export your assessment history',
      ],
    },
    {
      icon: FileText,
      title: 'Data Retention',
      content: [
        'Account data: Until account deletion',
        'Assessment results: 2 years',
        'Analytics data: 1 year',
        'Deleted data: Permanently removed within 30 days',
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
                <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </FadeIn>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <FadeIn delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              At SkillEval, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered skill assessment platform.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-8">
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
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Contact Us About Privacy
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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
            By using SkillEval, you agree to this Privacy Policy. We may update this policy from time to time, and we'll notify you of any significant changes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
