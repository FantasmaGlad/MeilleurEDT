export const FORMATIONS = {
  CC: 'BPJEPS AF CC',
  HM: 'BPJEPS AF HM'
};

// Jours de la semaine (sans week-end pour le planning)
export const DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi'
];

export const ALL_DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

export const EVENT_TYPES = {
  cours: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-900'
  },
  tp: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-900'
  },
  td: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-900'
  },
  sport: {
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    text: 'text-orange-900'
  }
};

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const API_ENDPOINT = '/api/planning';

export const CACHE_KEYS = {
  LAST_FORMATION: 'bpjeps_last_formation',
  LAST_WEEK: 'bpjeps_last_week',
  PLANNING_DATA: 'bpjeps_planning_data'
};

export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

