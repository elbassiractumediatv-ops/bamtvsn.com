import Link from 'next/link';
import { articleBanner } from '@/lib/article-banner';

export default function ArticleCard({ article }) {
  const cover = article.cover_url || articleBanner(article);
  return (
    <article className="card editorial-card">
      <Link href={`/actualites/${article.slug}`} className="editorial-card-image">
        <img className="card-image" src={cover} alt={article.title} loading="lazy" />
      </Link>
      <h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>
    </article>
  );
}
