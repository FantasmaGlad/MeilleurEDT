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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 flex items-center justify-between gap-2">
      {/* Bouton Précédent */}
      <button
        onClick={onPrevious}
        className="p-1.5 hover:bg-blue-50 rounded-lg transition-all hover:scale-110 active:scale-95"
        aria-label="Semaine précédente"
      >
        <ChevronLeft className="w-4 h-4 text-blue-600" />
      </button>

      {/* Infos semaine - Ultra compact */}
      <div className="flex-1 text-center">
        <div className="text-sm font-bold text-gray-900">
          Semaine {weekNumber}
        </div>
        <div className="text-[10px] text-gray-500">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      {/* Bouton Aujourd'hui */}
      <button
        onClick={onToday}
        className="hidden md:flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-200"
        aria-label="Aller à la semaine actuelle"
      >
        <Calendar className="w-3 h-3" />
        <span className="hidden lg:inline">Aujourd'hui</span>
      </button>

      {/* Bouton Suivant */}
      <button
        onClick={onNext}
        className="p-1.5 hover:bg-blue-50 rounded-lg transition-all hover:scale-110 active:scale-95"
        aria-label="Semaine suivante"
      >
        <ChevronRight className="w-4 h-4 text-blue-600" />
      </button>
    </div>
  );
}

