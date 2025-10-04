# 📂 Structure du Projet

## Vue d'Ensemble

```
planning-bpjeps/
│
├── 📄 Configuration
│   ├── package.json           # Dépendances et scripts npm
│   ├── vite.config.js          # Configuration Vite (bundler)
│   ├── tailwind.config.js      # Configuration Tailwind CSS
│   ├── postcss.config.js       # Configuration PostCSS
│   ├── vercel.json             # Configuration Vercel (serverless)
│   ├── .gitignore              # Fichiers ignorés par Git
│   ├── .vercelignore           # Fichiers ignorés par Vercel
│   └── .npmrc                  # Configuration npm
│
├── 📚 Documentation
│   ├── README.md               # Documentation principale
│   ├── QUICKSTART.md           # Démarrage rapide (3 étapes)
│   ├── INSTALLATION.md         # Guide d'installation détaillé
│   ├── DEPLOIEMENT.md          # Guide de déploiement
│   ├── CHECKLIST.md            # Checklist de vérification
│   └── STRUCTURE.md            # Ce fichier
│
├── 🌐 Frontend
│   ├── index.html              # Point d'entrée HTML
│   │
│   └── src/
│       ├── main.jsx            # Point d'entrée React
│       ├── App.jsx             # Composant racine
│       ├── index.css           # Styles globaux + Tailwind
│       │
│       ├── components/         # Composants React
│       │   ├── PlanningGrid.jsx       # Grille calendrier
│       │   ├── EventCard.jsx          # Carte événement/cours
│       │   ├── WeekNavigator.jsx      # Navigation semaines
│       │   ├── FormationToggle.jsx    # Toggle CC/HM
│       │   ├── ExportButton.jsx       # Bouton export PNG
│       │   ├── LoadingState.jsx       # État chargement
│       │   └── ErrorState.jsx         # État erreur
│       │
│       ├── hooks/              # Hooks personnalisés
│       │   ├── usePlanning.js         # Fetch et cache planning
│       │   ├── useWeekCalculator.js   # Calculs de semaines
│       │   └── useExport.js           # Export PNG
│       │
│       └── utils/              # Utilitaires
│           ├── constants.js           # Constantes globales
│           ├── dateHelpers.js         # Helpers de dates
│           └── cache.js               # Gestion cache localStorage
│
├── ⚙️ Backend (Serverless)
│   └── api/
│       └── planning.js         # API de scraping/parsing
│
└── 🎨 Assets
    └── public/
        └── favicon.svg         # Icône de l'application
```

---

## 📋 Description des Dossiers et Fichiers

### 🔧 Configuration

#### `package.json`
- Dépendances du projet (React, Vite, Tailwind, etc.)
- Scripts npm (`dev`, `build`, `preview`)
- Métadonnées du projet

#### `vite.config.js`
- Configuration du bundler Vite
- Plugins React
- Configuration du serveur de dev
- Proxy API

#### `tailwind.config.js`
- Configuration Tailwind CSS
- Couleurs personnalisées (cours, tp, td, sport)
- Extensions du thème

#### `vercel.json`
- Configuration des serverless functions
- Memory et timeout API
- Headers de cache
- Redirections

---

### 📚 Documentation

#### `README.md` (Principal)
- Vue d'ensemble du projet
- Installation et déploiement
- Architecture technique
- Stack et technologies

#### `QUICKSTART.md` (Démarrage 3 étapes)
- Installation rapide
- Lancement immédiat
- Déploiement express

#### `INSTALLATION.md` (Détaillé)
- Installation pas à pas
- Configuration initiale
- Tests et vérifications
- Personnalisation

#### `DEPLOIEMENT.md` (Production)
- Déploiement Vercel/Netlify
- Configuration domaine
- CI/CD
- Monitoring

#### `CHECKLIST.md` (Qualité)
- Vérifications pré-déploiement
- Tests fonctionnels
- Audits performance/accessibilité
- Sécurité

---

### 🌐 Frontend (src/)

#### Point d'Entrée

**`main.jsx`**
- Bootstrap React
- Montage dans le DOM (#root)
- Mode strict

**`App.jsx`** (Composant Racine)
- État global (formation, semaine)
- Orchestration des composants
- Gestion swipe gestures
- Header, navigation, planning, footer

**`index.css`**
- Import Tailwind (`@tailwind`)
- Variables CSS custom
- Styles globaux
- Utilitaires personnalisés

---

#### Composants (`src/components/`)

**`PlanningGrid.jsx`** (Grille Principale)
- Affichage grille desktop (8 colonnes)
- Affichage liste mobile (par jour)
- Organisation événements par jour
- Gestion état vide

**`EventCard.jsx`** (Carte Cours)
- Affichage détails événement
- Couleurs par type (cours/tp/td/sport)
- Icônes (horaire, salle, formateur)
- Hover effects

**`WeekNavigator.jsx`** (Navigation)
- Boutons précédent/suivant
- Affichage semaine courante
- Bouton "Aujourd'hui"
- Dates début/fin semaine

**`FormationToggle.jsx`** (Toggle)
- Switch CC/HM
- Animation de transition
- État actif visible

**`ExportButton.jsx`** (Export)
- Bouton flottant (bottom-right)
- État loading pendant export
- Icône téléchargement

**`LoadingState.jsx`** (Chargement)
- Skeleton loader animé
- Placeholders pour grille
- Animation pulse

**`ErrorState.jsx`** (Erreur)
- Message d'erreur clair
- Bouton "Réessayer"
- Info cache si disponible

---

#### Hooks (`src/hooks/`)

**`usePlanning.js`**
- Fetch données planning depuis API
- Cache local (localStorage)
- Refresh en background (stale-while-revalidate)
- Gestion erreurs
- États: loading, error, data

**`useWeekCalculator.js`**
- Calcul semaine courante
- Navigation semaines (prev/next)
- Format AAAASS (ex: 202540)
- Conversion dates
- Sauvegarde dernière semaine

**`useExport.js`**
- Export planning en PNG
- html2canvas
- Qualité 2x
- Nom fichier formaté
- État isExporting

---

#### Utilitaires (`src/utils/`)

**`constants.js`**
- Formations (CC, HM)
- Jours de la semaine
- Types événements (couleurs)
- Plages horaires
- Clés cache
- Endpoint API

**`dateHelpers.js`**
- Calcul numéro de semaine ISO
- Format AAAASS
- Conversion dates
- Semaine précédente/suivante
- Dates de la semaine (lundi-dimanche)

**`cache.js`**
- Gestion localStorage
- Setters/getters avec TTL
- Cache planning par formation/semaine
- Dernière formation/semaine
- Nettoyage cache

---

### ⚙️ Backend (api/)

**`planning.js`** (Serverless Function)
- Endpoint `/api/planning`
- Scraping HTML source
- Parsing avec Cheerio
- Cache in-memory (5min)
- Headers anti-blocage
- Détection type cours
- Format JSON structuré

**Input**: `?formation=CC&semaine=202540`

**Output**:
```json
{
  "data": {
    "events": [...],
    "meta": {...}
  },
  "cached": false,
  "timestamp": "..."
}
```

---

### 🎨 Assets (public/)

**`favicon.svg`**
- Icône SVG de l'app
- Thème bleu (#2563eb)
- Design calendrier

---

## 🔄 Flux de Données

```
User Action
    ↓
App.jsx (State Management)
    ↓
useWeekCalculator + usePlanning
    ↓
API Call → /api/planning
    ↓
Cache Check (localStorage)
    ↓
API Serverless (Vercel)
    ↓
Scraping + Parsing (Cheerio)
    ↓
JSON Response
    ↓
Cache Local + Server
    ↓
PlanningGrid → EventCard
    ↓
User View
```

---

## 📦 Dépendances

### Production
- `react` - Framework UI
- `react-dom` - Rendu React
- `lucide-react` - Icônes
- `html2canvas` - Export PNG

### Développement
- `vite` - Bundler ultra-rapide
- `@vitejs/plugin-react` - Plugin React pour Vite
- `tailwindcss` - Framework CSS utility-first
- `postcss` + `autoprefixer` - Préprocesseur CSS
- `cheerio` - Parsing HTML (serverless)

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev              # Lance serveur dev

# Production
npm run build            # Build optimisé
npm run preview          # Prévisualise build

# Maintenance
npm install              # Installer dépendances
npm update               # Mettre à jour dépendances
npm audit                # Vérifier vulnérabilités

# Déploiement
vercel                   # Deploy sur Vercel
netlify deploy --prod    # Deploy sur Netlify
```

---

## 📊 Tailles Estimées

- **Bundle JS** : ~200 KB (gzippé)
- **CSS** : ~15 KB (Tailwind purgé)
- **HTML** : ~2 KB
- **Total First Load** : ~220 KB

---

## 🎯 Points d'Extension Futurs

### Facile à Ajouter
- Mode sombre (Tailwind dark mode)
- Filtres par type de cours
- Recherche de cours
- Impression PDF

### Moyennement Complexe
- Notifications push (changements)
- Notes personnelles sur cours
- Favoris/Bookmarks
- Partage d'événement

### Avancé
- Synchronisation Google Calendar
- Mode offline complet (PWA)
- Multi-utilisateurs avec auth
- API REST complète

---

## 📖 Ressources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)

---

**Date de création** : Octobre 2025  
**Version** : 1.0.0  
**Auteur** : Planning BPJEPS AF Team

