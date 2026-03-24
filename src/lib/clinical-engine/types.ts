export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export interface ClinicalInput {
  patientProfile: {
    age: number;
    sex: string;
    isPregnant?: boolean;
    weightKg?: number;
  };
  seizureHistory: {
    type: string;
    semiology: string[];
    duration: string;
    frequency: string;
    onsetAge?: string;
    triggers: string[];
    developmentalHistory?: string;
    comorbidities: string[];
    isRepeated?: boolean;
  };
  underlyingCauses: {
    fever: boolean;
    headTrauma: boolean;
    perinatalInsult: boolean;
    metabolicSuspicion: boolean;
    suddenOnsetNeurological: boolean;
    neckStiffness?: boolean;
  };
  redFlags: {
    repeated: boolean;
    feverNeck: boolean;
    injury: boolean;
    newOnsetUnder5: boolean;
    medicationFail: boolean;
    isPregnant?: boolean;
    prolongedSeizure: boolean;
  };
  currentManagement?: {
    medication: string;
    dosage: string;
    adherence: 'good' | 'poor';
    sideEffects: string[];
  };
}

export interface Recommendation {
  urgencyLevel: UrgencyLevel;
  action: 'Counsel' | 'Refer' | 'Treat';
  actionDescription: string;
  referralDestination: string;
  followUpPlan: string;
  counselingPoints: string[];
  safetyWarnings: string[];
  riskScore: number;
  clinicalReasoning: string;
  targetFacilityType?: 'specialist' | 'district' | 'local';
  detectedRedFlags: string[];
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'specialist' | 'district' | 'local';
  coordinates: { lat: number; lng: number };
  capabilities: string[];
  contact: string;
  isOpen24h: boolean;
}
