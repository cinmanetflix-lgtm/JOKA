# Guide de démarrage rapide JOKA

## Installation en 3 étapes

### 1. Installation automatique
```bash
chmod +x install.sh
./install.sh
```

### 2. Configuration des clés API

Éditez `backend/.env` et `frontend-web/.env` avec vos clés :
- Stripe (pour les paiements)
- Google Maps (pour la géolocalisation)
- Mobile Money (optionnel pour la v1)

### 3. Lancement

**Avec Docker (recommandé) :**
```bash
docker-compose up -d
```

**Sans Docker :**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend-web
npm run dev
```

## Accès aux services

Une fois lancé, accédez à :

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000
- **Documentation API** : http://localhost:3000/api/docs
- **Base de données (Adminer)** : http://localhost:8080

## Créer votre premier compte

1. Ouvrez http://localhost:3001
2. Cliquez sur "Inscription"
3. Remplissez le formulaire
4. Connectez-vous !

## Tester l'API

### Via Swagger
Ouvrez http://localhost:3000/api/docs et testez directement les endpoints.

### Via curl
```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@joka.ci",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@joka.ci",
    "password": "password123"
  }'
```

## Problèmes courants

### Le frontend ne démarre pas
```bash
cd frontend-web
rm -rf node_modules
npm install
npm run dev
```

### Le backend ne se connecte pas à la base de données
Vérifiez que PostgreSQL est lancé :
```bash
docker-compose ps
```

Si nécessaire, relancez :
```bash
docker-compose down
docker-compose up -d
```

### Port déjà utilisé
Changez le port dans `docker-compose.yml` ou `vite.config.ts`

## Fonctionnalités à tester

1. ✅ Inscription/Connexion
2. ✅ Parcourir les services
3. ✅ Créer un service (en tant que partenaire)
4. ✅ Faire une réservation
5. ✅ Voir le tableau de bord
6. ✅ Créer un parcours

## Support

- 📖 Documentation complète : `README.md`
- 🚀 Guide détaillé : `GETTING_STARTED.md`
- 🐛 Problèmes : https://github.com/cinmanetflix-lgtm/JOKA/issues

---

**Bon développement ! 🚀**
