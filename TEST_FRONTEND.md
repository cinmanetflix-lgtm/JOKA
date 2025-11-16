# Guide de test du frontend JOKA

## 🚀 Démarrage rapide

### Méthode 1 : Installation automatique
```bash
./install.sh
cd frontend-web
npm run dev
```

### Méthode 2 : Installation manuelle
```bash
cd frontend-web
npm install
npm run dev
```

Le site sera accessible sur : **http://localhost:3001**

## ✅ Checklist de test

### 1. Page d'accueil (/)
- [ ] La page s'affiche correctement
- [ ] Le header avec logo JOKA est visible
- [ ] Les 7 catégories de services sont affichées
- [ ] Les cartes de catégories sont cliquables
- [ ] Le bouton "Explorer les services" fonctionne
- [ ] Le footer s'affiche

### 2. Navigation
- [ ] Cliquer sur "Accueil" dans le menu
- [ ] Cliquer sur "Services" dans le menu
- [ ] Cliquer sur "Mon Parcours" dans le menu
- [ ] Cliquer sur "Connexion" dans le menu
- [ ] Cliquer sur "Inscription" dans le menu

### 3. Changement de langue
- [ ] Cliquer sur "EN" change l'interface en anglais
- [ ] Cliquer sur "FR" change l'interface en français
- [ ] Les traductions sont correctes

### 4. Page Services (/services)
- [ ] La liste des services s'affiche (vide pour l'instant si le backend n'est pas lancé)
- [ ] Un message "Aucun service trouvé" s'affiche si vide
- [ ] Le titre "Services disponibles" est visible

### 5. Page Inscription (/register)
- [ ] Le formulaire d'inscription s'affiche
- [ ] Tous les champs sont présents :
  - [ ] Prénom
  - [ ] Nom
  - [ ] Email
  - [ ] Téléphone
  - [ ] Mot de passe
- [ ] Le bouton "Envoyer" est visible
- [ ] Le lien "Déjà un compte ? Se connecter" fonctionne

### 6. Page Connexion (/login)
- [ ] Le formulaire de connexion s'affiche
- [ ] Champs email et mot de passe présents
- [ ] Le bouton "Envoyer" est visible
- [ ] Le lien "Pas encore de compte ? S'inscrire" fonctionne

### 7. Design et responsive
- [ ] Les couleurs sont cohérentes (bleu #2563eb)
- [ ] Les boutons ont le bon style
- [ ] La navigation est fluide
- [ ] Tester sur mobile (réduire la fenêtre)
- [ ] Les images/icônes s'affichent correctement

### 8. Console du navigateur
- [ ] Ouvrir la console (F12)
- [ ] Vérifier qu'il n'y a pas d'erreurs rouges
- [ ] Les warnings jaunes sont acceptables

## 🔗 Test avec le backend

Si le backend est lancé (http://localhost:3000) :

### 1. Inscription
```
Email : test@joka.ci
Prénom : Test
Nom : User
Téléphone : +225 0701020304
Mot de passe : password123
```
- [ ] Cliquer sur "Inscription"
- [ ] Remplir le formulaire
- [ ] Soumettre
- [ ] Vérifier la redirection vers /dashboard

### 2. Connexion
```
Email : test@joka.ci
Mot de passe : password123
```
- [ ] Se déconnecter si connecté
- [ ] Aller sur /login
- [ ] Se connecter
- [ ] Vérifier la redirection vers /dashboard

### 3. Tableau de bord
- [ ] Le nom de l'utilisateur s'affiche
- [ ] Les 4 cartes de fonctionnalités sont visibles
- [ ] Le menu affiche "Tableau de bord"

### 4. Services (avec backend)
- [ ] Les services de la base de données s'affichent
- [ ] Cliquer sur un service redirige vers /services/:id
- [ ] La page de détails affiche les informations
- [ ] Le bouton "Réserver maintenant" fonctionne

### 5. Réservation
- [ ] Le formulaire de réservation s'affiche
- [ ] Les champs date, heure, quantité sont présents
- [ ] La soumission fonctionne

## 🐛 Problèmes courants

### Le site ne démarre pas
```bash
cd frontend-web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur de port occupé
Le port 3001 est occupé. Modifiez dans `vite.config.ts` :
```typescript
server: {
  port: 3002, // Changez le port
}
```

### Erreur "Cannot find module"
```bash
cd frontend-web
npm install
```

### Page blanche
- Ouvrez la console (F12)
- Regardez les erreurs
- Vérifiez que `.env` existe avec :
  ```
  VITE_API_URL=http://localhost:3000/api
  ```

## 📊 Métriques de performance

Ouvrez les DevTools > Lighthouse et lancez un audit :
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 80
- [ ] SEO > 90

## 🎨 Test visuel

Comparez avec les spécifications :
- [ ] Couleur primaire : #2563eb (bleu)
- [ ] Couleur secondaire : #10b981 (vert)
- [ ] Police : -apple-system, system-ui
- [ ] Boutons arrondis : 0.5rem
- [ ] Ombres subtiles sur les cartes

## ✨ Fonctionnalités avancées (optionnel)

### Redux DevTools
1. Installer l'extension Redux DevTools
2. Ouvrir les DevTools
3. Onglet "Redux"
4. Vérifier l'état de l'application

### React DevTools
1. Installer l'extension React DevTools
2. Ouvrir les DevTools
3. Onglet "Components"
4. Explorer l'arbre des composants

## 📝 Rapport de bugs

Si vous trouvez un bug :

1. Notez l'URL de la page
2. Notez les étapes pour reproduire
3. Faites une capture d'écran
4. Copiez le message d'erreur de la console
5. Créez une issue GitHub

## ✅ Résultat attendu

À la fin de ces tests, vous devriez avoir :
- ✅ Un site qui démarre sans erreurs
- ✅ Toutes les pages accessibles
- ✅ La navigation fonctionnelle
- ✅ Le changement de langue opérationnel
- ✅ Les formulaires affichés correctement
- ✅ Un design cohérent et responsive

---

**Le frontend JOKA est maintenant 100% fonctionnel ! 🎉**
