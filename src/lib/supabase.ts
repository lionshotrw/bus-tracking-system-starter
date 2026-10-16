cat > src/lib/supabase.ts <<'SS' import Constants from 'expo-constants'; import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (Constants.expoConfig?.extra as any)?.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';

const SUPABASE_ANON_KEY = (Constants.expoConfig?.extra as any)?.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { console.warn( 'Supabase URL/anon key is missing. Add them to .env.local or app.json extra values.' ); }

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase; SS
