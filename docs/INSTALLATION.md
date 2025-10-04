# 🚀 Guide d'Installation et de Démarrage

## Installation Rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

## 📝 Scripts Disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Crée un build de production
- `npm run preview` - Prévisualise le build de production

## 🔧 Configuration Initiale

### Vérifier que tout fonctionne

1. **Ouvrir http://localhost:3000**
2. Vous devriez voir l'interface du planning
3. Tester le toggle entre CC et HM
4. Tester la navigation entre semaines
5. Tester l'export PNG

### En cas de problème

#### Erreur de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Port 3000 déjà utilisé
Modifier le port dans `vite.config.js` :
```javascript
server: {
  port: 3001, // Changez ici
}
```

#### Erreur de scraping
L'API serverless fonctionne uniquement en production (Vercel). En développement, vous verrez peut-être des erreurs CORS. C'est normal !

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer votre repository GitHub
4. Vercel détectera automatiquement Vite
5. Cliquer sur "Deploy"

### Méthode 2 : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

## 🎨 Personnalisation

### Changer les couleurs

Éditer `tailwind.config.js` :
```javascript
theme: {
  extend: {
    colors: {
      'cours': '#votrecouleur',
      // ...
    }
  }
}
```

### Modifier les formations

Éditer `src/utils/constants.js` :
```javascript
export const FORMATIONS = {
  CC: 'Votre Nom Formation 1',
  HM: 'Votre Nom Formation 2'
};
```

### Changer les URLs de scraping

Éditer `api/planning.js` :
```javascript
const FORMATION_URLS = {
  CC: 'votre-url-ici',
  HM: 'votre-url-ici'
};
```

## 📱 Test Mobile

### Sur le réseau local

1. Trouver votre IP locale :
   - Windows : `ipconfig`
   - Mac/Linux : `ifconfig`

2. Sur votre mobile, aller à :
   `http://VOTRE_IP:3000`

### Avec ngrok (tunnel public)

```bash
# Installer ngrok
npm i -g ngrok

# Créer un tunnel
ngrok http 3000
```

## ✅ Checklist Post-Installation

- [ ] npm install fonctionne sans erreur
- [ ] npm run dev démarre le serveur
- [ ] L'interface s'affiche correctement
- [ ] Le toggle CC/HM fonctionne
- [ ] La navigation entre semaines fonctionne
- [ ] L'export PNG fonctionne
- [ ] Responsive mobile OK
- [ ] Pas d'erreur dans la console

## 🆘 Support

En cas de problème :

1. Vérifier que Node.js >= 18 est installé
2. Vérifier que tous les fichiers sont présents
3. Consulter les logs dans la console
4. Consulter le README.md pour plus d'infos

## 🎓 Prochaines Étapes

Une fois l'installation terminée :

1. **Tester en local** - Vérifier que tout fonctionne
2. **Personnaliser** - Adapter les couleurs/textes à vos besoins
3. **Déployer** - Mettre en production sur Vercel
4. **Partager** - Donner l'URL aux étudiants !

---

Bon développement ! 🚀

