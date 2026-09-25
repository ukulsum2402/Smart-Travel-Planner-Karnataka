export interface SeasonalInfo {
  seasonName: string;
  months: string;
  overallMood: string;
  suitabilityNote: string;
  malnadAdvice: string;
  coastalAdvice: string;
  heritageNorthAdvice: string;
}

export const KARNATAKA_SEASONAL_INFO: Record<string, SeasonalInfo> = {
  winter: {
    seasonName: 'Winter & Peak Season (Oct – Feb)',
    months: 'October to February',
    overallMood: 'Ideal time across all of Karnataka. Crisp mornings, clear blue skies, and balmy afternoons.',
    suitabilityNote: 'Best for all activities: trekking, temple exploration, heritage walks, beach activities, and coffee estate tours.',
    malnadAdvice: 'Chilly nights in Madikeri & Chikkamagaluru (14°C). Carry fleece jackets. Coffee picking season begins in Dec-Jan.',
    coastalAdvice: 'Gentle sea breezes in Gokarna & Udupi with crystal clear waters and open ferry services to St. Mary’s Islands.',
    heritageNorthAdvice: 'Comfortable day temperatures in Hampi & Badami, ideal for walking between open-air stone ruins.',
  },
  monsoon: {
    seasonName: 'Monsoon (June – Sept)',
    months: 'June to September',
    overallMood: 'Spectacular thunderous waterfalls, misty mountain passes, and lush emerald green carpets.',
    suitabilityNote: 'Unforgettable for waterfall lovers and romantic rain getaways; trekking on muddy steep ridges requires extra caution.',
    malnadAdvice: 'Waterfalls (Jog, Abbey, Hebbe) are at their roaring peak. Ghat roads can experience heavy rains and landslides; check local advisories.',
    coastalAdvice: 'High Arabian Sea waves; sea swimming and St. Mary’s Island boat ferries are suspended. Glorious coastal greenery.',
    heritageNorthAdvice: 'Moderate rainfall in Hampi and Badami. Rains bring relief and cool stone surfaces with dramatic stormy skies.',
  },
  summer: {
    seasonName: 'Summer (March – May)',
    months: 'March to May',
    overallMood: 'Warm to hot in plains; hill stations remain pleasant retreats with blooming coffee blossom aroma in March.',
    suitabilityNote: 'Visit hill stations (Coorg, Chikkamagaluru, Kemmanagundi) for cooler weather. Start heritage walks early at 7:00 AM.',
    malnadAdvice: 'March brings aromatic white coffee blossom fragrance. High peak treks best done at sunrise to avoid afternoon heat.',
    coastalAdvice: 'Humid coastal weather. Enjoy early morning swims and late sunset beach cafes.',
    heritageNorthAdvice: 'Hampi and Badami experience high heat (36°C - 40°C). Plan temple visits strictly between 6:30 AM – 10:30 AM and 4:30 PM – 6:30 PM.',
  },
};
