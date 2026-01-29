import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluationTrackingService, TopicReference, TopicContent } from '../services/evaluationTrackingService';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Code,
  FileText,
  AlertCircle,
  Lightbulb,
  Info,
  Play,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

interface TopicVideo {
  id: string;
  topic_id: string;
  title: string;
  youtube_video_id: string;
  language: string;
  duration: string;
  quality: string;
}

export default function TopicReferencePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<TopicReference | null>(null);
  const [content, setContent] = useState<TopicContent[]>([]);
  const [videos, setVideos] = useState<TopicVideo[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadTopicData();
    }
  }, [slug]);

  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-save progress every 30 seconds
    if (user && topic && timeSpent > 0 && timeSpent % 30 === 0) {
      saveProgress();
    }
  }, [timeSpent]);

  const loadTopicData = async () => {
    try {
      setLoading(true);
      const topicData = await evaluationTrackingService.getTopicBySlug(slug!);
      if (!topicData) {
        toast.error('Topic not found');
        navigate('/topics');
        return;
      }

      setTopic(topicData);

      const contentData = await evaluationTrackingService.getTopicContent(topicData.id);
      setContent(contentData);

      // Load videos
      const { data: videosData } = await supabase
        .from('topic_videos')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('language');
      
      if (videosData) {
        setVideos(videosData);
      }

      if (user) {
        const progressData = await evaluationTrackingService.getUserTopicProgress(user.id, topicData.id);
        setProgress(progressData);

        // Check if bookmarked
        const bookmarks = await evaluationTrackingService.getUserBookmarks(user.id);
        setIsBookmarked(bookmarks.some(b => b.id === topicData.id));

        // Start learning tracking
        if (!progressData || progressData.status === 'not_started') {
          await evaluationTrackingService.startTopicLearning(user.id, topicData.id);
        }
      }
    } catch (error) {
      console.error('Error loading topic:', error);
      toast.error('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!user || !topic) return;

    try {
      const progressPercentage = Math.min(100, Math.floor((timeSpent / 300) * 100)); // 5 min = 100%
      await evaluationTrackingService.updateTopicProgress(
        user.id,
        topic.id,
        progressPercentage,
        timeSpent
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleComplete = async () => {
    if (!user || !topic) return;

    try {
      await evaluationTrackingService.completeTopicLearning(user.id, topic.id);
      toast.success('Topic completed! 🎉');
      setProgress({ ...progress, status: 'completed', progress_percentage: 100 });
    } catch (error) {
      console.error('Error completing topic:', error);
      toast.error('Failed to mark as complete');
    }
  };

  const toggleBookmark = async () => {
    if (!user || !topic) return;

    try {
      if (isBookmarked) {
        await evaluationTrackingService.removeBookmark(user.id, topic.id);
        toast.success('Bookmark removed');
      } else {
        await evaluationTrackingService.bookmarkTopic(user.id, topic.id);
        toast.success('Topic bookmarked');
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'explanation':
        return <FileText className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'note':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/topics')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{topic.icon}</span>
                <div>
                  <h1 className="text-4xl font-bold">{topic.topic_name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Badge style={{ backgroundColor: topic.color }}>
                  {topic.skill_name}
                </Badge>
                <Badge variant="outline">{topic.category}</Badge>
                <Badge variant="secondary">{topic.difficulty_level}</Badge>
              </div>
            </div>

            {user && (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>

                {progress?.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={handleComplete}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {user && progress && (
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Time spent: {formatTime(timeSpent)}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {progress.progress_percentage}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress_percentage}%` }}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Content Sections */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos ({videos.length})
            </TabsTrigger>
            <TabsTrigger value="examples">
              <Code className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-6">
            {content.map((section, index) => (
              <Card key={section.id} className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  {getSectionIcon(section.section_type)}
                  <h2 className="text-2xl font-semibold flex-1">
                    {section.section_title}
                  </h2>
                </div>

                {section.section_type === 'code' ? (
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className={`language-${section.code_language}`}>
                        {section.content}
                      </code>
                    </pre>
                    {section.code_language && (
                      <Badge
                        className="absolute top-2 right-2"
                        variant="secondary"
                      >
                        {section.code_language}
                      </Badge>
                    )}
                  </div>
                ) : section.section_type === 'tip' ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ) : section.section_type === 'warning' ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ) : section.section_type === 'note' ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="mt-6">
            {videos.length > 0 ? (
              <div className="space-y-6">
                {/* Language Selector */}
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <label className="font-semibold">Select Language:</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set(videos.map(v => v.language))).map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Video Player */}
                {videos.filter(v => v.language === selectedLanguage).map(video => (
                  <Card key={video.id} className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{video.title}</h3>
                    
                    {/* YouTube Embed */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </Badge>
                      <Badge variant="secondary">
                        {video.quality}
                      </Badge>
                      <Badge>
                        {video.language.charAt(0).toUpperCase() + video.language.slice(1)}
                      </Badge>
                    </div>
                  </Card>
                ))}

                {videos.filter(v => v.language === selectedLanguage).length === 0 && (
                  <Card className="p-12 text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No videos available in {selectedLanguage}
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No videos available for this topic yet
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-6">
            <Card className="p-12 text-center">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Interactive examples coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Content Sections */}
        <div className="space-y-6 hidden">
          {content.map((section, index) => (
            <Card key={section.id} className="p-6">
              <div className="flex items-start gap-3 mb-4">
                {getSectionIcon(section.section_type)}
                <h2 className="text-2xl font-semibold flex-1">
                  {section.section_title}
                </h2>
              </div>

              {section.section_type === 'code' ? (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code className={`language-${section.code_language}`}>
                      {section.content}
                    </code>
                  </pre>
                  {section.code_language && (
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {section.code_language}
                    </Badge>
                  )}
                </div>
              ) : section.section_type === 'tip' ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ) : section.section_type === 'warning' ? (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ) : section.section_type === 'note' ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Complete Button at Bottom */}
        {user && progress?.status !== 'completed' && (
          <Card className="mt-8 p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Finished reading?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Mark this topic as complete to track your progress
            </p>
            <Button onClick={handleComplete} size="lg">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark as Complete
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
