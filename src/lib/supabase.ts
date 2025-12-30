import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if env vars are set (avoids build-time errors)
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);

export type Card = {
  id: string;
  created_at: string;
  created_by: string | null;
  title: string;
  link_url: string | null;
  image_url: string | null;
  city: "berlin" | "rome" | null;
  category: "food" | "sight" | "activity" | "nightlife" | "stay" | "transport" | "other" | null;
  likes: string[];
  is_booked: boolean;
  day: string | null;
  notes: string | null;
};
