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
  communication: { bg: 'bg-gradient-to-br from-blue-100 to-blue-200', border: 'border-l-4 border-blue-500', text: 'text-blue-900', ring: 'ring-blue-200' },
  projet: { bg: 'bg-gradient-to-br from-green-100 to-green-200', border: 'border-l-4 border-green-500', text: 'text-green-900', ring: 'ring-green-200' },
  théorie: { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', border: 'border-l-4 border-purple-500', text: 'text-purple-900', ring: 'ring-purple-200' },
  tp: { bg: 'bg-gradient-to-br from-orange-100 to-orange-200', border: 'border-l-4 border-orange-500', text: 'text-orange-900', ring: 'ring-orange-200' },
  sport: { bg: 'bg-gradient-to-br from-red-100 to-red-200', border: 'border-l-4 border-red-500', text: 'text-red-900', ring: 'ring-red-200' },
  cours: { bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200', border: 'border-l-4 border-cyan-500', text: 'text-cyan-900', ring: 'ring-cyan-200' }
};

export function PlanningCompact({ events = [], weekDates = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsByDay = {};
  for (let i = 0; i < 5; i++) {
    eventsByDay[i] = events.filter(e => e.day === i);
  }

  const weekdayDates = weekDates.slice(0, 5);

  return (
    <>
      {/* Vue Desktop/Tablette - STATIQUE 100% visible */}
      <div className="hidden md:block bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header mini */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-3 py-1.5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">📅 Emploi du temps</span>
            <span className="bg-white/25 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold">
              {events.length} cours
            </span>
          </div>
        </div>

        {/* Grille - Prend tout l'espace restant */}
        <div className="grid grid-cols-6 flex-1 min-h-0">
          {/* Colonne horaire */}
          <div className="border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col">
            <div className="bg-gray-100 px-2 py-1 text-center border-b border-gray-200 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-600">⏰</span>
            </div>
            <div className="flex-1 flex flex-col">
              {TIME_SLOTS.map((time, idx) => (
                <div
                  key={time}
                  className={`flex-1 flex items-center justify-center border-b border-gray-100 ${
                    idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-600">{time}</span>
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
                <div className={`px-2 py-1 text-center border-b border-gray-200 flex-shrink-0 transition-all ${
                  isToday 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'bg-gradient-to-b from-white to-gray-50'
                }`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'animate-pulse-soft' : 'text-gray-600'}`}>
                    {WEEKDAYS[dayIndex].short}
                  </div>
                  {date && (
                    <div className={`text-base font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
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
                      />
                    ))}
                  </div>

                  {/* Événements */}
                  <div className="absolute inset-0 p-0.5">
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
                          className={`absolute left-0.5 right-0.5 rounded-lg cursor-pointer
                            ${colors.bg} ${colors.border}
                            shadow-md hover:shadow-xl hover:ring-2 ${colors.ring}
                            transition-all duration-300 ease-out
                            hover:z-20 hover:-translate-y-px
                            opacity-0 animate-fadeIn`}
                          style={{
                            top: `${startOffset}%`,
                            height: `${Math.max(duration, 4)}%`,
                            animationDelay: `${dayIndex * 40 + idx * 25}ms`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <div className="p-1 h-full overflow-hidden flex flex-col justify-center">
                            <div className={`text-[9px] font-bold mb-0.5 ${colors.text} flex items-center gap-0.5`}>
                              <Clock className="w-2 h-2" />
                              {event.startTime || `${startHour}h`}
                            </div>
                            <div className={`font-bold text-[11px] leading-tight ${colors.text}`} style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {event.title}
                            </div>
                            {duration > 6 && event.teacher && (
                              <div className="text-[8px] text-gray-700 mt-0.5 truncate">
                                {event.teacher}
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