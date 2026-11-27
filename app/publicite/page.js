import Link from 'next/link';
import { getVideos } from '@/lib/content';

export const metadata = {
  title: 'Publicité | BAM TV SN',
  description: 'Découvrez les annonces et offres publicitaires diffusées sur BAM TV SN.',
};

export default async function PublicitePage() {
  const videos = await getVideos(12).catch(() => []);
  const playlistIds = videos
    .map((video) => video.youtube_id)
    .filter((id) => /^[A-Za-z0-9_-]{11}$/.test(id || ''));
  const firstVideoId = playlistIds[0];
  const playlist = playlistIds.join(',');
  const playlistUrl = firstVideoId
    ? `https://www.youtube-nocookie.com/embed/${firstVideoId}?playlist=${encodeURIComponent(playlist)}&autoplay=1&mute=1&loop=1&playsinline=1&rel=0&modestbranding=1`
    : null;

  return (
    <main className="publicite-page">
      <section className="publicite-intro">
        <p className="eyebrow">BAM TV SN · ESPACE ANNONCEURS</p>
        <h1>Publicités et annonces partenaires</h1>
        <p>Retrouvez ici les offres et annonces présentées par nos partenaires. Pour proposer votre propre publicité, contactez notre équipe ou préparez une annonce depuis l’administration.</p>
      </section>

      {playlistUrl && (
        <section className="publicite-video-section" aria-labelledby="publicite-video-title">
          <div className="publicite-video-heading">
            <div>
              <p className="eyebrow">BAM TV SN · VIDÉOS</p>
              <h2 id="publicite-video-title">Nos vidéos défilent automatiquement</h2>
              <p>Le lecteur enchaîne les vidéos publiées sur la chaîne. Le son démarre coupé pour permettre la lecture automatique ; vous pouvez l’activer directement dans le lecteur.</p>
            </div>
            <Link href="/videos">Toutes les vidéos →</Link>
          </div>
          <div className="publicite-video-player">
            <iframe
              src={playlistUrl}
              title="Playlist vidéo BAM TV SN"
              loading="eager"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="publicite-video-caption">{videos.length} vidéo(s) publiée(s) disponibles dans la sélection automatique.</p>
        </section>
      )}

      <section className="publicite-list" aria-labelledby="iptv-ad-title">
        <article className="publicite-ad-card">
          <div className="publicite-ad-visual">
            <img
              src="/ads/iptv-smarter-pro.svg"
              alt="Publicité IPTV Smarters Pro : abonnements 3 mois à 7 000 F, 6 mois à 13 000 F et 1 an à 25 000 F. Contact WhatsApp 78 537 64 61."
              width="720"
              height="1080"
              loading="eager"
            />
          </div>
          <div className="publicite-ad-details">
            <span className="publicite-ad-tag">Offre partenaire</span>
            <h2 id="iptv-ad-title">IPTV Smarters Pro</h2>
            <p>Offres d’abonnement indiquées sur le visuel. Pour toute question ou souscription, contactez directement l’annonceur.</p>
            <a
              className="publicite-whatsapp"
              href="https://wa.me/221785376461?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20la%20page%20Publicit%C3%A9%20de%20BAM%20TV%20SN%20au%20sujet%20de%20votre%20offre%20IPTV."
              target="_blank"
              rel="noopener noreferrer"
            >
              Contacter sur WhatsApp · 78 537 64 61
            </a>
          </div>
        </article>
      </section>

      <section className="publicite-card">
        <p className="eyebrow" style={{color:'#c9ead7'}}>BAM TV SN · ESPACE ANNONCEURS</p>
        <h2>Vous souhaitez faire connaître votre activité ?</h2>
        <p>Présentez votre entreprise, votre événement, votre cérémonie, votre produit ou votre service à notre audience.</p>
        <div className="publicite-actions">
          <Link href="/contact">Demander un espace publicitaire</Link>
          <Link className="secondary" href="/admin?tab=article">Créer une annonce dans une publication</Link>
        </div>
        <div className="publicite-note">La création et la publication d’une annonce depuis l’administration restent réservées aux membres autorisés de l’équipe BAM TV SN. Ajoutez le visuel et les informations de l’annonce, puis vérifiez le contenu avant publication.</div>
      </section>
    </main>
  );
}
