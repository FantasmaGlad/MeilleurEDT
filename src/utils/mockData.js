/**
 * Données mockées pour le développement local
 */

// Générer des événements de test
function generateMockEvents() {
  const coursTypes = ['cours', 'tp', 'td', 'sport'];
  const matieres = [
    'Anatomie',
    'Physiologie',
    'Méthodologie',
    'Musculation',
    'Cours Collectifs',
    'Nutrition',
    'Gestion',
    'Cardio Training',
    'Stretching'
  ];
  const salles = ['Salle A', 'Salle B', 'Gymnase', 'Studio', 'Salle 101', 'Extérieur'];
  const formateurs = [
    'M. Dupont',
    'Mme Martin',
    'M. Bernard',
    'Mme Dubois',
    'M. Thomas',
    'Mme Petit'
  ];

  const events = [];
  let eventId = 0;

  // Générer des événements pour chaque jour
  for (let day = 0; day < 7; day++) {
    // 2-4 événements par jour
    const numEvents = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numEvents; i++) {
      const startHour = 8 + Math.floor(Math.random() * 9); // 8h-17h
      const duration = 1 + Math.floor(Math.random() * 2); // 1-3h
      const endHour = startHour + duration;

      events.push({
        id: eventId++,
        title: matieres[Math.floor(Math.random() * matieres.length)],
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        room: salles[Math.floor(Math.random() * salles.length)],
        teacher: formateurs[Math.floor(Math.random() * formateurs.length)],
        type: coursTypes[Math.floor(Math.random() * coursTypes.length)],
        day: day,
        color: coursTypes[Math.floor(Math.random() * coursTypes.length)]
      });
    }
  }

  return events;
}

/**
 * Simule une réponse API
 */
export function getMockPlanningData(formation, semaine) {
  return {
    data: {
      events: generateMockEvents(),
      meta: {
        formation,
        semaine,
        totalEvents: 20,
        source: 'mock-data'
      }
    },
    cached: false,
    formation,
    semaine,
    timestamp: new Date().toISOString(),
    isMockData: true
  };
}

