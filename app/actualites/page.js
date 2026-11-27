import Link from 'next/link';
import {getArticles,getCategories} from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
export const dynamic='force-dynamic';export const metadata={title:'Actualités'};
export default async function NewsPage({searchParams}) {
 const params=await searchParams; const active=params.categorie||'';
 const [all,categories]=await Promise.all([getArticles(100).catch(()=>[]),getCategories('article').catch(()=>[])]);
 const items=active?all.filter(a=>a.category?.slug===active):all;
 const current=categories.find(c=>c.slug===active);
 return <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">BAM TV SN</p><h1>{current?.name||'Actualités'}</h1></div></div>
 <nav className="category-filters" aria-label="Rubriques d’actualité"><Link className={!active?'active':''} href="/actualites">Toutes</Link>{categories.map(c=><Link key={c.id} className={active===c.slug?'active':''} href={`/actualites?categorie=${c.slug}`}>{c.name}</Link>)}</nav>
 {items.length?<div className="cards">{items.map(x=><ArticleCard key={x.id} article={x}/>)}</div>:<EmptyState title="Aucun article dans cette rubrique">Les articles publiés dans cette catégorie apparaîtront ici.</EmptyState>}</div></section>;
}