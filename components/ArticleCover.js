'use client';

import { useState } from 'react';

export default function ArticleCover({ article, className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);
  const photo = article?.cover_url;
  const showBanner = !photo || failed;
  const published = article?.published_at
    ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(article.published_at))
    : 'BAM TV SN';
  const category = article?.category?.name || 'ACTUALITÉS';

  if (showBanner) {
    return (
      <div
        className={`bam-article-banner ${className}`}
        role="img"
        aria-label={`Bannière BAM TV SN : ${article?.title || 'Actualité'}`}
        style={{
          width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxSizing: 'border-box', padding: 'clamp(14px, 3.5vw, 34px)',
          color: '#fff', background: 'linear-gradient(125deg, #052d21 0%, #08743e 58%, #031a16 100%)',
          borderRadius: 'inherit',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: .15, backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 28px, #e2c879 29px 30px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/bam-tv-sn-logo.svg" alt="" style={{ width: 'clamp(70px, 14%, 150px)', height: 'auto', objectFit: 'contain' }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, letterSpacing: '.08em', fontSize: 'clamp(13px, 2vw, 22px)' }}>BAM TV SN</div>
            <div style={{ color: '#d7e8df', fontSize: 'clamp(8px, 1vw, 12px)', letterSpacing: '.08em' }}>L’INFORMATION AU CŒUR DE NOS COMMUNAUTÉS</div>
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: '94%' }}>
          <div style={{ display: 'inline-block', padding: '5px 10px', marginBottom: 12, background: '#bd202d', border: '1px solid #e5c879', fontWeight: 800, letterSpacing: '.08em', fontSize: 'clamp(9px, 1.2vw, 14px)' }}>{category.toLocaleUpperCase('fr-FR')}</div>
          <div style={{ fontWeight: 900, lineHeight: 1.12, fontSize: 'clamp(17px, 3.1vw, 38px)', textShadow: '0 2px 8px #001a10', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article?.title || 'Actualité'}</div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, borderTop: '2px solid #d9bd70', paddingTop: 9, fontSize: 'clamp(8px, 1.2vw, 13px)', fontWeight: 700, letterSpacing: '.04em' }}>
          <span>{published}</span><span>BAMTVSN.COM</span>
        </div>
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
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
