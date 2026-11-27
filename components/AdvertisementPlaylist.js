'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function whatsappHref(phone, title) {
  const digits = String(phone || '').replace(/\\D/g, '');
  if (!/^\\d{8,15}$/.test(digits)) return null;
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundPreference, setSoundPreference] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const videoRef = useRef(null);
  const current = items[index] || null;
  const isHero = variant === 'hero';

  // Remember the visitor's explicit sound choice for the rest of this browser session.
  useEffect(() => {
    try {
      setSoundPreference(window.sessionStorage.getItem('bam-ad-sound') === 'on');
    } catch {}
  }, []);

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
    let cancelled = false;
    setAutoplayBlocked(false);
    setSoundEnabled(false);
    setMediaFailed(false);

    const start = async () => {
      if (cancelled) return;
      // After one deliberate sound activation, try to keep sound on for every next ad.
      video.muted = !soundPreference;
      video.volume = 1;
      try {
        await video.play();
        if (!cancelled) setSoundEnabled(!video.muted);
      } catch {
        if (cancelled) return;
        // Browsers can still reject audible autoplay for a newly loaded media source.
        video.muted = true;
        try {
          await video.play();
          if (!cancelled) setAutoplayBlocked(true);
        } catch {
          if (!cancelled) setAutoplayBlocked(true);
        }
      }
    };

    if (video.readyState >= 2) start();
    else video.addEventListener('canplay', start, { once: true });
    return () => {
      cancelled = true;
      video.removeEventListener('canplay', start);
    };
  }, [current?.id, current?.media_type, current?.media_url, soundPreference]);

  const enableSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = false;
      video.volume = 1;
      await video.play();
      setSoundPreference(true);
      setSoundEnabled(true);
      setAutoplayBlocked(false);
      try { window.sessionStorage.setItem('bam-ad-sound', 'on'); } catch {}
    } catch {
      setSoundEnabled(false);
      setAutoplayBlocked(true);
    }
  };

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
            ref={videoRef}
            className="publicite-playlist-media"
            src={current.media_url}
            autoPlay
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
          <span>ANNONCE {items.length > 1 ? `· ${index + 1}/${items.length}` : ''}</span>
          <strong>{current.title}</strong>
        </div>}
        {current.media_type === 'video' && !soundEnabled && (
          <button type="button" className="publicite-playlist-sound" onClick={enableSound} aria-label="Activer le son des publicités">Activer le son</button>
        )}
        {contactHref && <a className="publicite-playlist-whatsapp" href={contactHref} target="_blank" rel="noopener noreferrer">WhatsApp · {current.title}</a>}
        {mediaFailed && <div className="publicite-playlist-failed">Média momentanément indisponible.</div>}
      </div>
      {autoplayBlocked && <p className="publicite-playlist-note" role="status">Le navigateur bloque encore le son automatique pour cette vidéo. Activez le son une fois ; BAM TV SN le conservera ensuite autant que le navigateur l’autorise.</p>}
      {!isHero && <p className="publicite-video-caption">Diffusion automatique · {items.length} annonce(s) active(s)</p>}
    </section>
  );
}
