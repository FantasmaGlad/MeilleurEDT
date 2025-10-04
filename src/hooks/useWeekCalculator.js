import { useState, useEffect } from 'react';
import { 
  getYearWeekFormat, 
  getNextWeek, 
  getPreviousWeek,
  getWeekDates,
  parseYearWeek
} from '../utils/dateHelpers';
import { saveLastWeek, getLastWeek } from '../utils/cache';

/**
 * Hook personnalisé pour gérer la navigation entre les semaines
 */
export function useWeekCalculator() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    // Essayer de récupérer la dernière semaine consultée
    const lastWeek = getLastWeek();
    return lastWeek || getYearWeekFormat(new Date());
  });

  // Sauvegarder la semaine actuelle à chaque changement
  useEffect(() => {
    saveLastWeek(currentWeek);
  }, [currentWeek]);

  /**
   * Aller à la semaine suivante
   */
  const goToNextWeek = () => {
    setCurrentWeek(prev => getNextWeek(prev));
  };

  /**
   * Aller à la semaine précédente
   */
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => getPreviousWeek(prev));
  };

  /**
   * Aller à la semaine actuelle
   */
  const goToCurrentWeek = () => {
    setCurrentWeek(getYearWeekFormat(new Date()));
  };

  /**
   * Aller à une semaine spécifique
   */
  const goToWeek = (yearWeek) => {
    setCurrentWeek(yearWeek);
  };

  // Obtenir les informations de la semaine actuelle
  const weekInfo = parseYearWeek(currentWeek);
  const weekDates = getWeekDates(currentWeek);

  return {
    currentWeek,
    weekNumber: weekInfo.week,
    year: weekInfo.year,
    weekDates,
    goToNextWeek,
    goToPreviousWeek,
    goToCurrentWeek,
    goToWeek
  };
}

