import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  const missing = [
    !supabaseUrl && "VITE_SUPABASE_URL",
    !supabaseKey && "VITE_SUPABASE_KEY",
  ].filter(Boolean);
  console.error(
    `Supabase environment variables missing: ${missing.join(", ")}.\n` +
      "Add them in Vercel Project Settings → Environment Variables (Production & Preview) and redeploy."
  );
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
