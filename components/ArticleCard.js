import Link from 'next/link';
export default function ArticleCard({ article }) {
  return <article className="card"><Link href={`/actualites/${article.slug}`}><img className="card-image" src={article.cover_url || '/placeholder-news.svg'} alt="" /></Link><div className="card-category">{article.category?.name || 'Actualité'}</div><h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>{article.excerpt && <p>{article.excerpt}</p>}<div className="meta">{article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR') : 'BAM TV SN'}</div></article>;
}
