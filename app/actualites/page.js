import { getArticles } from '@/lib/content'; import ArticleCard from '@/components/ArticleCard'; import EmptyState from '@/components/EmptyState';
export const dynamic='force-dynamic';
export const metadata={title:'Actualités'};
export default async function NewsPage(){const items=await getArticles(100).catch(()=>[]);return <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">BAM TV SN</p><h1>Actualités</h1></div></div>{items.length?<div className="cards">{items.map(x=><ArticleCard key={x.id} article={x}/>)}</div>:<EmptyState title="Aucune actualité publiée">Les articles de BAM TV SN apparaîtront ici.</EmptyState>}</div></section>}
