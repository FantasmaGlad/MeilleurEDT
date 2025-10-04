import * as cheerio from 'cheerio';

// Cache en mémoire avec TTL de 5 minutes
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Configuration des formations avec les vraies URLs
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

export default async function handler(req, res) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`🚀 [${requestId}] Début de la requête`);
  console.log(`📋 [${requestId}] Méthode: ${req.method}, URL: ${req.url}`);

  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log(`✅ [${requestId}] OPTIONS request - CORS OK`);
    return res.status(200).end();
  }

  const logs = [];

  try {
    const { formation = 'CC', semaine, debug = 'false' } = req.query;

    console.log(`📊 [${requestId}] Paramètres reçus:`, { formation, semaine, debug });

    if (!semaine) {
      console.log(`❌ [${requestId}] Paramètre semaine manquant`);
      return res.status(400).json({
        error: 'Le paramètre semaine est requis',
        example: '/api/planning?formation=CC&semaine=202540',
        logs,
        requestId
      });
    }

    // Validation de la formation
    if (!FORMATION_CONFIG[formation]) {
      console.log(`❌ [${requestId}] Formation inconnue: ${formation}`);
      return res.status(400).json({
        error: `Formation inconnue: ${formation}. Utilisez CC ou HM`,
        formations: Object.keys(FORMATION_CONFIG),
        logs,
        requestId
      });
    }

    const config = FORMATION_CONFIG[formation];
    console.log(`✅ [${requestId}] Formation validée: ${config.nom}`);

    // Vérifier le cache
    const cacheKey = `${formation}-${semaine}`;
    const cached = cache.get(cacheKey);

    console.log(`🔍 [${requestId}] Recherche en cache pour clé: ${cacheKey}`);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const cacheAge = Math.floor((Date.now() - cached.timestamp) / 1000);
      console.log(`✅ [${requestId}] Cache HIT - Âge: ${cacheAge}s`);

      return res.status(200).json({
        ...cached.data,
        cached: true,
        cacheAge,
        logs: debug === 'true' ? logs : undefined,
        requestId,
        executionTime: `${Date.now() - startTime}ms`
      });
    }

    console.log(`❌ [${requestId}] Cache MISS - Récupération depuis la source`);

    // Construire l'URL complète
    const url = `${BASE_URL}?typeRessource=${config.typeRessource}&codeRessource=${config.codeRessource}&semaine=${semaine}`;

    console.log(`🌐 [${requestId}] URL construite: ${url}`);

    // Headers détaillés pour contourner les protections
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'Referer': BASE_URL
    };

    console.log(`📡 [${requestId}] Headers configurés:`, Object.keys(headers));

    // Fetch avec timeout et retry
    console.log(`🔄 [${requestId}] Tentative de connexion...`);

    const response = await fetch(url, {
      headers,
      timeout: 30000, // 30 secondes timeout
      // Note: Node.js fetch ne supporte pas nativement timeout, mais on peut l'implémenter
    });

    console.log(`📥 [${requestId}] Réponse reçue:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ [${requestId}] Erreur HTTP ${response.status}:`, errorText.substring(0, 500));

      throw new Error(`HTTP ${response.status}: ${response.statusText}. Réponse: ${errorText.substring(0, 200)}...`);
    }

    const html = await response.text();
    const htmlLength = html.length;

    console.log(`📄 [${requestId}] HTML reçu:`, {
      length: htmlLength,
      firstChars: html.substring(0, 200),
      lastChars: html.substring(htmlLength - 200)
    });

    // Vérification du contenu HTML
    if (htmlLength < 1000) {
      console.log(`⚠️ [${requestId}] HTML très court - possible erreur`);
    }

    if (!html.includes('planning') && !html.includes('Planning')) {
      console.log(`⚠️ [${requestId}] HTML ne contient pas le mot "planning"`);
    }

    const $ = cheerio.load(html);

    console.log(`🔍 [${requestId}] HTML parsé avec Cheerio`);

    // Analyser la structure HTML
    const pageStructure = {
      title: $('title').text(),
      h1: $('h1').length,
      tables: $('table').length,
      divs: $('div').length,
      scripts: $('script').length,
      hasCalendar: $('.calendar, #calendar, [class*="calendar"]').length > 0,
      hasPlanningTable: $('table[class*="planning"], .planning-table').length > 0,
      bodyClasses: $('body').attr('class') || 'none',
      forms: $('form').length,
      selects: $('select').length,
      inputs: $('input').length
    };

    console.log(`📊 [${requestId}] Structure de la page:`, pageStructure);

    // Chercher les éléments potentiels de planning
    const potentialElements = {
      tables: $('table').length,
      eventClasses: $('[class*="event"], [class*="cours"], [class*="seance"], [class*="planning"]').length,
      timeElements: $('[class*="time"], [class*="heure"], [class*="horaire"]').length,
      dayElements: $('[class*="day"], [class*="jour"], [data-day]').length,
      roomElements: $('[class*="room"], [class*="salle"], [class*="gym"]').length,
      teacherElements: $('[class*="teacher"], [class*="prof"], [class*="formateur"]').length
    };

    console.log(`🎯 [${requestId}] Éléments potentiels trouvés:`, potentialElements);

    // Parser les événements du planning
    const events = [];

    console.log(`🔎 [${requestId}] Démarrage de l'extraction des événements...`);

    // Méthode 1 : Chercher dans les tableaux (approche structurée)
    console.log(`📋 [${requestId}] Méthode 1 - Recherche dans les tableaux...`);

    $('table').each((tableIndex, table) => {
      const $table = $(table);
      const tableClasses = $table.attr('class') || '';
      const tableRows = $table.find('tr').length;
      const tableCells = $table.find('td, th').length;

      console.log(`  📋 [${requestId}] Tableau ${tableIndex + 1}: ${tableClasses} (${tableRows} lignes, ${tableCells} cellules)`);

      // Chercher dans les cellules du tableau
      $table.find('td, th').each((cellIndex, cell) => {
        const $cell = $(cell);
        const cellText = $cell.text().trim();
        const cellClasses = $cell.attr('class') || '';
        const cellStyle = $cell.attr('style') || '';
        const colspan = parseInt($cell.attr('colspan') || '1');
        const rowspan = parseInt($cell.attr('rowspan') || '1');

        // Ignorer les cellules vides ou trop courtes
        if (cellText.length < 3) return;

        // Ignorer les en-têtes de jour
        if (cellText.match(/^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)$/i)) {
          console.log(`    📅 [${requestId}] En-tête de jour ignoré: ${cellText}`);
          return;
        }

        // Chercher les patterns d'événements
        const hasTimePattern = /\d{1,2}[h:](\d{2})?/.test(cellText);
        const hasEventPattern = cellClasses.includes('event') ||
                               cellClasses.includes('cours') ||
                               cellClasses.includes('seance') ||
                               cellText.length > 10;

        if (hasEventPattern || hasTimePattern) {
          console.log(`    🎯 [${requestId}] Cellule candidate trouvée:`, {
            text: cellText.substring(0, 100),
            classes: cellClasses,
            hasTime: hasTimePattern,
            colspan,
            rowspan
          });

          // Extraire les informations
          const lines = cellText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

          const event = {
            id: events.length,
            title: lines[0] || cellText.substring(0, 50),
            startTime: extractTime(cellText, 'start'),
            endTime: extractTime(cellText, 'end'),
            room: extractRoom(cellText),
            teacher: extractTeacher(cellText),
            type: detectEventType(cellText),
            day: cellIndex, // À affiner selon la structure
            rawText: cellText,
            source: `table-${tableIndex}-cell-${cellIndex}`,
            position: { colspan, rowspan },
            debug: debug === 'true' ? {
              cellClasses,
              cellStyle,
              lines: lines.length,
              hasTimePattern,
              hasEventPattern
            } : undefined
          };

          if (event.title && event.title.length > 2) {
            events.push(event);
            console.log(`    ✅ [${requestId}] Événement ajouté:`, {
              id: event.id,
              title: event.title,
              type: event.type,
              startTime: event.startTime,
              endTime: event.endTime
            });
          } else {
            console.log(`    ❌ [${requestId}] Événement ignoré (titre trop court): ${event.title}`);
          }
        }
      });
    });

    const method1Count = events.length;
    console.log(`📊 [${requestId}] Méthode 1 terminée: ${method1Count} événements trouvés`);

    // Méthode 2 : Chercher les divs avec classes spécifiques
    if (events.length === 0) {
      console.log(`🔎 [${requestId}] Méthode 2 - Recherche dans les divs événements...`);

      $('[class*="event"], [class*="cours"], [class*="seance"], [class*="planning"]').each((i, elem) => {
        const $elem = $(elem);
        const text = $elem.text().trim();
        const classes = $elem.attr('class') || '';
        const id = $elem.attr('id') || '';
        const dataAttrs = {};

        // Récupérer tous les attributs data-*
        Object.keys($elem[0].attribs || {}).forEach(attr => {
          if (attr.startsWith('data-')) {
            dataAttrs[attr] = $elem.attr(attr);
          }
        });

        if (text.length > 5 && !events.some(e => e.rawText === text)) {
          const event = {
            id: events.length,
            title: text.split('\n')[0] || text.substring(0, 50),
            startTime: extractTime(text, 'start'),
            endTime: extractTime(text, 'end'),
            room: extractRoom(text),
            teacher: extractTeacher(text),
            type: detectEventType(text),
            day: parseInt($elem.attr('data-day') || '0'),
            rawText: text,
            source: `div-${i}`,
            debug: debug === 'true' ? {
              classes,
              id,
              dataAttrs,
              parentClasses: $elem.parent().attr('class') || ''
            } : undefined
          };

          events.push(event);
          console.log(`  ✅ [${requestId}] Événement div trouvé:`, {
            id: event.id,
            title: event.title,
            type: event.type,
            classes
          });
        }
      });

      console.log(`📊 [${requestId}] Méthode 2 terminée: ${events.length - method1Count} événements trouvés`);
    }

    // Méthode 3 : Extraction depuis les scripts JavaScript
    if (events.length === 0) {
      console.log(`🔎 [${requestId}] Méthode 3 - Recherche dans les scripts JavaScript...`);

      $('script').each((i, script) => {
        const scriptContent = $(script).html() || '';
        const scriptSrc = $(script).attr('src') || '';

        if (scriptContent && (scriptContent.includes('planning') || scriptContent.includes('events'))) {
          console.log(`  📜 [${requestId}] Script ${i + 1} trouvé:`, {
            length: scriptContent.length,
            src: scriptSrc,
            preview: scriptContent.substring(0, 200)
          });

          // Essayer d'extraire des objets JSON
          try {
            // Chercher des patterns JSON simples
            const jsonMatches = scriptContent.match(/\{[^{}]*"[^"]*"[^{}]*\}/g);
            if (jsonMatches) {
              console.log(`  📦 [${requestId}] ${jsonMatches.length} objets JSON potentiels trouvés`);
            }
          } catch (e) {
            console.log(`  ⚠️ [${requestId}] Erreur parsing script ${i + 1}:`, e.message);
          }
        }
      });
    }

    // Méthode 4 : Extraction générale du contenu textuel
    if (events.length === 0) {
      console.log(`🔎 [${requestId}] Méthode 4 - Extraction générale du contenu...`);

      const bodyText = $('body').text();
      const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 10);

      console.log(`📝 [${requestId}] Contenu du body:`, {
        totalLength: bodyText.length,
        linesCount: lines.length,
        sample: lines.slice(0, 5)
      });

      // Chercher des patterns d'événements dans le texte
      lines.forEach((line, index) => {
        if (line.length > 15 && /\d/.test(line) && !line.includes('Planning') && !line.includes('JURA SPORT')) {
          const event = {
            id: events.length,
            title: line.substring(0, 50),
            startTime: extractTime(line, 'start'),
            endTime: extractTime(line, 'end'),
            room: extractRoom(line),
            teacher: extractTeacher(line),
            type: detectEventType(line),
            day: Math.floor(index / 3), // Estimation
            rawText: line,
            source: `body-line-${index}`
          };

          if (event.title.length > 5) {
            events.push(event);
            console.log(`  ✅ [${requestId}] Événement texte trouvé:`, {
              id: event.id,
              title: event.title,
              type: event.type
            });
          }
        }
      });
    }

    // Nettoyer les événements dupliqués
    const uniqueEvents = events.filter((event, index, self) =>
      index === self.findIndex((e) => e.rawText === event.rawText && e.title === event.title)
    );

    const duplicatesRemoved = events.length - uniqueEvents.length;
    if (duplicatesRemoved > 0) {
      console.log(`🧹 [${requestId}] ${duplicatesRemoved} doublons supprimés`);
    }

    console.log(`📊 [${requestId}] RÉSULTAT FINAL:`, {
      eventsFound: uniqueEvents.length,
      methodsTried: events.length > 0 ? 4 : 'Toutes épuisées',
      sampleEvents: uniqueEvents.slice(0, 3).map(e => ({
        title: e.title,
        type: e.type,
        startTime: e.startTime,
        source: e.source
      }))
    });

    // Préparer la réponse
    const executionTime = Date.now() - startTime;
    const data = {
      data: {
        events: uniqueEvents,
        meta: {
          formation,
          semaine,
          totalEvents: uniqueEvents.length,
          executionTime: `${executionTime}ms`,
          source: 'js-formation.ymag.cloud'
        }
      },
      cached: false,
      formation,
      semaine,
      timestamp: new Date().toISOString(),
      logs: debug === 'true' ? logs : undefined,
      requestId,
      executionTime: `${executionTime}ms`
    };

    // Mettre en cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    console.log(`✅ [${requestId}] Réponse préparée et mise en cache (${executionTime}ms)`);

    // Nettoyer le cache des entrées expirées
    cleanCache();

    return res.status(200).json(data);

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`💥 [${requestId}] ERREUR FATALE (${executionTime}ms):`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.status(500).json({
      error: 'Erreur lors de la récupération du planning',
      message: error.message,
      formation: req.query.formation,
      semaine: req.query.semaine,
      requestId,
      logs,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      executionTime: `${executionTime}ms`
    });
  }
}

// Extraire l'horaire du texte
function extractTime(text, type = 'start') {
  // Patterns multiples pour détecter les horaires
  const timePatterns = [
    /(\d{1,2})[h:](\d{2})/,  // 8h00, 08:30, 8:45
    /(\d{1,2})[h:](\d{2})\s*-\s*(\d{1,2})[h:](\d{2})/, // 8h00 - 10h00
    /(\d{1,2}):(\d{2})/,     // 08:30, 9:15
    /(\d{1,2})\s*-\s*(\d{1,2})/  // 8 - 10
  ];

  for (const pattern of timePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      if (type === 'start' && matches.length >= 3) {
        return `${matches[1].padStart(2, '0')}:${matches[2].padStart(2, '0')}`;
      } else if (type === 'end' && matches.length >= 5) {
        return `${matches[3].padStart(2, '0')}:${matches[4].padStart(2, '0')}`;
      }
    }
  }

  return '';
}

// Extraire la salle du texte
function extractRoom(text) {
  const roomPatterns = [
    /(?:salle|Salle|gym|gymnase|Gymnase)\s*:?\s*([A-Za-z0-9\s]+)/i,
    /(?:studio|Studio)\s*([A-Za-z0-9\s]+)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:-\s*)?([A-Z]\d+|[A-Z]\s*\d*)/, // Salle A1, Gymnase Principal
    /([A-Z]\d+|[A-Z]\s*\d*)/  // A1, B2, etc.
  ];

  for (const pattern of roomPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 1) {
      return match[1].trim();
    }
  }

  return '';
}

// Extraire le formateur du texte
function extractTeacher(text) {
  const teacherPatterns = [
    /(?:formateur|Formateur|intervenant|Intervenant|prof|Prof)\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/,
    /(?:M\.|Mme|Mr|Mlle)\s+([A-Z][a-z]+)/,
    /([A-Z][a-z]+)\s+([A-Z][a-z]+)/  // Prénom Nom
  ];

  for (const pattern of teacherPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Prendre le dernier groupe de capture (le nom du prof)
      const lastGroup = match[match.length - 1];
      if (lastGroup && lastGroup.length > 2) {
        return lastGroup.trim();
      }
    }
  }

  return '';
}

// Détecter le type de cours selon le contenu
function detectEventType(text) {
  const lowerText = text.toLowerCase();

  // Mots-clés pour chaque type
  const typeKeywords = {
    sport: ['sport', 'gym', 'fitness', 'musculation', 'cardio', 'renforcement', 'haltéro', 'crossfit'],
    tp: ['tp', 'pratique', 'atelier', 'pratiquer', 'technique', 'application'],
    td: ['td', 'dirigé', 'dirigés', 'théorie', 'cours magistral', 'cm'],
    cours: ['cours', 'leçon', 'séance', 'session', 'formation']
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }

  return 'cours'; // Par défaut
}

// Nettoyer le cache des entrées expirées
function cleanCache() {
  const now = Date.now();
  const initialSize = cache.size;

  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }

  const finalSize = cache.size;
  if (initialSize !== finalSize) {
    console.log(`🧹 Cache nettoyé: ${initialSize} → ${finalSize} entrées`);
  }
}

