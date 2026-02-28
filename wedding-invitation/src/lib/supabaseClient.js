import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  console.error(
    "❌ Supabase URL is missing or invalid! \n" +
      "Please check your .env file or GitHub Secrets (VITE_SUPABASE_URL).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
