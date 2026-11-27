import Link from 'next/link';

export const metadata = { title: 'Publicité | BAM TV SN', description: 'Réservez un espace publicitaire ou préparez une annonce sponsorisée sur BAM TV SN.' };

export default function PublicitePage() {
  return (
    <main className="publicite-page">
      <section className="publicite-card">
        <p className="eyebrow" style={{color:'#c9ead7'}}>BAM TV SN · ESPACE ANNONCEURS</p>
        <h1>Faites connaître votre activité avec BAM TV SN</h1>
        <p>Vous souhaitez promouvoir une entreprise, un événement, une cérémonie, un produit ou un service ? Contactez notre rédaction pour préparer la diffusion de votre annonce sur nos supports.</p>
        <div className="publicite-actions">
          <Link href="/contact">Demander un espace publicitaire</Link>
          <Link className="secondary" href="/admin?tab=article">Créer une annonce dans une publication</Link>
        </div>
        <div className="publicite-note">La création d’une publication publicitaire depuis le bouton rouge est réservée à l’équipe éditoriale connectée à l’administration. Vous pourrez y rédiger l’annonce, ajouter son visuel et l’enregistrer en brouillon ou la publier après vérification.</div>
      </section>
    </main>
  );
}
