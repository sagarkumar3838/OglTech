import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import './config/icons'; // Initialize Font Awesome icons
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import CareerPaths from './pages/CareerPaths';
import Evaluation from './pages/Evaluation';
import Scorecard from './pages/Scorecard';
import AdminDashboard from './pages/AdminDashboard';
import AIAssistant from './pages/AIAssistant';
import Practice from './pages/Practice';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LearningPath from './pages/LearningPath';
import Profile from './pages/Profile';
import ProfileComplete from './pages/ProfileComplete';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import OGLSection from './pages/OGLSection';
import OGLProgress from './pages/OGLProgress';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Topics from './pages/Topics';
import TopicReference from './pages/TopicReference';
import WeakTopicsDashboard from './pages/WeakTopicsDashboard';
import AdminTopicManager from './pages/AdminTopicManager';
import Roadmaps from './pages/Roadmaps';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes (no outer Layout) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/ai-assistant" 
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/practice" 
              element={
                <ProtectedRoute>
                  <Practice />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learning-path" 
              element={
                <ProtectedRoute>
                  <LearningPath />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile/complete" 
              element={
                <ProtectedRoute>
                  <ProfileComplete />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/weak-topics" 
              element={
                <ProtectedRoute>
                  <WeakTopicsDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout />}>
              {/* Home Page - / */}
              <Route index element={<Home />} />
              
              {/* About & Contact Pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Legal Pages */}
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="cookies" element={<Cookies />} />
              
              {/* Roadmaps - Learning Paths */}
              <Route path="roadmaps" element={<Roadmaps />} />
              
              {/* Topic Reference System */}
              <Route path="topics" element={<Topics />} />
              <Route path="topics/:slug" element={<TopicReference />} />
              
              {/* Career Routes - /careers */}
              <Route path="careers" element={<Careers />} />
              <Route path="careers/:careerSlug" element={<CareerDetail />} />
              <Route path="/career-paths" element={<CareerPaths />} />
              
              {/* OGL Content Developer Nested Routes */}
              <Route path="careers/ogl-content-developer/journey" element={<OGLSection />} />
              <Route path="careers/ogl-content-developer/evaluations" element={<OGLSection />} />
              <Route path="careers/ogl-content-developer/courses" element={<OGLSection />} />
              <Route path="careers/ogl-content-developer/hands-on" element={<OGLSection />} />
              <Route path="careers/ogl-content-developer/progress" element={<OGLProgress />} />
              
              {/* Evaluation Routes - /evaluation */}
              <Route 
                path="evaluation/:skillSlug/:levelSlug/:sessionId" 
                element={
                  <ProtectedRoute>
                    <Evaluation />
                  </ProtectedRoute>
                } 
              />
              
              {/* Backward compatibility for old evaluation URLs */}
              <Route 
                path="evaluation/:evaluationId" 
                element={
                  <ProtectedRoute>
                    <Evaluation />
                  </ProtectedRoute>
                } 
              />
              
              {/* Scorecard Routes - /scorecard */}
              <Route 
                path="scorecard/:scorecardSlug" 
                element={
                  <ProtectedRoute>
                    <Scorecard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes - /admin */}
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="admin/topics" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminTopicManager />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* 404 Not Found - Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
