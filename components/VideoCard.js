import Link from 'next/link';
import { videoThumbnail } from '@/lib/content';
export default function VideoCard({ video }) {
  const thumbnail = videoThumbnail(video) || '/placeholder-video.svg';
  return <article className="card video-card"><Link href={`/videos/${video.slug}`} className="thumb-wrap"><img className="card-image" src={thumbnail} alt="" /><span className="play-icon">▶</span></Link><div className="card-category">{video.emission?.title || video.category?.name || 'BAM TV'}</div><h3><Link href={`/videos/${video.slug}`}>{video.title}</Link></h3><div className="meta">{video.published_at ? new Date(video.published_at).toLocaleDateString('fr-FR') : 'BAM TV SN'}</div></article>;
}
