import { Clock, MapPin, User } from 'lucide-react';
import { EVENT_TYPES } from '../utils/constants';

/**
 * Composant pour afficher une carte d'événement (cours)
 */
export function EventCard({ event }) {
  const eventType = event.type || 'cours';
  const colors = EVENT_TYPES[eventType] || EVENT_TYPES.cours;

  return (
    <div
      className={`${colors.bg} ${colors.text} rounded-lg p-3 border-l-4 ${colors.border} shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group`}
    >
      {/* Titre */}
      <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:line-clamp-none">
        {event.title}
      </h4>

      {/* Horaire */}
      {(event.startTime || event.endTime) && (
        <div className="flex items-center gap-1 text-xs mb-1">
          <Clock className="w-3 h-3" />
          <span>
            {event.startTime}
            {event.endTime && event.startTime !== event.endTime && ` - ${event.endTime}`}
          </span>
        </div>
      )}

      {/* Salle */}
      {event.room && (
        <div className="flex items-center gap-1 text-xs mb-1">
          <MapPin className="w-3 h-3" />
          <span>{event.room}</span>
        </div>
      )}

      {/* Formateur */}
      {event.teacher && (
        <div className="flex items-center gap-1 text-xs">
          <User className="w-3 h-3" />
          <span className="line-clamp-1">{event.teacher}</span>
        </div>
      )}

      {/* Badge type */}
      <div className="mt-2">
        <span className="inline-block px-2 py-1 text-xs font-medium rounded uppercase">
          {eventType}
        </span>
      </div>
    </div>
  );
}

