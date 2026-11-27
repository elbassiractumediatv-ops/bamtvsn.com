'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ), []);
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) setRecovery(true);
    });
    // Supporte également le lien de récupération utilisant le hash token.
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setRecovery(true);
      });
    }
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function submit(event) {
    event.preventDefault();
    if (password.length < 12) { setMessage('Choisissez un mot de passe d’au moins 12 caractères.'); return; }
    if (password !== confirm) { setMessage('Les deux mots de passe ne correspondent pas.'); return; }
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setMessage('Impossible de modifier le mot de passe. Le lien est peut-être expiré. Demandez un nouveau lien.'); setBusy(false); return; }
    await supabase.auth.signOut();
    router.replace('/admin?password=updated');
  }

  return <section className="admin-shell"><div className="admin-panel" style={{maxWidth:480}}>
    <p className="eyebrow">BAM TV SN · Administration</p>
    <h1>Nouveau mot de passe</h1>
    {recovery ? <form className="admin-form" onSubmit={submit}>
      <label>Nouveau mot de passe<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <label>Confirmer le mot de passe<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirm} onChange={e=>setConfirm(e.target.value)} /></label>
      {message ? <p className="notice">{message}</p> : null}
      <button className="button" disabled={busy}>{busy ? 'Modification…' : 'Enregistrer le nouveau mot de passe'}</button>
    </form> : <p>Ouvrez le lien reçu par e-mail. Si le lien a expiré, retournez à la connexion et demandez-en un nouveau.</p>}
    <p style={{marginTop:20}}><a href="/admin">← Retour à l’administration</a></p>
  </div></section>;
}
