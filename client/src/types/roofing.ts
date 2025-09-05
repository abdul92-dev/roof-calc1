export type RoofingType = 'residential' | 'commercial';

export type MaterialType = 
  | 'asphalt' 
  | 'clay' 
  | 'metal' 
  | 'wood' 
  | 'slate' 
  | 'membrane'
  | 'tpo'
  | 'pvc'
  | 'epdm'
  | 'modified'
  | 'bur';

export type JobType = 'new' | 'replacement' | 'repair';

export type ComplexityType = 'simple' | 'medium' | 'complex';

export type PitchType = 'flat' | 'low' | 'medium' | 'steep';

export interface MaterialPricing {
  [key: string]: [number, number]; // [low, high] prices per sq ft
}

export interface MaterialOption {
  value: MaterialType;
  label: string;
  costRange: [number, number];
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  addons: number;
  totalLow: number;
  totalHigh: number;
  totalMid: number;
}

export interface CalculatorFormData {
  roofingType: RoofingType;
  roofSize: number;
  material: MaterialType | '';
  jobType: JobType;
  complexity: ComplexityType;
  tearoff: boolean;
  permits: boolean;
}

export interface RoofSizeHelperData {
  footprint: number;
  overhang: number;
  pitch: PitchType;
}
