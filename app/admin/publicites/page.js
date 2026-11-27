import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { deleteAdvertisementAction, toggleAdvertisementAction } from '../actions';
import AdvertisementUploadForm from '@/components/AdvertisementUploadForm';

export const dynamic = 'force-dynamic';

export default async function AdminAdvertisementsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { data: ads, error } = await supabase
    .from('advertisements')
    .select('id,title,media_url,media_type,mime_type,duration_seconds,position,is_active,created_at,whatsapp_phone')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  return (
    <section className="admin-shell">
      <div className="admin-panel admin-advertisements-panel">
        <div className="admin-top">
          <div>
            <p className="eyebrow">BAM TV SN · ESPACE PUBLICITAIRE</p>
            <h1>Playlist publicitaire</h1>
            <p>Ajoutez les images et vidéos qui seront diffusées automatiquement sur la page Publicité.</p>
          </div>
          <Link className="plain-button" href="/admin">Retour au tableau de bord</Link>
        </div>

        {params.created === '1' && <div className="notice success">Média ajouté à la playlist et publié.</div>}
        {params.updated === '1' && <div className="notice success">État de la publicité mis à jour.</div>}
        {params.deleted === '1' && <div className="notice success">Publicité supprimée de la playlist.</div>}
        {params.error === 'media' && <div className="notice">Fichier refusé. Utilisez une image JPG, PNG, WEBP, GIF ou une vidéo MP4 / WebM de 50 Mo maximum.</div>}
        {params.error === 'upload' && <div className="notice">L’envoi du média a échoué. Vérifiez le stockage publicitaire et réessayez.</div>}
        {params.error === 'save' && <div className="notice">Le média a été envoyé, mais son enregistrement a échoué. Réessayez ou contactez l’administrateur technique.</div>}

        <AdvertisementUploadForm />

        <div className="admin-advertisement-list">
          <h2>Médias programmés ({ads?.length || 0})</h2>
          {error && <div className="notice">Impossible de charger les publicités. Vérifiez les droits de la table Supabase.</div>}
          {!error && (!ads || ads.length === 0) && <p className="meta">Aucune publicité enregistrée pour le moment.</p>}
          {(ads || []).map((ad) => (
            <article className="admin-advertisement-item" key={ad.id}>
              <div className="admin-advertisement-preview">
                {ad.media_type === 'video'
                  ? <video src={ad.media_url} controls muted preload="metadata" />
                  : <img src={ad.media_url} alt={ad.title} />}
              </div>
              <div className="admin-advertisement-info">
                <strong>{ad.title}</strong>
                <span>{ad.media_type === 'video' ? 'Vidéo' : 'Image'} · Position {ad.position + 1}{ad.media_type === 'image' ? ` · ${ad.duration_seconds}s` : ''}</span>
                <span>{ad.whatsapp_phone ? `WhatsApp : ${ad.whatsapp_phone}` : 'Aucun contact WhatsApp associé'}</span>
                <span className={ad.is_active ? 'admin-ad-status active' : 'admin-ad-status paused'}>{ad.is_active ? 'En diffusion' : 'En pause'}</span>
              </div>
              <div className="admin-advertisement-actions">
                <form action={toggleAdvertisementAction}>
                  <input type="hidden" name="id" value={ad.id} />
                  <input type="hidden" name="active" value={ad.is_active ? 'false' : 'true'} />
                  <button className="plain-button" type="submit">{ad.is_active ? 'Mettre en pause' : 'Réactiver'}</button>
                </form>
                <form action={deleteAdvertisementAction}>
                  <input type="hidden" name="id" value={ad.id} />
                  <button className="plain-button danger" type="submit">Supprimer</button>
                </form>
              </div>
            </article>
          ))}
        </div>
        <p className="meta">Seuls les fichiers envoyés par un administrateur dans cet espace peuvent entrer dans la playlist. Les visiteurs n’ont aucun accès à l’envoi de fichiers.</p>
      </div>
    </section>
  );
}
