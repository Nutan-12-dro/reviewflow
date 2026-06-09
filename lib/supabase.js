import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

export function createClient() {
  // Pull keys safely from whichever environment the app is running on (Local or Vercel)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If keys are completely missing, don't crash silently—tell us exactly what's wrong in the logs
  if (!url || !anonKey) {
    console.error("Missing Supabase Environment Keys! Check your Vercel Dashboard Settings.");
  }

  return supabaseCreateClient(
    url || "", 
    anonKey || "", 
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
}