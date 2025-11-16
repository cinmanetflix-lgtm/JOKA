# JOKA Platform 🌍

**Plateforme de découverte et réservation de services locaux en Côte d'Ivoire**

JOKA est une application mobile (iOS/Android) et web qui facilite la découverte, la réservation et la gestion de services locaux divers : restauration, hébergement, loisirs, bien-être, transport, événements et commerces.

## 🎯 Fonctionnalités principales

### Pour les utilisateurs
- ✅ Authentification multi-canaux (email, téléphone, réseaux sociaux)
- 🔍 Recherche avancée avec filtres intelligents
- 📍 Géolocalisation et carte interactive
- 💳 Paiements sécurisés (Mobile Money + cartes bancaires)
- 🎫 Tickets numériques avec QR code
- 🗺️ Module "Mon Parcours" personnalisé avec IA
- 🚗 Location de voitures intégrée
- 📱 Partage social (WhatsApp, liens directs)

### Pour les partenaires
- 📊 Tableau de bord complet
- 📦 Gestion d'inventaire
- 📅 Calendrier et tarification dynamique
- 🚚 Option de livraison
- 📈 Statistiques et analytics
- 📢 Campagnes publicitaires

### Pour l'administrateur
- 🔐 Interface sécurisée
- 👥 Gestion des utilisateurs et partenaires
- ✅ Validation des inscriptions
- 📊 Rapports et analyses globales
- 🎯 Supervision du module publicitaire

## 🏗️ Architecture technique

### Stack technologique
- **Frontend Web**: React 18+ avec TypeScript
- **Mobile**: Flutter 3.x (iOS/Android)
- **Backend**: Node.js avec NestJS
- **Base de données**: PostgreSQL 14+ avec PostGIS
- **Cache**: Redis
- **API**: REST + GraphQL
- **Stockage**: AWS S3 / Google Cloud Storage
- **Paiement**: Stripe + Mobile Money (Orange, MTN, Moov, Wave)
- **Cartes**: Google Maps Platform / Mapbox
- **Sécurité**: JWT, AES-256, conformité RGPD

### Structure du projet

```
joka-platform/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Authentification
│   │   ├── users/       # Gestion utilisateurs
│   │   ├── services/    # Services (restaurants, hôtels, etc.)
│   │   ├── bookings/    # Réservations
│   │   ├── payments/    # Paiements
│   │   ├── parcours/    # Module Mon Parcours
│   │   ├── partners/    # Gestion partenaires
│   │   ├── admin/       # Interface admin
│   │   ├── advertising/ # Module publicité
│   │   └── common/      # Utilitaires communs
│   └── Dockerfile
├── frontend-web/         # Application web React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   ├── store/       # State management (Redux/Zustand)
│   │   └── utils/       # Utilitaires
│   └── Dockerfile
├── mobile/              # Application Flutter
│   ├── lib/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── pubspec.yaml
├── shared/              # Types et utilitaires partagés
│   └── types/
└── docker-compose.yml   # Configuration Docker
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- Docker et Docker Compose
- Flutter 3.x (pour le mobile)
- PostgreSQL 14+

### Installation rapide avec Docker

```bash
# Cloner le dépôt
git clone <repository-url>
cd joka-platform

# Installer les dépendances
npm run install:all

# Démarrer tous les services avec Docker
npm run dev
```

Les services seront disponibles sur :
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:3001
- **Adminer (DB UI)**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Installation manuelle (sans Docker)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend Web (nouveau terminal)
cd frontend-web
npm install
npm start

# Mobile (nouveau terminal)
cd mobile
flutter pub get
flutter run
```

### Variables d'environnement

Créer un fichier `.env` à la racine de chaque service :

**backend/.env**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=joka_user
DATABASE_PASSWORD=joka_password
DATABASE_NAME=joka_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

GOOGLE_MAPS_API_KEY=your-google-maps-key

AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=eu-west-1
AWS_S3_BUCKET=joka-uploads

# Mobile Money
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...
```

**frontend-web/.env**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📱 Mobile Money - Intégrations

L'application supporte les principaux opérateurs de Mobile Money en Côte d'Ivoire :

- **Orange Money** (CI Telecom)
- **MTN Mobile Money**
- **Moov Money**
- **Wave**

## 🔒 Sécurité

- HTTPS obligatoire en production
- Authentification JWT avec refresh tokens
- Chiffrement AES-256 pour les données sensibles
- Conformité RGPD
- Protection PCI-DSS pour les paiements
- 2FA pour l'administrateur
- Rate limiting sur les APIs
- Validation et sanitization des inputs

## 🧪 Tests

```bash
# Tests backend
cd backend
npm run test
npm run test:e2e
npm run test:cov

# Tests frontend
cd frontend-web
npm run test
npm run test:coverage
```

## 📚 Documentation API

Une fois le backend démarré, la documentation Swagger est disponible sur :
- http://localhost:3000/api/docs

## 🌍 Support multilingue

L'application supporte :
- 🇫🇷 Français
- 🇬🇧 Anglais
- Plus de langues locales à venir

## 💰 Devises supportées

- XOF (Franc CFA)
- EUR (Euro)
- USD (Dollar US)

## 🎨 Design et accessibilité

- Interface claire et intuitive
- Navigation accessible (boutons larges, contrastes forts)
- Textes explicites sans icônes seules
- Support des lecteurs d'écran
- Mode sombre/clair

## 📦 Déploiement

### Backend (API)
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Web
```bash
cd frontend-web
npm run build
# Déployer le dossier build/ sur votre hébergeur
```

### Mobile
```bash
cd mobile
flutter build apk --release  # Android
flutter build ios --release  # iOS
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE)

## 👥 Équipe

- Chef de projet
- Lead Dev Frontend
- Lead Dev Backend
- UI/UX Designer
- QA Engineer
- DevOps Engineer
- Marketing & Communication
- Support Client

## 📞 Support

Pour toute question ou assistance :
- Email: support@joka.ci
- Documentation: https://docs.joka.ci
- Issues: https://github.com/joka-platform/issues

---

**Fait avec ❤️ pour la Côte d'Ivoire** 🇨🇮
