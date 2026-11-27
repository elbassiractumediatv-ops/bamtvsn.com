'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function whatsappHref(phone, title) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(digits)) return null;
  const message = encodeURIComponent(`Bonjour, je vous contacte depuis BAM TV SN au sujet de votre publicité : ${title}.`);
  return `https://wa.me/${digits}?text=${message}`;
}

export default function AdvertisementPlaylist({ ads = [], variant = 'page' }) {
  const items = useMemo(() => (Array.isArray(ads) ? ads : []).filter((item) =>
    item && typeof item.media_url === 'string' &&
    (item.media_type === 'image' || item.media_type === 'video')
  ), [ads]);
  const [index, setIndex] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const videoRef = useRef(null);
  const current = items[index] || null;
  const isHero = variant === 'hero';

  const advance = () => {
    if (items.length > 1) {
      setMediaFailed(false);
      setAutoplayBlocked(false);
      setIndex((value) => (value + 1) % items.length);
    } else {
      setMediaFailed(true);
    }
  };

  useEffect(() => {
    setIndex(0);
    setMediaFailed(false);
  }, [items.length]);

  useEffect(() => {
    if (!current || current.media_type !== 'image') return undefined;
    const seconds = Math.min(60, Math.max(5, Number(current.duration_seconds) || 8));
    const timer = window.setTimeout(advance, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [current?.id, current?.media_type, current?.duration_seconds, items.length]);

  useEffect(() => {
    if (!current || current.media_type !== 'video') return undefined;
    const video = videoRef.current;
    if (!video) return undefined;
    setAutoplayBlocked(false);
    setMediaFailed(false);
    let cancelled = false;
    const attempt = () => {
      if (cancelled) return;
      video.play().then(() => setAutoplayBlocked(false)).catch(() => setAutoplayBlocked(true));
    };
    if (video.readyState >= 2) attempt();
    else video.addEventListener('canplay', attempt, { once: true });
    return () => {
      cancelled = true;
      video.removeEventListener('canplay', attempt);
    };
  }, [current?.id, current?.media_type]);

  if (!current) {
    return (
      <section className={`publicite-video-section ${isHero ? 'publicite-playlist-hero' : ''}`} aria-label="Espace publicitaire">
        {!isHero && <div className="publicite-video-heading"><div><p className="eyebrow">BAM TV SN · ESPACE PUBLICITAIRE</p><h2>Publicités en diffusion automatique</h2><p>Les annonces ajoutées par l’administration apparaîtront ici.</p></div></div>}
        <div className="publicite-playlist-empty">Aucune publicité active pour le moment.</div>
      </section>
    );
  }

  const contactHref = whatsappHref(current.whatsapp_phone, current.title);

  return (
    <section className={`publicite-video-section ${isHero ? 'publicite-playlist-hero' : ''}`} aria-label="Publicités en diffusion automatique">
      {!isHero && <div className="publicite-video-heading">
        <div><p className="eyebrow">BAM TV SN · ESPACE PUBLICITAIRE</p><h2>Publicités en diffusion automatique</h2><p>Les annonces publiées par l’administration s’enchaînent sans intervention des visiteurs.</p></div>
        <span className="publicite-playlist-count">{index + 1} / {items.length}</span>
      </div>}
      <div className="publicite-playlist-frame">
        {current.media_type === 'video' ? (
          <video
            key={current.id}
            ref={videoRef}
            className="publicite-playlist-media"
            src={current.media_url}
            autoPlay
            muted
            playsInline
            loop={false}
            preload="auto"
            controls={false}
            onEnded={advance}
            onError={advance}
            aria-label={current.title}
          />
        ) : (
          <img key={current.id} className="publicite-playlist-media" src={current.media_url} alt={current.title} onError={advance} />
        )}
        {!mediaFailed && <div className="publicite-playlist-label">
          <span>PUBLICITÉ {items.length > 1 ? `· ${index + 1}/${items.length}` : ''}</span>
          <strong>{current.title}</strong>
          {contactHref && <a className="publicite-playlist-whatsapp" href={contactHref} target="_blank" rel="noopener noreferrer">Contacter sur WhatsApp</a>}
        </div>}
        {mediaFailed && <div className="publicite-playlist-failed">Média momentanément indisponible.</div>}
      </div>
      {autoplayBlocked && <p className="publicite-playlist-note" role="status">Le navigateur bloque la lecture automatique. La vidéo est pourtant configurée sans son et sans clic.</p>}
      {!isHero && <p className="publicite-video-caption">Diffusion automatique · {items.length} annonce(s) active(s)</p>}
    </section>
  );
}
