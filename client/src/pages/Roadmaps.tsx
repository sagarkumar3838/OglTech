import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle2, Circle, Clock, TrendingUp, 
  BookOpen, Target, ArrowRight, Star
} from 'lucide-react';

export default function Roadmaps() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  useEffect(() => {
    if (selectedRoadmap) {
      loadTopics(selectedRoadmap.id);
    }
  }, [selectedRoadmap, user]);

  const loadRoadmaps = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('roadmaps')
        .select('*')
        .order('is_popular', { ascending: false });
      
      setRoadmaps(data || []);
      if (data && data.length > 0) {
        setSelectedRoadmap(data[0]);
      }
    } catch (error) {
      console.error('Error loading roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (roadmapId: string) => {
    try {
      const { data: topicsData } = await supabase
        .from('roadmap_topics')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_index');
      
      setTopics(topicsData || []);

      if (user) {
        const { data: progressData } = await supabase
          .from('user_roadmap_progress')
          .select('topic_id, completed')
          .eq('user_id', user.id)
          .eq('roadmap_id', roadmapId);
        
        const progressMap: Record<string, boolean> = {};
        progressData?.forEach(p => {
          progressMap[p.topic_id] = p.completed;
        });
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const toggleTopicCompletion = async (topicId: string) => {
    if (!user) return;

    const isCompleted = userProgress[topicId];
    
    try {
      if (isCompleted) {
        await supabase
          .from('user_roadmap_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId);
      } else {
        await supabase
          .from('user_roadmap_progress')
          .upsert({
            user_id: user.id,
            roadmap_id: selectedRoadmap.id,
            topic_id: topicId,
            completed: true,
            completed_at: new Date().toISOString()
          });
      }
      
      setUserProgress(prev => ({
        ...prev,
        [topicId]: !isCompleted
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
      cyan: 'from-cyan-500 to-cyan-600',
      red: 'from-red-500 to-red-600',
      sky: 'from-sky-500 to-sky-600',
      violet: 'from-violet-500 to-violet-600',
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return { label: 'Fundamentals', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' };
      case 2: return { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' };
      case 3: return { label: 'Advanced', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' };
      default: return { label: 'Basic', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200' };
    }
  };

  const completedCount = Object.values(userProgress).filter(Boolean).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🗺️ Learning Roadmaps
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Step-by-step guides to become a professional developer
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Roadmap List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Your Path</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  roadmaps.map((roadmap) => (
                    <button
                      key={roadmap.id}
                      onClick={() => setSelectedRoadmap(roadmap)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedRoadmap?.id === roadmap.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{roadmap.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{roadmap.title}</div>
                          {roadmap.is_popular && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                              <Star className="w-3 h-3 fill-current" />
                              Popular
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedRoadmap && (
              <>
                {/* Roadmap Header */}
                <Card className={`bg-gradient-to-r ${getColorClass(selectedRoadmap.color)} text-white`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          {selectedRoadmap.icon} {selectedRoadmap.title}
                        </h2>
                        <p className="text-blue-100 mb-4">{selectedRoadmap.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {selectedRoadmap.estimated_months} months
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {selectedRoadmap.difficulty}
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topics.length} topics
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {user && topics.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Your Progress</span>
                          <span>{completedCount} / {topics.length} completed</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Topics List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Path</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topics.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No topics available yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {topics.map((topic, index) => {
                          const isCompleted = userProgress[topic.id];
                          const levelInfo = getLevelLabel(topic.level);
                          
                          return (
                            <div
                              key={topic.id}
                              className={`border rounded-lg p-4 transition-all ${
                                isCompleted 
                                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                {user && (
                                  <button
                                    onClick={() => toggleTopicCompletion(topic.id)}
                                    className="mt-1 flex-shrink-0"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    ) : (
                                      <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                                    )}
                                  </button>
                                )}
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-semibold text-lg">{topic.title}</h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {topic.description}
                                      </p>
                                    </div>
                                    <span className="text-2xl ml-4">{index + 1}</span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className={`px-2 py-1 text-xs rounded ${levelInfo.color}`}>
                                      {levelInfo.label}
                                    </span>
                                    {topic.estimated_hours && (
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                                        ~{topic.estimated_hours}h
                                      </span>
                                    )}
                                    {topic.category && (
                                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                                        {topic.category}
                                      </span>
                                    )}
                                  </div>

                                  {topic.resources && topic.resources.length > 0 && (
                                    <div className="mt-3">
                                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                        Resources:
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {topic.resources.map((resource: any, i: number) => (
                                          <a
                                            key={i}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                          >
                                            {resource.title}
                                            <ArrowRight className="w-3 h-3" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CTA */}
                {!user && (
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Sign in to mark topics as completed and track your learning journey
                      </p>
                      <Link to="/login">
                        <Button size="lg">Sign In to Start</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
