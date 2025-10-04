# ✅ Checklist de Vérification - Planning BPJEPS AF

## 📁 Structure du Projet

### Fichiers de Configuration
- [x] `package.json` - Dépendances et scripts
- [x] `vite.config.js` - Configuration Vite
- [x] `tailwind.config.js` - Configuration Tailwind
- [x] `postcss.config.js` - Configuration PostCSS
- [x] `vercel.json` - Configuration Vercel
- [x] `.gitignore` - Fichiers à ignorer
- [x] `.vercelignore` - Fichiers à ignorer au déploiement

### Documentation
- [x] `README.md` - Documentation principale
- [x] `INSTALLATION.md` - Guide d'installation
- [x] `DEPLOIEMENT.md` - Guide de déploiement
- [x] `CHECKLIST.md` - Cette checklist

### Fichiers HTML/CSS
- [x] `index.html` - Point d'entrée HTML
- [x] `src/index.css` - Styles globaux
- [x] `public/favicon.svg` - Icône de l'application

### API Serverless
- [x] `api/planning.js` - Fonction serverless de scraping

### Application React

#### Points d'Entrée
- [x] `src/main.jsx` - Point d'entrée React
- [x] `src/App.jsx` - Composant principal

#### Composants (src/components/)
- [x] `PlanningGrid.jsx` - Grille du planning
- [x] `EventCard.jsx` - Carte d'événement
- [x] `WeekNavigator.jsx` - Navigation semaines
- [x] `FormationToggle.jsx` - Toggle CC/HM
- [x] `ExportButton.jsx` - Bouton d'export
- [x] `LoadingState.jsx` - État de chargement
- [x] `ErrorState.jsx` - État d'erreur

#### Hooks (src/hooks/)
- [x] `usePlanning.js` - Récupération données
- [x] `useWeekCalculator.js` - Calcul semaines
- [x] `useExport.js` - Export PNG

#### Utilitaires (src/utils/)
- [x] `constants.js` - Constantes
- [x] `dateHelpers.js` - Helpers de date
- [x] `cache.js` - Gestion du cache

---

## 🔍 Vérifications Fonctionnelles

### Installation
- [ ] `npm install` s'exécute sans erreur
- [ ] Toutes les dépendances sont installées
- [ ] Pas de vulnérabilités critiques (`npm audit`)

### Développement Local
- [ ] `npm run dev` démarre le serveur
- [ ] Application accessible sur http://localhost:3000
- [ ] Pas d'erreur dans la console
- [ ] Hot reload fonctionne

### Interface Utilisateur

#### Header
- [ ] Titre "Planning BPJEPS AF" affiché
- [ ] Toggle CC/HM visible et fonctionnel
- [ ] Bouton Rafraîchir visible (desktop)
- [ ] Badge "Cache" s'affiche quand données en cache

#### Navigation
- [ ] Bouton semaine précédente fonctionne
- [ ] Bouton semaine suivante fonctionne
- [ ] Bouton "Aujourd'hui" fonctionne (desktop)
- [ ] Numéro de semaine affiché correctement
- [ ] Dates de début/fin de semaine affichées

#### Planning
- [ ] Grille s'affiche correctement
- [ ] Jours de la semaine affichés avec dates
- [ ] Événements affichés avec bonnes couleurs
- [ ] Titre, horaire, salle, formateur visibles
- [ ] Badge type de cours affiché

#### États
- [ ] Skeleton loader pendant chargement
- [ ] Message d'erreur si échec API
- [ ] Message "Aucun cours" si pas d'événements
- [ ] Bouton "Réessayer" fonctionne

#### Export
- [ ] Bouton flottant visible en bas à droite
- [ ] Clic sur bouton lance l'export
- [ ] Fichier PNG téléchargé avec bon nom
- [ ] Qualité de l'image correcte (2x)

### Responsive Design

#### Mobile (< 768px)
- [ ] Header compact
- [ ] Toggle CC/HM accessible
- [ ] Navigation semaine accessible
- [ ] Vue liste par jour (pas grille)
- [ ] Touch targets >= 44px
- [ ] Swipe left/right change de semaine
- [ ] Bouton export accessible au pouce

#### Tablette (768px - 1024px)
- [ ] Grille compacte affichée
- [ ] Tous les éléments visibles
- [ ] Pas de scroll horizontal non voulu

#### Desktop (> 1024px)
- [ ] Grille complète avec horaires
- [ ] Bouton "Aujourd'hui" visible
- [ ] Bouton "Rafraîchir" visible
- [ ] Layout optimal

### Performance

#### Temps de Chargement
- [ ] Chargement initial < 1s (3G)
- [ ] Changement de vue < 300ms
- [ ] Export PNG < 2s
- [ ] Pas de freeze/lag

#### Cache
- [ ] Première visite : fetch API
- [ ] Visites suivantes : cache local
- [ ] Cache expire après 24h
- [ ] API cache 5min fonctionne
- [ ] Badge "Cache" s'affiche

#### Optimisations
- [ ] Pas de requêtes inutiles
- [ ] Images optimisées
- [ ] Bundle size raisonnable (< 500kb)
- [ ] Lazy loading si applicable

### Accessibilité

#### Navigation Clavier
- [ ] Tab navigate dans l'ordre logique
- [ ] Tous les boutons accessibles au clavier
- [ ] Focus visible sur éléments interactifs
- [ ] Enter/Space activent les boutons

#### ARIA et Sémantique
- [ ] Attributs aria-label sur icônes
- [ ] Roles ARIA appropriés
- [ ] Landmarks HTML5 (header, main, footer)
- [ ] Headings hiérarchisés (h1, h2, h3)

#### Contrastes
- [ ] Ratio de contraste >= 4.5:1 (texte normal)
- [ ] Ratio de contraste >= 3:1 (texte large)
- [ ] Pas de dépendance exclusive à la couleur

#### Autres
- [ ] Zoom 200% fonctionne
- [ ] Screen reader compatible
- [ ] Pas de flash/clignotement

---

## 🚀 Tests Avant Déploiement

### Tests Navigateurs

#### Chrome/Edge
- [ ] Affichage correct
- [ ] Toutes fonctionnalités OK
- [ ] Console sans erreur

#### Firefox
- [ ] Affichage correct
- [ ] Toutes fonctionnalités OK
- [ ] Console sans erreur

#### Safari (iOS)
- [ ] Affichage correct
- [ ] Toutes fonctionnalités OK
- [ ] Swipe gestures OK

### Tests Appareils

#### iPhone
- [ ] Portrait mode OK
- [ ] Landscape mode OK
- [ ] Touch gestures OK

#### Android
- [ ] Portrait mode OK
- [ ] Landscape mode OK
- [ ] Touch gestures OK

#### Tablette
- [ ] Portrait mode OK
- [ ] Landscape mode OK
- [ ] Layout adapté

### API et Données

#### Endpoint `/api/planning`
- [ ] Répond en production
- [ ] Format JSON correct
- [ ] Gère paramètres formation et semaine
- [ ] Cache fonctionne (5min)
- [ ] Gestion erreurs propre

#### Scraping
- [ ] Headers anti-blocage fonctionnent
- [ ] Parsing HTML correct
- [ ] Extraction données complète
- [ ] Types de cours détectés

#### Gestion Erreurs
- [ ] Erreur réseau gérée
- [ ] Erreur parsing gérée
- [ ] Timeout géré
- [ ] Fallback cache fonctionne

### Lighthouse Audit

#### Performance
- [ ] Score > 90
- [ ] FCP < 1s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TBT < 300ms

#### Accessibilité
- [ ] Score > 90
- [ ] Tous critères respectés

#### Best Practices
- [ ] Score > 90
- [ ] HTTPS en production
- [ ] Pas d'erreurs console
- [ ] Bibliothèques à jour

#### SEO
- [ ] Score > 90
- [ ] Meta tags présents
- [ ] Titre approprié
- [ ] Description présente

---

## 📦 Déploiement

### Pré-Déploiement
- [ ] `npm run build` réussit
- [ ] Dossier `dist/` généré
- [ ] Taille bundle acceptable
- [ ] Pas d'erreurs de build

### Vercel
- [ ] Projet connecté à GitHub
- [ ] Build réussit sur Vercel
- [ ] Serverless functions déployées
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré

### Post-Déploiement
- [ ] URL de production accessible
- [ ] Toutes fonctionnalités testées en prod
- [ ] Lighthouse audit en production
- [ ] Pas d'erreurs dans logs Vercel
- [ ] API fonctionne en production

---

## 🔐 Sécurité

- [ ] Pas de secrets/API keys en clair
- [ ] Pas de console.log en production
- [ ] Headers de sécurité configurés
- [ ] HTTPS forcé
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Pas d'injection possible
- [ ] Pas de XSS possible

---

## 📊 Monitoring Post-Lancement

- [ ] Analytics configuré (optionnel)
- [ ] Erreurs monitoring (Sentry, etc.)
- [ ] Uptime monitoring (Uptime Robot)
- [ ] Performance monitoring
- [ ] Logs Vercel consultables

---

## 🎯 Prêt pour la Production

Une fois tous les items cochés, l'application est prête pour :
- ✅ Déploiement en production
- ✅ Utilisation par les étudiants
- ✅ Partage de l'URL

---

## 📝 Notes

**Date de vérification** : __________

**Vérificateur** : __________

**Problèmes identifiés** :
- 
- 

**Optimisations futures** :
- Notifications push pour changements planning
- Mode sombre
- Filtres par type de cours
- Recherche de cours
- Synchronisation calendrier externe (Google Calendar, etc.)

---

**Version** : 1.0.0  
**Statut** : Prêt pour production ✅

