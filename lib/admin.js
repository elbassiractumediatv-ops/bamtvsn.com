import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getAdminUser(supabase) {
  supabase ??= await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { supabase, user: null };
  }

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

export async function requireAdmin() {
  const result = await getAdminUser();

  if (!result.user) {
    throw new Error('Accès administrateur requis.');
  }

  return result;
}
