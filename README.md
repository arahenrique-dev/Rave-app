# Rave-app
Application mobile React Native (Expo) permettant d’enregistrer, importer et transformer des fichiers audio via un serveur externe (Flask ou API locale).

## Fonctionnalités principales

### 1. Connexion au serveur
- Configuration de l’adresse IP et du port du serveur
- Test de connexion avec retour d’état
- Persistance des paramètres serveur (Redux Persist)

### 2. Enregistrement audio
- Enregistrement direct depuis le micro du téléphone
- Sauvegarde locale des fichiers audio
- Liste des enregistrements disponibles
- Lecture et suppression des fichiers

### 3. Traitement audio (Rave / AI models)
- Sélection d’un modèle de traitement côté serveur
- Upload des fichiers audio vers le serveur
- Téléchargement du fichier audio traité
- Lecture du résultat transformé

### 4. Sélection de source audio
L’utilisateur peut choisir la source audio à traiter :
- Audio par défaut (fichier local intégré dans l’application) (bugs)
- Fichiers importés depuis le téléphone (bugs)
- Enregistrements réalisés dans l’application


## Installation

### 1. Cloner le projet
```bash
git clone <repo-url>
cd rave-app
```

### 2. Installer les dépendances et Expo CLI (si nécessaire)
```
npm install
npm install -g expo-cli
```

### 4. Lancer l’application
```
npx expo start
```

### 5. Mise en place du serveur
Suivre les instructions dans le repository suivant : https://github.com/gnvIRCAM/RAVE-ONNX-Server

## Lancer sur téléphone
- Installer Expo Go sur iOS ou Android
- Scanner le QR code affiché dans le terminal ou navigateur Expo
- L’application se lance automatiquement

