'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  ['Accueil', '/'],
  ['Actualités', '/actualites'],
  ['Direct', '/direct'],
  ['Vidéos', '/videos'],
  ['Émissions', '/emissions'],
  ['Contact', '/contact'],
];

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  return (
    <>
      <div className="topline">
        <div className="wrap topinner">
          <span>Votre média, votre voix</span>
          <span>L’information au cœur de nos communautés</span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap headerinner">
          <Link href="/" className="brand"><img src="/bam-tv-sn-logo.svg" alt="BAM TV SN" /></Link>
          <nav aria-label="Navigation principale">
            {nav.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link href="/recherche" aria-label="Recherche" className="search-link">⌕</Link>
            <Link className="live-pill" href="/direct"><i /> En direct</Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="wrap footerinner">
          <Link href="/" className="footerbrand">BAM TV <span>SN</span></Link>
          <p>L’information au cœur de nos communautés.</p>
          <div className="footlinks">
            <Link href="/actualites">Actualités</Link><Link href="/direct">Direct</Link>
            <Link href="/videos">Vidéos</Link><Link href="/emissions">Émissions</Link><Link href="/contact">Contact</Link>
          </div>
          <small>© {new Date().getFullYear()} BAM TV SN</small>
        </div>
      </footer>
    </>
  );
}
