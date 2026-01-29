import { supabase } from '../config/supabase';

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  user_role?: string;
  experience_level?: string;
  skills?: string[];
  interests?: string[];
  learning_goals?: string[];
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  preferred_learning_style?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCourseEnrollment {
  id?: string;
  user_id: string;
  career_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  started_at?: string;
  completed_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  user_role?: string;
  experience_level?: string;
  total_tests: number;
  average_score: number;
  total_correct: number;
  total_questions_attempted: number;
  last_test_date?: string;
  rank: number;
}

class UserProfileService {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception fetching user profile:', err);
      return null;
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }

    return data;
  }

  // Upload avatar image
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Get user course enrollments
  async getUserEnrollments(userId: string): Promise<UserCourseEnrollment[]> {
    const { data, error } = await supabase
      .from('user_course_enrollments')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }

    return data || [];
  }

  // Enroll in a course
  async enrollInCourse(enrollment: UserCourseEnrollment): Promise<UserCourseEnrollment | null> {
    const { data, error } = await supabase
      .from('user_course_enrollments')
      .upsert(enrollment, { onConflict: 'user_id,career_id' })
      .select()
      .single();

    if (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }

    return data;
  }

  // Update course progress
  async updateCourseProgress(
    userId: string,
    careerId: string,
    updates: Partial<UserCourseEnrollment>
  ): Promise<UserCourseEnrollment | null> {
    const { data, error } = await supabase
      .from('user_course_enrollments')
      .update(updates)
      .eq('user_id', userId)
      .eq('career_id', careerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }

    return data;
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  }

  // Get user rank
  async getUserRank(userId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('rank')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }

    return data?.rank || null;
  }

  // Get user stats
  async getUserStats(userId: string) {
    // Get scorecards
    const { data: scorecards, error: scorecardsError } = await supabase
      .from('scorecards')
      .select('*')
      .eq('user_id', userId);

    if (scorecardsError) {
      console.error('Error fetching scorecards:', scorecardsError);
      return null;
    }

    // Get enrollments
    const enrollments = await this.getUserEnrollments(userId);

    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const inProgressCourses = enrollments.filter(e => e.status === 'in_progress').length;
    const totalTests = scorecards?.length || 0;
    const averageScore = scorecards && scorecards.length > 0
      ? scorecards.reduce((acc, sc) => acc + Number(sc.overall_score), 0) / scorecards.length
      : 0;

    return {
      completedCourses,
      inProgressCourses,
      totalTests,
      averageScore: Math.round(averageScore),
      enrollments,
      scorecards
    };
  }

  // Subscribe to leaderboard changes (real-time)
  subscribeToLeaderboard(callback: (payload: any) => void) {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scorecards'
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Subscribe to user profile changes (real-time)
  subscribeToUserProfile(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`user-profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }
}

export const userProfileService = new UserProfileService();
