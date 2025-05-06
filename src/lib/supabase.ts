import { createClient } from '@supabase/supabase-js';

// Define environment variables with type safety
const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);