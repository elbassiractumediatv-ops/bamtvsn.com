# Migration vers Hostinger — BAM TV SN

État : préparation privée, aucun déploiement autorisé à ce stade.

## Pré-requis et choix
- Dépôt privé : elbassiractumediatv-ops/bamtvsn.com.
- Supabase de production inchangé : https://thevryhybiloqddnoeof.supabase.co.
- Ancien site : https://bamtv-sn.netlify.app/ ; accès propriétaire à retrouver.
- Domaine envisagé : bamtvsn.com (propriété et disponibilité non confirmées).
- Si l'application originale est Node.js/Next.js, choisir Hostinger Business ou Cloud avec Web App Node.js. Ne pas choisir un constructeur de site. Version Node et commande de build à déterminer après récupération du package.json.
- Le dépôt contient l'inventaire technique, mais pas encore le code original exploitable. Ne pas importer dans Hostinger avant restauration et tests.

## Sauvegarde avant bascule
- Exporter schéma et données avec les outils de sauvegarde Supabase/CLI, chiffrer les exports, ne pas les committer dans GitHub.
- Sauvegarder les objets des buckets articles, media, publicites séparément (un dump SQL ne contient pas leurs octets).
- Préserver Auth, RLS, migrations, Edge Function bamtv-affiche et le secret Vault existant ; aucun redéploiement de cette fonction nécessaire pour un changement d'hébergeur.
- Vérifier les tâches externes (publication automatique, import YouTube), leurs URL et leurs variables. Elles ne sont pas toutes identifiées.
- Contrôler la restauration dans un environnement isolé.

## Préparation du code
Retrouver le projet Claude original ou télécharger un déploiement Netlify depuis son compte propriétaire. À défaut, reconstruire les pages et l'administration décrites dans inventaire-reprise.md. Ne pas affirmer que le code reconstruit est identique. Préserver les slugs, liens, médias, SEO, sécurité et droits administrateurs.

## Configuration Hostinger (après restauration)
1. hPanel > Websites > Create site > Web App Node.js si le framework le requiert.
2. Autoriser exclusivement le dépôt GitHub BAM TV SN. Ne pas lancer l'import/deploy tant que le contrôle d'accès privé n'est pas garanti : le déploiement peut rendre une URL temporaire publique.
3. Configurer les variables attendues par le code réel. L'URL Supabase ne change pas. La clé publishable/anon sert au client ; jamais de clé secret/service_role dans le navigateur ou GitHub. Si un serveur doit détenir un secret, le placer dans les variables serveur de Hostinger.
4. Tester d'abord localement. Si un aperçu distant est indispensable, le protéger par une authentification serveur vérifiée depuis une session non connectée ; noindex seul ne suffit pas.
5. Vérifier HTTPS, routes, articles, vidéos, rubriques, recherche, publicité et durée, direct, messages, administration et permissions. Tester les écritures uniquement sur environnement isolé. Vérifier le script de contrôle en lecture seule.
6. Quand prêt, configurer le Site URL Supabase (actuellement localhost:3000) et les redirections exactes requises par l'authentification, en conservant les accès indispensables pendant la transition.

## Condition impérative de publication unique
Ne pas publier un second site public tant que l'ancien site Netlify ne peut pas être désactivé ou redirigé. Récupérer le compte propriétaire ou solliciter Netlify avec preuve de propriété. Lorsque les accès sont rétablis, coordonner le retrait ou la redirection permanente de l'ancien site vers le domaine définitif, puis publier Hostinger et contrôler les URL. Un sous-domaine netlify.app n'est pas transférable par simple changement DNS chez Hostinger. Ne pas désactiver Supabase ni révoquer des clés pour tenter d'éteindre Netlify. Prévoir retour arrière, sauvegarde et vérification des liens.

## Documentation officielle
- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/how-to-migrate-a-node-js-application-to-hostinger/
- https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/

## État observé le 27/11/2026
15 articles, 81 vidéos, 15 catégories, 3 publicités, 1 administrateur, 1 article ancien. 9 tables publiques avec RLS activée. Inventaire des noms de politiques déjà consulté ; audit de leurs expressions et tests d'autorisation à effectuer. Aucune donnée copiée, supprimée ou modifiée pendant cette préparation.
