/**
 * Calcule le numéro de semaine ISO 8601 pour une date donnée
 * @param {Date} date - La date à traiter
 * @returns {number} Le numéro de semaine
 */
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Obtient l'année et le numéro de semaine au format AAAASS
 * @param {Date} date - La date à traiter
 * @returns {string} Format AAAASS (ex: 202540)
 */
export function getYearWeekFormat(date = new Date()) {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}${week.toString().padStart(2, '0')}`;
}

/**
 * Obtient la date du lundi d'une semaine donnée
 * @param {number} year - L'année
 * @param {number} week - Le numéro de semaine
 * @returns {Date} La date du lundi
 */
export function getDateOfWeek(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}

/**
 * Parse le format AAAASS en année et semaine
 * @param {string} yearWeek - Format AAAASS
 * @returns {{year: number, week: number}}
 */
export function parseYearWeek(yearWeek) {
  const str = yearWeek.toString();
  return {
    year: parseInt(str.substring(0, 4), 10),
    week: parseInt(str.substring(4, 6), 10)
  };
}

/**
 * Obtient la semaine suivante au format AAAASS
 * @param {string} currentWeek - Semaine actuelle au format AAAASS
 * @returns {string} Semaine suivante au format AAAASS
 */
export function getNextWeek(currentWeek) {
  const { year, week } = parseYearWeek(currentWeek);
  const currentDate = getDateOfWeek(year, week);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 7);
  return getYearWeekFormat(nextDate);
}

/**
 * Obtient la semaine précédente au format AAAASS
 * @param {string} currentWeek - Semaine actuelle au format AAAASS
 * @returns {string} Semaine précédente au format AAAASS
 */
export function getPreviousWeek(currentWeek) {
  const { year, week } = parseYearWeek(currentWeek);
  const currentDate = getDateOfWeek(year, week);
  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 7);
  return getYearWeekFormat(prevDate);
}

/**
 * Formate une date pour l'affichage
 * @param {Date} date - La date à formater
 * @returns {string} Date formatée (ex: "04/10/2025")
 */
export function formatDate(date) {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Obtient les dates de la semaine (lundi à dimanche)
 * @param {string} yearWeek - Format AAAASS
 * @returns {Date[]} Tableau de 7 dates
 */
export function getWeekDates(yearWeek) {
  const { year, week } = parseYearWeek(yearWeek);
  const monday = getDateOfWeek(year, week);
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

