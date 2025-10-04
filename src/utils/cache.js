import { CACHE_KEYS, CACHE_DURATION } from './constants';

/**
 * Sauvegarde des données dans le localStorage avec timestamp
 * @param {string} key - Clé de stockage
 * @param {*} data - Données à stocker
 */
export function setCache(key, data) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde en cache:', error);
  }
}

/**
 * Récupère des données du cache si elles sont valides
 * @param {string} key - Clé de stockage
 * @param {number} maxAge - Durée maximale en ms (par défaut 24h)
 * @returns {*|null} Les données ou null si expirées/inexistantes
 */
export function getCache(key, maxAge = CACHE_DURATION) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la lecture du cache:', error);
    return null;
  }
}

/**
 * Supprime une entrée du cache
 * @param {string} key - Clé à supprimer
 */
export function clearCache(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur lors de la suppression du cache:', error);
  }
}

/**
 * Nettoie tout le cache de l'application
 */
export function clearAllCache() {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage du cache:', error);
  }
}

/**
 * Sauvegarde la dernière formation consultée
 * @param {string} formation - Code formation (CC ou HM)
 */
export function saveLastFormation(formation) {
  setCache(CACHE_KEYS.LAST_FORMATION, formation);
}

/**
 * Récupère la dernière formation consultée
 * @returns {string} Code formation ou 'CC' par défaut
 */
export function getLastFormation() {
  return getCache(CACHE_KEYS.LAST_FORMATION) || 'CC';
}

/**
 * Sauvegarde la dernière semaine consultée
 * @param {string} week - Semaine au format AAAASS
 */
export function saveLastWeek(week) {
  setCache(CACHE_KEYS.LAST_WEEK, week);
}

/**
 * Récupère la dernière semaine consultée
 * @returns {string|null} Semaine ou null
 */
export function getLastWeek() {
  return getCache(CACHE_KEYS.LAST_WEEK);
}

/**
 * Génère une clé de cache pour les données de planning
 * @param {string} formation - Code formation
 * @param {string} week - Semaine
 * @returns {string} Clé de cache
 */
export function getPlanningCacheKey(formation, week) {
  return `${CACHE_KEYS.PLANNING_DATA}_${formation}_${week}`;
}

/**
 * Sauvegarde les données de planning en cache
 * @param {string} formation - Code formation
 * @param {string} week - Semaine
 * @param {*} data - Données du planning
 */
export function savePlanningData(formation, week, data) {
  const key = getPlanningCacheKey(formation, week);
  setCache(key, data);
}

/**
 * Récupère les données de planning du cache
 * @param {string} formation - Code formation
 * @param {string} week - Semaine
 * @returns {*|null} Données ou null
 */
export function getPlanningData(formation, week) {
  const key = getPlanningCacheKey(formation, week);
  return getCache(key);
}

