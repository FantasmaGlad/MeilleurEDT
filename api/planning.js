import * as cheerio from 'cheerio';

// Cache en mémoire avec TTL de 5 minutes
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

// Configuration des formations
const FORMATION_CONFIG = {
  CC: {
    typeRessource: '63000',
    codeRessource: '11606',
    nom: 'BPJEPS AF CC (Cours Collectifs)'
  },
  HM: {
    typeRessource: '63000',
    codeRessource: '11603',
    nom: 'BPJEPS AF HM (Haltérophilie Musculation)'
  }
};

const BASE_URL = 'https://js-formation.ymag.cloud/index.php/planning/public/';

// Jours de la semaine (sans week-end)
const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

export default async function handler(req, res) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`🚀 [${requestId}] Début de la requête`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { formation = 'CC', semaine, debug = 'false' } = req.query;

    console.log(`📊 [${requestId}] Paramètres:`, { formation, semaine });

    if (!semaine) {
      return res.status(400).json({
        error: 'Paramètre semaine requis',
        example: '/api/planning?formation=CC&semaine=202540'
      });
    }

    // Vérifier le cache
    const cacheKey = `${formation}-${semaine}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ [${requestId}] Cache HIT`);
      return res.status(200).json({
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cached.timestamp) / 1000)
      });
    }

    console.log(`❌ [${requestId}] Cache MISS`);

    const config = FORMATION_CONFIG[formation];
    const url = `${BASE_URL}?typeRessource=${config.typeRessource}&codeRessource=${config.codeRessource}&semaine=${semaine}`;

    console.log(`🌐 [${requestId}] URL: ${url}`);

    // Fetch avec headers anti-blocage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Referer': BASE_URL,
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    console.log(`📄 [${requestId}] HTML reçu: ${html.length} bytes`);

    const $ = cheerio.load(html);

    // Extraire UNIQUEMENT les événements du planning (pas les menus de sélection)
    const events = [];

    // Trouver la table du planning (celle qui contient les jours de la semaine)
    let planningTable = null;

    $('table').each((i, table) => {
      const $table = $(table);
      const headerText = $table.find('th, td').first().text().toLowerCase();
      
      // Chercher la table qui contient les jours de la semaine
      if (headerText.includes('lundi') || headerText.includes('semaine')) {
        planningTable = $table;
        console.log(`📋 [${requestId}] Table du planning trouvée (table ${i + 1})`);
        return false; // Break
      }
    });

    if (!planningTable) {
      console.log(`⚠️ [${requestId}] Table du planning non trouvée - fallback sur toutes les tables`);
      planningTable = $('table').first();
    }

    // Extraire les en-têtes (jours de la semaine)
    const dayHeaders = [];
    $(planningTable).find('tr').first().find('th, td').each((i, cell) => {
      const text = $(cell).text().trim().toLowerCase();
      if (WEEKDAYS.some(day => text.includes(day))) {
        dayHeaders.push({
          index: i,
          day: text
        });
        console.log(`  📅 [${requestId}] Jour trouvé: ${text} (colonne ${i})`);
      }
    });

    console.log(`📊 [${requestId}] ${dayHeaders.length} jours de semaine détectés`);

    // Parcourir les lignes du tableau (ignorer la première ligne d'en-têtes)
    $(planningTable).find('tr').slice(1).each((rowIndex, row) => {
      const $row = $(row);
      const timeCell = $row.find('td, th').first().text().trim();
      
      // Si la première cellule contient une heure, c'est une ligne du planning
      if (/^\d{1,2}[h:]?\d{0,2}$/.test(timeCell)) {
        const hourSlot = timeCell;

        // Parcourir les cellules de cette ligne
        $row.find('td').each((cellIndex, cell) => {
          if (cellIndex === 0) return; // Ignorer la colonne horaire

          const $cell = $(cell);
          const cellText = $cell.text().trim();
          const cellClasses = $cell.attr('class') || '';
          const cellStyle = $cell.attr('style') || '';
          const rowspan = parseInt($cell.attr('rowspan') || '1');
          const colspan = parseInt($cell.attr('colspan') || '1');

          // Ignorer les cellules vides
          if (cellText.length < 5) return;

          // Ignorer les cellules qui ne contiennent que des en-têtes
          if (cellText.match(/^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)$/i)) return;

          // Ignorer les menus de sélection et autres éléments UI
          if (cellText.includes('Sélectionnez') || cellText.includes('Appliquer')) return;

          // Extraire les informations de l'événement
          const lines = cellText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

          // Déterminer le jour (basé sur l'index de la cellule)
          let dayIndex = -1;
          for (let i = 0; i < dayHeaders.length; i++) {
            if (cellIndex === dayHeaders[i].index || (cellIndex >= dayHeaders[i].index && cellIndex < dayHeaders[i].index + colspan)) {
              dayIndex = i;
              break;
            }
          }

          // Si on ne trouve pas le jour exact, estimation
          if (dayIndex === -1 && cellIndex > 0) {
            dayIndex = Math.min(cellIndex - 1, 4); // Max 5 jours
          }

          const event = {
            id: events.length,
            title: lines[0] || 'Sans titre',
            description: lines.slice(1).join(' '),
            startTime: hourSlot,
            endTime: calculateEndTime(hourSlot, rowspan),
            day: Math.max(0, Math.min(dayIndex, 4)), // Entre 0 et 4 (lundi à vendredi)
            dayName: WEEKDAYS[Math.max(0, Math.min(dayIndex, 4))],
            duration: rowspan, // Nombre de créneaux horaires
            group: extractGroup(cellText),
            teacher: extractTeacher(cellText),
            room: extractRoom(cellText),
            type: detectEventType(cellText),
            color: getColorFromStyle(cellStyle, cellClasses),
            rawText: cellText,
            position: { row: rowIndex, col: cellIndex, rowspan, colspan }
          };

          events.push(event);
          console.log(`  ✅ [${requestId}] Événement: ${event.title} (${event.dayName} ${event.startTime})`);
        });
      }
    });

    // Filtrer et nettoyer les événements
    const cleanEvents = events.filter(e => 
      e.title.length > 3 && 
      !e.title.includes('JURA SPORT') &&
      !e.title.includes('Planning public')
    );

    console.log(`📊 [${requestId}] ${cleanEvents.length} événements extraits`);

    const executionTime = Date.now() - startTime;
    const data = {
      data: {
        events: cleanEvents,
        meta: {
          formation: config.nom,
          formationCode: formation,
          semaine,
          totalEvents: cleanEvents.length,
          weekdays: WEEKDAYS,
          executionTime: `${executionTime}ms`
        }
      },
      cached: false,
      formation,
      semaine,
      timestamp: new Date().toISOString(),
      requestId,
      executionTime: `${executionTime}ms`
    };

    // Mettre en cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    console.log(`✅ [${requestId}] Terminé en ${executionTime}ms`);

    cleanCache();

    return res.status(200).json(data);

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`💥 [${requestId}] ERREUR:`, error.message);

    return res.status(500).json({
      error: 'Erreur lors de la récupération du planning',
      message: error.message,
      requestId,
      executionTime: `${executionTime}ms`
    });
  }
}

// Calculer l'heure de fin en fonction de la durée (rowspan)
function calculateEndTime(startTime, rowspan) {
  const match = startTime.match(/(\d{1,2})[h:]?(\d{0,2})/);
  if (!match) return '';

  let hour = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;

  // Ajouter la durée (1 rowspan = 1 heure généralement)
  hour += rowspan;

  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Extraire le groupe de l'événement
function extractGroup(text) {
  // Chercher des patterns comme "25 26 MOIRANS BPJEPS AF HM CE"
  const groupMatch = text.match(/(\d{2}\s+\d{2}\s+[A-Z\s]+BPJEPS[A-Z\s]+)/);
  return groupMatch ? groupMatch[1].trim() : '';
}

// Extraire la salle
function extractRoom(text) {
  const lines = text.split('\n').map(l => l.trim());
  
  // Chercher les patterns de salle
  for (const line of lines) {
    if (line.match(/^[A-Z\s]+\d+$/)) return line; // CAP MAURIANA 2
    if (line.toLowerCase().includes('distance')) return 'A distance';
    if (line.toLowerCase().includes('prescrit')) return 'Prescrit';
    if (line.match(/^(Salle|Gymnase|Studio|SALLE|CAP|INSPE|MJC)/i)) return line;
  }

  return '';
}

// Extraire le formateur
function extractTeacher(text) {
  const lines = text.split('\n').map(l => l.trim());
  
  // Chercher des patterns comme "M. CARVALHO M." ou "Mme JACOTOT J."
  for (const line of lines) {
    if (line.match(/^(M\.|Mme|Mr|Mlle)\s+[A-Z]+/)) {
      return line;
    }
  }

  return '';
}

// Détecter le type de cours
function detectEventType(text) {
  const lower = text.toLowerCase();

  if (lower.includes('communication')) return 'communication';
  if (lower.includes('concevoir') || lower.includes('projet')) return 'projet';
  if (lower.includes('caractéristiques') || lower.includes('publics')) return 'théorie';
  if (lower.includes('tp') || lower.includes('pratique')) return 'tp';
  if (lower.includes('sport') || lower.includes('gym')) return 'sport';

  return 'cours';
}

// Extraire la couleur du style CSS
function getColorFromStyle(style, classes) {
  if (style.includes('rgb(144, 238, 144)') || classes.includes('green')) return '#90EE90'; // Vert
  if (style.includes('rgb(0, 255, 255)') || style.includes('cyan') || classes.includes('cyan')) return '#00FFFF'; // Cyan
  if (style.includes('rgb(255, 182, 193)') || classes.includes('pink')) return '#FFB6C1'; // Rose
  if (style.includes('rgb(255, 255, 0)') || classes.includes('yellow')) return '#FFFF00'; // Jaune

  // Couleurs par défaut selon le type
  return '#E3F2FD'; // Bleu clair par défaut
}

// Nettoyer le cache
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}
