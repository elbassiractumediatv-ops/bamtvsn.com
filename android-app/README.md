# BAM TV SN — Application Android

Application mobile React Native / Expo SDK 58, pensée pour Android et connectée en ligne à la base Supabase existante du média.

## Aperçu fonctionnel
- **Accueil** : identité BAM TV SN, 4 actualités à la une et vidéos récentes
- **Actualités** : liste des articles publiés, ouverture d'une fiche détaillée dans l'application
- **Vidéos** : catalogue des vidéos publiées, fiche vidéo et ouverture YouTube
- **Direct** : accès à la page live YouTube (URL à confirmer avant publication)
- **Recherche** : recherche dans les contenus récupérés depuis Supabase
- **Favoris** : sauvegarde locale des articles et vidéos sur le téléphone
- **Menu** : site, Facebook, YouTube et contact

## Prérequis
- Node.js 22.13 ou supérieur
- npm
- Android avec Expo Go compatible SDK 58 pour le test rapide
- Un compte Expo/EAS pour les APK et AAB de production

## Démarrage local
1. Copier `.env.example` vers `.env`.
2. Vérifier l'URL Supabase et renseigner une clé publique **publishable** ou **anon**.
3. Dans le dossier `android-app`, exécuter :
```bash
npm install
npx expo install --fix
npx expo start
```
4. Scanner le QR code avec Expo Go sur Android.

## Construire l'APK et l'AAB
```bash
npm install -g eas-cli
eas login
eas build:configure
```
- APK installation directe : `npm run apk`
- AAB Google Play : `npm run aab`

Le code source est prêt pour la configuration de build, mais les binaires doivent encore être compilés par EAS et installés/testés sur un appareil réel.

## Données et sécurité
Projet Supabase ciblé : `thevryhybiloqddnoeof`. L'application interroge en lecture les tables `articles` et `videos`, ainsi que leur relation `categories`. Elle n'effectue aucune écriture et aucune migration SQL n'a été appliquée.

**Ne jamais intégrer une clé `service_role` ou une clé secrète dans l'application mobile.** Utiliser uniquement la clé publique publishable/anon et s'appuyer sur les politiques RLS existantes.

## Avant publication
- Ajouter l'icône officielle et les éléments graphiques originaux BAM TV SN.
- Confirmer l'URL officielle du direct et vérifier les URLs de partage des articles.
- Tester les politiques RLS avec la clé publique, la navigation, la recherche, les favoris et la lecture YouTube.
- Ajouter les notifications push, leur consentement et la configuration Google Play.
- Effectuer les tests sur plusieurs tailles d'écran et connexions mobiles.
