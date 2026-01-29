import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plan = {
  name: 'Enterprise Suite',
  price: 299,
  description: 'For companies of any size',
  features: [
    'Unlimited skill assessments',
    'Advanced analytics and reporting',
    'Custom question banks',
    'Priority support and onboarding',
    'API access for integrations',
    'White-label options available',
  ],
  includes:
    'Security, Unlimited Storage, Advanced Analytics, API Access, and all premium features',
  companies: [
    {
      name: 'Tech Corp',
      logo: 'https://placehold.co/120x40/4F46E5/FFFFFF/png?text=TechCorp',
      height: 20,
    },
    {
      name: 'StartupX',
      logo: 'https://placehold.co/120x40/22D3EE/FFFFFF/png?text=StartupX',
      height: 16,
    },
    {
      name: 'DevTeam',
      logo: 'https://placehold.co/120x40/8B5CF6/FFFFFF/png?text=DevTeam',
      height: 16,
    },
    {
      name: 'CodeLabs',
      logo: 'https://placehold.co/120x40/EC4899/FFFFFF/png?text=CodeLabs',
      height: 20,
    },
  ],
};

export default function PricingSection() {
  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-[#0B1220] dark:to-black py-16 md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-indigo-500/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-cyan-500/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-purple-500/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-balance md:text-4xl lg:text-5xl text-slate-900 dark:text-white">
            Transform the way you assess talent
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Empower your team with AI-powered assessments. Flexible, scalable, and built for modern hiring.
          </p>
        </div>
        <div className="mt-10 md:mt-20">
          <div className="bg-white dark:bg-slate-900/70 relative rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl shadow-slate-950/5 backdrop-blur-sm">
            <div className="grid items-center gap-12 divide-y divide-slate-200 dark:divide-slate-700 p-12 md:grid-cols-2 md:gap-x-2 md:divide-x-0 md:divide-y-0">
              {/* Left Side */}
              <div className="pb-12 text-center md:pr-12 md:pb-0">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{plan.description}</p>
                <span className="text-indigo-600 dark:text-indigo-400 mt-12 mb-6 inline-block text-6xl font-extrabold">
                  <span className="align-super text-4xl">$</span>
                  {plan.price}
                </span>
                <div className="flex justify-center">
                  <Link
                    to="/login"
                    className="shadow-md bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all inline-block"
                  >
                    Get started
                  </Link>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-12 text-sm">Includes: {plan.includes}</p>
              </div>

              {/* Right Side */}
              <div className="relative m-3">
                <div className="text-left">
                  <h4 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">What's included:</h4>
                  <ul role="list" className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="text-indigo-600 dark:text-indigo-400 mt-1 size-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-6 text-sm">
                  Team size is flexible; add or switch members as needed. Companies using our platform include:
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-start gap-6">
                  {plan.companies.map((company, i) => (
                    <img
                      key={i}
                      className="h-5 w-auto dark:invert opacity-70 hover:opacity-100 transition-opacity"
                      src={company.logo}
                      alt={`${company.name} Logo`}
                      height={company.height}
                      width="auto"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
