import { formatDate } from '../utils/dateHelpers';

// Jours de la semaine (sans week-end)
const WEEKDAYS = [
  { short: 'LUN', full: 'Lundi' },
  { short: 'MAR', full: 'Mardi' },
  { short: 'MER', full: 'Mercredi' },
  { short: 'JEU', full: 'Jeudi' },
  { short: 'VEN', full: 'Vendredi' }
];

// Plages horaires (08h à 18h)
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Couleurs par type (style Google Agenda)
const EVENT_COLORS = {
  communication: { bg: '#E3F2FD', border: '#1976D2', text: '#1565C0' },
  projet: { bg: '#C8E6C9', border: '#388E3C', text: '#2E7D32' },
  théorie: { bg: '#F3E5F5', border: '#7B1FA2', text: '#6A1B9A' },
  tp: { bg: '#FFF3E0', border: '#F57C00', text: '#E65100' },
  sport: { bg: '#FFEBEE', border: '#D32F2F', text: '#C62828' },
  cours: { bg: '#E1F5FE', border: '#0288D1', text: '#01579B' }
};

/**
 * Composant PlanningGrid style Google Agenda
 */
export function PlanningGridGoogle({ events, weekDates }) {
  // Organiser les événements par jour (0-4 = lundi à vendredi)
  const eventsByDay = {};
  for (let i = 0; i < 5; i++) {
    eventsByDay[i] = events.filter(e => e.day === i);
  }

  // Obtenir les dates de la semaine (lundi à vendredi seulement)
  const weekdayDates = weekDates.slice(0, 5);

  return (
    <>
      {/* Vue Desktop/Tablette - Style Google Agenda */}
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header avec les jours */}
        <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
          {/* Colonne horaire */}
          <div className="px-4 py-3 text-center border-r border-gray-200">
            <span className="text-xs font-medium text-gray-500">HORAIRE</span>
          </div>

          {/* Colonnes des jours */}
          {WEEKDAYS.map((day, index) => {
            const date = weekdayDates[index];
            const dayNumber = date ? date.getDate() : '';
            const isToday = date && date.toDateString() === new Date().toDateString();

            return (
              <div 
                key={index} 
                className={`px-4 py-3 text-center border-r border-gray-200 last:border-r-0 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {day.short}
                  </span>
                  {date && (
                    <span className={`text-2xl font-semibold mt-1 ${
                      isToday 
                        ? 'bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full'
                        : 'text-gray-900'
                    }`}>
                      {dayNumber}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grille horaire */}
        <div className="grid grid-cols-6 relative">
          {/* Colonne des heures */}
          <div className="border-r border-gray-200 bg-gray-50">
            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="h-20 px-4 py-2 border-b border-gray-200 flex items-start justify-end"
              >
                <span className="text-xs font-medium text-gray-500">{time}</span>
              </div>
            ))}
          </div>

          {/* Colonnes des jours */}
          {[0, 1, 2, 3, 4].map((dayIndex) => {
            const dayEvents = eventsByDay[dayIndex] || [];
            const isToday = weekdayDates[dayIndex] && 
                           weekdayDates[dayIndex].toDateString() === new Date().toDateString();

            return (
              <div
                key={dayIndex}
                className={`border-r border-gray-200 last:border-r-0 relative ${
                  isToday ? 'bg-blue-50 bg-opacity-30' : ''
                }`}
              >
                {/* Lignes horaires */}
                {TIME_SLOTS.map((time) => (
                  <div
                    key={time}
                    className="h-20 border-b border-gray-100"
                  />
                ))}

                {/* Événements positionnés absolument */}
                <div className="absolute inset-0 p-1">
                  {dayEvents.map((event) => {
                    const colors = EVENT_COLORS[event.type] || EVENT_COLORS.cours;
                    
                    // Calculer la position verticale
                    const startHour = parseInt(event.startTime.split(':')[0]);
                    const startMinutes = parseInt(event.startTime.split(':')[1] || 0);
                    const topOffset = ((startHour - 8) * 80) + (startMinutes * 80 / 60);
                    
                    // Calculer la hauteur
                    const endHour = parseInt(event.endTime.split(':')[0]);
                    const endMinutes = parseInt(event.endTime.split(':')[1] || 0);
                    const duration = ((endHour * 60 + endMinutes) - (startHour * 60 + startMinutes)) / 60;
                    const height = duration * 80 - 4; // -4 pour le padding

                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg shadow-sm border-l-4 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                        style={{
                          top: `${topOffset}px`,
                          height: `${height}px`,
                          backgroundColor: colors.bg,
                          borderLeftColor: colors.border
                        }}
                      >
                        <div className="p-2 h-full overflow-hidden">
                          {/* Horaire */}
                          <div className="text-xs font-semibold mb-1" style={{ color: colors.text }}>
                            {event.startTime} - {event.endTime}
                          </div>

                          {/* Titre */}
                          <div className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: colors.text }}>
                            {event.title}
                          </div>

                          {/* Infos complémentaires */}
                          {event.teacher && (
                            <div className="text-xs text-gray-600 truncate">
                              👤 {event.teacher}
                            </div>
                          )}
                          {event.room && (
                            <div className="text-xs text-gray-600 truncate">
                              📍 {event.room}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vue Mobile - Liste par jour */}
      <div className="md:hidden space-y-4">
        {WEEKDAYS.map((day, index) => {
          const dayEvents = eventsByDay[index] || [];
          const date = weekdayDates[index];
          const isToday = date && date.toDateString() === new Date().toDateString();

          // Trier les événements par heure
          const sortedEvents = [...dayEvents].sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
          });

          return (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* En-tête du jour */}
              <div className={`px-4 py-3 border-b ${
                isToday ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase">
                      {day.full}
                    </div>
                    {date && (
                      <div className={`text-xs ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatDate(date)}
                      </div>
                    )}
                  </div>
                  <div className={`text-2xl font-bold ${
                    isToday 
                      ? 'bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-full'
                      : ''
                  }`}>
                    {date ? date.getDate() : ''}
                  </div>
                </div>
              </div>

              {/* Événements du jour */}
              <div className="divide-y divide-gray-100">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event) => {
                    const colors = EVENT_COLORS[event.type] || EVENT_COLORS.cours;

                    return (
                      <div
                        key={event.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          {/* Barre colorée */}
                          <div
                            className="w-1 rounded-full"
                            style={{ backgroundColor: colors.border }}
                          />

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            {/* Horaire */}
                            <div
                              className="text-sm font-semibold mb-1"
                              style={{ color: colors.text }}
                            >
                              {event.startTime} - {event.endTime}
                            </div>

                            {/* Titre */}
                            <div
                              className="font-semibold text-base mb-2"
                              style={{ color: colors.text }}
                            >
                              {event.title}
                            </div>

                            {/* Infos */}
                            <div className="space-y-1">
                              {event.teacher && (
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <span>👤</span>
                                  <span>{event.teacher}</span>
                                </div>
                              )}
                              {event.room && (
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <span>📍</span>
                                  <span>{event.room}</span>
                                </div>
                              )}
                              {event.group && (
                                <div className="text-xs text-gray-500">
                                  {event.group}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400">
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
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">
            📅 Aucun cours prévu
          </div>
          <p className="text-gray-500 text-sm">
            Aucun événement pour cette semaine
          </p>
        </div>
      )}
    </>
  );
}
