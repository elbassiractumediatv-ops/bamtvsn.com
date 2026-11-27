import Link from 'next/link';
import { getArticles, getVideos, videoThumbnail } from '@/lib/content';
import { articleBanner } from '@/lib/article-banner';

export const dynamic = 'force-dynamic';

const navItems = [
  ['Actualités','/actualites'],['Politique','/actualites?categorie=politique'],
  ['Économie','/actualites?categorie=economie'],['Sport','/actualites?categorie=sport'],
  ['Culture','/actualites?categorie=culture'],['Monde','/actualites?categorie=international'],
];

function dailyVideoSelection(items) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 5);
  const eligible = items.filter(video => video.published_at && new Date(video.published_at) >= cutoff);
  const day = new Date().toISOString().slice(0, 10);
  const hash = (value) => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
  return [...eligible].sort((a, b) => hash(`${day}-${a.id}`) - hash(`${day}-${b.id}`)).slice(0, 3);
}

function dateLabel(value) {
  if (!value) return 'BAM TV SN';
  return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value));
}

export default async function HomePage() {
  const [articles, videos] = await Promise.all([
    getArticles(12).catch(() => []),
    getVideos(100).catch(() => []),
  ]);
  const latest = articles.slice(0,6);
  const trends = [...articles].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0,3);
  const trendingVideos = dailyVideoSelection(videos);
  return (
    <div className="reference-home">
      <header className="reference-masthead">
        <div className="reference-masthead-glow" aria-hidden="true" />
        <Link href="/" aria-label="BAM TV SN - Accueil" className="reference-logo-link">
          <img src="/bam-tv-sn-logo.svg" alt="Logo BAM TV SN" />
        </Link>
      </header>

      <nav className="reference-nav" aria-label="Rubriques principales">
        <div className="reference-nav-inner">
          <div className="reference-nav-links">
            {navItems.map(([label,href],i)=><Link key={label} href={href} className={i===0?'selected':''}>{label}</Link>)}
            <Link href="/videos">Vidéos</Link>
            <Link href="/direct" className="reference-live">En direct</Link>
          </div>
          <div className="reference-nav-tools">
            <form action="/recherche" method="get" className="reference-search"><span aria-hidden="true">⌕</span><input name="q" placeholder="Rechercher..." aria-label="Rechercher" /></form>
            <Link className="reference-login" href="/admin">Se connecter</Link>
          </div>
        </div>
      </nav>

      <main className="reference-main">
        <div className="reference-content-grid">
          <section className="reference-news">
            <div className="reference-section-title"><h1>À LA UNE</h1><span /></div>
            {latest.length ? <div className="reference-article-grid">
              {latest.map((article,i)=><article className="reference-article" key={article.id}>
                <Link href={`/actualites/${article.slug}`} className="reference-article-image">
                  <img src={article.cover_url || articleBanner(article)} alt={article.title} loading={i>2?'lazy':'eager'} />
                </Link>
                <div className="reference-article-body">
                  <span className="reference-category">{article.category?.name || 'ACTUALITÉS'}</span>
                  <h2><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h2>
                  <small>{dateLabel(article.published_at)}</small>
                </div>
              </article>)}
            </div> : <p className="reference-empty">Les dernières actualités seront affichées ici.</p>}
          </section>

          <aside className="reference-sidebar">
            <Link href="/publicite" className="reference-ad">
              <strong>VOTRE PUBLICITÉ ICI</strong>
              <span>Espace publicitaire</span>
              <b>Réserver maintenant</b>
            </Link>
            <section className="reference-trends">
              <h2>TENDANCES</h2>
              {trendingVideos.length ? trendingVideos.map((video,i)=><Link href={`/videos/${video.slug}`} className="reference-trend reference-trend-video" key={video.id}>
                <span>{String(i+1).padStart(2,'0')}</span><div><strong>{video.title}</strong><small>{dateLabel(video.published_at)} · Vidéo</small></div>
              </Link>) : <p>Aucune vidéo publiée au cours des cinq derniers mois.</p>}
              <h3 className="reference-trends-articles-title">ARTICLES POPULAIRES</h3>
              {trends.map((article,i)=><Link href={`/actualites/${article.slug}`} className="reference-trend" key={article.id}>
                <span>{String(i+1).padStart(2,'0')}</span><div><strong>{article.title}</strong><small>{dateLabel(article.published_at)}</small></div>
              </Link>)}
            </section>
          </aside>
        </div>

        <section className="reference-videos">
          <div className="reference-video-heading"><h2>DERNIÈRES VIDÉOS YOUTUBE</h2><Link href="/direct"><span>▶</span> EN DIRECT</Link></div>
          {videos.length ? <div className="reference-video-row">
            {videos.slice(0,4).map(video=><article className="reference-video-card" key={video.id}>
              <Link href={`/videos/${video.slug}`} className="reference-video-thumb">
                <img src={videoThumbnail(video) || '/placeholder-video.svg'} alt={video.title} loading="lazy" />
                <span>▶</span>
              </Link>
              <h3><Link href={`/videos/${video.slug}`}>{video.title}</Link></h3>
            </article>)}
          </div> : <p className="reference-empty">Les dernières vidéos seront affichées ici.</p>}
          <div className="reference-video-footer"><span>‹　 <b>1</b>　2　3　4　›</span><Link href="/videos">Voir tout →</Link></div>
        </section>
      </main>
    </div>
  );
}
