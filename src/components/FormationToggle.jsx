/**
 * Composant de switch entre les formations CC et HM
 */
export function FormationToggle({ formation, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange('CC')}
        className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
          formation === 'CC'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        CC
      </button>
      <button
        onClick={() => onChange('HM')}
        className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
          formation === 'HM'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        HM
      </button>
    </div>
  );
}

