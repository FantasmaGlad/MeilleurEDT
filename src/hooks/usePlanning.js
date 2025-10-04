import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINT } from '../utils/constants';
import { savePlanningData, getPlanningData } from '../utils/cache';
import { getMockPlanningData } from '../utils/mockData';

// Détecter si on est en mode développement local
const isDevelopment = import.meta.env.DEV;

/**
 * Hook personnalisé pour récupérer et gérer les données du planning
 */
export function usePlanning(formation, week) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  /**
   * Fonction pour récupérer les données du planning
   */
  const fetchPlanning = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache local d'abord
      if (useCache) {
        const cachedData = getPlanningData(formation, week);
        if (cachedData) {
          setData(cachedData);
          setIsCached(true);
          setLoading(false);
          // Lancer une mise à jour en background
          fetchFromAPI(formation, week, true);
          return;
        }
      }

      // Récupérer depuis l'API
      await fetchFromAPI(formation, week, false);
    } catch (err) {
      // En développement, utiliser les données mockées si l'API échoue
      if (isDevelopment) {
        // Log une seule fois de manière claire
        if (!sessionStorage.getItem('mock-warning-shown')) {
          console.log('📘 Mode développement : Données de test chargées (API serverless disponible uniquement en production)');
          sessionStorage.setItem('mock-warning-shown', 'true');
        }
        const mockData = getMockPlanningData(formation, week);
        savePlanningData(formation, week, mockData);
        setData(mockData);
        setIsCached(false);
        setError(null); // Pas d'erreur en mode dev avec mock
      } else {
        console.error('Erreur lors de la récupération du planning:', err.message);
        setError(err.message || 'Erreur lors du chargement du planning');
        
        // Essayer de charger depuis le cache en cas d'erreur
        const cachedData = getPlanningData(formation, week);
        if (cachedData) {
          setData(cachedData);
          setIsCached(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [formation, week]);

  /**
   * Récupérer depuis l'API
   */
  const fetchFromAPI = async (formation, week, isBackground = false) => {
    try {
      const url = `${API_ENDPOINT}?formation=${formation}&semaine=${week}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      // Sauvegarder en cache
      savePlanningData(formation, week, result);

      if (!isBackground) {
        setData(result);
        setIsCached(false);
      } else {
        // Mise à jour silencieuse du cache
        setData(result);
      }
    } catch (err) {
      // Ne rien logger en mode background ou développement (silencieux)
      if (!isBackground && !isDevelopment) {
        console.error('Erreur API:', err.message);
      }
      if (!isBackground) {
        throw err;
      }
    }
  };

  /**
   * Forcer un rafraîchissement
   */
  const refresh = () => {
    fetchPlanning(false);
  };

  // Charger les données au montage et quand formation/week change
  useEffect(() => {
    fetchPlanning(true);
  }, [fetchPlanning]);

  return {
    data,
    events: data?.data?.events || [],
    meta: data?.data?.meta || {},
    loading,
    error,
    isCached,
    refresh
  };
}

