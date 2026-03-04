import { environment } from '@env/environment';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(environment.supabase.url, environment.supabase.key);
