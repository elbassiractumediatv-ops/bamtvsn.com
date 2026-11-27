import Link from 'next/link';
import ArticleCover from '@/components/ArticleCover';

export default function ArticleCard({ article }) {
  return (
    <article className="card editorial-card">
      <Link href={`/actualites/${article.slug}`} className="editorial-card-image" aria-label={`Lire : ${article.title}`}>
        <ArticleCover article={article} variant="card" loading="lazy" />
      </Link>
      <div className="editorial-card-content">
        <h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>
      </div>
    </article>
  );
}
