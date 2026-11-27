import Link from 'next/link';

export const metadata = {
  title: 'En direct',
  description: 'Retrouvez le direct et les contenus vidéo de BAM TV SN.',
};

export default function DirectPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div><p className="eyebrow">BAM TV SN</p><h1>En direct</h1></div>
        </div>
        <div className="direct-page-panel">
          <div className="direct-screen"><span className="direct-screen-mark">BAM TV <b>SN</b></span><span className="direct-screen-play">▶</span><p>ESPACE DIRECT</p></div>
          <div className="direct-page-copy">
            <p className="eyebrow">Notre antenne</p>
            <h2>Suivez BAM TV SN sur YouTube</h2>
            <p>Lorsqu’une diffusion est programmée, retrouvez ici les informations du direct. En attendant, accédez à notre chaîne pour revoir les reportages, interviews et émissions.</p>
            <a className="button" href="https://www.youtube.com/@BAMTVSN" target="_blank" rel="noopener noreferrer">Ouvrir la chaîne YouTube ↗</a>
            <p className="direct-status-note">Aucune diffusion en direct n’est confirmée sur cette page pour le moment.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
