# BAM TV SN

Site éditorial Next.js 16, connecté aux contenus existants de Supabase.

## Démarrer

1. Copier `.env.example` vers `.env.local`.
2. Renseigner `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` avec la clé publique/publishable du projet Supabase déjà associé à BAM TV SN.
3. Installer et lancer : `npm install`, puis `npm run dev`.

Les clés service-role ne sont jamais nécessaires et ne doivent pas être placées dans les variables `NEXT_PUBLIC_*`.

## Administration

Ouvrir `/admin` et se connecter avec le compte dont l’UUID figure dans `public.admins`. Les règles RLS Supabase n’autorisent que cet administrateur à publier. Les vidéos et articles sont publiés immédiatement; les émissions sont ajoutées actives.

## Netlify

Le projet se construit avec `npm run build`. Configurer l’environnement Netlify avec l’URL Supabase et la clé publishable sur les contextes Builds et Functions. Le domaine de production reste `bamtvsn.com`.
