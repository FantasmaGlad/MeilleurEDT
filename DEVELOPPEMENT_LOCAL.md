# 🛠️ Guide de Développement Local

## ⚠️ Important : API Serverless

L'API serverless (`/api/planning`) **ne fonctionne pas** avec `npm run dev` car Vite ne gère pas les Vercel Functions.

**Deux solutions disponibles** :

---

## ✅ Solution 1 : Données Mockées (Recommandé pour le dev)

### Mode par défaut

L'application **détecte automatiquement** qu'elle est en développement et utilise des **données de test** :

```bash
npm run dev
```

**Avantages** :
- ✅ Fonctionne immédiatement
- ✅ Pas de configuration
- ✅ Données réalistes générées
- ✅ Badge "Données de test" visible

**Limitations** :
- ⚠️ Données générées aléatoirement (pas les vraies données)
- ⚠️ Ne teste pas le scraping réel

**Comment ça marche** :
- L'application essaie d'appeler l'API
- Si échec (erreur 500), elle utilise `src/utils/mockData.js`
- Badge bleu "Données de test" affiché dans le header

---

## ✅ Solution 2 : Vercel Dev (Pour tester l'API réelle)

### Installation

```bash
# Installer Vercel CLI globalement
npm install -g vercel
```

### Connexion

```bash
# Se connecter à Vercel
vercel login
```

Suivez les instructions pour vous connecter avec votre compte.

### Lancement

```bash
# Au lieu de npm run dev, utiliser :
vercel dev
```

**Avantages** :
- ✅ API serverless fonctionne en local
- ✅ Teste le scraping réel
- ✅ Comportement identique à la production
- ✅ Hot reload fonctionne

**Limitations** :
- ⚠️ Plus lent à démarrer (30-60 secondes)
- ⚠️ Nécessite un compte Vercel
- ⚠️ Peut être bloqué par le site source (robots.txt)

### Configuration initiale

La première fois :
```bash
vercel dev
```

Questions :
- **Set up and develop?** → Yes
- **Which scope?** → Votre compte
- **Link to existing project?** → No
- **Project name?** → planning-bpjeps (ou autre)
- **Directory?** → . (racine)

Ensuite, l'app démarre sur `http://localhost:3000`

---

## 🔄 Workflow Recommandé

### Pour le développement UI

```bash
npm run dev
```

- Données mockées suffisantes
- Développement rapide des composants
- Test du responsive
- Test des interactions

### Pour tester l'API

```bash
vercel dev
```

- Test du scraping réel
- Vérification du parsing
- Test du cache API
- Debug des erreurs API

### Avant le déploiement

```bash
npm run build
vercel --prod
```

---

## 🎨 Personnaliser les Données Mockées

Éditer `src/utils/mockData.js` :

```javascript
const matieres = [
  'Anatomie',
  'Physiologie',
  'Vos matières ici...'
];

const formateurs = [
  'M. Dupont',
  'Vos formateurs ici...'
];
```

---

## 🔍 Debugging

### Vérifier le mode utilisé

Ouvrir la console navigateur (F12) :

**Mode Mock** :
```
⚠️ Mode développement : Utilisation des données mockées
```

**Mode API** :
Pas de warning, les données sont fetchées normalement.

### Badge visible

- **Badge bleu "Données de test"** → Mode mock
- **Badge jaune "Cache"** → Données en cache
- **Pas de badge** → Données fraîches de l'API

---

## 🐛 Problèmes Courants

### Erreur 500 avec npm run dev
**Normal !** C'est pour ça qu'on a les données mockées.

### Vercel dev ne démarre pas
```bash
# Nettoyer la config
rm -rf .vercel
vercel dev
```

### API bloquée en production
- Vérifier les headers dans `api/planning.js`
- Tester avec curl
- Vérifier les logs Vercel

### Pas de données affichées
1. Vérifier la console (F12)
2. Vérifier le badge (Mock ou Cache)
3. Essayer de rafraîchir

---

## 📊 Comparaison des Modes

| Fonctionnalité | `npm run dev` | `vercel dev` | Production |
|----------------|---------------|--------------|------------|
| **Vitesse démarrage** | ⚡ Très rapide | 🐌 Lent | N/A |
| **Hot reload** | ✅ Oui | ✅ Oui | N/A |
| **API serverless** | ❌ Non (mock) | ✅ Oui | ✅ Oui |
| **Scraping réel** | ❌ Non | ✅ Oui | ✅ Oui |
| **Configuration** | ✅ Aucune | ⚙️ Vercel CLI | N/A |
| **Données réelles** | ❌ Mock | ✅ Oui | ✅ Oui |

---

## 🎯 Recommandations

### Débutant
→ Utiliser `npm run dev` avec les données mockées

### Développeur expérimenté
→ Utiliser `vercel dev` pour tester l'API

### Avant déploiement
→ Toujours tester avec `vercel dev` puis déployer

---

## 📝 Scripts Disponibles

```bash
# Développement rapide (avec mock)
npm run dev

# Développement avec API (Vercel CLI requis)
vercel dev

# Build production
npm run build

# Preview du build
npm run preview

# Déployer en production
vercel --prod
```

---

## 🚀 Production

En production (déployé sur Vercel) :
- ✅ API serverless fonctionne automatiquement
- ✅ Scraping réel activé
- ✅ Cache de 5 minutes
- ✅ Pas de données mockées

---

## 💡 Astuces

### Forcer l'utilisation du cache

En développement, le cache localStorage fonctionne :
1. Charger l'app avec `vercel dev` (données réelles)
2. Relancer avec `npm run dev`
3. Les données en cache s'affichent (badge "Cache")

### Nettoyer le cache

Console navigateur (F12) :
```javascript
localStorage.clear()
```

Puis rafraîchir la page.

### Debug l'API

Tester l'endpoint directement :
```bash
# Avec vercel dev
curl "http://localhost:3000/api/planning?formation=CC&semaine=202540"
```

---

## ✅ Checklist Développement

- [ ] `npm install` exécuté
- [ ] `npm run dev` fonctionne
- [ ] Badge "Données de test" visible
- [ ] Navigation entre semaines OK
- [ ] Export PNG fonctionne
- [ ] Responsive mobile OK
- [ ] (Optionnel) `vercel dev` testé
- [ ] (Optionnel) API réelle testée

---

**Bon développement !** 🎉

Si vous voyez des erreurs 500, c'est **normal** en mode `npm run dev`. L'application bascule automatiquement sur les données mockées.

