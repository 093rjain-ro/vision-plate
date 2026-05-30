import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function ensureAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Attempt anonymous sign in to satisfy RLS
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn("Silent anonymous auth failed, proceeding as unauthenticated client", error);
    }
  }
}
