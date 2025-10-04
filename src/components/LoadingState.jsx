/**
 * Composant d'état de chargement avec skeleton loader
 */
export function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      {/* En-tête skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      
      {/* Grille skeleton */}
      <div className="grid grid-cols-8 gap-2">
        {/* Colonne horaire */}
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Colonnes jours */}
        {[...Array(7)].map((_, dayIndex) => (
          <div key={dayIndex} className="space-y-2">
            {/* Header jour */}
            <div className="h-12 bg-gray-300 rounded"></div>
            
            {/* Events */}
            {[...Array(3 + Math.floor(Math.random() * 4))].map((_, eventIndex) => (
              <div 
                key={eventIndex} 
                className="h-24 bg-gray-200 rounded"
                style={{ 
                  marginTop: `${Math.random() * 40}px` 
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

