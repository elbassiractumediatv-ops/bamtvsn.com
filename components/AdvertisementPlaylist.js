'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export default function AdvertisementPlaylist({ ads = [] }) {
  const items = useMemo(() => (Array.isArray(ads) ? ads : []).filter((item) =>
    item && typeof item.media_url === 'string' &&
    (item.media_type === 'image' || item.media_type === 'video')
  ), [ads]);
  const [index, setIndex] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef(null);
  const current = items[index] || null;

  const advance = () => {
    if (items.length > 1) setIndex((value) => (value + 1) % items.length);
    else if (items.length === 1) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => setAutoplayBlocked(true));
      }
    }
  };

  useEffect(() => {
    setIndex(0);
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
    const attempt = () => video.play().catch(() => setAutoplayBlocked(true));
    if (video.readyState >= 2) attempt();
    else video.addEventListener('canplay', attempt, { once: true });
    return () => video.removeEventListener('canplay', attempt);
  }, [current?.id, current?.media_type]);

  if (!current) {
    return (
      <section className="publicite-video-section" aria-labelledby="publicite-video-title">
        <div className="publicite-video-heading">
          <div>
            <p className="eyebrow">BAM TV SN · ESPACE PUBLICITAIRE</p>
            <h2 id="publicite-video-title">Publicités en diffusion automatique</h2>
            <p>Aucun média n’est encore programmé. Les annonces ajoutées par l’administration apparaîtront ici.</p>
          </div>
        </div>
        <div className="publicite-playlist-empty">La playlist publicitaire est en attente de médias.</div>
      </section>
    );
  }

  return (
    <section className="publicite-video-section" aria-labelledby="publicite-video-title">
      <div className="publicite-video-heading">
        <div>
          <p className="eyebrow">BAM TV SN · ESPACE PUBLICITAIRE</p>
          <h2 id="publicite-video-title">Publicités en diffusion automatique</h2>
          <p>Les annonces publiées par l’administration s’enchaînent sans intervention des visiteurs.</p>
        </div>
        <span className="publicite-playlist-count">{index + 1} / {items.length}</span>
      </div>
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
            preload="auto"
            controls={false}
            onEnded={advance}
            onError={advance}
            aria-label={current.title}
          />
        ) : (
          <img
            key={current.id}
            className="publicite-playlist-media"
            src={current.media_url}
            alt={current.title}
            onError={advance}
          />
        )}
        <div className="publicite-playlist-label">
          <span>PUBLICITÉ</span>
          <strong>{current.title}</strong>
        </div>
      </div>
      {autoplayBlocked && (
        <p className="publicite-playlist-note" role="status">
          La lecture automatique est bloquée par les réglages du navigateur. Les vidéos sont configurées en lecture muette et sans clic.
        </p>
      )}
      <p className="publicite-video-caption">Diffusion automatique · {items.length} annonce(s) active(s)</p>
    </section>
  );
}
