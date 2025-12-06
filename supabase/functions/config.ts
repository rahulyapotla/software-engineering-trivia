import { createClient } from "@supabase/supabase-js";

export const CONFIG = {
  // How similar two questions must be to count as duplicates
  SEMANTIC_DUPLICATE_THRESHOLD: 0.85,

  // How similar two questions must be to count as same-topic (streak)
  TOPIC_STREAK_THRESHOLD: 0.90,

  RECENT_TOPIC_WINDOW: 3,

  MAX_RETRIES: 5,
};

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apiKey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);