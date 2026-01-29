import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OGLSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which section we're in
  const section = location.pathname.split('/').pop();
  
  const renderContent = () => {
    switch (section) {
      case 'journey':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Foundation Phase</h3>
                    <p className="text-gray-600">Learn the basics of game development and OGL principles</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Game Design</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">OGL Basics</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">2</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Intermediate Phase</h3>
                    <p className="text-gray-600">Build interactive content and game mechanics</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Level Design</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Scripting</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">3</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Advanced Phase</h3>
                    <p className="text-gray-600">Master complex systems and publish your content</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Advanced Mechanics</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Publishing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'evaluations':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Skill Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Test your knowledge and earn certifications in various OGL development skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-semibold mb-2">Game Design Fundamentals</h3>
                  <p className="text-sm text-gray-600 mb-3">3 levels • Progressive difficulty</p>
                  <button 
                    onClick={() => navigate(`/careers/ogl-content-developer`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Skill Details
                  </button>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-semibold mb-2">OGL Content Creation</h3>
                  <p className="text-sm text-gray-600 mb-3">3 levels • Progressive difficulty</p>
                  <button 
                    onClick={() => navigate(`/careers/ogl-content-developer`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Skill Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'courses':
        return (
          <Card>
            <CardHeader>
              <CardTitle>OGL Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Comprehensive courses to master OGL content development.
              </p>
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Introduction to OGL</h3>
                      <p className="text-sm text-gray-600 mb-2">Learn the fundamentals of Open Game License</p>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Beginner</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">4 hours</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start Course
                    </button>
                  </div>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Game Mechanics Design</h3>
                      <p className="text-sm text-gray-600 mb-2">Create engaging game mechanics and systems</p>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Intermediate</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">6 hours</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start Course
                    </button>
                  </div>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Advanced Content Publishing</h3>
                      <p className="text-sm text-gray-600 mb-2">Publish and monetize your OGL content</p>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Advanced</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">8 hours</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'hands-on':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Hands-on OGL Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4">
                <h3 className="text-xl font-semibold mb-2">🎮 Interactive Development Environment</h3>
                <p className="text-gray-700 mb-4">
                  Practice your skills in a real OGL development environment with instant feedback.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold">
                  Launch Environment
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">🛠️ Build Tools</h4>
                  <p className="text-sm text-gray-600">Access professional game development tools</p>
                </div>
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">📝 Code Editor</h4>
                  <p className="text-sm text-gray-600">Write and test your game scripts</p>
                </div>
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">🎨 Asset Library</h4>
                  <p className="text-sm text-gray-600">Use pre-built assets and templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'progress':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Overall Progress</span>
                    <span className="text-gray-600">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-1">Completed Skills</h4>
                    <p className="text-3xl font-bold text-green-700">3</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-1">Evaluations Passed</h4>
                    <p className="text-3xl font-bold text-blue-700">5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 mt-20">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center hover:text-blue-600 transition p-2 hover:bg-gray-100 rounded"
        >
          <Home className="w-5 h-5" />
        </button>
        <ChevronRight className="w-4 h-4" />
        <button 
          onClick={() => navigate('/careers')}
          className="hover:text-blue-600 transition"
        >
          Careers
        </button>
        <ChevronRight className="w-4 h-4" />
        <button 
          onClick={() => navigate('/careers/ogl-content-developer')}
          className="hover:text-blue-600 transition"
        >
          OGL Content Developer
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-semibold capitalize">{section?.replace('-', ' ')}</span>
      </nav>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default OGLSection;
