import { getArticles, getVideos } from '@/lib/content';

export const dynamic = 'force-dynamic';

const SITE = 'https://bamtvsn.com';

export default async function sitemap() {
  const fixed = [
    { url: SITE, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE}/actualites`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE}/videos`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE}/direct`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE}/emissions`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE}/publicite`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const [articles, videos] = await Promise.all([
    getArticles(1000).catch(() => []),
    getVideos(1000).catch(() => []),
  ]);

  const articleUrls = articles.filter(item => item.slug).map(item => ({
    url: `${SITE}/actualites/${encodeURIComponent(item.slug)}`,
    lastModified: item.published_at ? new Date(item.published_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const videoUrls = videos.filter(item => item.slug).map(item => ({
    url: `${SITE}/videos/${encodeURIComponent(item.slug)}`,
    lastModified: item.published_at ? new Date(item.published_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...fixed, ...articleUrls, ...videoUrls];
}
