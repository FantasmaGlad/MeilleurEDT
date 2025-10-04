import { useState } from 'react';
import html2canvas from 'html2canvas';

/**
 * Hook personnalisé pour gérer l'export PNG du planning
 */
export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  /**
   * Exporter le planning en PNG
   * @param {string} elementId - ID de l'élément à capturer
   * @param {string} formation - Code formation (CC ou HM)
   * @param {string} week - Semaine au format AAAASS
   */
  const exportToPNG = async (elementId, formation, week) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Élément non trouvé');
      }

      // Capturer l'élément avec html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Qualité 2x
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Convertir en blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Erreur lors de la création de l\'image');
        }

        // Créer un lien de téléchargement
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Générer le nom de fichier
        const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
        const year = week.substring(0, 4);
        const weekNum = week.substring(4, 6);
        link.download = `Planning_BPJEPS_${formation}_Semaine_${weekNum}_${date}.png`;
        
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Nettoyer
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, 'image/png');

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setExportError(error.message || 'Erreur lors de l\'export');
      setIsExporting(false);
    }
  };

  return {
    exportToPNG,
    isExporting,
    exportError
  };
}

