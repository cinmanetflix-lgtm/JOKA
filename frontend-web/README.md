# JOKA Frontend Web

Application web React pour la plateforme JOKA.

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

## Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build pour production
- `npm run preview` - Preview du build de production
- `npm run lint` - Linter le code

## Configuration

Créez un fichier `.env` à la racine avec :

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=votre-clé
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Technologies

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router v6
- i18next
- Axios
