# 🚀 Guide de Déploiement

## Déploiement sur Vercel (Recommandé)

### Prérequis
- Compte GitHub
- Compte Vercel (gratuit)
- Code poussé sur GitHub

### Étapes Détaillées

#### 1. Préparer le Repository GitHub

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit - Planning BPJEPS AF"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/VOTRE_USERNAME/planning-bpjeps.git
git branch -M main
git push -u origin main
```

#### 2. Connecter à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Sign Up" ou "Login"
3. Se connecter avec GitHub
4. Autoriser Vercel à accéder à vos repositories

#### 3. Importer le Projet

1. Sur le dashboard Vercel, cliquer "New Project"
2. Sélectionner votre repository `planning-bpjeps`
3. Vercel détecte automatiquement :
   - Framework Preset : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Install Command : `npm install`

4. **Important** : Vérifier dans "Advanced" :
   - Node.js Version : **18.x** ou supérieur
   - Root Directory : `./` (racine)

5. Cliquer sur "**Deploy**"

#### 4. Configuration Post-Déploiement

Une fois déployé, votre app sera accessible sur :
```
https://votre-projet.vercel.app
```

### Configuration du Domaine Personnalisé (Optionnel)

1. Dans Vercel, aller dans "Settings" > "Domains"
2. Ajouter votre domaine personnalisé
3. Suivre les instructions pour configurer les DNS

---

## Déploiement sur Netlify (Alternative)

### Via Interface Web

1. Aller sur [netlify.com](https://netlify.com)
2. "Add new site" > "Import an existing project"
3. Connecter GitHub et sélectionner le repo
4. Configuration :
   - Build command : `npm run build`
   - Publish directory : `dist`
   - Node version : 18

### Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialiser
netlify init

# Déployer
netlify deploy --prod
```

⚠️ **Note** : Pour les serverless functions sur Netlify, il faut adapter le dossier `api/` en `netlify/functions/`

---

## Vérification du Déploiement

### Checklist

- [ ] L'application se charge sans erreur
- [ ] Le toggle CC/HM fonctionne
- [ ] La navigation entre semaines fonctionne
- [ ] L'API `/api/planning` répond correctement
- [ ] L'export PNG fonctionne
- [ ] Le cache fonctionne (vérifier Network tab)
- [ ] Responsive mobile OK
- [ ] Lighthouse Score > 90

### Tester l'API

```bash
# Remplacer YOUR-APP par votre URL
curl "https://YOUR-APP.vercel.app/api/planning?formation=CC&semaine=202540"
```

Vous devriez recevoir un JSON avec les événements.

---

## Déploiement Continu (CI/CD)

Avec Vercel/Netlify, le déploiement automatique est activé par défaut :

1. Chaque `git push` sur `main` → Déploiement en production
2. Chaque PR → Preview deployment automatique
3. Rollback en un clic si problème

### Désactiver le déploiement auto (si besoin)

Dans Vercel :
- Settings > Git > Production Branch
- Décocher "Automatically deploy to production"

---

## Variables d'Environnement

Si vous ajoutez des variables d'environnement :

### Dans Vercel
1. Settings > Environment Variables
2. Ajouter les variables (ex: `VITE_API_KEY`)
3. Redéployer

### Dans le code
```javascript
// Accéder aux variables
const apiKey = import.meta.env.VITE_API_KEY;
```

---

## Monitoring & Analytics

### Vercel Analytics (Gratuit)

1. Dans Vercel Dashboard
2. Analytics > Enable
3. Installer le package :
```bash
npm install @vercel/analytics
```

4. Dans `src/main.jsx` :
```javascript
import { inject } from '@vercel/analytics';
inject();
```

### Lighthouse CI

Pour automatiser les tests performance :

```bash
npm install -g @lhci/cli

# Créer lighthouserc.js et configurer
lhci autorun
```

---

## Optimisations Pré-Déploiement

### 1. Analyser le Bundle

```bash
npm run build
npx vite-bundle-visualizer
```

### 2. Optimiser les Images

- Utiliser WebP pour les images
- Compresser avec [TinyPNG](https://tinypng.com)
- Utiliser des icônes SVG

### 3. Minification

Vite le fait automatiquement, mais vérifier :
```javascript
// vite.config.js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Supprimer console.log en prod
    }
  }
}
```

---

## Rollback en Cas de Problème

### Vercel

1. Aller dans "Deployments"
2. Trouver le déploiement précédent qui fonctionnait
3. Cliquer sur les 3 points > "Promote to Production"

### Git

```bash
# Revenir au commit précédent
git revert HEAD
git push origin main
```

---

## Maintenance

### Mises à Jour des Dépendances

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour (attention breaking changes)
npm update

# Ou utiliser npm-check-updates
npx npm-check-updates -u
npm install
```

### Surveillance

- Configurer des alertes (Uptime Robot, Pingdom)
- Monitorer les logs Vercel/Netlify
- Surveiller les performances avec Lighthouse

---

## 🆘 Problèmes Courants

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### API qui ne répond pas
- Vérifier que `/api` est bien inclus dans le déploiement
- Vérifier les logs dans Vercel Functions
- Tester l'endpoint directement

### Build Failed
- Vérifier la version Node.js (18+)
- Vérifier les erreurs de lint
- Vérifier que toutes les dépendances sont dans package.json

---

## 📊 Performance en Production

### Objectifs
- Time to First Byte (TTFB) : < 200ms
- First Contentful Paint : < 1s
- Time to Interactive : < 2s
- Lighthouse Score : > 90

### Optimisations Vercel
- Edge Network automatique
- Compression Brotli/Gzip
- HTTP/2 et HTTP/3
- Caching automatique

---

## 🎉 Déploiement Réussi !

Votre application est maintenant en ligne ! 

**Prochaines étapes** :
1. Partager l'URL avec les utilisateurs
2. Collecter les retours
3. Itérer et améliorer
4. Monitorer les performances

**URL de production** : `https://votre-app.vercel.app`

---

Bon déploiement ! 🚀

