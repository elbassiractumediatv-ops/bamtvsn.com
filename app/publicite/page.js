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
    .select('id,title,media_url,media_type,duration_seconds,position,whatsapp_phone')
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
