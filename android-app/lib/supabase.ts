import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const isSupabaseConfigured = Boolean(url && key && !url.includes('YOUR_PROJECT') && !key.includes('YOUR_PUBLIC'));
export const supabase = isSupabaseConfigured ? createClient(url, key, { auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}, global:{headers:{'X-Client-Info':'bam-tv-sn-android'}} }) : null;
