import { NextResponse } from 'next/server';

export default function robots() {
  return new NextResponse(
    'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://bamtvsn.com/sitemap.xml\nHost: https://bamtvsn.com\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
  );
}
