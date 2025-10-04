import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { FormationToggle } from './components/FormationToggle';
import { WeekNavigator } from './components/WeekNavigator';
import { PlanningGridGoogle } from './components/PlanningGridGoogle';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Titre */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Planning BPJEPS AF
              </h1>
              {isMockData && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Données de test
                </span>
              )}
              {isCached && !isMockData && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Cache
                </span>
              )}
            </div>

            {/* Toggle Formation */}
            <FormationToggle formation={formation} onChange={handleFormationChange} />

            {/* Bouton Refresh (Desktop uniquement) */}
            <button
              onClick={refresh}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Rafraîchir"
            >
              <RefreshCw className="w-4 h-4" />
              Rafraîchir
            </button>
          </div>

          {/* Sous-titre formation */}
          <div className="mt-2 text-center sm:text-left">
            <p className="text-sm text-gray-600">
              {FORMATIONS[formation]}
            </p>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation semaine */}
        <div className="mb-6">
          <WeekNavigator
            weekNumber={weekNumber}
            year={year}
            weekDates={weekDates}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onToday={goToCurrentWeek}
          />
        </div>

        {/* Planning avec transition */}
        <div
          id="planning-container"
          className={`transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {loading && !error ? (
            <LoadingState />
          ) : error && !isCached ? (
            <ErrorState error={error} onRetry={refresh} isCached={false} />
          ) : (
            <>
              {error && isCached && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Impossible de récupérer les dernières données. Affichage des données en cache.
                  </p>
                </div>
              )}
              <PlanningGridGoogle events={events} weekDates={weekDates} />
            </>
          )}
        </div>
      </main>

      {/* Bouton Export flottant */}
      {!loading && !error && events.length > 0 && (
        <ExportButton onClick={handleExport} isExporting={isExporting} />
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        <p>Planning BPJEPS AF · {new Date().getFullYear()}</p>
        <p className="mt-1">
          Données synchronisées depuis{' '}
          <a
            href="https://js-formation.ymag.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            JS Formation
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

