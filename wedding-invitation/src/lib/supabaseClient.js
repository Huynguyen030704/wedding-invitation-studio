import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  console.warn("⚠️ Supabase credentials missing or invalid.");
}

// Khởi tạo an toàn: nếu thiếu URL thì export null chứ không gọi createClient
export const supabase =
  supabaseUrl && supabaseUrl.startsWith("http")
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
