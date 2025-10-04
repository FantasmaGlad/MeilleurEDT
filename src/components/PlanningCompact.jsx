import { useState } from 'react';
import { formatDate } from '../utils/dateHelpers';
import { Clock, MapPin, User, X } from 'lucide-react';

const WEEKDAYS = [
  { short: 'LUN', full: 'Lundi' },
  { short: 'MAR', full: 'Mardi' },
  { short: 'MER', full: 'Mercredi' },
  { short: 'JEU', full: 'Jeudi' },
  { short: 'VEN', full: 'Vendredi' }
];

const TIME_SLOTS = ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'];

const COLORS = {
  communication: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-900',
    ring: 'ring-blue-200',
    hover: 'hover:from-blue-200 hover:to-blue-300'
  },
  projet: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200',
    border: 'border-l-4 border-green-500',
    text: 'text-green-900',
    ring: 'ring-green-200',
    hover: 'hover:from-green-200 hover:to-green-300'
  },
  théorie: {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    border: 'border-l-4 border-purple-500',
    text: 'text-purple-900',
    ring: 'ring-purple-200',
    hover: 'hover:from-purple-200 hover:to-purple-300'
  },
  tp: {
    bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    border: 'border-l-4 border-orange-500',
    text: 'text-orange-900',
    ring: 'ring-orange-200',
    hover: 'hover:from-orange-200 hover:to-orange-300'
  },
  sport: {
    bg: 'bg-gradient-to-br from-red-100 to-red-200',
    border: 'border-l-4 border-red-500',
    text: 'text-red-900',
    ring: 'ring-red-200',
    hover: 'hover:from-red-200 hover:to-red-300'
  },
  cours: {
    bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    border: 'border-l-4 border-cyan-500',
    text: 'text-cyan-900',
    ring: 'ring-cyan-200',
    hover: 'hover:from-cyan-200 hover:to-cyan-300'
  }
};

export function PlanningCompact({ events = [], weekDates = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsByDay = {};
  for (let i = 0; i < 5; i++) {
    eventsByDay[i] = events.filter(e => e.day === i);
  }

  const weekdayDates = weekDates.slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      {/* Vue Desktop/Tablette - STATIQUE 100% visible */}
      <div className="hidden md:block bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header ultra-compact avec gradient */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-sm">📅</span>
              </div>
              <span className="text-sm font-bold">Emploi du temps</span>
            </div>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
              {events.length} cours
            </span>
          </div>
        </div>

        {/* Grille - Prend tout l'espace restant */}
        <div className="grid grid-cols-6 flex-1 min-h-0">
          {/* Colonne horaire */}
          <div className="border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col">
            <div className="bg-gray-100 px-3 py-2 text-center border-b border-gray-200 flex-shrink-0">
              <span className="text-xs font-bold text-gray-600">⏰</span>
            </div>
            <div className="flex-1 flex flex-col">
              {TIME_SLOTS.map((time, idx) => (
                <div
                  key={time}
                  className={`flex-1 flex items-center justify-center border-b border-gray-100 transition-colors ${
                    idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  <span className="text-xs font-bold text-gray-600">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonnes des jours */}
          {[0, 1, 2, 3, 4].map((dayIndex) => {
            const dayEvents = eventsByDay[dayIndex] || [];
            const date = weekdayDates[dayIndex];
            const isToday = date && date.toDateString() === new Date().toDateString();

            return (
              <div
                key={dayIndex}
                className={`border-r last:border-r-0 relative flex flex-col transition-all duration-300 ${
                  isToday ? 'bg-blue-50/40' : ''
                }`}
              >
                {/* Header jour */}
                <div className={`px-3 py-2 text-center border-b border-gray-200 flex-shrink-0 transition-all ${
                  isToday
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gradient-to-b from-white to-gray-50'
                }`}>
                  <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'animate-pulse-soft' : 'text-gray-600'}`}>
                    {WEEKDAYS[dayIndex].short}
                  </div>
                  {date && (
                    <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </div>
                  )}
                </div>

                {/* Zone événements - Flex-1 */}
                <div className="flex-1 relative min-h-0">
                  {/* Lignes horaires */}
                  <div className="absolute inset-0 flex flex-col">
                    {TIME_SLOTS.map((time, idx) => (
                      <div
                        key={time}
                        className={`flex-1 border-b border-gray-100 ${
                          idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                        }`}
                        style={{ minHeight: '48px' }}
                      />
                    ))}
                  </div>

                  {/* Événements */}
                  <div className="absolute inset-0 p-1">
                    {dayEvents.map((event, idx) => {
                      const colors = COLORS[event.type] || COLORS.cours;

                      const startHour = parseInt(event.startTime?.split(':')[0] || event.startTime?.split('h')[0] || 8);
                      const startMin = parseInt(event.startTime?.split(':')[1] || 0);
                      const endHour = parseInt(event.endTime?.split(':')[0] || event.endTime?.split('h')[0] || (startHour + 2));
                      const endMin = parseInt(event.endTime?.split(':')[1] || 0);

                      // Calculer en pourcentage pour que ce soit flexible
                      const totalMinutes = TIME_SLOTS.length * 60;
                      const startOffset = ((startHour - 8) * 60 + startMin) / totalMinutes * 100;
                      const duration = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / totalMinutes * 100;

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`absolute left-1 right-1 rounded-xl cursor-pointer
                            ${colors.bg} ${colors.border}
                            shadow-lg hover:shadow-xl hover:ring-4 ${colors.ring}
                            transition-all duration-300 ease-out
                            hover:z-20 hover:-translate-y-1 hover:scale-[1.02]
                            opacity-0 animate-fadeIn`}
                          style={{
                            top: `${startOffset}%`,
                            height: `${Math.max(duration, 5)}%`,
                            animationDelay: `${dayIndex * 50 + idx * 30}ms`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <div className="p-2 h-full overflow-hidden flex flex-col justify-center">
                            <div className={`text-xs font-bold mb-1 ${colors.text} flex items-center gap-1`}>
                              <Clock className="w-3 h-3" />
                              {event.startTime || `${startHour}h`}
                            </div>
                            <div className={`font-bold text-sm leading-tight ${colors.text}`} style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {event.title}
                            </div>
                            {duration > 8 && event.teacher && (
                              <div className="text-xs text-gray-700 mt-1 truncate">
                                👤 {event.teacher}
                              </div>
                            )}
                            {duration > 10 && event.room && (
                              <div className="text-xs text-gray-700 truncate">
                                📍 {event.room}
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

      {/* Vue Mobile Portrait - Cartes espacées et modernes */}
      <div className="md:hidden landscape:hidden space-y-4 pb-24">
        {WEEKDAYS.map((day, index) => {
          const dayEvents = eventsByDay[index] || [];
          const date = weekdayDates[index];
          const isToday = date && date.toDateString() === new Date().toDateString();
          const sortedEvents = [...dayEvents].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

          return (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 opacity-0 animate-fadeIn" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
              <div className={`px-4 py-3 transition-all duration-500 ${
                isToday
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      isToday ? 'bg-white/20 text-white animate-pulse-soft' : 'bg-white/50 text-gray-900'
                    }`}>
                      {date ? date.getDate() : ''}
                    </div>
                    <div>
                      <div className="text-lg font-bold uppercase tracking-wide">{day.full}</div>
                      {date && (
                        <div className={`text-sm ${isToday ? 'text-white/80' : 'text-gray-600'}`}>
                          {formatDate(date)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`text-base font-bold ${isToday ? 'text-white' : 'text-gray-600'}`}>
                    {sortedEvents.length} cours
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event, idx) => {
                    const colors = COLORS[event.type] || COLORS.cours;
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group"
                      >
                        <div className="flex gap-3">
                          <div className={`w-1.5 rounded-full ${colors.bg} ${colors.border}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold mb-2 ${colors.text} flex items-center gap-2 group-hover:scale-105 transition-transform`}>
                              <Clock className="w-4 h-4" />
                              {event.startTime} {event.endTime && `- ${event.endTime}`}
                            </div>
                            <div className={`font-bold text-lg mb-2 ${colors.text} leading-tight`}>
                              {event.title}
                            </div>
                            <div className="space-y-1.5">
                              {event.teacher && (
                                <div className="text-sm text-gray-700 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{event.teacher}</span>
                                </div>
                              )}
                              {event.room && (
                                <div className="text-sm text-gray-700 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{event.room}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-2xl mb-3">📅</div>
                    <div className="text-gray-500 font-semibold text-lg">Aucun cours prévu</div>
                    <div className="text-gray-400 text-sm mt-1">Libre ce jour</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vue Mobile Paysage - Grille ultra-compacte */}
      <div className="hidden landscape:block md:landscape:hidden">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-3 py-1.5">
            <div className="text-xs font-bold">📅 {events.length} cours cette semaine</div>
          </div>
          <div className="grid grid-cols-6 divide-x divide-gray-200" style={{ height: 'calc(100vh - 150px)' }}>
            <div className="bg-gray-50">
              <div className="sticky top-0 bg-gray-100 px-1 py-1 text-center text-[10px] font-bold border-b">⏰</div>
              {TIME_SLOTS.map((time, idx) => (
                <div key={time} className={`flex items-center justify-center border-b border-gray-100 text-[10px] font-semibold text-gray-600 ${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`} style={{ height: `calc((100vh - 180px) / ${TIME_SLOTS.length})` }}>
                  {time}
                </div>
              ))}
            </div>
            {[0, 1, 2, 3, 4].map((dayIndex) => {
              const dayEvents = eventsByDay[dayIndex] || [];
              const date = weekdayDates[dayIndex];
              const isToday = date && date.toDateString() === new Date().toDateString();
              return (
                <div key={dayIndex} className={`relative ${isToday ? 'bg-blue-50/40' : ''}`}>
                  <div className={`sticky top-0 z-10 px-1 py-1 text-center border-b transition-all ${
                    isToday ? 'bg-blue-500 text-white shadow' : 'bg-white'
                  }`}>
                    <div className="text-[10px] font-bold">{WEEKDAYS[dayIndex].short}</div>
                    {date && <div className="text-sm font-bold">{date.getDate()}</div>}
                  </div>
                  <div className="relative" style={{ height: `calc((100vh - 180px))` }}>
                    {TIME_SLOTS.map((time, idx) => (
                      <div key={time} className={`border-b border-gray-100 ${
                        idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                      }`} style={{ height: `calc((100vh - 180px) / ${TIME_SLOTS.length})` }} />
                    ))}
                    <div className="absolute inset-0 p-0.5">
                      {dayEvents.map((event) => {
                        const colors = COLORS[event.type] || COLORS.cours;
                        const startHour = parseInt(event.startTime?.split(':')[0] || event.startTime?.split('h')[0] || 8);
                        const startMin = parseInt(event.startTime?.split(':')[1] || 0);
                        const endHour = parseInt(event.endTime?.split(':')[0] || event.endTime?.split('h')[0] || (startHour + 2));
                        const slotHeight = (window.innerHeight - 180) / TIME_SLOTS.length;
                        const topOffset = ((startHour - 8) * slotHeight) + (startMin * slotHeight / 60);
                        const duration = ((endHour * 60) - (startHour * 60 + startMin)) / 60;
                        const height = Math.max(duration * slotHeight - 2, 28);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`absolute left-0.5 right-0.5 rounded-lg cursor-pointer
                              ${colors.bg} ${colors.border}
                              shadow-sm hover:shadow-md hover:ring-1 ${colors.ring}
                              transition-all duration-200`}
                            style={{ top: `${topOffset}px`, height: `${height}px` }}
                          >
                            <div className="p-0.5 h-full overflow-hidden">
                              <div className={`text-[8px] font-bold ${colors.text} truncate`}>
                                {event.title}
                              </div>
                              {height > 35 && (
                                <div className="text-[7px] text-gray-600 truncate">
                                  {event.startTime}
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
      </div>

      {/* Modal détails */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const colors = COLORS[selectedEvent.type] || COLORS.cours;
              return (
                <>
                  <div className={`${colors.bg} p-5 rounded-t-2xl ${colors.border}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${colors.text} mb-2 flex items-center gap-2`}>
                          <Clock className="w-4 h-4" />
                          {selectedEvent.startTime} - {selectedEvent.endTime || 'N/A'}
                        </div>
                        <h3 className={`text-xl font-bold ${colors.text}`}>
                          {selectedEvent.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="p-2 hover:bg-white/30 rounded-full transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {selectedEvent.teacher && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">Formateur</div>
                          <div className="font-semibold text-gray-900">{selectedEvent.teacher}</div>
                        </div>
                      </div>
                    )}
                    {selectedEvent.room && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">Salle</div>
                          <div className="font-semibold text-gray-900">{selectedEvent.room}</div>
                        </div>
                      </div>
                    )}
                    {selectedEvent.group && (
                      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}