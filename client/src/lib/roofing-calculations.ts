import { MaterialPricing, CostBreakdown, CalculatorFormData, RoofingType, MaterialType, RoofSizeHelperData, PitchType } from '@/types/roofing';

// Material pricing data for 2025 Torrance, CA
export const materialPricing: Record<RoofingType, MaterialPricing> = {
  residential: {
    asphalt: [5, 10],
    clay: [11, 25],
    metal: [7, 20],
    wood: [8, 15],
    slate: [15, 40],
    membrane: [7, 12]
  },
  commercial: {
    tpo: [4, 8],
    pvc: [5, 9],
    epdm: [4, 9],
    modified: [4.5, 9],
    bur: [5.5, 10],
    metal: [8, 15],
    asphalt: [7, 10]
  }
};

export const materialLabels: Record<RoofingType, Record<string, string>> = {
  residential: {
    asphalt: 'Asphalt Shingles',
    clay: 'Clay/Concrete Tile',
    metal: 'Metal',
    wood: 'Wood Shake/Shingles',
    slate: 'Slate',
    membrane: 'Flat Membrane (EPDM/TPO)'
  },
  commercial: {
    tpo: 'TPO Membrane',
    pvc: 'PVC Membrane',
    epdm: 'EPDM Rubber',
    modified: 'Modified Bitumen',
    bur: 'Built-Up Roofing (BUR)',
    metal: 'Metal',
    asphalt: 'Asphalt Shingles'
  }
};

export function getMaterialOptions(roofingType: RoofingType) {
  const pricing = materialPricing[roofingType];
  const labels = materialLabels[roofingType];
  
  return Object.keys(pricing).map(material => ({
    value: material as MaterialType,
    label: `${labels[material]} ($${pricing[material][0]}-$${pricing[material][1]}/sq ft)`,
    costRange: pricing[material] as [number, number]
  }));
}

export function calculateRoofingCost(formData: CalculatorFormData): CostBreakdown | null {
  const { roofingType, roofSize, material, jobType, complexity, tearoff, permits } = formData;

  if (!roofSize || !material || roofSize <= 0) {
    return null;
  }

  const [lowCost, highCost] = materialPricing[roofingType][material];
  const midCost = (lowCost + highCost) / 2;

  // Base cost calculation
  let baseLow = roofSize * lowCost;
  let baseMid = roofSize * midCost;
  let baseHigh = roofSize * highCost;

  // Apply complexity multiplier to labor portion (40% of base cost)
  const complexityMultipliers = { simple: 0, medium: 0.2, complex: 0.4 };
  const complexityMultiplier = complexityMultipliers[complexity];
  
  const laborMultiplier = 1 + (complexityMultiplier * 0.4);
  baseLow *= laborMultiplier;
  baseMid *= laborMultiplier;
  baseHigh *= laborMultiplier;

  // Add commercial adjustment (+10% for scale)
  if (roofingType === 'commercial') {
    baseLow *= 1.1;
    baseMid *= 1.1;
    baseHigh *= 1.1;
  }

  // Calculate add-ons
  let addons = 0;
  if (tearoff && jobType === 'replacement') {
    addons += roofSize * 1.5; // $1.50/sq ft average
  }
  if (permits) {
    addons += 500; // $500 average
  }

  // Apply job type modifier for repairs
  if (jobType === 'repair') {
    baseLow *= 0.6;
    baseMid *= 0.6;
    baseHigh *= 0.6;
  }

  // Final totals
  const totalLow = baseLow + addons;
  const totalHigh = baseHigh + addons;
  const totalMid = baseMid + addons;

  // Calculate breakdown for chart (60% materials, 40% labor)
  const materialsCost = totalMid * 0.6;
  const laborCost = totalMid * 0.4;

  return {
    materials: materialsCost,
    labor: laborCost,
    addons: addons,
    totalLow: totalLow,
    totalHigh: totalHigh,
    totalMid: totalMid
  };
}

export function calculateRoofSize(data: RoofSizeHelperData): number {
  const { footprint, overhang, pitch } = data;

  if (!footprint || footprint <= 0) {
    return 0;
  }

  // Calculate overhang addition (perimeter approximation)
  const perimeter = 4 * Math.sqrt(footprint); // Approximate for square
  const overhangSqFt = (perimeter * overhang) / 12; // Convert inches to feet

  // Apply pitch multiplier
  const pitchMultipliers: Record<PitchType, number> = { 
    flat: 1.0, 
    low: 1.1, 
    medium: 1.3, 
    steep: 1.5 
  };
  const pitchMultiplier = pitchMultipliers[pitch];

  // Add waste factor (12.5% average)
  const wasteMultiplier = 1.125;

  return Math.round((footprint + overhangSqFt) * pitchMultiplier * wasteMultiplier);
}
