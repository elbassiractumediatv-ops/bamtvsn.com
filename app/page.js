import Link from 'next/link';
import { getArticles, getFeaturedArticle, getVideos, getEmissions } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const [featured, articles, videos, emissions] = await Promise.all([
    getFeaturedArticle().catch(() => null), getArticles(6).catch(() => []), getVideos(8).catch(() => []), getEmissions(6).catch(() => []),
  ]);
  const supporting = articles.filter((item) => item.id !== featured?.id).slice(0, 4);
  return <>
    <section className="hero"><div className="wrap"><div className="hero-grid">
      {featured ? <article className="hero-feature"><img src={featured.cover_url || '/placeholder-news.svg'} alt="" /><div className="hero-copy"><span className="tag">À la une</span><h1>{featured.title}</h1><p>{featured.excerpt}</p><p className="meta">{featured.category?.name || 'Actualité'} · {featured.published_at ? new Date(featured.published_at).toLocaleDateString('fr-FR') : ''}</p><p style={{marginTop:18}}><Link className="button" href={`/actualites/${featured.slug}`}>Lire l’article</Link></p></div></article> : <article className="hero-feature"><img src="/placeholder-news.svg" alt="" /><div className="hero-copy"><span className="tag">BAM TV SN</span><h1>L’information au cœur de nos communautés</h1><p>Retrouvez les actualités, reportages et émissions de votre média.</p><p style={{marginTop:18}}><Link className="button" href="/actualites">Découvrir les actualités</Link></p></div></article>}
      <div className="hero-side">{supporting.length ? supporting.map((article) => <article className="side-card" key={article.id}><Link href={`/actualites/${article.slug}`}><img src={article.cover_url || '/placeholder-news.svg'} alt="" /></Link><div><div className="card-category">{article.category?.name || 'Actualité'}</div><h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3></div></article>) : <div className="empty-state"><h2>Les nouvelles de BAM TV SN</h2><p>Les actualités publiées apparaîtront ici.</p></div>}</div>
    </div></div></section>
    <section className="section soft"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Le fil de l’actualité</p><h2>Dernières actualités</h2></div><Link href="/actualites" className="text-link">Toute l’actualité →</Link></div>{articles.length ? <div className="cards">{articles.slice(0,6).map((article)=><ArticleCard key={article.id} article={article}/>)}</div> : <EmptyState title="Les actualités arrivent bientôt">Retrouvez ici les articles publiés par la rédaction BAM TV SN.</EmptyState>}</div></section>
    <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Reportages et magazines</p><h2>Les dernières vidéos</h2></div><Link href="/videos" className="text-link">Toutes les vidéos →</Link></div>{videos.length ? <div className="video-grid">{videos.slice(0,8).map((video)=><VideoCard key={video.id} video={video}/>)}</div> : <EmptyState title="Les vidéos arrivent bientôt">Les vidéos publiées seront visibles dans cette rubrique.</EmptyState>}</div></section>
    <section className="section soft"><div className="wrap"><div className="section-head"><div><p className="eyebrow">À découvrir</p><h2>Nos émissions</h2></div><Link href="/emissions" className="text-link">Toutes les émissions →</Link></div>{emissions.length ? <div className="emission-grid">{emissions.map((e)=><article className="emission-card" key={e.id}><img src={e.cover_url || '/placeholder-news.svg'} alt=""/><div><h3>{e.title}</h3><p>{e.description}</p></div></article>)}</div> : <EmptyState title="Les émissions arrivent bientôt">La grille des émissions BAM TV SN sera publiée ici.</EmptyState>}</div></section>
  </>;
}
