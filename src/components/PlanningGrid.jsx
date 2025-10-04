import { EventCard } from './EventCard';
import { DAYS, TIME_SLOTS } from '../utils/constants';
import { formatDate } from '../utils/dateHelpers';

/**
 * Composant principal de la grille de planning
 */
export function PlanningGrid({ events, weekDates }) {
  // Organiser les événements par jour
  const eventsByDay = events.reduce((acc, event) => {
    const day = event.day || 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Version Desktop/Tablet - Grille */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-max">
          {/* En-tête des jours */}
          <div className="grid grid-cols-8 border-b bg-gray-50 sticky top-0 z-10">
            <div className="p-4 font-semibold text-gray-700 border-r">
              Horaire
            </div>
            {DAYS.map((day, index) => (
              <div
                key={day}
                className="p-4 text-center border-r last:border-r-0"
              >
                <div className="font-semibold text-gray-900">{day}</div>
                {weekDates[index] && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(weekDates[index])}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Grille horaire */}
          <div className="grid grid-cols-8">
            {/* Colonne des heures */}
            <div className="border-r bg-gray-50">
              {TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className="p-4 text-sm font-medium text-gray-700 border-b h-24 flex items-center justify-center"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Colonnes des jours */}
            {[...Array(7)].map((_, dayIndex) => (
              <div key={dayIndex} className="border-r last:border-r-0 relative">
                <div className="p-2 space-y-2 min-h-screen">
                  {eventsByDay[dayIndex]?.map((event, eventIndex) => (
                    <EventCard key={`${dayIndex}-${eventIndex}`} event={event} />
                  ))}
                  {(!eventsByDay[dayIndex] || eventsByDay[dayIndex].length === 0) && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      Aucun cours
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Version Mobile - Liste par jour */}
      <div className="md:hidden">
        {DAYS.map((day, dayIndex) => {
          const dayEvents = eventsByDay[dayIndex] || [];
          
          return (
            <div key={day} className="border-b last:border-b-0">
              {/* En-tête du jour */}
              <div className="bg-gray-50 p-4 sticky top-0 z-10 border-b">
                <div className="font-semibold text-gray-900">{day}</div>
                {weekDates[dayIndex] && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(weekDates[dayIndex])}
                  </div>
                )}
              </div>

              {/* Événements du jour */}
              <div className="p-4 space-y-3">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, eventIndex) => (
                    <EventCard key={`${dayIndex}-${eventIndex}`} event={event} />
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Aucun cours ce jour
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun événement */}
      {events.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">
            Aucun cours prévu pour cette semaine
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Les données seront disponibles prochainement
          </p>
        </div>
      )}
    </div>
  );
}

