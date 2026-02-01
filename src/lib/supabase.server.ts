import { createClient } from "@supabase/supabase-js";

// This key is secret and should NEVER be prefixed with VITE_ 
// if you want to ensure it doesn't leak to the client bundle.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    if (typeof window === "undefined") {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Server-side operations will fall back to anon key or fail.");
    }
}

// Create a server-side client with the service role key.
// This client bypasses Row Level Security (RLS).
export const supabaseAdmin = createClient(
    supabaseUrl || "", 
    supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY || ""
);
