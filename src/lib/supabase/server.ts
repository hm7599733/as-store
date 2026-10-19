import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://dnilahehjcmhfouktsjk.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWxhaGVoamNtaGZvdWt0c2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjUyNjgsImV4cCI6MjEwNzg0MTI2OH0.OwSUc_8-PWHSEms7WXz2Ycu_G0tfG5AXe-_YiCN3zpE';
const FALLBACK_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWxhaGVoamNtaGZvdWt0c2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI2NTI2OCwiZXhwIjoyMTA3ODQxMjY4fQ.BnK9PEUIvh3BhG5hSm8xyYZwoDAFltliYfxR6oOlL1k';

function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return FALLBACK_URL;
  let url = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  if (!url) return FALLBACK_URL;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return FALLBACK_URL;
  }
}

function sanitizeKey(rawKey?: string, fallback: string = ''): string {
  if (!rawKey) return fallback;
  const cleaned = rawKey.trim().replace(/^['"]|['"]$/g, '');
  return cleaned || fallback;
}

const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, FALLBACK_ANON_KEY);
const supabaseServiceRoleKey = sanitizeKey(process.env.SUPABASE_SERVICE_ROLE_KEY, FALLBACK_SERVICE_ROLE_KEY);

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

