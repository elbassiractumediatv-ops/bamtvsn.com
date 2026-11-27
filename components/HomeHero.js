import Link from 'next/link';
import HomeLiveAndAds from '@/components/HomeLiveAndAds';

const channels = [
  { label: 'YouTube', href: 'https://www.youtube.com/@BAMTVSN' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
];

const navigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Vidéos', href: '/videos' },
  { label: 'Publicité', href: '/publicite' },
  { label: 'Contact', href: '/contact' },
];

export default function HomeHero({ headlines = [], ads = [] }) {
  const news = headlines.length ? headlines : [{ time: 'BAM TV SN', title: 'Retrouvez toute l’actualité sur BAM TV SN' }];
  return (
    <>
      <section className="bam-brand-hero" aria-labelledby="bam-hero-title">
        <nav className="bam-hero-nav" aria-label="Navigation principale">
          <Link href="/" className="bam-nav-brand"><img src="/bam-tv-sn-logo.svg" alt="BAM TV SN" /></Link>
          <div className="bam-nav-links">
            {navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/direct" className="bam-nav-direct"><i /> Direct</Link>
          </div>
        </nav>
        <div className="bam-hero-light" aria-hidden="true" />
        <svg className="bam-dakar-silhouette" viewBox="0 0 900 250" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <g fill="#002d20" opacity=".82">
            <path d="M260 250V115h42v135zm54 0V78h58v172zm72 0V126h48v124zm60 0V42h40v208zm52 0V100h76v150zm92 0V130h44v120zm58 0V88h55v162z"/>
            <path d="M395 78l20-38 20 38h-12v34h-16V78zm200 22l17-35 17 35h-10v31h-14v-31z"/>
            <path d="M490 250v-62c0-34 28-62 62-62s62 28 62 62v62z"/>
            <path d="M700 250q10-95 60-110q-36 35-28 110zm24-94q-15-45-46-54q32 4 55 37zm12-2q25-43 62-45q-39 13-48 52z"/>
            <path d="M0 250V202q90-28 178 0v48zm760 0v-45q70-38 140 0v45z"/>
          </g>
          <g stroke="#002d20" strokeWidth="5" fill="none" opacity=".85">
            <path d="M238 250q0-75-36-106m36 40q-26-34-54-28m54 5q15-34 43-39"/>
          </g>
        </svg>
        <div className="bam-hero-inner">
          <div className="bam-hero-logo-wrap">
            <img className="bam-hero-logo" src="/bam-tv-sn-logo.svg" alt="Logo officiel BAM TV SN" />
          </div>
          <div className="bam-hero-copy">
            <span className="bam-hero-kicker">Vous suivez</span>
            <h1 id="bam-hero-title">BAM TV SN</h1>
            <div className="bam-hero-socials">
              <span>sur</span>
              {channels.map(channel => <a key={channel.label} href={channel.href} target="_blank" rel="noopener noreferrer">{channel.label}</a>)}
              <Link className="bam-hero-live" href="/direct"><i /> En direct</Link>
            </div>
            <p className="bam-hero-motto"><span>INFORMER</span><i /> <span>ÉDUQUER</span><i /> <span>DIVERTIR</span><i /> <span>RASSEMBLER</span></p>
          </div>
          <div className="bam-hero-media"><HomeLiveAndAds ads={ads} /></div>
        </div>
        <div className="bam-flag-waves" aria-hidden="true"><i /><i /><i /></div>
      </section>
      <div className="bam-breaking" aria-label="En bref">
        <strong>En bref</strong>
        <div className="bam-breaking-window">
          <div className="bam-breaking-track">
            {[...news, ...news].map((item, index) => (
              <span key={index}><b>{item.time}</b> {item.title}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
