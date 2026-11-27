import { supabase } from './supabase';
import type { Article, Video, Category } from '../types';

export async function getHomeContent() {
  if (!supabase) throw new Error('Configuration Supabase manquante.');
  const [articles, videos, categories] = await Promise.all([
    supabase.from('articles').select('id,title,slug,excerpt,content,cover_url,category_id,status,featured,views,published_at,created_at').eq('status','published').order('published_at',{ascending:false}).limit(8),
    supabase.from('videos').select('id,title,slug,description,youtube_id,thumbnail_url,category_id,status,featured,published_at,created_at').eq('status','published').order('published_at',{ascending:false}).limit(8),
    supabase.from('categories').select('id,name,slug,type,position').order('position'),
  ]);
  if (articles.error) throw articles.error;
  if (videos.error) throw videos.error;
  if (categories.error) throw categories.error;
  return { articles:(articles.data||[]) as Article[], videos:(videos.data||[]) as Video[], categories:(categories.data||[]) as Category[] };
}
export async function getArticles(categoryId?:string) {
  if (!supabase) throw new Error('Configuration Supabase manquante.');
  let q=supabase.from('articles').select('*').eq('status','published').order('published_at',{ascending:false}).limit(60);
  if(categoryId) q=q.eq('category_id',categoryId);
  const {data,error}=await q; if(error) throw error; return (data||[]) as Article[];
}
export async function getVideos(categoryId?:string) {
  if (!supabase) throw new Error('Configuration Supabase manquante.');
  let q=supabase.from('videos').select('*').eq('status','published').order('published_at',{ascending:false}).limit(60);
  if(categoryId) q=q.eq('category_id',categoryId);
  const {data,error}=await q; if(error) throw error; return (data||[]) as Video[];
}
