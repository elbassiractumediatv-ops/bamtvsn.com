import Link from 'next/link';
import { requestPasswordResetAction } from '@/app/admin/actions';

export const metadata = { title: 'Mot de passe oublié | Administration BAM TV SN' };

export default async function ForgotPasswordPage({searchParams}) {
  const params = await searchParams;
  return <section className="admin-shell"><div className="admin-panel" style={{maxWidth:480}}>
    <p className="eyebrow">BAM TV SN · Administration</p>
    <h1>Mot de passe oublié</h1>
    {params.sent ? <p className="notice success">Si cette adresse correspond à un compte administrateur, un e-mail de réinitialisation vient d’être envoyé. Vérifiez également vos courriers indésirables.</p> : <>
      <p>Saisissez l’adresse e-mail de votre compte administrateur. Vous recevrez un lien sécurisé pour choisir un nouveau mot de passe.</p>
      {params.error ? <p className="notice">Adresse e-mail invalide.</p> : null}
      <form action={requestPasswordResetAction} className="admin-form">
        <label>Adresse e-mail<input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="vous@exemple.com"/></label>
        <button className="button" type="submit">Envoyer le lien de réinitialisation</button>
      </form>
    </>}
    <p style={{marginTop:20}}><Link href="/admin">← Retour à la connexion</Link></p>
  </div></section>;
}
