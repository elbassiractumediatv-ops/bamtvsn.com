import Link from 'next/link';
import AdvertisementPlaylist from '@/components/AdvertisementPlaylist';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Publicité | BAM TV SN',
  description: 'Découvrez les annonces et offres publicitaires diffusées automatiquement sur BAM TV SN.',
};

export default async function PublicitePage() {
  const supabase = await createServerSupabaseClient();
  const { data: advertisements } = await supabase
    .from('advertisements')
    .select('id,title,media_url,media_type,duration_seconds,position')
    .eq('is_active', true)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  return (
    <main className="publicite-page">
      <section className="publicite-intro">
        <p className="eyebrow">BAM TV SN · ESPACE ANNONCEURS</p>
        <h1>Publicités et annonces partenaires</h1>
        <p>Retrouvez ici les offres et annonces présentées par nos partenaires. Pour proposer votre propre publicité, contactez notre équipe ou préparez une annonce depuis l’administration.</p>
      </section>

      <AdvertisementPlaylist ads={advertisements || []} />

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
          <Link className="secondary" href="/admin/publicites">Gérer la playlist publicitaire</Link>
        </div>
        <div className="publicite-note">La création, l’ajout et la gestion des publicités diffusées automatiquement sont réservés aux membres autorisés de l’équipe BAM TV SN.</div>
      </section>
    </main>
  );
}
