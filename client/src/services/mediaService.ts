import { supabase } from '../config/supabase';

export interface Media {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  usage_type: 'hero' | 'parallax';
  position: number;
  alt_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch hero media (video or image)
 */
export const getHeroMedia = async (): Promise<Media | null> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('usage_type', 'hero')
      .eq('is_active', true)
      .order('position', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      // Silently handle error if table doesn't exist
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('Media table not found. Please run create-media-table.sql');
        return null;
      }
      console.error('Error fetching hero media:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.log('Media service error:', error);
    return null;
  }
};

/**
 * Fetch all parallax media (images only - videos disabled for parallax)
 */
export const getParallaxMedia = async (): Promise<Media[]> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('usage_type', 'parallax')
      .eq('media_type', 'image') // Only fetch images for parallax
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      // Silently handle error if table doesn't exist
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('Media table not found. Please run create-media-table.sql');
        return [];
      }
      console.error('Error fetching parallax media:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.log('Media service error:', error);
    return [];
  }
};

/**
 * Fetch all media
 */
export const getAllMedia = async (): Promise<Media[]> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('is_active', true)
      .order('usage_type', { ascending: true })
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching all media:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllMedia:', error);
    return [];
  }
};

/**
 * Add new media (admin only)
 */
export const addMedia = async (media: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media | null> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert([media])
      .select()
      .single();

    if (error) {
      console.error('Error adding media:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addMedia:', error);
    return null;
  }
};

/**
 * Update media (admin only)
 */
export const updateMedia = async (id: string, updates: Partial<Media>): Promise<Media | null> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating media:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateMedia:', error);
    return null;
  }
};

/**
 * Delete media (admin only)
 */
export const deleteMedia = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting media:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    return false;
  }
};

/**
 * Toggle media active status (admin only)
 */
export const toggleMediaStatus = async (id: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('media')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling media status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in toggleMediaStatus:', error);
    return false;
  }
};
