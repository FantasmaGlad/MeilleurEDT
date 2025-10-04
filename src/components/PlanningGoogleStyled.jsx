import { useState } from 'react';
import { formatDate } from '../utils/dateHelpers';
import { Clock, MapPin, User, X } from 'lucide-react';

// Jours de la semaine
const WEEKDAYS = [
  { short: 'LUN', full: 'Lundi' },
  { short: 'MAR', full: 'Mardi' },
  { short: 'MER', full: 'Mercredi' },
  { short: 'JEU', full: 'Jeudi' },
  { short: 'VEN', full: 'Vendredi' }
];

// Plages horaires compactes
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Couleurs douces style Google
const COLORS = {
  communication: { 
    light: 'from-blue-50 to-blue-100', 
    border: 'border-blue-400', 
    text: 'text-blue-700',
    glow: 'shadow-blue-200'
  },
  projet: { 
    light: 'from-green-50 to-green-100', 
    border: 'border-green-400', 
    text: 'text-green-700',
    glow: 'shadow-green-200'
  },
  théorie: { 
    light: 'from-purple-50 to-purple-100', 
    border: 'border-purple-400', 
    text: 'text-purple-700',
    glow: 'shadow-purple-200'
  },
  tp: { 
    light: 'from-orange-50 to-orange-100', 
    border: 'border-orange-400', 
    text: 'text-orange-700',
    glow: 'shadow-orange-200'
  },
  sport: { 
    light: 'from-red-50 to-red-100', 
    border: 'border-red-400', 
    text: 'text-red-700',
    glow: 'shadow-red-200'
  },
  cours: { 
    light: 'from-cyan-50 to-cyan-100', 
    border: 'border-cyan-400', 
    text: 'text-cyan-700',
    glow: 'shadow-cyan-200'
  }
};

/**
 * Planning style Google ultra-optimisé
 */
export function PlanningGoogleStyled({ events, weekDates }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Organiser par jour
  const eventsByDay = {};
  for (let i = 0; i < 5; i++) {
    eventsByDay[i] = events.filter(e => e.day === i);
  }

  const weekdayDates = weekDates.slice(0, 5);

  return (
    <>
      {/* Vue Desktop/Tablette - Sans scroll */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Emploi du temps</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">{events.length} cours</span>
            </div>
          </div>
        </div>

        {/* Grille avec hauteur fixe */}
        <div className="grid grid-cols-6 border-t border-gray-200" style={{ height: 'calc(100vh - 280px)', minHeight: '500px', maxHeight: '700px' }}>
          {/* Colonne horaire */}
          <div className="border-r border-gray-200 bg-gray-50 overflow-y-auto scrollbar-thin">
            <div className="sticky top-0 bg-gray-100 px-3 py-2 text-center border-b border-gray-200 z-10">
              <span className="text-xs font-semibold text-gray-600">⏰</span>
            </div>
            {TIME_SLOTS.map((time, idx) => (
              <div
                key={time}
                className={`h-16 px-3 flex items-center justify-center border-b border-gray-100 ${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <span className="text-xs font-medium text-gray-600">{time}</span>
              </div>
            ))}
          </div>

          {/* Colonnes des jours */}
          {[0, 1, 2, 3, 4].map((dayIndex) => {
            const dayEvents = eventsByDay[dayIndex] || [];
            const date = weekdayDates[dayIndex];
            const isToday = date && date.toDateString() === new Date().toDateString();

            return (
              <div
                key={dayIndex}
                className={`border-r border-gray-200 relative overflow-hidden ${
                  isToday ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Header jour - sticky */}
                <div className={`sticky top-0 z-10 px-2 py-2 text-center border-b border-gray-200 transition-all duration-300 ${
                  isToday 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white'
                }`}>
                  <div className="text-xs font-bold uppercase tracking-wide">
                    {WEEKDAYS[dayIndex].short}
                  </div>
                  {date && (
                    <div className={`text-lg font-bold mt-1 ${
                      isToday ? 'animate-pulse' : ''
                    }`}>
                      {date.getDate()}
                    </div>
                  )}
                </div>

                {/* Fond avec lignes horaires */}
                <div className="relative" style={{ height: `${TIME_SLOTS.length * 64}px` }}>
                  {TIME_SLOTS.map((time, idx) => (
                    <div
                      key={time}
                      className={`h-16 border-b border-gray-100 ${
                        idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                    />
                  ))}

                  {/* Événements */}
                  <div className="absolute inset-0 p-1">
                    {dayEvents.map((event) => {
                      const colors = COLORS[event.type] || COLORS.cours;
                      
                      // Position et hauteur
                      const startHour = parseInt(event.startTime?.split(':')[0] || 8);
                      const startMin = parseInt(event.startTime?.split(':')[1] || 0);
                      const endHour = parseInt(event.endTime?.split(':')[0] || startHour + 1);
                      const endMin = parseInt(event.endTime?.split(':')[1] || 0);
                      
                      const topOffset = ((startHour - 8) * 64) + (startMin * 64 / 60);
                      const duration = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60;
                      const height = Math.max(duration * 64 - 4, 40);

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`absolute left-1 right-1 rounded-xl border-l-4 cursor-pointer
                            bg-gradient-to-br ${colors.light} ${colors.border}
                            shadow-md hover:shadow-xl hover:scale-[1.02]
                            transition-all duration-300 ease-out
                            hover:z-20 hover:${colors.glow}
                            animate-fade-in`}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                            animationDelay: `${dayIndex * 50 + event.id * 20}ms`
                          }}
                        >
                          <div className="p-2 h-full overflow-hidden">
                            <div className={`text-xs font-bold mb-1 ${colors.text} flex items-center gap-1`}>
                              <Clock className="w-3 h-3" />
                              {event.startTime}
                            </div>
                            <div className={`font-semibold text-sm leading-tight line-clamp-2 ${colors.text}`}>
                              {event.title}
                            </div>
                            {height > 60 && event.teacher && (
                              <div className="text-xs text-gray-600 mt-1 truncate flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {event.teacher}
                              </div>
                            )}
                            {height > 80 && event.room && (
                              <div className="text-xs text-gray-600 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.room}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vue Mobile Portrait */}
      <div className="md:hidden landscape:hidden space-y-3">
        {WEEKDAYS.map((day, index) => {
          const dayEvents = eventsByDay[index] || [];
          const date = weekdayDates[index];
          const isToday = date && date.toDateString() === new Date().toDateString();
          const sortedEvents = [...dayEvents].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

          return (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`px-4 py-3 ${
                isToday 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wide">{day.full}</div>
                    {date && (
                      <div className="text-xs opacity-90 mt-0.5">{formatDate(date)}</div>
                    )}
                  </div>
                  <div className={`text-3xl font-bold ${isToday ? 'animate-pulse' : ''}`}>
                    {date ? date.getDate() : ''}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event) => {
                    const colors = COLORS[event.type] || COLORS.cours;
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                      >
                        <div className="flex gap-3">
                          <div className={`w-1 rounded-full bg-gradient-to-b ${colors.light}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-bold mb-1 ${colors.text} flex items-center gap-1`}>
                              <Clock className="w-3 h-3" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className={`font-semibold text-base mb-2 ${colors.text}`}>
                              {event.title}
                            </div>
                            {event.teacher && (
                              <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <User className="w-3 h-3" />
                                {event.teacher}
                              </div>
                            )}
                            {event.room && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.room}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400">Aucun cours</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vue Mobile Paysage - Compacte sans scroll */}
      <div className="hidden landscape:block md:landscape:hidden">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2">
            <div className="text-sm font-semibold">Emploi du temps • {events.length} cours</div>
          </div>
          <div className="grid grid-cols-6 divide-x divide-gray-200" style={{ height: 'calc(100vh - 180px)' }}>
            <div className="bg-gray-50 overflow-y-auto scrollbar-thin">
              <div className="sticky top-0 bg-gray-100 px-2 py-1 text-center text-xs font-bold border-b">⏰</div>
              {TIME_SLOTS.map(time => (
                <div key={time} className="h-12 px-2 flex items-center justify-center border-b border-gray-100 text-xs font-medium text-gray-600">
                  {time}
                </div>
              ))}
            </div>
            {[0, 1, 2, 3, 4].map((dayIndex) => {
              const dayEvents = eventsByDay[dayIndex] || [];
              const date = weekdayDates[dayIndex];
              const isToday = date && date.toDateString() === new Date().toDateString();
              return (
                <div key={dayIndex} className={`relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                  <div className={`sticky top-0 z-10 px-1 py-1 text-center border-b ${
                    isToday ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}>
                    <div className="text-xs font-bold">{WEEKDAYS[dayIndex].short}</div>
                    {date && <div className="text-sm font-bold">{date.getDate()}</div>}
                  </div>
                  <div className="relative" style={{ height: `${TIME_SLOTS.length * 48}px` }}>
                    {TIME_SLOTS.map(time => (
                      <div key={time} className="h-12 border-b border-gray-100" />
                    ))}
                    <div className="absolute inset-0 p-0.5">
                      {dayEvents.map((event) => {
                        const colors = COLORS[event.type] || COLORS.cours;
                        const startHour = parseInt(event.startTime?.split(':')[0] || 8);
                        const startMin = parseInt(event.startTime?.split(':')[1] || 0);
                        const endHour = parseInt(event.endTime?.split(':')[0] || startHour + 1);
                        const topOffset = ((startHour - 8) * 48) + (startMin * 48 / 60);
                        const duration = ((endHour * 60) - (startHour * 60 + startMin)) / 60;
                        const height = Math.max(duration * 48 - 2, 30);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`absolute left-0.5 right-0.5 rounded-lg border-l-2 cursor-pointer
                              bg-gradient-to-br ${colors.light} ${colors.border}
                              shadow-sm hover:shadow-md transition-all duration-200`}
                            style={{ top: `${topOffset}px`, height: `${height}px` }}
                          >
                            <div className="p-1 h-full overflow-hidden">
                              <div className={`text-[10px] font-bold ${colors.text} truncate`}>
                                {event.title}
                              </div>
                              <div className="text-[9px] text-gray-600 truncate">
                                {event.startTime}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal détails événement */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const colors = COLORS[selectedEvent.type] || COLORS.cours;
              return (
                <>
                  <div className={`bg-gradient-to-r ${colors.light} p-6 rounded-t-2xl border-l-8 ${colors.border}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${colors.text} mb-2 flex items-center gap-2`}>
                          <Clock className="w-4 h-4" />
                          {selectedEvent.startTime} - {selectedEvent.endTime}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedEvent.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedEvent.teacher && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Formateur</div>
                          <div className="font-medium">{selectedEvent.teacher}</div>
                        </div>
                      </div>
                    )}
                    {selectedEvent.room && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Salle</div>
                          <div className="font-medium">{selectedEvent.room}</div>
                        </div>
                      </div>
                    )}
                    {selectedEvent.group && (
                      <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                        {selectedEvent.group}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </>
  );
}
