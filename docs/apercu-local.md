# Aperçu de reprise — non publiable

Une reconstruction initiale, pas une copie du code original. Le serveur écoute exclusivement sur 127.0.0.1:3000. Ne pas le déployer sur Hostinger à ce stade. Un proxy pourrait exposer un service loopback : ne pas configurer de proxy public.

## Démarrage
Node 22 ou supérieur. Copier .env.example vers .env.local et renseigner uniquement la clé publique Supabase du projet existant. Exécuter npm run check, puis npm run dev. Aucun npm install nécessaire. Le serveur utilise des GET et ne modifie pas les données Supabase.

## Ce qui est inclus
Accueil, articles et détail par slug, catégories, vidéos avec liens YouTube, émissions, recherche locale (limitée aux 100 articles récents), titres des publicités actives. Les contenus articles sont affichés en texte échappé, sans interpréter le HTML. Design provisoire, pas une reproduction fidèle.

## Restant à restaurer
Logo et charte exacte, affichage riche des articles, carrousel de publicités avec durée, lecteur vidéo intégré, galerie, pages légales, contacts, administration complète avec Auth/RLS, SEO, pagination, automatisations hors Supabase et tests de bout en bout. Aucune écriture ni connexion admin ne doit être activée avant audit des permissions. Ne pas modifier la fonction bamtv-affiche existante. Aucun changement DNS, aucune publication.

Le code original et un abonnement Hostinger compatible restent à confirmer.