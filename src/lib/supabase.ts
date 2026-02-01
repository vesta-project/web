import { createClient } from "@supabase/supabase-js";

// Prefer VITE_ names first for backward compatibility with previous setup,
// then fall back to the user's provided NEXT_PUBLIC names.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
