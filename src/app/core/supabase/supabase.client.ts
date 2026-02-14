import { createClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

export const supabaseClient = createClient(environment.supabase.url, environment.supabase.key);
