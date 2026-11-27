// Prototype de reprise LOCAL uniquement. Ne pas publier en production.
import {createServer} from 'node:http';
const origin='https://thevryhybiloqddnoeof.supabase.co';
const key=process.env.SUPABASE_PUBLISHABLE_KEY || '';
function publicKey(k) {
  if(k.startsWith('sb_publishable_')) return true;
  try {return JSON.parse(Buffer.from(k.split('.')[1],'base64url').toString()).role==='anon';}catch{return false;}
}
if(!publicKey(key)){console.error('Configurer une clé Supabase publique dans .env.local. Jamais de service_role.');process.exit(1);}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'?esc(u.href):'';}catch{return '';}};
const pathSlug=v=>encodeURIComponent(String(v??''));
const date=v=>{const d=new Date(v);return v&&!Number.isNaN(d.valueOf())?new Intl.DateTimeFormat('fr-SN',{dateStyle:'medium',timeZone:'Africa/Dakar'}).format(d):'';};
async function rows(table,params){
 const u=new URL('/rest/v1/'+table,origin);
 for(const [k,v] of Object.entries(params)) u.searchParams.set(k,v);
 const headers={apikey:key,Accept:'application/json'};
 if(!key.startsWith('sb_publishable_'))headers.Authorization='Bearer '+key;
 const r=await fetch(u,{headers,signal:AbortSignal.timeout(10000),redirect:'error'});
 if(!r.ok)throw new Error('Supabase '+table+' HTTP '+r.status);
 const data=await r.json();if(!Array.isArray(data))throw new Error('Réponse inattendue');return data;
}
const articles=(extra={})=>rows('articles',{select:'id,title,slug,excerpt,cover_url,published_at,featured,category_id',status:'eq.published',order:'published_at.desc.nullslast',limit:'100',...extra});
const videos=()=>rows('videos',{select:'title,slug,description,youtube_id,thumbnail_url,published_at',status:'eq.published',order:'published_at.desc.nullslast',limit:'200'});
const cats=()=>rows('categories',{select:'id,name,slug,type,position',order:'position.asc',limit:'100'});
const emissions=()=>rows('emissions',{select:'title,slug,description,cover_url,schedule',is_active:'eq.true',order:'position.asc',limit:'100'});
const ads=()=>rows('publicites',{select:'titre,type,media_url,lien,duree',actif:'eq.true',order:'position.asc',limit:'50'});
const img=(url,alt='')=>safeUrl(url)?'<img loading="lazy" src="'+safeUrl(url)+'" alt="'+esc(alt)+'">':'';
const yt=id=>/^[A-Za-z0-9_-]{11}$/.test(id??'')?'https://www.youtube.com/watch?v='+id:'https://youtube.com/@bamtvsenegal';
const card=a=>'<article>'+img(a.cover_url,a.title)+'<small>'+esc(date(a.published_at))+'</small><h2><a href="/actualites/'+pathSlug(a.slug)+'">'+esc(a.title)+'</a></h2><p>'+esc(a.excerpt)+'</p></article>';
const vcard=v=>'<article>'+img(v.thumbnail_url,v.title)+'<small>'+esc(date(v.published_at))+'</small><h2><a href="'+esc(yt(v.youtube_id))+'">'+esc(v.title)+'</a></h2></article>';
const grid=(items,render)=>items.length?'<div class="grid">'+items.map(render).join('')+'</div>':'<p>Aucun contenu disponible.</p>';
function layout(title,body,categories=[]){
 return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+esc(title)+' — BAM TV SN</title><style> *{box-sizing:border-box}body{margin:0;background:#f5f6f7;color:#202730;font:16px/1.6 system-ui,sans-serif}header{background:#133344;color:white;padding:24px max(5vw,16px)}header a{color:white}header strong{font-size:30px}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:inherit}nav a{text-decoration:none}aside{padding:12px 5vw;background:#fde9b6;color:#352d19}main{max-width:1200px;margin:auto;padding:25px 16px}h1{font-size:32px}h2{font-size:19px;line-height:1.35}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px}article{background:white;border:1px solid #e2e5e8;border-radius:8px;padding:16px;overflow:hidden}img{display:block;max-width:100%;height:auto;object-fit:cover;border-radius:5px}small{color:#62717b}footer{background:#133344;color:white;padding:25px 5vw}form{display:flex;gap:8px;flex-wrap:wrap}input,button{font:inherit;padding:9px} .content{white-space:pre-wrap;overflow-wrap:anywhere}.rubriques{display:flex;flex-wrap:wrap;gap:12px;margin-top:14px}</style></head><body><aside>Reconstruction locale privée — aperçu non officiel, non destiné à la publication.</aside><header><strong>BAM TV SN</strong><p>L’information au cœur de nos communautés</p><nav><a href="/">Accueil</a><a href="/actualites">Actualités</a><a href="/videos">Vidéos</a><a href="/emissions">Émissions</a><a href="/recherche">Recherche</a><a href="https://youtube.com/@bamtvsenegal/live">Direct</a></nav><div class="rubriques">'+categories.map(c=>'<a href="/rubrique/'+pathSlug(c.slug)+'">'+esc(c.name)+'</a>').join('')+'</div></header><main>'+body+'</main><footer>BAM TV SN · <a href="https://youtube.com/@bamtvsenegal">YouTube</a> · <a href="https://www.tiktok.com/@bam.tv.senegal">TikTok</a></footer></body></html>';
}
const server=createServer(async(req,res)=>{
 res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('X-Robots-Tag','noindex,nofollow');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'none'; img-src https:; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
 function send(code,title,body,cs=[]){res.statusCode=code;res.end(layout(title,body,cs));}
 if(req.method!=='GET'){res.setHeader('Allow','GET');return send(405,'Lecture seule','<h1>Lecture seule</h1>');}
 try{
 const u=new URL(req.url,'http://127.0.0.1');const p=u.pathname;
 if(p==='/healthz')return send(200,'État','<p>Serveur local actif.</p>');
 if(p.startsWith('/admin')||p==='/contact')return send(501,'Non restauré','<h1>Fonctionnalité non restaurée</h1><p>Administration et formulaires de production non activés dans cet aperçu.</p>');
 const cs=await cats();
 if(p==='/'){
 const [aa,vv,ee,pp]=await Promise.all([articles(),videos(),emissions(),ads()]);
 const featured=aa.find(x=>x.featured)||aa[0];
 const news=featured?'<h1>À la une</h1>'+card(featured):'';
 const adlist=pp.length?'<h2>Publicités</h2><p>'+pp.map(a=>esc(a.titre)).join(' · ')+'</p>':'';
 return send(200,'Accueil',news+adlist+'<h1>Dernières actualités</h1>'+grid(aa.slice(0,12),card)+'<h1>Vidéos</h1>'+grid(vv.slice(0,8),vcard)+'<h1>Émissions</h1>'+grid(ee,e=>'<article>'+img(e.cover_url,e.title)+'<h2>'+esc(e.title)+'</h2><p>'+esc(e.description)+'</p></article>'),cs);
 }
 if(p==='/actualites')return send(200,'Actualités','<h1>Actualités</h1>'+grid(await articles(),card),cs);
 if(p==='/videos')return send(200,'Vidéos','<h1>Vidéos</h1>'+grid(await videos(),vcard),cs);
 if(p==='/emissions')return send(200,'Émissions','<h1>Émissions</h1>'+grid(await emissions(),e=>'<article>'+img(e.cover_url,e.title)+'<h2>'+esc(e.title)+'</h2><p>'+esc(e.description)+'</p><p>'+esc(e.schedule)+'</p></article>'),cs);
 if(p.startsWith('/rubrique/')){const slug=decodeURIComponent(p.slice(10));const c=cs.find(x=>x.slug===slug);if(!c)return send(404,'Rubrique','<h1>Rubrique introuvable</h1>',cs);return send(200,c.name,'<h1>'+esc(c.name)+'</h1>'+grid(await articles({category_id:'eq.'+c.id}),card),cs);}
 if(p.startsWith('/actualites/')){
 const slug=decodeURIComponent(p.slice(12));
 if(!/^[a-zA-Z0-9_-]{1,240}$/.test(slug))return send(404,'Article','<h1>Article introuvable</h1>',cs);
 const a=(await articles({select:'title,slug,excerpt,content,cover_url,published_at',slug:'eq.'+slug,limit:'1'}))[0];
 if(!a)return send(404,'Article','<h1>Article introuvable</h1>',cs);
 return send(200,a.title,'<article><h1>'+esc(a.title)+'</h1><small>'+esc(date(a.published_at))+'</small>'+img(a.cover_url,a.title)+'<p>'+esc(a.excerpt)+'</p><div class="content">'+esc(a.content)+'</div></article>',cs);
 }
 if(p==='/recherche'){const q=(u.searchParams.get('q')||'').slice(0,100);const aa=q?(await articles()).filter(a=>(a.title+' '+(a.excerpt||'')).toLocaleLowerCase('fr').includes(q.toLocaleLowerCase('fr'))):[];return send(200,'Recherche','<h1>Recherche</h1><form><input name="q" value="'+esc(q)+'" placeholder="Rechercher"><button>Rechercher</button></form>'+(q?grid(aa,card):''),cs);}
 return send(404,'Introuvable','<h1>Page introuvable</h1>',cs);
 }catch(e){console.error('Aperçu :',e.message);return send(503,'Indisponible','<h1>Connexion ou page indisponible</h1><p>Vérifier la configuration et les permissions Supabase.</p>');}
});
// Écoute exclusivement sur loopback. Aucun mode public fourni.
server.listen(3000,'127.0.0.1',()=>console.log('Aperçu local : http://127.0.0.1:3000'));
