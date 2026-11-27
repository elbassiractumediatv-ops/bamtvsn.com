import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { uploadArticleBannerAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminImagesPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const uploadedUrl = typeof params.url === 'string' && params.url.startsWith('https://')
    ? params.url
    : null;

  return (
    <section className="admin-shell">
      <div className="admin-panel">
        <div className="admin-top">
          <div>
            <p className="eyebrow">BAM TV SN · Médiathèque</p>
            <h1>Images et bannières</h1>
            <p>Envoyez les visuels des articles dans le stockage sécurisé de BAM TV SN.</p>
          </div>
          <Link className="plain-button" href="/admin">Retour au tableau de bord</Link>
        </div>

        {params.uploaded === '1' && uploadedUrl && (
          <div className="notice success">
            Bannière envoyée avec succès.
            <p><a href={uploadedUrl} target="_blank" rel="noreferrer">Ouvrir la bannière</a></p>
            <label>URL publique
              <input readOnly value={uploadedUrl} />
            </label>
          </div>
        )}
        {params.error === 'missing' && <div className="notice">Choisissez une image avant l’envoi.</div>}
        {params.error === 'invalid' && <div className="notice">Format non accepté ou fichier trop volumineux. Utilisez JPG, PNG ou WEBP (8 Mo maximum).</div>}
        {params.error === 'upload' && <div className="notice">L’envoi a échoué. Vérifiez les autorisations Supabase Storage puis réessayez.</div>}

        <form action={uploadArticleBannerAction} className="admin-form">
          <label>Fichier de la bannière
            <input name="banner" type="file" accept="image/jpeg,image/png,image/webp" required />
          </label>
          <p className="meta">Formats acceptés : JPG, PNG, WEBP. Taille maximale : 8 Mo. Les fichiers sont stockés dans le bucket public « articles », dossier « banners ».</p>
          <button className="button" type="submit">Envoyer la bannière</button>
        </form>
        <div style={{ marginTop: 24 }}>
          <h2>Utilisation</h2>
          <p className="meta">Après l’envoi, copiez l’URL publique et collez-la dans le champ « URL de l’image » de l’article. L’association automatique à l’article et la génération graphique des bannières seront ajoutées dans une étape distincte.</p>
        </div>
      </div>
    </section>
  );
}
