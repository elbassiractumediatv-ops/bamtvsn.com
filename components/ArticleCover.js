'use client';

import { useState } from 'react';

export default function ArticleCover({ article, className = '', loading = 'lazy', variant = 'article' }) {
  const [failed, setFailed] = useState(false);
  const [imageRatio, setImageRatio] = useState(null);
  const photo = article?.cover_url;
  const published = article?.published_at
    ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(article.published_at))
    : 'BAM TV SN';
  const category = article?.category?.name || 'ACTUALITÉS';
  const isCard = variant === 'card';

  if (!photo || failed) {
    if (isCard) {
      return (
        <div className={`article-cover-fallback article-cover-fallback-card ${className}`} role="img" aria-label={`Illustration éditoriale BAM TV SN : ${article?.title || 'Actualité'}`}>
          <span className="article-cover-brand">BAM <b>TV</b> SN</span>
          <span className="article-cover-category">{category}</span>
          <strong>Image non disponible</strong>
          <small>BAMTVSN.COM</small>
        </div>
      );
    }

    return (
      <div className={`article-cover-fallback article-cover-fallback-large ${className}`} role="img" aria-label={`Bannière BAM TV SN : ${article?.title || 'Actualité'}`}>
        <span className="article-cover-brand">BAM <b>TV</b> SN</span>
        <span className="article-cover-category">{category}</span>
        <strong>{article?.title || 'Actualité'}</strong>
        <small>{published} · BAMTVSN.COM</small>
      </div>
    );
  }

  const isPortrait = imageRatio !== null && imageRatio < 0.82;
  if (isCard) {
    return (
      <div className={`article-cover-frame ${isPortrait ? 'is-portrait' : ''} ${className}`}>
        <img
          src={photo}
          alt={article?.title || 'Photo de l’actualité'}
          loading={loading}
          onError={() => setFailed(true)}
          onLoad={(event) => setImageRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
        />
      </div>
    );
  }

  return (
    <img
      className={className}
      src={photo}
      alt={article?.title || 'Photo de l’actualité'}
      loading={loading}
      onError={() => setFailed(true)}
      onLoad={(event) => setImageRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
      style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 560, objectFit: isPortrait ? 'contain' : 'cover', background: isPortrait ? '#f1f4f1' : 'transparent' }}
    />
  );
}
