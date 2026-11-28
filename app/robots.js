export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://bamtvsn.com/sitemap.xml',
    host: 'https://bamtvsn.com',
  };
}
