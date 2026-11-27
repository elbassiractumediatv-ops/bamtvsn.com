import Link from 'next/link';
import { getArticles, getVideos, getEmissions } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

const youtubeChannel = 'https://www.youtube.com/@BAMTVSN';

export default async function HomePage() {
  const [articles, videos, emissions] = await Promise.all([
    getArticles(100).catch(() => []),
    getVideos(4).catch(() => []),
    getEmissions(3).catch(() => []),
  ]);

  const lead = articles[0] ?? null;
  const latest = articles.slice(0, 4);

  return (
    <div className="home-redesign">
      <div className="home-ticker">
        <span className="home-ticker-label">EN BREF</span>
        <div className="home-ticker-marquee" aria-label="Actualités à la une">
          <div className="home-ticker-track">
            <span>{lead?.title || 'BAM TV SN — L’information, le direct et les images.'}</span>
            <span aria-hidden="true">{lead?.title || 'BAM TV SN — L’information, le direct et les images.'}</span>
          </div>
        </div>
      </div>

      <section className="home-intro wrap">
        <div>
          <p className="eyebrow">Votre média, votre voix</p>
          <h1>L’information.<br /><span>Le direct. Les images.</span></h1>
          <p className="home-intro-copy">Suivez l’actualité du Sénégal, de l’Afrique et du monde à travers nos articles, reportages et émissions.</p>
          <div className="home-actions">
            <Link className="button" href="/actualites">Lire les actualités</Link>
            <Link className="home-outline-button" href="/direct">Regarder le direct</Link>
          </div>
        </div>
        <a className="home-channel-card" href={youtubeChannel} target="_blank" rel="noopener noreferrer">
          <span className="home-channel-icon">▶</span>
          <span><strong>BAM TV SN sur YouTube</strong><small>Reportages, interviews et émissions</small></span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>


      <section className="section soft">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">Le fil de l’information</p><h2>Les 4 affiches récentes</h2></div><Link className="text-link" href="/actualites">Tout voir →</Link></div>
          {latest.length ? <div className="cards">{latest.map(article => <ArticleCard key={article.id} article={article} />)}</div> : <EmptyState title="Aucun autre article pour le moment">Consultez régulièrement cette rubrique pour suivre les nouvelles publications.</EmptyState>}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">Reportages et magazines</p><h2>Les 4 vidéos récentes</h2></div><Link className="text-link" href="/videos">Tout voir →</Link></div>
          {videos.length ? <div className="video-grid">{videos.map(video => <VideoCard key={video.id} video={video} />)}</div> : <EmptyState title="Les vidéos arrivent bientôt">Les reportages et vidéos publiés seront présentés dans cette rubrique.</EmptyState>}
        </div>
      </section>

      <section className="home-direct-band">
        <div className="wrap home-direct-inner">
          <div><span className="home-live-dot" /> <span className="home-direct-kicker">BAM TV SN</span><h2>Le rendez-vous du direct</h2><p>Retrouvez notre espace direct et accédez à la chaîne YouTube BAM TV SN.</p></div>
          <Link className="home-direct-button" href="/direct">Accéder au direct <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">Vos programmes</p><h2>Nos émissions</h2></div><Link className="text-link" href="/emissions">Toutes les émissions →</Link></div>
          {emissions.length ? <div className="emission-grid">{emissions.map(emission => <article className="emission-card" key={emission.id}><img src={emission.cover_url || '/placeholder-news.svg'} alt="" /><div><h3>{emission.title}</h3><p>{emission.description}</p></div></article>)}</div> : <EmptyState title="Les émissions arrivent bientôt">Les programmes de BAM TV SN seront présentés ici.</EmptyState>}
        </div>
      </section>
    </div>
  );
}
