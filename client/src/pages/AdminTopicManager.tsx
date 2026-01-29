import { useState } from 'react';
import { supabase } from '../config/supabase';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Save } from 'lucide-react';

export default function AdminTopicManager() {
  const [topicSlug, setTopicSlug] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionType, setSectionType] = useState('explanation');
  const [content, setContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('');
  
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [videoLanguage, setVideoLanguage] = useState('english');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoQuality, setVideoQuality] = useState('intermediate');

  const handleAddContent = async () => {
    try {
      // Get topic ID
      const { data: topic } = await supabase
        .from('topic_references')
        .select('id')
        .eq('slug', topicSlug)
        .single();

      if (!topic) {
        toast.error('Topic not found! Check the slug.');
        return;
      }

      // Get current max order
      const { data: sections } = await supabase
        .from('topic_content_sections')
        .select('order_index')
        .eq('topic_id', topic.id)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrder = sections && sections.length > 0 ? sections[0].order_index + 1 : 1;

      // Insert content
      const { error } = await supabase
        .from('topic_content_sections')
        .insert({
          topic_id: topic.id,
          section_title: sectionTitle,
          section_type: sectionType,
          content: content,
          code_language: codeLanguage || null,
          order_index: nextOrder
        });

      if (error) throw error;

      toast.success('Content added successfully!');
      
      // Clear form
      setSectionTitle('');
      setContent('');
      setCodeLanguage('');
    } catch (error: any) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content: ' + error.message);
    }
  };

  const handleAddVideo = async () => {
    try {
      // Get topic ID
      const { data: topic } = await supabase
        .from('topic_references')
        .select('id')
        .eq('slug', topicSlug)
        .single();

      if (!topic) {
        toast.error('Topic not found! Check the slug.');
        return;
      }

      // Insert video
      const { error } = await supabase
        .from('topic_videos')
        .insert({
          topic_id: topic.id,
          title: videoTitle,
          youtube_video_id: youtubeVideoId,
          language: videoLanguage,
          duration: videoDuration,
          quality: videoQuality
        });

      if (error) throw error;

      toast.success('Video added successfully!');
      
      // Clear form
      setVideoTitle('');
      setYoutubeVideoId('');
      setVideoDuration('');
    } catch (error: any) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">📚 Topic Content Manager</h1>

        {/* Topic Slug Input */}
        <Card className="p-6 mb-6">
          <Label htmlFor="topicSlug">Topic Slug (e.g., html-forms, css-flexbox)</Label>
          <Input
            id="topicSlug"
            value={topicSlug}
            onChange={(e) => setTopicSlug(e.target.value)}
            placeholder="html-forms"
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Find slugs in topic_references table or from URL: /topics/[slug]
          </p>
        </Card>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Add Content Section</TabsTrigger>
            <TabsTrigger value="video">Add Video</TabsTrigger>
          </TabsList>

          {/* Add Content Tab */}
          <TabsContent value="content">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sectionTitle">Section Title</Label>
                  <Input
                    id="sectionTitle"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="What is HTML Forms?"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="sectionType">Section Type</Label>
                  <Select value={sectionType} onValueChange={setSectionType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="explanation">Explanation</SelectItem>
                      <SelectItem value="code">Code Example</SelectItem>
                      <SelectItem value="tip">Tip</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="syntax">Syntax</SelectItem>
                      <SelectItem value="example">Example</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sectionType === 'code' && (
                  <div>
                    <Label htmlFor="codeLanguage">Code Language</Label>
                    <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="jsx">JSX/React</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your content here..."
                    rows={12}
                    className="mt-2 font-mono"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    For code sections, paste your code directly. For explanations, write 2-3 sentences.
                  </p>
                </div>

                <Button onClick={handleAddContent} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content Section
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Add Video Tab */}
          <TabsContent value="video">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videoTitle">Video Title</Label>
                  <Input
                    id="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="HTML Forms Complete Tutorial"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="youtubeVideoId">YouTube Video ID</Label>
                  <Input
                    id="youtubeVideoId"
                    value={youtubeVideoId}
                    onChange={(e) => setYoutubeVideoId(e.target.value)}
                    placeholder="dQw4w9WgXcQ"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    From URL: https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                  </p>
                </div>

                <div>
                  <Label htmlFor="videoLanguage">Language</Label>
                  <Select value={videoLanguage} onValueChange={setVideoLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="videoDuration">Duration</Label>
                  <Input
                    id="videoDuration"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="25:40"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Format: MM:SS or HH:MM:SS
                  </p>
                </div>

                <div>
                  <Label htmlFor="videoQuality">Quality Level</Label>
                  <Select value={videoQuality} onValueChange={setVideoQuality}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddVideo} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Reference */}
        <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold mb-2">📝 Quick Reference</h3>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li>• <strong>Explanation</strong>: 2-3 sentences explaining the concept</li>
            <li>• <strong>Code</strong>: Working code examples with comments</li>
            <li>• <strong>Tip</strong>: Best practices and pro tips</li>
            <li>• <strong>Warning</strong>: Common mistakes to avoid</li>
            <li>• <strong>Note</strong>: Additional important information</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
