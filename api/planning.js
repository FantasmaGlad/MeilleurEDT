import * as cheerio from 'cheerio';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

const FORMATION_CONFIG = {
  CC: {
    typeRessource: '63000',
    codeRessource: '11606',
    nom: 'BPJEPS AF CC'
  },
  HM: {
    typeRessource: '63000',
    codeRessource: '11603',
    nom: 'BPJEPS AF HM'
  }
};

const BASE_URL = 'https://js-formation.ymag.cloud/index.php/planning/public/';
const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

export default async function handler(req, res) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  // Mode développement - logs moins verbeux
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log(`🚀 [${requestId}] ${req.method} ${req.url}`);
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { formation = 'CC', semaine, debug = 'false' } = req.query;

    if (!semaine) {
      return res.status(400).json({
        error: 'Paramètre semaine requis',
        example: '/api/planning?formation=CC&semaine=202540'
      });
    }

    // Cache check
    const cacheKey = `${formation}-${semaine}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      if (isDev) console.log(`✅ [${requestId}] Cache HIT (${Math.floor((Date.now() - cached.timestamp) / 1000)}s)`);
      return res.status(200).json({
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cached.timestamp) / 1000)
      });
    }

    if (isDev) console.log(`❌ [${requestId}] Cache MISS`);

    const config = FORMATION_CONFIG[formation];
    const url = `${BASE_URL}?typeRessource=${config.typeRessource}&codeRessource=${config.codeRessource}&semaine=${semaine}`;

    // Fetch
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
    const $ = cheerio.load(html);

    // Extraire les événements
    const events = [];

    // Chercher dans les divs avec style background (événements colorés)
    $('div[style*="background"], td[style*="background"]').each((i, elem) => {
      const $elem = $(elem);
      const style = $elem.attr('style') || '';
      const text = $elem.text().trim();

      // Filtres
      if (text.length < 10) return;
      if (text.includes('Sélectionnez') || text.includes('Appliquer')) return;
      if (text.includes('JURA SPORT FORMATION')) return;

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 2) return;

      const firstLine = lines[0];
      if (firstLine.length < 3 || firstLine.length > 100) return;

      // Déterminer le jour
      let dayIndex = -1;
      let currentParent = $elem.parent();
      for (let level = 0; level < 5; level++) {
        const parentText = currentParent.text().toLowerCase();
        for (let d = 0; d < WEEKDAYS.length; d++) {
          if (parentText.includes(WEEKDAYS[d])) {
            dayIndex = d;
            break;
          }
        }
        if (dayIndex !== -1) break;
        currentParent = currentParent.parent();
      }

      // Fallback sur position
      if (dayIndex === -1) {
        const cellIndex = $elem.closest('td').index();
        if (cellIndex > 0 && cellIndex <= 5) {
          dayIndex = cellIndex - 1;
        }
      }

      const event = {
        id: events.length,
        title: firstLine,
        description: lines.slice(1).join(' '),
        startTime: extractTime(text, 'start'),
        endTime: extractTime(text, 'end'),
        day: Math.max(0, Math.min(dayIndex, 4)),
        dayName: dayIndex >= 0 ? WEEKDAYS[dayIndex] : 'inconnu',
        group: extractGroup(text),
        teacher: extractTeacher(text),
        room: extractRoom(text),
        type: detectEventType(text),
        color: extractColor(style),
        rawText: text
      };

      if (event.title.length >= 3 && !event.title.includes('Planning public')) {
        events.push(event);
      }
    });

    if (isDev) {
      console.log(`📊 [${requestId}] ${events.length} événements extraits en ${Date.now() - startTime}ms`);
    }

    const executionTime = Date.now() - startTime;
    const data = {
      data: {
        events,
        meta: {
          formation: config.nom,
          formationCode: formation,
          semaine,
          totalEvents: events.length,
          weekdays: WEEKDAYS.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
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

    cache.set(cacheKey, { data, timestamp: Date.now() });

    cleanCache();

    return res.status(200).json(data);

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`💥 [${requestId}] Erreur: ${error.message} (${executionTime}ms)`);

    return res.status(500).json({
      error: 'Erreur lors de la récupération du planning',
      message: error.message,
      formation: req.query.formation,
      semaine: req.query.semaine,
      requestId,
      executionTime: `${executionTime}ms`
    });
  }
}

// Extraction de l'horaire
function extractTime(text, type = 'start') {
  const timePatterns = [
    /(\d{1,2})[h:](\d{2})\s*(?:-|à)\s*(\d{1,2})[h:](\d{2})/i,
    /(\d{1,2})[h:](\d{2})/,
    /(\d{1,2})h/
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (type === 'start') {
        return `${match[1].padStart(2, '0')}:${match[2]  ? match[2].padStart(2, '0') : '00'}`;
      } else if (type === 'end' && match[3]) {
        return `${match[3].padStart(2, '0')}:${match[4] ? match[4].padStart(2, '0') : '00'}`;
      }
    }
  }
  return '';
}

// Extraction du groupe
function extractGroup(text) {
  const match = text.match(/(\d{2}\s+\d{2}\s+[A-Z\s]+BPJEPS[A-Z\s]+)/i);
  return match ? match[1].trim() : '';
}

// Extraction de la salle
function extractRoom(text) {
  const lines = text.split('\n').map(l => l.trim());
  
  for (const line of lines) {
    if (line.match(/^(CAP|INSPE|MJC|Salle|Gymnase|Studio)/i)) return line;
    if (line.toLowerCase().includes('distance')) return 'À distance';
    if (line.toLowerCase().includes('prescrit')) return 'Prescrit';
  }
  
  return '';
}

// Extraction du formateur
function extractTeacher(text) {
  const match = text.match(/(M\.|Mme|Mr)\s+[A-Z]+\s+[A-Z]\.?/i);
  return match ? match[0].trim() : '';
}

// Détection du type
function detectEventType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('communication')) return 'communication';
  if (lower.includes('concevoir') || lower.includes('projet')) return 'projet';
  if (lower.includes('caractéristiques') || lower.includes('publics')) return 'théorie';
  if (lower.includes('tp') || lower.includes('pratique')) return 'tp';
  if (lower.includes('sport') || lower.includes('gym')) return 'sport';
  return 'cours';
}

// Extraction de la couleur du style
function extractColor(style) {
  if (style.includes('rgb(144, 238, 144)') || style.includes('lightgreen')) return '#90EE90';
  if (style.includes('rgb(0, 255, 255)') || style.includes('cyan') || style.includes('aqua')) return '#00FFFF';
  if (style.includes('rgb(255, 182, 193)') || style.includes('pink')) return '#FFB6C1';
  if (style.includes('rgb(255, 255, 0)') || style.includes('yellow')) return '#FFFF00';
  return '#E3F2FD';
}

// Nettoyage du cache
function cleanCache() {
  const now = Date.now();
  const before = cache.size;
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
  if (cache.size !== before) {
    console.log(`🧹 Cache nettoyé: ${before} → ${cache.size} entrées`);
  }
}