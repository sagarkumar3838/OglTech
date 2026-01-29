import { supabase } from '../config/supabase';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  video_type: 'hero' | 'parallax';
  position: number;
  alt_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch hero video
 */
export const getHeroVideo = async (): Promise<Video | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('video_type', 'hero')
      .eq('is_active', true)
      .order('position', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching hero video:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getHeroVideo:', error);
    return null;
  }
};

/**
 * Fetch all parallax videos
 */
export const getParallaxVideos = async (): Promise<Video[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('video_type', 'parallax')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching parallax videos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getParallaxVideos:', error);
    return [];
  }
};

/**
 * Fetch all videos
 */
export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .order('video_type', { ascending: true })
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching all videos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    return [];
  }
};

/**
 * Add a new video (admin only)
 */
export const addVideo = async (video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<Video | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select()
      .single();

    if (error) {
      console.error('Error adding video:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addVideo:', error);
    return null;
  }
};

/**
 * Update a video (admin only)
 */
export const updateVideo = async (id: string, updates: Partial<Video>): Promise<Video | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateVideo:', error);
    return null;
  }
};

/**
 * Delete a video (admin only)
 */
export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting video:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    return false;
  }
};

/**
 * Toggle video active status (admin only)
 */
export const toggleVideoStatus = async (id: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling video status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in toggleVideoStatus:', error);
    return false;
  }
};
