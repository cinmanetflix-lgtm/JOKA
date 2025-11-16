# Guide de démarrage JOKA Platform

Ce guide vous aide à démarrer rapidement avec la plateforme JOKA.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ et npm
- **Docker** et Docker Compose
- **PostgreSQL** 14+ (si vous n'utilisez pas Docker)
- **Flutter** 3.x (pour l'application mobile)
- **Git**

## 🚀 Installation rapide (avec Docker)

La méthode la plus simple pour démarrer est d'utiliser Docker :

```bash
# 1. Cloner le dépôt
git clone <repository-url>
cd Local-connect

# 2. Créer les fichiers .env
cp backend/.env.example backend/.env
cp frontend-web/.env.example frontend-web/.env

# 3. Démarrer tous les services
docker-compose up -d
```

Les services seront disponibles sur :
- **Backend API** : http://localhost:3000
- **Documentation Swagger** : http://localhost:3000/api/docs
- **Frontend Web** : http://localhost:3001
- **Base de données PostgreSQL** : localhost:5432
- **Adminer (UI base de données)** : http://localhost:8080

## 📱 Démarrage manuel (sans Docker)

### Backend (API)

```bash
cd backend

# Installer les dépendances
npm install

# Copier et configurer .env
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer le serveur de développement
npm run start:dev
```

### Frontend Web

```bash
cd frontend-web

# Installer les dépendances
npm install

# Copier et configurer .env
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer le serveur de développement
npm start
```

### Mobile (Flutter)

```bash
cd mobile

# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

## 🔑 Configuration des clés API

### 1. Stripe (Paiements par carte)

1. Créez un compte sur [Stripe](https://stripe.com)
2. Récupérez vos clés API dans le Dashboard
3. Ajoutez-les dans `backend/.env` et `frontend-web/.env`

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Google Maps

1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activez les APIs : Maps JavaScript API, Places API, Directions API
3. Créez une clé API
4. Ajoutez-la dans les fichiers .env

```env
GOOGLE_MAPS_API_KEY=AIza...
```

### 3. Mobile Money

Pour intégrer Mobile Money, vous devez obtenir des clés API auprès de chaque opérateur :

#### Orange Money
- Site : [Orange Developer](https://developer.orange.com)
- Ajoutez vos clés dans `backend/.env`

#### MTN Mobile Money
- Site : [MTN MoMo API](https://momodeveloper.mtn.com)
- Ajoutez vos clés dans `backend/.env`

#### Moov Money & Wave
- Contactez les opérateurs pour les clés API
- Ajoutez-les dans `backend/.env`

## 🗄️ Base de données

### Avec Docker

La base de données PostgreSQL est automatiquement créée avec Docker.

### Sans Docker

```bash
# Créer la base de données
createdb joka_db

# Les migrations se font automatiquement au démarrage du backend
```

## 🧪 Tester l'application

### 1. Créer un compte utilisateur

```bash
# Via l'interface web
http://localhost:3001/register

# Ou via l'API directement
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Explorer l'API avec Swagger

Ouvrez http://localhost:3000/api/docs pour voir tous les endpoints disponibles et les tester directement.

### 3. Créer un service (en tant que partenaire)

1. Créez un compte avec le rôle "partner"
2. Connectez-vous
3. Utilisez l'endpoint `/api/services` pour créer un service

## 📚 Structure du projet

```
joka-platform/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Authentification
│   │   ├── users/       # Utilisateurs
│   │   ├── services/    # Services
│   │   ├── bookings/    # Réservations
│   │   ├── payments/    # Paiements
│   │   ├── parcours/    # Parcours touristiques
│   │   ├── partners/    # Gestion partenaires
│   │   ├── admin/       # Administration
│   │   ├── advertising/ # Publicité
│   │   └── common/      # Utilitaires
│   └── Dockerfile
├── frontend-web/         # Application React
│   ├── src/
│   │   ├── components/  # Composants
│   │   ├── pages/       # Pages
│   │   ├── services/    # Services API
│   │   ├── store/       # Redux store
│   │   └── i18n/        # Traductions
│   └── Dockerfile
├── mobile/              # Application Flutter
│   └── lib/
│       └── main.dart
├── docker-compose.yml   # Configuration Docker
└── README.md           # Documentation
```

## 🌐 Fonctionnalités principales

### Pour les utilisateurs
✅ Inscription/Connexion (email, téléphone)
✅ Recherche de services avec filtres
✅ Réservation en 3 étapes
✅ Paiement Mobile Money & cartes bancaires
✅ Tickets QR code + PDF
✅ Module "Mon Parcours" personnalisé

### Pour les partenaires
✅ Tableau de bord complet
✅ Gestion des services et inventaire
✅ Calendrier et tarification
✅ Statistiques en temps réel
✅ Campagnes publicitaires

### Pour l'administrateur
✅ Gestion utilisateurs/partenaires
✅ Validation des inscriptions
✅ Supervision globale
✅ Analytics et rapports

## 🔧 Développement

### Backend

```bash
# Lancer en mode watch
npm run start:dev

# Build pour production
npm run build

# Lancer les tests
npm run test

# Lancer les tests e2e
npm run test:e2e
```

### Frontend

```bash
# Lancer en mode développement
npm start

# Build pour production
npm run build

# Lancer les tests
npm test
```

### Mobile

```bash
# Lancer sur iOS
flutter run -d ios

# Lancer sur Android
flutter run -d android

# Build pour production
flutter build apk --release
flutter build ios --release
```

## 🐛 Dépannage

### Problème : Le backend ne démarre pas

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Vérifier les logs
docker-compose logs backend

# Redémarrer les services
docker-compose restart
```

### Problème : Erreur de connexion à la base de données

Vérifiez les variables d'environnement dans `backend/.env` :
```env
DATABASE_HOST=postgres  # ou localhost si sans Docker
DATABASE_PORT=5432
DATABASE_USER=joka_user
DATABASE_PASSWORD=joka_password
DATABASE_NAME=joka_db
```

### Problème : Le frontend ne se connecte pas au backend

Vérifiez `frontend-web/.env` :
```env
VITE_API_URL=http://localhost:3000/api
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@joka.ci
- 📖 Documentation : Consultez le README.md
- 🐛 Issues : https://github.com/joka-platform/issues

## 🎉 Prochaines étapes

1. ✅ Explorez l'API avec Swagger
2. ✅ Créez votre premier service
3. ✅ Testez une réservation
4. ✅ Configurez les paiements Mobile Money
5. ✅ Créez un parcours personnalisé
6. ✅ Lancez une campagne publicitaire

---

**Bon développement ! 🚀**
