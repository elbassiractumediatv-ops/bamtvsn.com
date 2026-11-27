'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUser, requireAdmin } from '@/lib/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function val(form, name) { return String(form.get(name) || '').trim(); }
function slugify(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 75) || 'contenu'; }
async function uniqueSlug(supabase, table, title) {
  const base = slugify(title); let slug = base; let n = 2;
  for (let attempt = 0; attempt < 25; attempt++) {
    const { data, error } = await supabase.from(table).select('id').eq('slug', slug).maybeSingle();
    if (error) return null;
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
  return null;
}
function validUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return value.length <= 2048 && url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function loginAction(form) {
  const email = val(form, 'email');
  const password = form.get('password');
  if (!email || typeof password !== 'string' || !password) redirect('/admin?error=missing');
  if (email.length > 254 || password.length > 1024) redirect('/admin?error=login');
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/admin?error=login');
  const { user } = await getAdminUser(supabase);
  if (!user) {
    await supabase.auth.signOut({ scope: 'local' });
    redirect('/admin?error=login');
  }
  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  redirect(error ? '/admin?error=logout' : '/admin');
}

export async function createVideoAction(form) {
  const { supabase } = await requireAdmin();
  const title = val(form, 'title'); const youtubeId = val(form, 'youtube_id'); const description = val(form, 'description');
  const thumbnail = val(form, 'thumbnail_url'); const categoryId = val(form, 'category_id'); const emissionId = val(form, 'emission_id');
  if (!title || !/^[A-Za-z0-9_-]{11}$/.test(youtubeId) || !validUrl(thumbnail)) redirect('/admin?tab=video&error=video');
  const slug = await uniqueSlug(supabase, 'videos', title);
  if (!slug) redirect('/admin?tab=video&error=save');
  const { error } = await supabase.from('videos').insert({ title, slug, youtube_id: youtubeId, description: description || null, thumbnail_url: thumbnail || null, category_id: categoryId || null, emission_id: emissionId || null, status: 'published', featured: false, published_at: new Date().toISOString() });
  if (error) redirect('/admin?tab=video&error=save');
  revalidatePath('/', 'layout'); redirect('/admin?tab=video&created=video');
}

export async function createArticleAction(form) {
  const { supabase, user } = await requireAdmin();
  const title = val(form, 'title'); const excerpt = val(form, 'excerpt'); const content = val(form, 'content'); const cover = val(form, 'cover_url'); const category = val(form, 'category_id');
  if (!title || !content || !validUrl(cover)) redirect('/admin?tab=article&error=article');
  const slug = await uniqueSlug(supabase, 'articles', title);
  if (!slug) redirect('/admin?tab=article&error=save');
  const { error } = await supabase.from('articles').insert({ title, slug, excerpt: excerpt || null, content, cover_url: cover || null, category_id: category || null, status: 'published', featured: false, author_id: user.id, published_at: new Date().toISOString() });
  if (error) redirect('/admin?tab=article&error=save');
  revalidatePath('/', 'layout'); redirect('/admin?tab=article&created=article');
}

export async function createEmissionAction(form) {
  const { supabase } = await requireAdmin();
  const title = val(form, 'title'); const description = val(form, 'description'); const cover = val(form, 'cover_url'); const schedule = val(form, 'schedule');
  if (!title || !validUrl(cover)) redirect('/admin?tab=emission&error=emission');
  const slug = await uniqueSlug(supabase, 'emissions', title);
  if (!slug) redirect('/admin?tab=emission&error=save');
  const { data: last, error: positionError } = await supabase.from('emissions').select('position').order('position', { ascending: false }).limit(1).maybeSingle();
  if (positionError) redirect('/admin?tab=emission&error=save');
  const { error } = await supabase.from('emissions').insert({ title, slug, description: description || null, cover_url: cover || null, schedule: schedule || null, is_active: true, position: (last?.position ?? 0) + 1 });
  if (error) redirect('/admin?tab=emission&error=save');
  revalidatePath('/', 'layout'); redirect('/admin?tab=emission&created=emission');
}

export async function uploadArticleBannerAction(form) {
  const { supabase } = await requireAdmin();
  const file = form.get('banner');
  if (!(file instanceof File) || file.size === 0) redirect('/admin/images?error=missing');
  const allowed = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const extension = allowed[file.type];
  if (!extension || file.size > 8 * 1024 * 1024) redirect('/admin/images?error=invalid');
  const path = `banners/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('articles').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) redirect('/admin/images?error=upload');
  const { data } = supabase.storage.from('articles').getPublicUrl(path);
  revalidatePath('/', 'layout');
  redirect(`/admin/images?uploaded=1&url=${encodeURIComponent(data.publicUrl)}`);
}
