'use server';

import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/admin';

const factorName = 'BAM TV SN';
const enrollmentError = 'Impossible de configurer la double authentification. Réessayez.';
const verificationError = 'Code refusé. Saisissez le code à six chiffres actuellement affiché dans l’application.';

export async function enrollAdminTotp() {
  const { supabase, user } = await getAdminUser();
  if (!user) redirect('/admin');

  const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
  if (listError || !factors) return { error: enrollmentError };
  if (factors.all.some(factor => factor.status === 'verified')) redirect('/admin');

  for (const factor of factors.all) {
    if (factor.factor_type === 'totp' && factor.status === 'unverified' && factor.friendly_name === factorName) {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
      if (error) return { error: enrollmentError };
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: factorName,
    issuer: factorName,
  });
  if (error || !data?.totp?.qr_code) return { error: enrollmentError };

  return { factorId: data.id, qrCode: data.totp.qr_code };
}

export async function verifyAdminTotp(_state, form) {
  const { supabase, user } = await getAdminUser();
  if (!user) redirect('/admin');

  const code = String(form.get('code') ?? '').trim();
  const factorId = String(form.get('factorId') ?? '');
  if (!/^\d{6}$/.test(code)) return { error: verificationError };

  const { data, error: listError } = await supabase.auth.mfa.listFactors();
  if (listError || !data) return { error: verificationError };

  const hasVerifiedFactor = data.all.some(factor => factor.status === 'verified');
  const factor = data.all.find(item => item.id === factorId && item.factor_type === 'totp');
  if (!factor || (hasVerifiedFactor && factor.status !== 'verified')) {
    return { error: verificationError };
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return { error: verificationError };
  redirect('/admin');
}
