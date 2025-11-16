# JOKA Mobile App (Flutter)

Application mobile JOKA développée avec Flutter pour iOS et Android.

## Fonctionnalités

- Authentification utilisateur
- Découverte et recherche de services
- Réservation et paiement
- Tickets numériques avec QR code
- Module "Mon Parcours" personnalisé
- Géolocalisation en temps réel
- Support multilingue (FR/EN)
- Paiements Mobile Money intégrés

## Prérequis

- Flutter SDK 3.x
- Dart SDK 3.x
- Android Studio / Xcode
- Émulateur Android / Simulateur iOS

## Installation

```bash
# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run

# Build pour production
flutter build apk --release  # Android
flutter build ios --release  # iOS
```

## Structure

```
mobile/
├── lib/
│   ├── main.dart
│   ├── screens/       # Écrans de l'application
│   ├── widgets/       # Composants réutilisables
│   ├── models/        # Modèles de données
│   ├── services/      # Services API
│   └── utils/         # Utilitaires
├── assets/
│   ├── images/
│   └── icons/
└── pubspec.yaml
```

## Configuration

Créer un fichier `.env` avec les variables suivantes :

```
API_URL=https://api.joka.ci
GOOGLE_MAPS_API_KEY=your-key
STRIPE_PUBLISHABLE_KEY=your-key
```

## Paiements Mobile Money

L'application supporte :
- Orange Money
- MTN Mobile Money
- Moov Money
- Wave

## Documentation

Pour plus d'informations, consultez la [documentation complète](../README.md).
