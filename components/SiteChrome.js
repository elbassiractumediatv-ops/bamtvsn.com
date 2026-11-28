'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const newsCategories = ['Politique','Économie','Société','International','Sport','Religion','Culture','Tech & Informatique','Santé','Environnement'];
const videoCategories = ['Politique','Reportages','Émissions','En direct','Replay','Religieux','Sport','Culture'];
const socials = [
  { label: 'YouTube', short: '▶', className: 'social-youtube', href: 'https://www.youtube.com/@BAMTVSN' },
  { label: 'Facebook', short: 'f', className: 'social-facebook', href: 'https://www.facebook.com/profile.php?id=103507534697163' },
];

function toCategorySlug(value) {
  return value.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function CategoryMenu({ title, href, categories }) {
  return (
    <div className="nav-dropdown">
      <Link href={href} className="nav-dropdown-trigger">{title}<span aria-hidden="true">⌄</span></Link>
      <div className="nav-dropdown-panel">
        {categories.map(category => (
          <Link key={category} href={`${href}?categorie=${toCategorySlug(category)}`}>{category}</Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  return (
    <>
      <header className="site-header">
        <div className="header-top wrap">
          <Link href="/" className="brand"><img src="/bam-tv-sn-logo.svg" alt="BAM TV SN" /></Link>
          <div className="header-top-right">
            <span className="social-caption">Suivez-nous sur</span>
            <div className="social-links" aria-label="Réseaux sociaux">
              {socials.map(social => <a key={social.label} href={social.href} className={social.className} aria-label={social.label} title={social.label} target="_blank" rel="noopener noreferrer">{social.short}</a>)}
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <div className="wrap header-bottom-inner">
            <nav className="main-nav" aria-label="Navigation principale">
              <Link href="/" className={pathname === '/' ? 'active' : ''}>Accueil</Link>
              <CategoryMenu title="Actualités" href="/actualites" categories={newsCategories} />
              <CategoryMenu title="Vidéos" href="/videos" categories={videoCategories} />
              <Link href="/publicite" className={pathname.startsWith('/publicite') ? 'active' : ''}>Publicité</Link>
              <Link href="/direct" className={pathname === '/direct' ? 'active live-nav' : 'live-nav'}><i /> En direct</Link>
            </nav>
            <div className="header-motto">INFORMER <b>·</b> DIVERTIR <b>·</b> ÉDUQUER <b>·</b> RASSEMBLER</div>
            <Link href="/recherche" className="header-search" aria-label="Rechercher">⌕</Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="wrap footerinner">
          <Link href="/" className="footerbrand">BAM TV <span>SN</span></Link>
          <p>L’information au cœur de nos communautés.</p>
          <div className="footlinks">
            <Link href="/actualites">Actualités</Link><Link href="/direct">En direct</Link>
            <Link href="/videos">Vidéos</Link><Link href="/publicite">Publicité</Link><Link href="/contact">Contact</Link>
          </div>
          <small>© {new Date().getFullYear()} BAM TV SN</small>
        </div>
      </footer>
    </>
  );
}
