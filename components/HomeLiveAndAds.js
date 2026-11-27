'use client';

import { useEffect, useRef, useState } from 'react';
import AdvertisementPlaylist from '@/components/AdvertisementPlaylist';

const CHANNEL_ID = 'UC7VnuAmqfg2ZFXcP4VozLyw';

export default function HomeLiveAndAds({ ads = [] }) {
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [liveReady, setLiveReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let poll = null;
    const boot = () => {
      if (cancelled || !window.YT?.Player || !frameRef.current) return;
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(frameRef.current, {
        events: {
          onReady: () => { if (!cancelled) setLiveReady(true); },
          onStateChange: (event) => {
            if (cancelled) return;
            if (event.data === window.YT.PlayerState.PLAYING) setIsLive(true);
            if (event.data === window.YT.PlayerState.ENDED) setIsLive(false);
          },
          onError: () => { if (!cancelled) setIsLive(false); }
        }
      });
      poll = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getPlayerState || !window.YT) return;
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) setIsLive(true);
        else if (state === window.YT.PlayerState.ENDED || state === window.YT.PlayerState.UNSTARTED) setIsLive(false);
      }, 2500);
    };

    if (window.YT?.Player) boot();
    else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        boot();
      };
      if (!document.querySelector('script[data-bam-youtube-api]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.bamYoutubeApi = 'true';
        document.head.appendChild(script);
      }
    }
    return () => {
      cancelled = true;
      if (poll) window.clearInterval(poll);
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="bam-live-ads-layout">
      <section className="bam-home-live" aria-label="Direct YouTube BAM TV SN">
        <div className="bam-home-live-heading"><span className={isLive ? 'bam-live-dot is-live' : 'bam-live-dot'} />{isLive ? 'BAM TV SN · EN DIRECT' : 'BAM TV SN · CHAÎNE YOUTUBE'}</div>
        <div className="bam-home-live-frame">
          <div
            ref={frameRef}
            id="bam-home-live-youtube"
            data-live-channel={CHANNEL_ID}
            className="bam-home-live-embed"
          />
          {!liveReady && <div className="bam-home-live-loading">Connexion à la chaîne YouTube…</div>}
        </div>
        <a className="bam-home-live-channel" href={`https://www.youtube.com/channel/${CHANNEL_ID}`} target="_blank" rel="noopener noreferrer">Voir la chaîne BAM TV SN sur YouTube ↗</a>
      </section>
      <section className="bam-home-ad-column" aria-label="Playlist publicitaire">
        <div className="bam-home-ad-heading">ESPACE PUBLICITAIRE</div>
        <AdvertisementPlaylist ads={ads} variant="hero" paused={isLive} />
        {isLive && <p className="bam-ad-paused-note">Publicités en pause pendant le direct</p>}
      </section>
    </div>
  );
}
