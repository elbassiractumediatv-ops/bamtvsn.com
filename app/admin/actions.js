'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUser, requireAdmin } from '@/lib/admin';

function val(form, name) { return String(form.get(name) || '').trim(); }
function slugify(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 75) || 'contenu'; }
function validUuid(value) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function validUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}
function within(value, max) { return value.length <= max; }

async function uniqueSlug(supabase, table, title) {
  const base = slugify(title);
  let slug = base;
  let n = 2;
  while (true) {
    const { data, error } = await supabase.from(table).select('id').eq('slug', slug).maybeSingle();
    if (error) throw new Error('Impossible de vérifier le slug.');
    if (!data) return slug;
    slug = `${base}-${n++}`;
    if (n > 1000) throw new Error('Impossible de générer un slug unique.');
  }
}

async function validImageSignature(file, mime) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (mime === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === 'image/png') return bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v);
  if (mime === 'image/webp') return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
  return false;
}

export async function loginAction(form) {
  const email = val(form, 'email');
  const password = String(form.get('password') ?? '');
  if (!email || !password || !within(email, 254) || !within(password, 1024) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect('/admin?error=missing');
  const { supabase } = await getAdminUser();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/admin?error=login');
  const { data: { user } } = await supabase.auth.getUser();
  const { data: admin } = user ? await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle() : { data: null };
  if (!admin) { await supabase.auth.signOut(); redirect('/admin?error=forbidden'); }
  redirect('/admin');
}

export async function logoutAction() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/admin');
}

export async function createVideoAction(form) {
  const { supabase } = await requireAdmin();
  const title = val(form, 'title');
  const youtubeId = val(form, 'youtube_id');
  const description = val(form, 'description');
  const status = val(form, 'status') === 'published' ? 'published' : 'draft';
  const thumbnail = val(form, 'thumbnail_url');
  const categoryId = val(form, 'category_id');
  const emissionId = val(form, 'emission_id');
  if (title.length < 3 || !within(title, 200) || !within(description, 5000) || !validUuid(categoryId) ||
      (emissionId && !validUuid(emissionId)) || !/^[A-Za-z0-9_-]{11}$/.test(youtubeId) ||
      !validUrl(thumbnail)) redirect('/admin?tab=video&error=video');
  const { data: videoCategory } = await supabase.from('categories').select('id').eq('id', categoryId).eq('type', 'video').maybeSingle();
  if (!videoCategory) redirect('/admin?tab=video&error=video');
  let slug;
  try { slug = await uniqueSlug(supabase, 'videos', title); }
  catch { redirect('/admin?tab=video&error=save'); }
  const { error } = await supabase.from('videos').insert({
    title, slug, youtube_id: youtubeId, description: description || null,
    thumbnail_url: thumbnail || null, category_id: categoryId,
    emission_id: emissionId || null, status, featured: false,
    published_at: status === 'published' ? new Date().toISOString() : null
  });
  if (error) redirect('/admin?tab=video&error=save');
  revalidatePath('/', 'layout');
  redirect('/admin?tab=video&created=' + status);
}

export async function createArticleAction(form) {
  const { supabase, user } = await requireAdmin();
  const title = val(form, 'title');
  const excerpt = val(form, 'excerpt');
  const content = val(form, 'content');
  const cover = val(form, 'cover_url');
  const category = val(form, 'category_id');
  const status = val(form, 'status') === 'published' ? 'published' : 'draft';
  if (title.length < 3 || !within(title, 200) || !within(excerpt, 400) || !content ||
      !within(content, 100000) || !validUuid(category) || !validUrl(cover)) {
    redirect('/admin?tab=article&error=article');
  }
  const { data: articleCategory } = await supabase.from('categories').select('id').eq('id', category).eq('type', 'article').maybeSingle();
  if (!articleCategory) redirect('/admin?tab=article&error=article');
  let slug;
  try { slug = await uniqueSlug(supabase, 'articles', title);
  catch { redirect('/admin?tab=article&error=save'); }
  const { error } = await supabase.from('articles').insert({
    title, slug, excerpt: excerpt || null, content, cover_url: cover || null,
    category_id: category, status, featured: false,
    author_id: user.id, published_at: status === 'published' ? new Date().toISOString() : null
  });
  if (error) redirect('/admin?tab=article&error=save');
  revalidatePath('/', 'layout');
  redirect('/admin?tab=article&created=' + status);
}

export async function createEmissionAction(form) {
  const { supabase } = await requireAdmin();
  const title = val(form, 'title');
  const description = val(form, 'description');
  const cover = val(form, 'cover_url');
  const schedule = val(form, 'schedule');
  if (title.length < 2 || !within(title, 120) || !within(description, 3000) ||
      !within(schedule, 120) || !validUrl(cover)) redirect('/admin?tab=emission&error=emission');
  let slug;
  try { slug = await uniqueSlug(supabase, 'emissions', title); }
  catch { redirect('/admin?tab=emission&error=save'); }
  const { data: last } = await supabase.from('emissions').select('position').order('position', { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from('emissions').insert({
    title, slug, description: description || null, cover_url: cover || null,
    schedule: schedule || null, is_active: true, position: (last?.position ?? 0) + 1
  });
  if (error) redirect('/admin?tab=emission&error=save');
  revalidatePath('/', 'layout');
  redirect('/admin?tab=emission&created=emission');
}

export async function uploadArticleBannerAction(form) {
  const { supabase } = await requireAdmin();
  const file = form.get('banner');
  if (!(file instanceof File) || file.size === 0) redirect('/admin/images?error=missing');
  const allowed = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const extension = allowed[file.type];
  if (!extension || file.size > 8 * 1024 * 1024 || !(await validImageSignature(file, file.type))) {
    redirect('/admin/images?error=invalid');
  }
  const path = `banners/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('articles').upload(path, file, {
    contentType: file.type, cacheControl: '31536000', upsert: false
  });
  if (error) redirect('/admin/images?error=upload');
  const { data } = supabase.storage.from('articles').getPublicUrl(path);
  revalidatePath('/', 'layout');
  redirect(`/admin/images?uploaded=1&url=${encodeURIComponent(data.publicUrl)}`);
}

export async function publishDraftAction(form) {
  const { supabase } = await requireAdmin();
  const table = val(form, 'type') === 'video' ? 'videos' : 'articles';
  const id = val(form, 'id');
  if (!validUuid(id)) redirect('/admin?error=invalid');
  const { data, error } = await supabase.from(table).update({
    status: 'published',
    published_at: new Date().toISOString()
  }).eq('id', id).eq('status', 'draft').select('id').maybeSingle();
  if (error || !data) redirect('/admin?error=save');
  revalidatePath('/', 'layout');
  redirect('/admin?tab=review&published=1');
}
