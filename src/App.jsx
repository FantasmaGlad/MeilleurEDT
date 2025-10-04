import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { FormationToggle } from './components/FormationToggle';
import { WeekNavigator } from './components/WeekNavigator';
import { PlanningGoogleStyled } from './components/PlanningGoogleStyled';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { ExportButton } from './components/ExportButton';
import { useWeekCalculator } from './hooks/useWeekCalculator';
import { usePlanning } from './hooks/usePlanning';
import { useExport } from './hooks/useExport';
import { saveLastFormation, getLastFormation } from './utils/cache';
import { FORMATIONS } from './utils/constants';

function App() {
  const [formation, setFormation] = useState(() => getLastFormation());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    currentWeek,
    weekNumber,
    year,
    weekDates,
    goToNextWeek,
    goToPreviousWeek,
    goToCurrentWeek
  } = useWeekCalculator();

  const { data, events, loading, error, isCached, refresh } = usePlanning(formation, currentWeek);
  const { exportToPNG, isExporting } = useExport();
  
  // Détecter si on utilise des données mockées
  const isMockData = data?.isMockData || false;

  // Sauvegarder la formation sélectionnée
  useEffect(() => {
    saveLastFormation(formation);
  }, [formation]);

  // Gérer le changement de formation avec transition
  const handleFormationChange = (newFormation) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setFormation(newFormation);
      setIsTransitioning(false);
    }, 150);
  };

  // Gérer l'export PNG
  const handleExport = () => {
    exportToPNG('planning-container', formation, currentWeek);
  };

  // Gérer le swipe sur mobile (bonus)
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - semaine suivante
        goToNextWeek();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - semaine précédente
        goToPreviousWeek();
      }
    };

    const element = document.getElementById('planning-container');
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [goToNextWeek, goToPreviousWeek]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header Google Style - Compact */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 animate-slideIn">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Titre avec logo Google style */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                  P
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Planning BPJEPS
                </h1>
              </div>
              {isMockData && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Test
                </span>
              )}
              {isCached && !isMockData && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Cache
                </span>
              )}
            </div>

            {/* Controls - Compact */}
            <div className="flex items-center gap-3">
              <FormationToggle formation={formation} onChange={handleFormationChange} />
              <button
                onClick={refresh}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                aria-label="Rafraîchir"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">Rafraîchir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal - Sans scroll */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 overflow-hidden">
        {/* Navigation semaine - Compact */}
        <div className="mb-4 animate-fadeIn">
          <WeekNavigator
            weekNumber={weekNumber}
            year={year}
            weekDates={weekDates}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onToday={goToCurrentWeek}
          />
        </div>

        {/* Planning - Hauteur flexible */}
        <div
          id="planning-container"
          className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          {loading && !error ? (
            <div className="animate-fadeIn"><LoadingState /></div>
          ) : error && !isCached ? (
            <div className="animate-scaleIn"><ErrorState error={error} onRetry={refresh} isCached={false} /></div>
          ) : (
            <>
              {error && isCached && (
                <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-3 animate-slideIn">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Données en cache • Impossible de récupérer les dernières données
                  </p>
                </div>
              )}
              <div className="animate-fadeIn">
                <PlanningGoogleStyled events={events} weekDates={weekDates} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bouton Export - Style Google */}
      {!loading && !error && events.length > 0 && (
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
            disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-full 
            shadow-lg hover:shadow-xl transition-all duration-300 z-50 touch-target
            hover:scale-110 active:scale-95 animate-scaleIn"
          aria-label="Exporter en PNG"
          title="Exporter en PNG"
          style={{ animationDelay: '500ms' }}
        >
          {isExporting ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
      )}

      {/* Footer - Compact */}
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500 animate-fadeIn">
        <p>
          Planning BPJEPS AF • {new Date().getFullYear()} •{' '}
          <a
            href="https://js-formation.ymag.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            JS Formation
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

