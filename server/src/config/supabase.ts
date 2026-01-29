import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
