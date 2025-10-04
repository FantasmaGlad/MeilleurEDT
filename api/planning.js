import * as cheerio from 'cheerio';

// Cache en mémoire avec TTL de 5 minutes
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const FORMATION_URLS = {
  CC: 'https://js-formation.ymag.cloud/index.php/planning/public/?typeRessource=63000&codeRessource=11606',
  HM: 'https://js-formation.ymag.cloud/index.php/planning/public/?typeRessource=63000&codeRessource=11606'
};

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { formation = 'CC', semaine } = req.query;

    if (!semaine) {
      return res.status(400).json({ 
        error: 'Le paramètre semaine est requis',
        example: '/api/planning?formation=CC&semaine=202540'
      });
    }

    // Vérifier le cache
    const cacheKey = `${formation}-${semaine}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cached.timestamp) / 1000)
      });
    }

    // Construire l'URL
    const baseUrl = FORMATION_URLS[formation] || FORMATION_URLS.CC;
    const url = `${baseUrl}&semaine=${semaine}`;

    // Fetch avec headers personnalisés
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Referer': 'https://js-formation.ymag.cloud/',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Parser les événements du planning
    const events = [];
    
    // Chercher les événements dans le HTML (adapter selon la structure réelle)
    $('.event, .planning-event, [class*="event"]').each((i, elem) => {
      const $elem = $(elem);
      
      const event = {
        id: i,
        title: $elem.find('.title, .event-title, [class*="title"]').text().trim() || 
               $elem.text().trim().split('\n')[0],
        startTime: $elem.find('.time, .event-time, [class*="time"]').first().text().trim(),
        endTime: $elem.find('.time, .event-time, [class*="time"]').last().text().trim(),
        room: $elem.find('.room, .salle, [class*="room"], [class*="salle"]').text().trim(),
        teacher: $elem.find('.teacher, .formateur, [class*="teacher"], [class*="formateur"]').text().trim(),
        type: detectEventType($elem.text()),
        day: $elem.closest('[data-day], .day, [class*="day"]').attr('data-day') || 
             $elem.closest('td, .col').index(),
        color: detectEventType($elem.text())
      };

      if (event.title) {
        events.push(event);
      }
    });

    // Si aucun événement trouvé avec la première méthode, essayer une approche plus générique
    if (events.length === 0) {
      $('td[class*="event"], div[class*="event"], .cours, .td, .tp').each((i, elem) => {
        const $elem = $(elem);
        const text = $elem.text().trim();
        
        if (text && text.length > 3) {
          events.push({
            id: i,
            title: text.split('\n')[0] || text.substring(0, 50),
            startTime: '',
            endTime: '',
            room: '',
            teacher: '',
            type: detectEventType(text),
            day: $elem.closest('td').index() || 0,
            color: detectEventType(text)
          });
        }
      });
    }

    // Préparer la réponse
    const data = {
      data: {
        events: events,
        meta: {
          formation,
          semaine,
          totalEvents: events.length
        }
      },
      cached: false,
      formation,
      semaine,
      timestamp: new Date().toISOString()
    };

    // Mettre en cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    // Nettoyer le cache des entrées expirées
    cleanCache();

    return res.status(200).json(data);

  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la récupération du planning',
      message: error.message,
      formation: req.query.formation,
      semaine: req.query.semaine
    });
  }
}

// Détecter le type de cours selon le contenu
function detectEventType(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('sport') || lowerText.includes('gym') || lowerText.includes('fitness')) {
    return 'sport';
  } else if (lowerText.includes('tp') || lowerText.includes('pratique')) {
    return 'tp';
  } else if (lowerText.includes('td') || lowerText.includes('dirigé')) {
    return 'td';
  } else {
    return 'cours';
  }
}

// Nettoyer le cache des entrées expirées
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}

