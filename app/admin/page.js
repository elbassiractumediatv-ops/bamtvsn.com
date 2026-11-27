import Link from 'next/link';
import { getAdminUser } from '@/lib/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCategories, getEmissions } from '@/lib/content';
import { loginAction, logoutAction, createVideoAction, createArticleAction, createEmissionAction } from './actions';

export const dynamic='force-dynamic';
function Status({params}){
  if(params.error==='login')return <div className="notice">Connexion refusée. Vérifiez vos identifiants ou réessayez plus tard.</div>;
  if(params.error==='logout')return <div className="notice">La déconnexion a échoué. Réessayez.</div>;
  if(params.error==='missing')return <div className="notice">Saisissez votre adresse e-mail et votre mot de passe.</div>;
  if(params.error==='save')return <div className="notice">Enregistrement impossible. Vérifiez les champs et réessayez.</div>;
  if(params.error)return <div className="notice">Vérifiez les champs obligatoires et les liens HTTPS.</div>;
  if(params.created)return <div className="notice success">Publication enregistrée. Le contenu apparaît maintenant sur le site.</div>;
  return null;
}
function Field({label,name,required=false,placeholder='',type='text'}){return <label>{label}<input name={name} type={type} required={required} placeholder={placeholder}/></label>}
function Tabs({tab}){return <div className="admin-tabs">{[['video','Ajouter une vidéo'],['article','Ajouter un titre'],['emission','Ajouter une émission']].map(([id,title])=><Link key={id} href={`/admin?tab=${id}`} aria-current={tab===id?'page':undefined}>{title}</Link>)}</div>}

export default async function AdminPage({searchParams}){
  const params=await searchParams; const tab=['video','article','emission'].includes(params.tab)?params.tab:'video';
  const {user}=await getAdminUser();
  if(!user)return <section className="admin-shell"><div className="admin-panel" style={{maxWidth:480}}><p className="eyebrow">Espace sécurisé</p><h1>Administration</h1><p>Connectez-vous avec le compte administrateur BAM TV SN.</p><Status params={params}/><form action={loginAction} className="admin-form"><Field label="Adresse e-mail" name="email" type="email" required placeholder="vous@exemple.com"/><Field label="Mot de passe" name="password" type="password" required/><button className="button">Se connecter</button></form></div></section>;
  const categories=(await getCategories(tab==='video'?'video':'article').catch(()=>[])); const emissions=(await getEmissions(100).catch(()=>[]));
  return <section className="admin-shell"><div className="admin-panel"><div className="admin-top"><div><p className="eyebrow">BAM TV SN · Administration</p><h1>Publier un contenu</h1><p>Connecté comme {user.email}</p></div><form action={logoutAction}><button className="plain-button">Déconnexion</button></form></div><Status params={params}/><Tabs tab={tab}/>
    {tab==='video'&&<form action={createVideoAction} className="admin-form"><div className="admin-grid"><Field label="Titre de la vidéo" name="title" required placeholder="Ex. Le journal de ce soir"/><Field label="ID YouTube (11 caractères)" name="youtube_id" required placeholder="dQw4w9WgXcQ"/></div><Field label="Description" name="description"/><div className="admin-grid"><Field label="URL de la miniature (optionnel)" name="thumbnail_url" placeholder="https://…"/><label>Catégorie<select name="category_id"><option value="">Sans catégorie</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><label>Émission (optionnel)<select name="emission_id"><option value="">Aucune émission</option>{emissions.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}</select></label><button className="button">Publier la vidéo</button></form>}
    {tab==='article'&&<form action={createArticleAction} className="admin-form"><Field label="Titre de l’article" name="title" required placeholder="Le titre à publier"/><Field label="Résumé" name="excerpt" placeholder="Une courte présentation affichée sur le site"/><label>Contenu<textarea name="content" required placeholder="Texte de l’article"/></label><div className="admin-grid"><Field label="URL de l’image (optionnel)" name="cover_url" placeholder="https://…"/><label>Rubrique<select name="category_id"><option value="">Sans rubrique</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><button className="button">Publier l’article</button></form>}
    {tab==='emission'&&<form action={createEmissionAction} className="admin-form"><Field label="Nom de l’émission" name="title" required placeholder="Ex. Débat du soir"/><Field label="Description" name="description"/><div className="admin-grid"><Field label="URL de l’affiche (optionnel)" name="cover_url" placeholder="https://…"/><Field label="Horaire (optionnel)" name="schedule" placeholder="Tous les vendredis à 20 h"/></div><button className="button">Ajouter l’émission</button></form>}
    <p className="meta" style={{marginTop:24}}>Les publications sont immédiatement visibles et protégées par les droits administrateur Supabase.</p>
  </div></section>;
}
