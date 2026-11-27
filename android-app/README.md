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

## Architecture de sécurité
- L'application mobile est un client public : toute variable `EXPO_PUBLIC_*` est intégrée au binaire et visible par un utilisateur. La clé autorisée est uniquement la clé publique Supabase publishable/anon.
- Aucun secret serveur, clé `service_role`, mot de passe administrateur ou jeton privé ne doit être ajouté au dépôt ou au binaire.
- Les requêtes sont limitées aux contenus publiés et l'application ne propose aucune opération d'écriture sur Supabase.
- La vraie frontière de sécurité reste PostgreSQL/RLS et les privilèges du projet Supabase. Le client mobile ne peut pas rendre une table sûre si les politiques RLS sont incorrectes.
- Les favoris restent sur l'appareil. Aucun compte lecteur ni donnée personnelle n'est collecté dans cette première version.
- Les liens externes ouvrent YouTube ou le site dans l'application correspondante ; aucune page web arbitraire n'est exécutée dans une WebView.

## Contrôles avant une version publique
Depuis ce dossier :
```bash
npm install
npx expo install --fix
npm run typecheck
npx expo-doctor
npm audit --omit=dev
```
Ces contrôles doivent être exécutés et leurs éventuelles alertes corrigées avant les builds finaux. Une compilation réussie ne remplace pas un test sur appareils Android réels ni une vérification des règles RLS.
