import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

/**
 * Composant de navigation entre les semaines
 */
export function WeekNavigator({ 
  weekNumber, 
  year, 
  weekDates,
  onPrevious, 
  onNext,
  onToday 
}) {
  const startDate = weekDates[0];
  const endDate = weekDates[6];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between gap-4">
      {/* Bouton Précédent */}
      <button
        onClick={onPrevious}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-target"
        aria-label="Semaine précédente"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Informations de la semaine */}
      <div className="flex-1 text-center">
        <div className="text-sm text-gray-600 mb-1">
          Semaine {weekNumber} · {year}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      {/* Bouton Aujourd'hui */}
      <button
        onClick={onToday}
        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        aria-label="Aller à la semaine actuelle"
      >
        <Calendar className="w-4 h-4" />
        Aujourd'hui
      </button>

      {/* Bouton Suivant */}
      <button
        onClick={onNext}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-target"
        aria-label="Semaine suivante"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}

