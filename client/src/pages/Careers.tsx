import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { 
  Briefcase, 
  ChevronRight, 
  BookOpen, 
  Award,
  Target,
  Zap,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers
} from 'lucide-react';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform data to match expected format and add slug
      const careersData = data.map(career => {
        const slug = career.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        
        return {
          id: career.id,
          name: career.name,
          slug: slug,
          description: career.description,
          experienceLevel: career.experience_level,
          skills: career.skills
        };
      });

      setCareers(careersData);
    } catch (error) {
      console.error('Error loading careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCareerIcon = (careerName) => {
    if (careerName.includes('Frontend')) return '🎨';
    if (careerName.includes('Backend')) return '⚙️';
    if (careerName.includes('DevOps')) return '🚀';
    if (careerName.includes('Cloud')) return '☁️';
    if (careerName.includes('QA') || careerName.includes('Tester')) return '🧪';
    if (careerName.includes('Content')) return '📝';
    return '💻';
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case 'Fresher':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Entry-Level':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Mid-Level':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Senior':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const experienceLevels = ['all', 'Fresher', 'Entry-Level', 'Mid-Level', 'Senior'];

  const filteredCareers = filter === 'all' 
    ? careers 
    : careers.filter(c => c.experienceLevel === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section - Modern & Bold */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Choose Your Path to Success</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Tech Career Paths</span>
              <span className="block text-white/90">Built for Excellence</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-xl text-white/90 leading-relaxed">
              Master the skills needed to excel in the tech industry. Each path features progressive learning 
              levels designed to take you from beginner to expert.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-6 h-6" />
                  <span className="text-3xl font-bold">{careers.length}</span>
                </div>
                <p className="text-white/80 text-sm">Career Paths</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-6 h-6" />
                  <span className="text-3xl font-bold">3</span>
                </div>
                <p className="text-white/80 text-sm">Difficulty Levels</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-6 h-6" />
                  <span className="text-3xl font-bold">
                    {careers.reduce((acc, c) => acc + (c.skills?.length || 0), 0)}
                  </span>
                </div>
                <p className="text-white/80 text-sm">Total Skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section - Modern Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Explore Career Paths</h2>
              <p className="text-gray-600 mt-1">
                {filteredCareers.length} {filteredCareers.length === 1 ? 'career' : 'careers'} available
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Layers className="w-4 h-4" />
              <span>Filter by experience</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  filter === level
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {level === 'all' ? 'All Careers' : level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Careers Grid - Modern Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCareers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Careers Found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different experience level to see more options.</p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Show All Careers
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCareers.map((career) => (
              <Link
                key={career.id}
                to={`/careers/${career.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
              >
                {/* Card Header with Gradient */}
                <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/10" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-6xl drop-shadow-lg">{getCareerIcon(career.name)}</div>
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 leading-tight">{career.name}</h3>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${getExperienceColor(career.experienceLevel)} backdrop-blur-sm`}>
                      {career.experienceLevel}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{career.description}</p>

                  {/* Skills Count */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{career.skills?.length || 0}</p>
                        <p className="text-xs text-gray-500">Skills</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{(career.skills?.length || 0) * 3}</p>
                        <p className="text-xs text-gray-500">Levels</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {career.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {career.skills?.length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                          +{career.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-indigo-600 font-bold group-hover:text-indigo-700">
                      <span>Start Learning Path</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section - Modern 3-Column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Career Paths?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Structured learning designed to transform you into a job-ready professional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-indigo-200">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Progressive Learning</h3>
            <p className="text-gray-600 leading-relaxed">
              Master skills step-by-step with our 3-level system: Basic, Intermediate, and Advanced. Each level builds on the previous one.
            </p>
            <div className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Structured curriculum</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Earn Certifications</h3>
            <p className="text-gray-600 leading-relaxed">
              Complete all levels in a career path to earn your certification and showcase your skills to potential employers.
            </p>
            <div className="mt-6 flex items-center gap-2 text-green-600 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Industry recognized</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Industry-Ready Skills</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn the exact skills needed for real-world tech jobs. Our curriculum is designed with industry standards in mind.
            </p>
            <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Job-ready training</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner - Modern Gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative px-8 py-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Select a career path above and begin your transformation into a skilled tech professional. 
              Each path is designed to take you from beginner to job-ready.
            </p>
            
            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-8 h-8" />
                </div>
                <p className="text-4xl font-bold mb-1">{careers.length}</p>
                <p className="text-white/80">Career Paths</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="text-4xl font-bold mb-1">
                  {careers.reduce((acc, c) => acc + (c.skills?.length || 0), 0)}
                </p>
                <p className="text-white/80">Total Skills</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8" />
                </div>
                <p className="text-4xl font-bold mb-1">
                  {careers.reduce((acc, c) => acc + (c.skills?.length || 0) * 3, 0)}
                </p>
                <p className="text-white/80">Learning Levels</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:scale-105"
              >
                <span>Explore All Paths</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
