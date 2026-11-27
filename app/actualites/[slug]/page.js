import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/content';
import ArticleCover from '@/components/ArticleCover';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);
  if (!article) notFound();

  return (
    <article className="article-layout">
      <div className="card-category">{article.category?.name || 'Actualité'}</div>
      <h1>{article.title}</h1>
      <p className="meta">BAM TV SN · {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR') : ''}</p>
      {article.excerpt && <p style={{ fontSize: 19, lineHeight: 1.6, color: '#687386' }}>{article.excerpt}</p>}
      <ArticleCover article={article} className="article-cover" loading="eager" />
      <div className="article-body">{article.content}</div>
    </article>
  );
}
