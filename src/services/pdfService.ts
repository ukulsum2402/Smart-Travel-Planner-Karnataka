import { Trip } from '../types';

export const pdfService = {
  /**
   * Generates / prepares PDF export for a trip.
   * Simulates API request to future GET /api/trips/:id/pdf, then triggers high-fidelity browser print.
   */
  async exportTripPdf(trip: Trip): Promise<{ success: boolean; message: string }> {
    // Simulate brief network delay for generation
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Trigger native browser PDF printing which renders the dedicated print media styles
      window.print();
      return {
        success: true,
        message: `Generated print-ready PDF for ${trip.title}`,
      };
    } catch (e) {
      console.error('PDF generation error', e);
      return {
        success: false,
        message: 'Could not trigger PDF generator. Please use your browser Print function.',
      };
    }
  },
};
