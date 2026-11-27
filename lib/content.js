import { createPublicClient } from '@/lib/supabase/public';

const articleFields = 'id,title,slug,excerpt,content,cover_url,published_at,featured,views,category:categories(name,slug)';
const videoFields = 'id,title,slug,description,youtube_id,thumbnail_url,published_at,featured,category:categories(name,slug),emission:emissions(title,slug)';
const emissionFields = 'id,title,slug,description,cover_url,schedule,position';

export async function getArticles(limit = 20) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(articleFields)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error('Les actualités ne sont pas disponibles.');
  return data ?? [];
}

export async function getFeaturedArticle() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(articleFields)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error('La une est momentanément indisponible.');
  return data;
}

export async function getArticle(slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(articleFields)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error('Cet article ne peut pas être chargé.');
  return data;
}

export async function getVideos(limit = 100) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('videos')
    .select(videoFields)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error('Les vidéos ne sont pas disponibles.');
  return data ?? [];
}

export async function getVideo(slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('videos')
    .select(videoFields)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error('Cette vidéo ne peut pas être chargée.');
  return data;
}

export async function getEmissions(limit = 50) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('emissions')
    .select(emissionFields)
    .eq('is_active', true)
    .order('position', { ascending: true })
    .limit(limit);

  if (error) throw new Error('Les émissions ne sont pas disponibles.');
  return data ?? [];
}

export async function getCategories(type) {
  const supabase = createPublicClient();
  let query = supabase.from('categories').select('id,name,slug,type,position').order('position');
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) throw new Error('Les rubriques ne sont pas disponibles.');
  return data ?? [];
}

export async function getCategoryArticles(categorySlug) {
  const supabase = createPublicClient();
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id,name,slug,type')
    .eq('slug', categorySlug)
    .eq('type', 'article')
    .maybeSingle();

  if (categoryError || !category) return { category: null, articles: [] };

  const { data: articles, error } = await supabase
    .from('articles')
    .select(articleFields)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) throw new Error('Cette rubrique est momentanément indisponible.');
  return { category, articles: articles ?? [] };
}

export async function searchContent(term) {
  const query = term.trim().slice(0, 100).replace(/[\\%_*"(),\u0000-\u001f]+/g, ' ').trim();
  if (!query) return { articles: [], videos: [] };

  const supabase = createPublicClient();
  const pattern = `"%${query}%"`;
  const [articleResult, videoResult] = await Promise.all([
    supabase.from('articles').select(articleFields).eq('status', 'published')
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`).limit(30),
    supabase.from('videos').select(videoFields).eq('status', 'published')
      .or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(30),
  ]);

  if (articleResult.error || videoResult.error) {
    throw new Error('La recherche est momentanément indisponible.');
  }

  return { articles: articleResult.data ?? [], videos: videoResult.data ?? [] };
}

export function videoThumbnail(video) {
  if (video.thumbnail_url?.startsWith('https://')) return video.thumbnail_url;
  if (/^[A-Za-z0-9_-]{11}$/.test(video.youtube_id ?? '')) {
    return `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`;
  }
  return '';
}
