import Link from 'next/link';
import { getArticles, getFeaturedArticle, getVideos, getEmissions } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
const socials = [
  { label: 'YouTube', href: 'https://www.youtube.com/@BAMTVSN' },
  { label: 'Facebook', href: 'https://www.facebook.com/bamtvsn' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bamtvsn' },
];
export default async function HomePage() {
  const [featured, articles, videos, emissions] = await Promise.all([
    getFeaturedArticle().catch(() => null), getArticles(8).catch(() => []), getVideos(8).catch(() => []), getEmissions(6).catch(() => []),
  ]);
  const leadVideo = videos[0];
  const supporting = articles.filter((item) => item.id !== featured?.id).slice(0, 4);
  const ticker = articles[0];
  return <div className="bam-home">
    <div className="bam-ticker"><span>En bref</span><div>{ticker?.title || 'BAM TV SN : l’essentiel de l’actualité au Sénégal et dans le monde'}</div></div>
    <section className="bam-welcome"><div className="bam-welcome-inner">
      <img className="bam-welcome-logo" src="/bam-tv-sn-logo.svg" alt="BAM TV SN"/>
      <span className="bam-follow-label">Vous suivez</span>
      <h1>BAM TV SN</h1>
      <div className="bam-social-row"><span>sur</span>{socials.map(s=><a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}</div>
      <Link className="bam-live" href="/direct"><i/> En direct</Link>
      <p className="bam-motto">INFORMER <span>ÉDUQUER</span><br/>DIVERTIR <span>RASSEMBLER</span></p>
    </div></section>
    {leadVideo ? <section className="bam-feature-video"><div className="bam-video-frame"><VideoCard video={leadVideo}/><span className="bam-most-viewed">La plus vue du moment</span></div><div className="bam-video-strip">{videos.slice(1,5).map(v=><Link key={v.id} href={`/videos/${v.slug}`}><img src={v.thumbnail_url || `https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title}/></Link>)}</div></section> : <section className="bam-feature-video"><div className="bam-empty-video">Les dernières vidéos BAM TV SN apparaîtront ici.</div></section>}
    <section className="bam-section"><div className="bam-section-head"><div><small>LE FIL DE L’ACTUALITÉ</small><h2>Dernières actualités</h2></div><Link href="/actualites">Toute l’actualité →</Link></div>{articles.length?<div className="cards">{articles.slice(0,6).map(a=><ArticleCard key={a.id} article={a}/>)}</div>:<EmptyState title="Les actualités arrivent bientôt">Retrouvez ici les articles publiés par BAM TV SN.</EmptyState>}</section>
    <section className="bam-section"><div className="bam-section-head"><div><small>REPORTAGES ET MAGAZINES</small><h2>Les dernières vidéos</h2></div><Link href="/videos">Toutes les vidéos →</Link></div>{videos.length?<div className="video-grid">{videos.map(v=><VideoCard key={v.id} video={v}/>)}</div>:<EmptyState title="Les vidéos arrivent bientôt">Les vidéos publiées seront visibles ici.</EmptyState>}</section>
    <section className="bam-section"><div className="bam-section-head"><div><small>À DÉCOUVRIR</small><h2>Nos émissions</h2></div><Link href="/emissions">Toutes les émissions →</Link></div>{emissions.length?<div className="emission-grid">{emissions.map(e=><article className="emission-card" key={e.id}><img src={e.cover_url||'/placeholder-news.svg'} alt=""/><div><h3>{e.title}</h3><p>{e.description}</p></div></article>)}</div>:<EmptyState title="Les émissions arrivent bientôt">La grille des émissions sera publiée ici.</EmptyState>}</section>
  </div>;
}