export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'STABLE';

export interface ClinicalInput {
  patientProfile: {
    age: number;
    sex: string;
    isPregnant?: boolean;
    weightKg?: number;
  };
  seizureHistory: {
    type: string;
    semiology: string[]; // motor, awareness level, vocalization
    duration: string;
    frequency: string;
    onsetAge?: string;
    triggers: string[];
    developmentalHistory?: string;
    comorbidities: string[];
  };
  underlyingCauses: {
    fever: boolean;
    headTrauma: boolean;
    perinatalInsult: boolean;
    metabolicSuspicion: boolean;
    suddenOnsetNeurological: boolean;
  };
  redFlags: {
    repeated: boolean;
    feverNeck: boolean;
    injury: boolean;
    newOnsetUnder5: boolean;
    medicationFail: boolean;
    isPregnant?: boolean;
    prolongedSeizure: boolean; // > 5 mins
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
  action: string;
  referralDestination: string;
  followUpInterval: string;
  counselingPoints: string[];
  antiStigmaMessages: string[];
  safetyAdvice: string[];
  medicationGuidance?: string;
  riskScore: number;
  clinicalReasoning: string;
  clinicianReviewRequired: boolean;
  targetFacilityType?: 'specialist' | 'district' | 'local';
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
