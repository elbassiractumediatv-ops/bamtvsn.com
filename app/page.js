import Link from 'next/link';
import { getArticles, getVideos, getEmissions, videoThumbnail } from '@/lib/content';
import { articleBanner } from '@/lib/article-banner';
import ArticleCard from '@/components/ArticleCard';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

const youtubeChannel = 'https://www.youtube.com/@BAMTVSN';

function formatDate(value) {
  if (!value) return 'BAM TV SN';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(value));
}

export default async function HomePage() {
  const [articles, videos, emissions] = await Promise.all([
    getArticles(9).catch(() => []),
    getVideos(5).catch(() => []),
    getEmissions(3).catch(() => []),
  ]);

  const lead = articles[0] ?? null;
  const latest = articles.slice(1, 7);

  return (
    <div className="home-redesign">
      <div className="home-ticker">
        <span className="home-ticker-label">À LA UNE</span>
        <p>{lead?.title || 'BAM TV SN — L’information, le direct et les images.'}</p>
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

      {lead ? (
        <section className="home-lead wrap" aria-label="À la une">
          <Link href={`/actualites/${lead.slug}`} className="home-lead-image">
            <img src={lead.cover_url || articleBanner(lead)} alt={lead.title} />
            <span className="home-lead-tag">{lead.category?.name || 'À la une'}</span>
          </Link>
          <div className="home-lead-copy">
            <p className="eyebrow">Le choix de la rédaction</p>
            <h2><Link href={`/actualites/${lead.slug}`}>{lead.title}</Link></h2>
            {lead.excerpt && <p>{lead.excerpt}</p>}
            <span className="meta">{formatDate(lead.published_at)}</span>
            <Link className="home-read-link" href={`/actualites/${lead.slug}`}>Lire l’article <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      ) : (
        <section className="wrap home-empty"><EmptyState title="Les actualités arrivent bientôt">Les prochains articles publiés par la rédaction apparaîtront ici.</EmptyState></section>
      )}

      <section className="section soft">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">Le fil de l’information</p><h2>Dernières actualités</h2></div><Link className="text-link" href="/actualites">Toute l’actualité →</Link></div>
          {latest.length ? <div className="cards">{latest.map(article => <ArticleCard key={article.id} article={article} />)}</div> : <EmptyState title="Aucun autre article pour le moment">Consultez régulièrement cette rubrique pour suivre les nouvelles publications.</EmptyState>}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">Reportages et magazines</p><h2>En images</h2></div><Link className="text-link" href="/videos">Toutes les vidéos →</Link></div>
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
