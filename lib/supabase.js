import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

export const createClient = (supabaseUrl, supabaseAnonKey) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing! Check your environment variables.");
  }
  return supabaseCreateClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder'
  );
};