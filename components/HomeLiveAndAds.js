'use client';

import { useEffect, useRef, useState } from 'react';
import AdvertisementPlaylist from '@/components/AdvertisementPlaylist';

const CHANNEL_ID = 'UC7VnuAmqfg2ZFXcP4VozLyw';
const LIVE_EMBED_URL = `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0`;

export default function HomeLiveAndAds({ ads = [] }) {
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [liveReady, setLiveReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let poll = null;

    const boot = () => {
      if (cancelled || !window.YT?.Player || !frameRef.current || playerRef.current) return;

      // The iframe must already contain YouTube's channel live-stream URL.
      // Creating a Player around an empty div does not select any video.
      playerRef.current = new window.YT.Player(frameRef.current, {
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setLiveReady(true);
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (cancelled || !window.YT) return;
            if (event.data === window.YT.PlayerState.PLAYING) setIsLive(true);
            if (event.data === window.YT.PlayerState.ENDED) setIsLive(false);
          },
          onError: () => {
            if (!cancelled) {
              setIsLive(false);
              setLiveReady(true);
            }
          }
        }
      });

      poll = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getPlayerState || !window.YT) return;
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) setIsLive(true);
        else if (state === window.YT.PlayerState.ENDED) setIsLive(false);
      }, 2000);
    };

    if (window.YT?.Player) {
      boot();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
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
        <div className="bam-home-live-heading">
          <span className={isLive ? 'bam-live-dot is-live' : 'bam-live-dot'} />
          {isLive ? 'BAM TV SN · EN DIRECT' : 'BAM TV SN · DIRECT YOUTUBE'}
        </div>
        <div className="bam-home-live-frame">
          <iframe
            ref={frameRef}
            id="bam-home-live-youtube"
            className="bam-home-live-embed"
            src={LIVE_EMBED_URL}
            title="Direct vidéo BAM TV SN"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {!liveReady && <div className="bam-home-live-loading">Chargement du direct BAM TV SN…</div>}
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
