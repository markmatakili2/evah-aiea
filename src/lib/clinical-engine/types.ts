export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'STABLE';

export interface ClinicalInput {
  patientProfile: {
    age: number;
    sex: string;
    isPregnant?: boolean;
  };
  seizureHistory: {
    type: string;
    duration: string;
    frequency: string;
    triggers: string[];
  };
  redFlags: {
    repeated: boolean;
    feverNeck: boolean;
    injury: boolean;
    newOnsetUnder5: boolean;
    medicationFail: boolean;
    isPregnant?: boolean;
  };
}

export interface Recommendation {
  urgencyLevel: UrgencyLevel;
  action: string;
  referralDestination: string;
  followUpInterval: string;
  counselingPoints: string[];
  riskScore: number; // 0-10
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

export interface SafetyWarning {
  id: string;
  message: string;
  isAcknowledged: boolean;
}
