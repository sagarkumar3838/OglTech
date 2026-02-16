import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationTrackingService, TopicReference } from '../services/evaluationTrackingService';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Code, 
  Palette, 
  Zap,
  CheckCircle2,
  Clock,
  Bookmark
} from 'lucide-react';
import { toast } from 'sonner';
import { TechIcon } from '../utils/techIcons';

export default function TopicsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allTopics, setAllTopics] = useState<TopicReference[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<TopicReference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [userProgress, setUserProgress] = useState<Map<string, any>>(new Map());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const skills = [
    { name: 'HTML', value: 'html', color: '#E34F26' },
    { name: 'CSS', value: 'css', color: '#1572B6' },
    { name: 'JavaScript', value: 'javascript', color: '#F7DF1E' },
    { name: 'jQuery', value: 'jquery', color: '#0769AD' },
  ];

  useEffect(() => {
    loadTopics();
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    filterTopics();
  }, [searchQuery, selectedSkill, selectedDifficulty, allTopics]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const topics = await evaluationTrackingService.getAllTopics();
      setAllTopics(topics);
      setFilteredTopics(topics);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load bookmarks
      const userBookmarks = await evaluationTrackingService.getUserBookmarks(user.id);
      setBookmarks(new Set(userBookmarks.map(b => b.id)));

      // Load progress for all topics
      // Note: This is simplified - in production, you'd want to batch this
      const progressMap = new Map();
      for (const topic of allTopics) {
        const progress = await evaluationTrackingService.getUserTopicProgress(user.id, topic.id);
        if (progress) {
          progressMap.set(topic.id, progress);
        }
      }
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const filterTopics = () => {
    let filtered = [...allTopics];

    // Filter by skill
    if (selectedSkill !== 'all') {
      filtered = filtered.filter(t => t.skill_name === selectedSkill);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(t => t.difficulty_level === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.topic_name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    setFilteredTopics(filtered);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query && user) {
      // Save search to history
      await evaluationTrackingService.searchTopics(query, user.id);
    }
  };

  const groupTopicsByCategory = (topics: TopicReference[]) => {
    const grouped = new Map<string, TopicReference[]>();
    topics.forEach(topic => {
      if (!grouped.has(topic.category)) {
        grouped.set(topic.category, []);
      }
      grouped.get(topic.category)!.push(topic);
    });
    return grouped;
  };

  const getProgressBadge = (topicId: string) => {
    const progress = userProgress.get(topicId);
    if (!progress) return null;

    if (progress.status === 'completed') {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }

    if (progress.status === 'reading') {
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    }

    return null;
  };

  const renderTopicCard = (topic: TopicReference) => {
    const isBookmarked = bookmarks.has(topic.id);
    const progress = userProgress.get(topic.id);

    return (
      <Card
        key={topic.id}
        className="p-4 hover:shadow-lg transition-all cursor-pointer group relative"
        onClick={() => navigate(`/topics/${topic.slug}`)}
      >
        {isBookmarked && (
          <Bookmark className="absolute top-2 right-2 w-4 h-4 text-yellow-500 fill-yellow-500" />
        )}

        <div className="flex items-start gap-3">
          <span className="text-3xl">{topic.icon}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {topic.topic_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {topic.description}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge
                variant="outline"
                style={{ borderColor: topic.color, color: topic.color }}
              >
                {topic.skill_name}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {topic.difficulty_level}
              </Badge>
              {user && getProgressBadge(topic.id)}
            </div>

            {progress && progress.progress_percentage > 0 && progress.status !== 'completed' && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${progress.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const groupedTopics = groupTopicsByCategory(filteredTopics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            📚 Topic Reference Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Quick reference guides for web development topics. Learn, practice, and master your skills.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Skill Filter */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <Button
            variant={selectedSkill === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedSkill('all')}
          >
            All Topics
          </Button>
          {skills.map(skill => (
            <Button
              key={skill.name}
              variant={selectedSkill === skill.name ? 'default' : 'outline'}
              onClick={() => setSelectedSkill(skill.name)}
              style={
                selectedSkill === skill.name
                  ? { backgroundColor: skill.color }
                  : {}
              }
              className="flex items-center gap-2"
            >
              <TechIcon name={skill.value} size={18} colored={selectedSkill !== skill.name} />
              {skill.name}
            </Button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            size="sm"
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === 'basic' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('basic')}
          >
            Basic
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('intermediate')}
          >
            Intermediate
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('advanced')}
          >
            Advanced
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6 text-gray-600 dark:text-gray-400">
          Showing {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
        </div>

        {/* Topics Grid by Category */}
        <div className="space-y-12">
          {Array.from(groupedTopics.entries()).map(([category, topics]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">#</span>
                {category}
                <Badge variant="secondary">{topics.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(renderTopicCard)}
              </div>
            </div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No topics found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
