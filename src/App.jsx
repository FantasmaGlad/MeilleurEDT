import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { FormationToggle } from './components/FormationToggle';
import { WeekNavigator } from './components/WeekNavigator';
import { PlanningCompact } from './components/PlanningCompact';
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
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* Header Ultra-Compact - Google Style */}
      <header className="bg-white border-b border-gray-200 shadow-sm animate-slideIn flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            {/* Titre avec logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
                P
              </div>
              <h1 className="text-base font-semibold text-gray-900">Planning BPJEPS</h1>
              {isMockData && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                  Test
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <FormationToggle formation={formation} onChange={handleFormationChange} />
              <button
                onClick={refresh}
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                aria-label="Rafraîchir"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal - FIXE sans scroll */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 py-2 overflow-hidden flex flex-col">
        {/* Navigation semaine - Mini */}
        <div className="mb-2 animate-fadeIn flex-shrink-0">
          <WeekNavigator
            weekNumber={weekNumber}
            year={year}
            weekDates={weekDates}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onToday={goToCurrentWeek}
          />
        </div>

        {/* Planning - Prend tout l'espace restant */}
        <div
          id="planning-container"
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          {loading && !error ? (
            <div className="h-full flex items-center justify-center"><LoadingState /></div>
          ) : error && !isCached && !isMockData ? (
            <div className="h-full flex items-center justify-center"><ErrorState error={error} onRetry={refresh} isCached={false} /></div>
          ) : (
            <div className="h-full animate-fadeIn">
              <PlanningCompact events={events} weekDates={weekDates} />
            </div>
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

    </div>
  );
}

export default App;

