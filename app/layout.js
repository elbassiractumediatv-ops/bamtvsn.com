import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bamtvsn.com'),
  title: { default: 'BAM TV SN — L’information au cœur de nos communautés', template: '%s | BAM TV SN' },
  description: 'Toute l’actualité, les vidéos et les émissions de BAM TV SN.',
};

const nav = [['Accueil', '/'], ['Actualités', '/actualites'], ['Vidéos', '/videos'], ['Émissions', '/emissions'], ['Contact', '/contact']];

export default function RootLayout({ children }) {
  return <html lang="fr"><body>
    <div className="topline"><div className="wrap topinner"><span>Votre média, votre voix</span><span>L’information au cœur de nos communautés</span></div></div>
    <header className="site-header"><div className="wrap headerinner">
      <Link href="/" className="brand"><img src="/logo-bamtv.svg" alt="BAM TV SN" /></Link>
      <nav aria-label="Navigation principale">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div style={{display:'flex',alignItems:'center',gap:12}}><Link href="/recherche" aria-label="Recherche" style={{fontSize:19}}>⌕</Link><Link className="live-pill" href="/direct"><i /> En direct</Link></div>
    </div></header>
    <main>{children}</main>
    <footer><div className="wrap footerinner"><Link href="/" className="footerbrand">BAM TV <span>SN</span></Link><p>L’information au cœur de nos communautés.</p><div className="footlinks"><Link href="/actualites">Actualités</Link><Link href="/videos">Vidéos</Link><Link href="/emissions">Émissions</Link><Link href="/contact">Contact</Link></div><small>© {new Date().getFullYear()} BAM TV SN</small></div></footer>
  </body></html>;
}
