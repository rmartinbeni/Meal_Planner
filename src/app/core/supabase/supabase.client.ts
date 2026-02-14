import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

export const supabaseClient: SupabaseClient = createClient(
  environment.supabase.url,
  environment.supabase.key
);
