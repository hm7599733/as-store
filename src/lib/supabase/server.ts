import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://dnilahehjcmhfouktsjk.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWxhaGVoamNtaGZvdWt0c2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjUyNjgsImV4cCI6MjEwNzg0MTI2OH0.OwSUc_8-PWHSEms7WXz2Ycu_G0tfG5AXe-_YiCN3zpE';

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWxhaGVoamNtaGZvdWt0c2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI2NTI2OCwiZXhwIjoyMTA3ODQxMjY4fQ.BnK9PEUIvh3BhG5hSm8xyYZwoDAFltliYfxR6oOlL1k';

export function getPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export function createServiceClient() {
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false },
  });
}
