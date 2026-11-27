import HomeLiveAndAds from '@/components/HomeLiveAndAds';

export const metadata = {
  title: 'En direct',
  description: 'Regardez le direct vidéo de BAM TV SN et retrouvez notre chaîne YouTube officielle.',
};

const CHANNEL_ID = 'UC7VnuAmqfg2ZFXcP4VozLyw';
const CHANNEL_URL = 'https://www.youtube.com/channel/' + CHANNEL_ID;

export default function DirectPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div><p className="eyebrow">BAM TV SN</p><h1>En direct</h1></div>
        </div>
        <div className="direct-page-panel">
          <div className="direct-page-player">
            <HomeLiveAndAds ads={[]} showAds={false} showChannelLink={false} />
          </div>
          <div className="direct-page-copy">
            <p className="eyebrow">Notre antenne</p>
            <h2>Suivez BAM TV SN sur YouTube</h2>
            <p>Retrouvez ici le lecteur vidéo de BAM TV SN. Lorsqu’une diffusion est en cours, elle s’affiche dans ce lecteur. Vous pouvez également ouvrir notre chaîne officielle pour revoir nos reportages, interviews et émissions.</p>
            <a className="button" href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">Ouvrir la chaîne YouTube ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
