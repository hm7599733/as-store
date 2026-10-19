import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://dnilahehjcmhfouktsjk.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWxhaGVoamNtaGZvdWt0c2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjUyNjgsImV4cCI6MjEwNzg0MTI2OH0.OwSUc_8-PWHSEms7WXz2Ycu_G0tfG5AXe-_YiCN3zpE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
