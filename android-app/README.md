# BAM TV SN — Application mobile

Application React Native / Expo connectée en lecture seule au projet Supabase existant du média.

## Fonctionnalités présentes dans le code
- Accueil avec article à la une, actualités récentes et vidéos récentes
- Liste des actualités et détail d'un article
- Catalogue vidéo, détail et ouverture sur YouTube
- Accès à la page live de la chaîne YouTube
- Recherche des articles et vidéos
- Favoris enregistrés localement sur le téléphone
- Navigation par onglets et actualisation par glissement

## Configuration
1. Installer Node.js 22.13 ou supérieur.
2. Copier le fichier .env.example vers .env.
3. Renseigner EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY avec les valeurs publiques du projet BAM TV SN (thevryhybiloqddnoeof). Ne jamais utiliser service_role.
4. Dans ce dossier, exécuter npm install, npx expo install --fix, npx expo-doctor puis npx expo start.

## Builds Android
- APK de test : npm run apk
- AAB Google Play : npm run aab

Un compte Expo/EAS connecté est nécessaire pour lancer les builds cloud. Le build doit ensuite être installé et testé sur un vrai téléphone.

## Sécurité et limites
Les tables articles et videos sont lues avec le filtre status = published. La clé embarquée doit être une clé publique anon/publishable et l'accès repose sur les politiques RLS Supabase. Aucun changement SQL n'est effectué.
Les notifications push ne sont pas encore intégrées et nécessitent une configuration Expo ainsi qu'un service d'envoi. L'URL du direct ouvre la page live YouTube mais ne prouve pas qu'une diffusion est actuellement active. L'icône officielle doit encore être fournie. Les variables Supabase et les parcours doivent être testés sur Android avant publication.
