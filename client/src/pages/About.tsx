import { motion } from 'framer-motion';
import { Brain, Target, Users, Zap, Award, TrendingUp } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';

const About = () => {
  const values = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Leveraging cutting-edge AI to generate unique, fair assessments',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Accurate skill evaluation with detailed insights and analytics',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Designed for both candidates and hiring teams',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Quick assessments with instant, actionable results',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { value: '5000+', label: 'Questions' },
    { value: '10+', label: 'Skills' },
    { value: '1000+', label: 'Assessments' },
    { value: '95%', label: 'Accuracy' },
  ];

  const team = [
    {
      name: 'AI Assessment Engine',
      role: 'Core Technology',
      description: 'Generates unique questions and evaluates responses in real-time',
    },
    {
      name: 'Analytics Platform',
      role: 'Insights & Reporting',
      description: 'Provides detailed scorecards and skill gap analysis',
    },
    {
      name: 'Security System',
      role: 'Integrity',
      description: 'Ensures fair assessments with anti-cheat detection',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/20 dark:via-[#0B1220] dark:to-cyan-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                About <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">SkillEval</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing technical hiring with AI-powered skill assessments that are fair, fast, and incredibly accurate.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                To transform technical hiring by providing AI-powered assessments that eliminate bias, save time, and identify the best talent.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                We believe that every candidate deserves a fair chance to showcase their skills, and every company deserves access to the best talent.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Our platform generates unique questions for each assessment, ensuring no memorization and pure skill evaluation.
              </p>
            </FadeIn>
            <ScaleIn delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Powered by Advanced Technology
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Our platform combines AI, analytics, and security to deliver the best assessment experience
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">{item.role}</p>
                <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to transform your hiring?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Join forward-thinking companies using AI to build better teams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all"
              >
                Start Free Assessment
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-lg font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
              >
                Contact Us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default About;
