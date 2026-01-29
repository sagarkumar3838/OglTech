import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white dark:bg-[#0B1220] relative w-full overflow-hidden py-16 md:py-24">
      <div
        className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: `radial-gradient(circle at center, #4F46E5, transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: `radial-gradient(circle at center, #22D3EE, transparent 70%)`,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 mx-auto max-w-5xl overflow-hidden rounded-[28px] border shadow-xl backdrop-blur-sm">
          <div className="grid md:grid-cols-2">
            <div className="relative p-6 md:p-10" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex w-full gap-2"
              >
                <h2 className="from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                  Contact
                </h2>
                <span className="text-indigo-600 dark:text-indigo-400 relative z-10 w-full text-4xl font-bold tracking-tight italic md:text-5xl">
                  Us
                </span>
              </motion.div>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-white">
                      Name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </motion.div>
                </div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-slate-900 dark:text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    required
                    className="h-40 resize-none w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-lg px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center">
                        <Check className="mr-2 h-4 w-4" />
                        Message Sent!
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative my-8 flex items-center justify-center overflow-hidden pr-8"
            >
              <div className="flex flex-col items-center justify-center overflow-hidden">
                <article className="relative mx-auto h-[350px] min-h-60 max-w-[450px] overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-600 to-indigo-600/5 p-6 text-3xl tracking-tight text-white md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
                  Transform your hiring with AI-powered skill assessments.
                  <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 opacity-30 blur-3xl" />
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
