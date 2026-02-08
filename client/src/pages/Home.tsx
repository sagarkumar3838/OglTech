import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Brain, 
  CheckCircle2, ArrowRight, Zap, BarChart3, 
  Code, Layers, Shield
} from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';
import { CountUp } from '../components/animations/CountUp';
import { SmoothScrollHero } from '../components/SmoothScrollHero';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import FaqSection from '../components/FaqSection';
import PricingSection from '../components/PricingSection';

const Home = () => {

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-[#0B1220] transition-colors duration-300">
      {/* Smooth Scroll Hero */}
      <SmoothScrollHero />
      
      {/* Features Grid */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* FAQ */}
      <FaqSection />
      
      {/* Contact */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};



// Features Section
const FeaturesSection = () => {
  const features = [
    { icon: Brain, title: "AI-Powered Assessments and Goal Setting", desc: "5,000+ skill-specific questions and personalized tasks to help you improve.", color: "from-indigo-500 to-purple-500" },
    { icon: BarChart3, title: "Detailed Analytics", desc: "Comprehensive scorecards with strengths and gaps analysis.", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, title: "Progressive Levels", desc: "Track skill maturity from Basic to Advanced with precision.", color: "from-green-500 to-emerald-500" },
    { icon: Zap, title: "Instant Results", desc: "Get immediate feedback and detailed reports in real-time.", color: "from-orange-500 to-amber-500" },
    { icon: Code, title: "Multiple Skills", desc: "Assess HTML, CSS, JavaScript, jQuery, and OpenGL.", color: "from-cyan-500 to-blue-500" },
    { icon: Shield, title: "Anti-Cheat System", desc: "Tab switching detection ensures assessment integrity.", color: "from-rose-500 to-red-500" },
  ];

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to shape a standout profile
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Your seamless journey to building and growing your career.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, Fast, Effective</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Get started in minutes, not hours</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900" />
          
          {[
            { num: 1, title: "Choose a Career Path", desc: "Select from Frontend, Backend, Full Stack, or specialized roles", color: "from-indigo-500 to-purple-600" },
            { num: 2, title: "Take the Assessment", desc: "Answer AI-generated questions tailored to the skill level", color: "from-purple-500 to-pink-600" },
            { num: 3, title: "Get Detailed Results", desc: "Receive comprehensive scorecards with hiring recommendations", color: "from-pink-500 to-red-600" },
          ].map((step, index) => (
            <ScaleIn key={index} delay={0.2 + index * 0.2}>
              <div className="text-center relative z-10">
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: 5000, suffix: "+", label: "Questions" },
            { value: 10, suffix: "+", label: "Skills Covered" },
            { value: 1000, suffix: "+", label: "Assessments" },
            { value: 95, suffix: "%", label: "Accuracy" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-indigo-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Why teams choose our platform</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Join forward-thinking companies using AI to build better teams</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { benefit: "Save 80% of screening time", desc: "Automated assessments replace hours of manual screening" },
            { benefit: "Eliminate bias", desc: "AI-generated questions ensure fair, objective evaluation" },
            { benefit: "Better hiring decisions", desc: "Data-driven insights lead to stronger team building" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="font-semibold text-xl mb-2 text-slate-900 dark:text-white">{item.benefit}</h4>
              <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
