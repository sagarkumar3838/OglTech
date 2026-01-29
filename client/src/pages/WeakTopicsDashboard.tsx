import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationTrackingService, WeakTopic, RetestEligibility } from '../services/evaluationTrackingService';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  AlertCircle, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  TrendingDown,
  Target,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function WeakTopicsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [retestEligibility, setRetestEligibility] = useState<RetestEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, filter]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load weak topics
      const topics = filter === 'all' 
        ? await evaluationTrackingService.getUserWeakTopics(user.id)
        : await evaluationTrackingService.getUserWeakTopics(user.id, filter);
      
      setWeakTopics(topics);

      // Load retest eligibility for the most recent session
      if (topics.length > 0) {
        const sessionId = topics[0].evaluation_session_id;
        const eligibility = await evaluationTrackingService.checkRetestEligibility(user.id, sessionId);
        setRetestEligibility(eligibility);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load weak topics');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = async (topic: WeakTopic) => {
    try {
      await evaluationTrackingService.startTopicLearning(user!.id, topic.topic_id, topic.id);
      navigate(`/topics/${getTopicSlug(topic.topic_name)}`);
    } catch (error) {
      console.error('Error starting learning:', error);
      toast.error('Failed to start learning');
    }
  };

  const handleRetest = () => {
    if (!retestEligibility) return;
    navigate(`/evaluation/${retestEligibility.skill_name}/${retestEligibility.level}`);
  };

  const getTopicSlug = (topicName: string) => {
    return topicName.toLowerCase().replace(/\s+/g, '-');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs_review':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'mastered':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'needs_review':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'mastered':
        return <Target className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const calculateOverallProgress = () => {
    if (weakTopics.length === 0) return 0;
    const completed = weakTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length;
    return Math.round((completed / weakTopics.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (weakTopics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Weak Topics Found!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't taken any evaluations yet, or you're doing great!
            </p>
            <Button onClick={() => navigate('/evaluation')}>
              Take an Evaluation
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📚 Your Learning Path</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Focus on these topics to improve your skills and unlock retest
          </p>
        </div>

        {/* Overall Progress Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Overall Progress</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {weakTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length} of {weakTopics.length} topics completed
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">
              {overallProgress}%
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </Card>

        {/* Retest Eligibility Card */}
        {retestEligibility && (
          <Card className={`p-6 mb-8 ${retestEligibility.is_eligible ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {retestEligibility.is_eligible ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                ) : (
                  <Clock className="w-12 h-12 text-yellow-500" />
                )}
                <div>
                  <h3 className="text-xl font-bold">
                    {retestEligibility.is_eligible ? 'Ready for Retest!' : 'Keep Learning'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {retestEligibility.is_eligible 
                      ? 'You\'ve completed all required topics. Take the retest now!'
                      : `Complete ${retestEligibility.required_topics_count - retestEligibility.completed_topics_count} more topic(s) to unlock retest`
                    }
                  </p>
                </div>
              </div>
              {retestEligibility.is_eligible && !retestEligibility.retest_taken && (
                <Button onClick={handleRetest} size="lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Take Retest
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Topics
          </Button>
          <Button
            variant={filter === 'needs_review' ? 'default' : 'outline'}
            onClick={() => setFilter('needs_review')}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Needs Review
          </Button>
          <Button
            variant={filter === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in_progress')}
          >
            <Clock className="w-4 h-4 mr-2" />
            In Progress
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </Button>
        </div>

        {/* Weak Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weakTopics.map((topic) => (
            <Card key={topic.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{topic.topic_name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{topic.skill_name}</Badge>
                    <Badge variant="secondary">{topic.level}</Badge>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${getStatusColor(topic.status)}`}>
                  {getStatusIcon(topic.status)}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                  <span className={`font-semibold ${topic.accuracy_percentage < 60 ? 'text-red-500' : 'text-green-500'}`}>
                    {topic.accuracy_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Wrong Answers</span>
                  <span className="font-semibold text-red-500">
                    {topic.wrong_count} / {topic.total_attempts}
                  </span>
                </div>
                {topic.time_spent_minutes > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                    <span className="font-semibold">
                      {topic.time_spent_minutes} min
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {topic.status === 'needs_review' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleStartLearning(topic)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              )}
              {topic.status === 'in_progress' && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleStartLearning(topic)}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              )}
              {topic.status === 'completed' && (
                <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Completed
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
