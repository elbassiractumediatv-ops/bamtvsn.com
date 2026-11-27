import Link from 'next/link';
import { videoThumbnail } from '@/lib/content';

export default function VideoCard({ video }) {
  const thumbnail = videoThumbnail(video) || '/placeholder-video.svg';
  return (
    <article className="card video-card editorial-card">
      <Link href={`/videos/${video.slug}`} className="thumb-wrap editorial-card-image">
        <img className="card-image" src={thumbnail} alt={video.title} loading="lazy" />
        <span className="play-icon" aria-hidden="true">▶</span>
      </Link>
      <h3><Link href={`/videos/${video.slug}`}>{video.title}</Link></h3>
    </article>
  );
}
