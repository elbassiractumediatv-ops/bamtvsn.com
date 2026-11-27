# BAM TV SN — Application Android

Application mobile React Native / Expo connectée en lecture au projet Supabase existant de BAM TV SN.

## Configuration
1. Installer Node.js LTS et Expo CLI via `npx expo`.
2. Copier `.env.example` vers `.env`.
3. Renseigner `EXPO_PUBLIC_SUPABASE_URL` et la clé **publishable/anon uniquement**. Ne jamais mettre une clé `service_role` dans l'application.
4. Installer les dépendances : `npm install`.
5. Lancer : `npx expo start`.

## Builds Android
- APK de test : `eas build --platform android --profile preview`
- AAB Google Play : `eas build --platform android --profile production`

Les builds EAS nécessitent un compte Expo et la configuration du projet EAS. L'identifiant Android déclaré est `sn.bamtv.mobile`.

## Données utilisées
- `public.articles` (status = published)
- `public.videos` (status = published, lecture via YouTube)
- `public.categories`

L'application ne crée ni ne modifie de données dans Supabase. Les accès sont en lecture seule côté application et soumis aux politiques RLS existantes.
