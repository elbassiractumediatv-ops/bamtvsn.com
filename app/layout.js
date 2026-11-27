import './globals.css';
import SiteChrome from '@/components/SiteChrome';
export const metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bamtvsn.com'),
 title: { default: 'BAM TV SN — L’information au cœur de nos communautés', template: '%s | BAM TV SN' },
 description: 'Toute l’actualité, les vidéos et les émissions de BAM TV SN.',
};
export default function RootLayout({children}) {
 return <html lang="fr"><body><SiteChrome>{children}</SiteChrome></body></html>;
}