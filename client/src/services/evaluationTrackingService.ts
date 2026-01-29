import { supabase } from '../config/supabase';

export interface EvaluationSession {
  id: string;
  user_id: string;
  skill_name: string;
  current_level: 'basic' | 'intermediate' | 'advanced';
  status: 'in_progress' | 'passed' | 'failed' | 'expired';
  started_at: string;
  expires_at: string;
  completed_at?: string;
  score?: number;
  total_questions?: number;
  correct_answers?: number;
  wrong_answers?: number;
  can_retest: boolean;
  retest_available_at?: string;
}

export interface WeakTopic {
  id: string;
  user_id: string;
  evaluation_session_id: string;
  skill_name: string;
  level: string;
  topic_id: string;
  topic_name: string;
  wrong_count: number;
  total_attempts: number;
  accuracy_percentage: number;
  status: 'needs_review' | 'in_progress' | 'completed' | 'mastered';
  started_learning_at?: string;
  completed_learning_at?: string;
  time_spent_minutes: number;
}

export interface TopicReference {
  id: string;
  skill_name: string;
  category: string;
  topic_name: string;
  slug: string;
  description: string;
  difficulty_level: 'basic' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
  order_index: number;
}

export interface TopicContent {
  id: string;
  topic_id: string;
  section_title: string;
  section_type: 'syntax' | 'example' | 'explanation' | 'code' | 'table' | 'list' | 'note' | 'warning' | 'tip';
  content: string;
  code_language?: string;
  order_index: number;
}

export interface UserTopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  weak_topic_id?: string;
  status: 'not_started' | 'reading' | 'completed' | 'bookmarked';
  progress_percentage: number;
  time_spent_seconds: number;
  last_read_section_id?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
}

export interface RetestEligibility {
  id: string;
  user_id: string;
  evaluation_session_id: string;
  skill_name: string;
  level: string;
  required_topics_count: number;
  completed_topics_count: number;
  is_eligible: boolean;
  eligible_at?: string;
  retest_taken: boolean;
}

class EvaluationTrackingService {
  // ============================================
  // EVALUATION SESSION MANAGEMENT
  // ============================================

  async startEvaluationSession(
    userId: string,
    skillName: string,
    level: 'basic' | 'intermediate' | 'advanced'
  ): Promise<EvaluationSession> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour time limit

    const { data, error } = await supabase
      .from('evaluation_sessions')
      .insert({
        user_id: userId,
        skill_name: skillName,
        current_level: level,
        status: 'in_progress',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async completeEvaluationSession(
    sessionId: string,
    results: {
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      wrongAnswers: number;
      passed: boolean;
    }
  ): Promise<EvaluationSession> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .update({
        status: results.passed ? 'passed' : 'failed',
        completed_at: new Date().toISOString(),
        score: results.score,
        total_questions: results.totalQuestions,
        correct_answers: results.correctAnswers,
        wrong_answers: results.wrongAnswers,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getActiveEvaluationSession(
    userId: string,
    skillName: string
  ): Promise<EvaluationSession | null> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_name', skillName)
      .eq('status', 'in_progress')
      .gt('expires_at', new Date().toISOString())
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async checkSessionExpiry(sessionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .select('expires_at, status')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    const isExpired = new Date(data.expires_at) < new Date();
    if (isExpired && data.status === 'in_progress') {
      await supabase
        .from('evaluation_sessions')
        .update({ status: 'expired' })
        .eq('id', sessionId);
    }

    return isExpired;
  }

  // ============================================
  // WEAK TOPIC IDENTIFICATION
  // ============================================

  async identifyWeakTopics(
    sessionId: string,
    userId: string,
    questionResults: Array<{
      questionId: string;
      topicName: string;
      isCorrect: boolean;
    }>
  ): Promise<WeakTopic[]> {
    // Group by topic and calculate accuracy
    const topicStats = new Map<string, { correct: number; total: number }>();

    questionResults.forEach(({ topicName, isCorrect }) => {
      if (!topicStats.has(topicName)) {
        topicStats.set(topicName, { correct: 0, total: 0 });
      }
      const stats = topicStats.get(topicName)!;
      stats.total++;
      if (isCorrect) stats.correct++;
    });

    // Identify weak topics (accuracy < 60%)
    const weakTopics: WeakTopic[] = [];

    for (const [topicName, stats] of topicStats.entries()) {
      const accuracy = (stats.correct / stats.total) * 100;
      
      if (accuracy < 60) {
        // Get topic reference
        const { data: topicRef } = await supabase
          .from('topic_references')
          .select('id')
          .eq('topic_name', topicName)
          .single();

        if (topicRef) {
          const { data: session } = await supabase
            .from('evaluation_sessions')
            .select('skill_name, current_level')
            .eq('id', sessionId)
            .single();

          const { data, error } = await supabase
            .from('user_weak_topics')
            .insert({
              user_id: userId,
              evaluation_session_id: sessionId,
              skill_name: session?.skill_name,
              level: session?.current_level,
              topic_id: topicRef.id,
              topic_name: topicName,
              wrong_count: stats.total - stats.correct,
              total_attempts: stats.total,
              accuracy_percentage: accuracy,
              status: 'needs_review',
            })
            .select()
            .single();

          if (!error && data) {
            weakTopics.push(data);
          }
        }
      }
    }

    // Create retest eligibility record
    if (weakTopics.length > 0) {
      const { data: session } = await supabase
        .from('evaluation_sessions')
        .select('skill_name, current_level')
        .eq('id', sessionId)
        .single();

      await supabase.from('retest_eligibility').insert({
        user_id: userId,
        evaluation_session_id: sessionId,
        skill_name: session?.skill_name,
        level: session?.current_level,
        required_topics_count: weakTopics.length,
        completed_topics_count: 0,
        is_eligible: false,
      });
    }

    return weakTopics;
  }

  async getUserWeakTopics(
    userId: string,
    status?: string
  ): Promise<WeakTopic[]> {
    let query = supabase
      .from('user_weak_topics')
      .select('*')
      .eq('user_id', userId)
      .order('accuracy_percentage', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // ============================================
  // TOPIC REFERENCE SYSTEM
  // ============================================

  async getAllTopics(skillName?: string): Promise<TopicReference[]> {
    let query = supabase
      .from('topic_references')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (skillName) {
      query = query.eq('skill_name', skillName);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getTopicsByCategory(
    skillName: string,
    category: string
  ): Promise<TopicReference[]> {
    const { data, error } = await supabase
      .from('topic_references')
      .select('*')
      .eq('skill_name', skillName)
      .eq('category', category)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getTopicBySlug(slug: string): Promise<TopicReference | null> {
    const { data, error } = await supabase
      .from('topic_references')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getTopicContent(topicId: string): Promise<TopicContent[]> {
    const { data, error } = await supabase
      .from('topic_content_sections')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async searchTopics(query: string, userId?: string): Promise<TopicReference[]> {
    const { data, error } = await supabase
      .from('topic_references')
      .select('*')
      .or(`topic_name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(20);

    if (error) throw error;

    // Save search history
    if (userId && data) {
      await supabase.from('topic_search_history').insert({
        user_id: userId,
        search_query: query,
        results_count: data.length,
      });
    }

    return data || [];
  }

  // ============================================
  // USER TOPIC PROGRESS TRACKING
  // ============================================

  async startTopicLearning(
    userId: string,
    topicId: string,
    weakTopicId?: string
  ): Promise<UserTopicProgress> {
    const { data, error } = await supabase
      .from('user_topic_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        weak_topic_id: weakTopicId,
        status: 'reading',
        started_at: new Date().toISOString(),
        progress_percentage: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Update weak topic status
    if (weakTopicId) {
      await supabase
        .from('user_weak_topics')
        .update({
          status: 'in_progress',
          started_learning_at: new Date().toISOString(),
        })
        .eq('id', weakTopicId);
    }

    return data;
  }

  async updateTopicProgress(
    userId: string,
    topicId: string,
    progressPercentage: number,
    timeSpentSeconds: number,
    lastReadSectionId?: string
  ): Promise<void> {
    await supabase
      .from('user_topic_progress')
      .update({
        progress_percentage: progressPercentage,
        time_spent_seconds: timeSpentSeconds,
        last_read_section_id: lastReadSectionId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('topic_id', topicId);
  }

  async completeTopicLearning(
    userId: string,
    topicId: string
  ): Promise<void> {
    const { data: progress } = await supabase
      .from('user_topic_progress')
      .select('weak_topic_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    await supabase
      .from('user_topic_progress')
      .update({
        status: 'completed',
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    // Update weak topic status
    if (progress?.weak_topic_id) {
      await supabase
        .from('user_weak_topics')
        .update({
          status: 'completed',
          completed_learning_at: new Date().toISOString(),
        })
        .eq('id', progress.weak_topic_id);
    }
  }

  async getUserTopicProgress(
    userId: string,
    topicId: string
  ): Promise<UserTopicProgress | null> {
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // ============================================
  // RETEST ELIGIBILITY
  // ============================================

  async checkRetestEligibility(
    userId: string,
    sessionId: string
  ): Promise<RetestEligibility | null> {
    const { data, error } = await supabase
      .from('retest_eligibility')
      .select('*')
      .eq('user_id', userId)
      .eq('evaluation_session_id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  async getRetestEligibilityStatus(
    userId: string,
    skillName: string,
    level: string
  ): Promise<RetestEligibility | null> {
    const { data, error } = await supabase
      .from('retest_eligibility')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_name', skillName)
      .eq('level', level)
      .eq('retest_taken', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // ============================================
  // BOOKMARKS
  // ============================================

  async bookmarkTopic(userId: string, topicId: string, notes?: string): Promise<void> {
    await supabase.from('topic_bookmarks').upsert({
      user_id: userId,
      topic_id: topicId,
      notes,
    });
  }

  async removeBookmark(userId: string, topicId: string): Promise<void> {
    await supabase
      .from('topic_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId);
  }

  async getUserBookmarks(userId: string): Promise<TopicReference[]> {
    const { data, error } = await supabase
      .from('topic_bookmarks')
      .select('topic_id, topic_references(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((b: any) => b.topic_references) || [];
  }
}

export const evaluationTrackingService = new EvaluationTrackingService();
