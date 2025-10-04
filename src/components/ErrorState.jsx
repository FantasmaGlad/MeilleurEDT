import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Composant d'état d'erreur avec bouton retry
 */
export function ErrorState({ error, onRetry, isCached }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Erreur de chargement
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          {error || 'Une erreur est survenue lors du chargement du planning.'}
        </p>

        {isCached && (
          <p className="text-sm text-gray-500 text-center mb-4">
            Les données affichées proviennent du cache et peuvent être obsolètes.
          </p>
        )}
        
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    </div>
  );
}

