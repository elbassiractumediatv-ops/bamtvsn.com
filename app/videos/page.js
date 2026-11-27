import Link from 'next/link';
import {getVideos,getCategories} from '@/lib/content';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';
export const dynamic='force-dynamic';export const metadata={title:'Vidéos'};
export default async function VideosPage({searchParams}) {
 const params=await searchParams; const active=params.categorie||'';
 const [all,categories]=await Promise.all([getVideos(100).catch(()=>[]),getCategories('video').catch(()=>[])]);
 const items=active?all.filter(v=>v.category?.slug===active):all;
 const current=categories.find(c=>c.slug===active);
 return <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Reportages, débats et magazines</p><h1>{current?.name||'Vidéos'}</h1></div></div>
 <nav className="category-filters" aria-label="Catégories vidéo"><Link className={!active?'active':''} href="/videos">Toutes</Link>{categories.map(c=><Link key={c.id} className={active===c.slug?'active':''} href={`/videos?categorie=${c.slug}`}>{c.name}</Link>)}</nav>
 {items.length?<div className="video-grid">{items.map(x=><VideoCard key={x.id} video={x}/>)}</div>:<EmptyState title="Aucune vidéo dans cette rubrique">Les vidéos publiées dans cette catégorie apparaîtront ici.</EmptyState>}</div></section>;
}