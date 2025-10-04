# 📅 Planning BPJEPS AF

Application web moderne de visualisation d'emploi du temps pour les formations BPJEPS AF (Activités de la Forme).

## ✨ Fonctionnalités

- 📱 **Mobile First** - Interface responsive optimisée pour mobile
- 🎨 **Design Moderne** - Inspiré de Google Agenda et Notion
- ⚡ **Performance** - Chargement ultra-rapide avec système de cache multi-niveaux
- 🔄 **Navigation Intuitive** - Swipe gestures sur mobile pour changer de semaine
- 💾 **Export PNG** - Téléchargez votre planning en haute qualité
- 🎯 **Deux Formations** - Toggle entre CC et HM
- 🔔 **Temps Réel** - Données synchronisées depuis la source officielle

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd planning-bpjeps
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

4. **Build pour production**
```bash
npm run build
```

## 📦 Déploiement

### Vercel (Recommandé)

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Importer le projet depuis GitHub
3. Configurer les settings selon `vercel.json`
4. Déployer !

### Netlify

1. Créer un compte sur [netlify.com](https://netlify.com)
2. Glisser-déposer le dossier `dist` après build
3. Les serverless functions seront automatiquement détectées

## 🏗️ Architecture

```
├── api/                    # Serverless Functions
│   └── planning.js        # API de scraping et parsing
├── src/
│   ├── components/        # Composants React
│   │   ├── PlanningGrid.jsx
│   │   ├── EventCard.jsx
│   │   ├── WeekNavigator.jsx
│   │   ├── FormationToggle.jsx
│   │   ├── ExportButton.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorState.jsx
│   ├── hooks/            # Hooks personnalisés
│   │   ├── usePlanning.js
│   │   ├── useWeekCalculator.js
│   │   └── useExport.js
│   ├── utils/            # Utilitaires
│   │   ├── dateHelpers.js
│   │   ├── cache.js
│   │   └── constants.js
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

## 🛠️ Stack Technique

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **Export**: html2canvas
- **Backend**: Vercel Serverless Functions
- **Parsing**: Cheerio
- **Cache**: localStorage + in-memory

## 🎨 Personnalisation

### Couleurs des types de cours

Modifiez `src/utils/constants.js` :

```javascript
export const EVENT_TYPES = {
  cours: { bg: 'bg-blue-100', border: 'border-blue-400', ... },
  tp: { bg: 'bg-green-100', border: 'border-green-400', ... },
  // ...
};
```

### Plages horaires

Modifiez `TIME_SLOTS` dans `src/utils/constants.js`

### Durée du cache

Modifiez `CACHE_DURATION` dans :
- `src/utils/constants.js` (cache localStorage)
- `api/planning.js` (cache serveur)

## 📱 Responsive

- **Mobile** (< 768px) : Vue liste par jour avec swipe
- **Tablette** (768px - 1024px) : Grille compacte
- **Desktop** (> 1024px) : Grille complète avec tous les détails

## 🔒 Sécurité & Données

- ✅ Aucune collecte de données personnelles
- ✅ Pas de cookies tiers
- ✅ localStorage uniquement pour préférences UI
- ✅ Rate limiting côté serveur
- ✅ Gestion propre des erreurs

## 🐛 Debug

### Problèmes de scraping

L'API serverless utilise des headers personnalisés pour éviter le blocage. Si vous rencontrez des erreurs 403 :

1. Vérifier que `api/planning.js` est bien déployé
2. Tester l'endpoint : `/api/planning?formation=CC&semaine=202540`
3. Vérifier les logs Vercel

### Cache obsolète

Pour forcer un rafraîchissement :
- Cliquer sur le bouton "Rafraîchir"
- Ou nettoyer le localStorage dans DevTools

## 📊 Performance

Objectifs (selon Lighthouse) :
- Performance : > 90
- Accessibilité : > 90
- Best Practices : > 90
- SEO : > 90

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

Créé avec ❤️ pour les étudiants BPJEPS AF

## 🙏 Remerciements

- JS Formation pour les données source
- La communauté React et Tailwind CSS

## 🔍 Logs Détaillés pour Vercel

### API avec Logs Ultra-Détaillés

L'API serverless inclut maintenant des logs très détaillés visibles dans les **logs Vercel** :

**Endpoint** : `/api/planning`

**Paramètres** :
- `formation` : `CC` ou `HM` (requis)
- `semaine` : Format `AAAASS` (ex: `202540`) (requis)
- `debug` : `true` pour logs ultra-détaillés (optionnel)

**Exemples** :
```bash
# Requête normale
/api/planning?formation=CC&semaine=202540

# Avec logs détaillés (visible dans Vercel Logs)
/api/planning?formation=CC&semaine=202540&debug=true
```

**Logs visibles dans Vercel Dashboard** :
```
🚀 [abc123] Début de la requête
📊 [abc123] Paramètres reçus: { formation: 'CC', semaine: '202540' }
✅ [abc123] Formation validée: BPJEPS AF CC (Cours Collectifs)
🔍 [abc123] Recherche en cache pour clé: CC-202540
❌ [abc123] Cache MISS - Récupération depuis la source
🌐 [abc123] URL construite: https://js-formation.ymag.cloud/...
📡 [abc123] Headers configurés: [12 headers différents]
🔄 [abc123] Tentative de connexion...
📥 [abc123] Réponse reçue: { status: 200, headers: {...} }
📄 [abc123] HTML reçu: { length: 15234, preview: "..." }
🔍 [abc123] HTML parsé avec Cheerio
📊 [abc123] Structure de la page: { tables: 3, divs: 45, scripts: 2, ... }
🔎 [abc123] Démarrage de l'extraction des événements...
📋 [abc123] Méthode 1 - Recherche dans les tableaux...
  📋 [abc123] Tableau 1: planning-table (8 lignes, 56 cellules)
    🎯 [abc123] Cellule candidate trouvée: "Anatomie - M. Dupont 8h00-10h00"
    ✅ [abc123] Événement ajouté: { id: 0, title: "Anatomie", type: "cours", ... }
📊 [abc123] Méthode 1 terminée: 12 événements trouvés
📊 [abc123] RÉSULTAT FINAL: { eventsFound: 12, methodsTried: 4, ... }
✅ [abc123] Réponse préparée et mise en cache (450ms)
```

**Fonctionnalités des Logs** :
- ✅ **ID de requête unique** pour tracer chaque requête
- ✅ **Temps d'exécution** mesuré à chaque étape
- ✅ **Structure HTML analysée** (tables, divs, scripts)
- ✅ **Extraction détaillée** des événements cellule par cellule
- ✅ **4 méthodes de scraping** avec résultats par méthode
- ✅ **Headers utilisés** pour contourner les blocages
- ✅ **Cache HIT/MISS** clairement indiqué
- ✅ **Erreurs détaillées** en cas de problème

**Pour voir les logs** :
1. Déployer sur Vercel
2. Aller dans le **Dashboard Vercel**
3. Sélectionner votre fonction dans **Functions**
4. Cliquer sur **Logs** pour voir les détails en temps réel

---

**Version** : 1.0.0
**Date** : Octobre 2025

