import { Download, Loader2 } from 'lucide-react';

/**
 * Composant bouton d'export PNG
 */
export function ExportButton({ onClick, isExporting }) {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 touch-target"
      aria-label="Exporter en PNG"
      title="Exporter en PNG"
    >
      {isExporting ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Download className="w-6 h-6" />
      )}
    </button>
  );
}

