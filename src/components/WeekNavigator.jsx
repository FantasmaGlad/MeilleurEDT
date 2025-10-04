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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 flex items-center justify-between gap-3 animate-fadeIn">
      {/* Bouton Précédent - Style Google */}
      <button
        onClick={onPrevious}
        className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 touch-target hover:scale-110 active:scale-95"
        aria-label="Semaine précédente"
      >
        <ChevronLeft className="w-5 h-5 text-blue-600" />
      </button>

      {/* Informations de la semaine - Compact */}
      <div className="flex-1 text-center">
        <div className="font-semibold text-gray-900">
          Semaine {weekNumber}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      {/* Bouton Aujourd'hui - Style Google */}
      <button
        onClick={onToday}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
        aria-label="Aller à la semaine actuelle"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden lg:inline">Aujourd'hui</span>
      </button>

      {/* Bouton Suivant - Style Google */}
      <button
        onClick={onNext}
        className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 touch-target hover:scale-110 active:scale-95"
        aria-label="Semaine suivante"
      >
        <ChevronRight className="w-5 h-5 text-blue-600" />
      </button>
    </div>
  );
}

