# BAM TV SN — Application Android

Application mobile React Native / Expo SDK 58, en ligne, connectée en lecture à la base Supabase du site.

## Écrans de cette première version
- Accueil : 4 articles à la une et dernières vidéos
- Actualités : liste des articles publiés
- Vidéos : liste des vidéos YouTube publiées
- Direct : accès au live YouTube
- Menu : site officiel, Facebook, YouTube et contact

## Démarrage
Prérequis : Node.js 22.13+.

1. Copier `.env.example` en `.env`.
2. Renseigner la clé publique Supabase publishable/anon.
3. Exécuter :
```bash
npm install
npx expo install --fix
npx expo start
```
4. Scanner le QR code avec Expo Go compatible SDK 58 ou lancer un émulateur Android.

## APK et AAB
Installer EAS CLI et se connecter :
```bash
npm install -g eas-cli
eas login
eas build:configure
```
APK installation directe : `npm run apk`
AAB Google Play : `npm run aab`

Le binaire final doit encore être compilé et testé. Les builds EAS nécessitent un compte Expo.

## Supabase / sécurité
Projet lié : `thevryhybiloqddnoeof`. Lecture seule des tables `articles` et `videos`, avec la relation `categories`. Aucune migration ou écriture SQL n'a été faite. N'utiliser que la clé publique publishable/anon côté mobile ; jamais une clé `service_role`.

## Points à valider avant publication
- URL exacte de la page article (actuellement lien vers /article/slug).
- URL officielle du direct BAM TV SN.
- Logo original en icône Android et écran de démarrage.
- Tests réels sur plusieurs téléphones, RLS, performances, liens et lecture vidéo.
- Notifications push et configuration Play Console.
