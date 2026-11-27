import Link from 'next/link';
import ArticleCover from '@/components/ArticleCover';

export default function ArticleCard({ article }) {
  return (
    <article className="card editorial-card">
      <Link href={`/actualites/${article.slug}`} className="editorial-card-image">
        <ArticleCover article={article} className="card-image" />
      </Link>
      <h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>
    </article>
  );
}
