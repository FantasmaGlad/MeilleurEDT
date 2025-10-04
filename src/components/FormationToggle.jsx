/**
 * Composant de switch entre les formations CC et HM - Style Google
 */
export function FormationToggle({ formation, onChange }) {
  return (
    <div className="inline-flex bg-white border border-gray-300 rounded-lg p-0.5 shadow-sm">
      <button
        onClick={() => onChange('CC')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
          formation === 'CC'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        CC
      </button>
      <button
        onClick={() => onChange('HM')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
          formation === 'HM'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        HM
      </button>
    </div>
  );
}

