import { supabase } from './supabase';
export async function getArticles(limit = 30) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('articles')
    .select('id,title,slug,excerpt,content,cover_url,gallery,views,published_at,created_at,category_id,categories(name,slug)')
    .eq('status', 'published').order('published_at', { ascending: false, nullsFirst: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}
export async function getArticleBySlug(slug: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('articles')
    .select('id,title,slug,excerpt,content,cover_url,gallery,views,published_at,created_at,category_id,categories(name,slug)')
    .eq('status','published').eq('slug',slug).maybeSingle();
  if (error) throw error;
  return data;
}
export async function getVideos(limit = 40) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('videos')
    .select('id,title,slug,description,youtube_id,thumbnail_url,published_at,created_at,category_id,categories(name,slug)')
    .eq('status', 'published').order('published_at', { ascending: false, nullsFirst: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}
export async function getVideoBySlug(slug: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('videos')
    .select('id,title,slug,description,youtube_id,thumbnail_url,published_at,created_at,category_id,categories(name,slug)')
    .eq('status','published').eq('slug',slug).maybeSingle();
  if (error) throw error;
  return data;
}
