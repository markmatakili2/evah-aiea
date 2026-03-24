import { ClinicalInput, Recommendation, UrgencyLevel } from './types';

/**
 * @fileOverview WHO mhGAP-aligned clinical logic engine for epilepsy management at the PHC level.
 * Aligned with Kenyan national protocols and EVAH CDSS safety guidelines.
 */

export function runClinicalLogic(input: ClinicalInput): Recommendation {
  let riskScore = 0;
  const detectedFlags: string[] = [];
  
  // 1. DYNAMIC RED FLAG DETECTION
  // Prolonged Seizure (> 5 min) is an automated red flag
  if (Number(input.seizureHistory.duration) >= 5) {
    riskScore += 10;
    detectedFlags.push("Status Epilepticus Risk (Duration >= 5m)");
  }

  // Repeated seizures without recovery
  if (input.seizureHistory.isRepeated) {
    riskScore += 10;
    detectedFlags.push("Repeated Seizures (Cluster Risk)");
  }

  // Fever + Neck Stiffness
  if (input.underlyingCauses.fever && input.underlyingCauses.neckStiffness) {
    riskScore += 9;
    detectedFlags.push("CNS Infection Risk (Fever + Neck Stiffness)");
  }

  // Pregnancy
  if (input.patientProfile.isPregnant || (input.patientProfile.sex === 'female' && input.redFlags.isPregnant)) {
    riskScore += 9;
    detectedFlags.push("Eclampsia Risk (Pregnancy with Seizures)");
  }

  // Pediatric New Onset
  if (input.patientProfile.age < 5) {
    riskScore += 6;
    detectedFlags.push("Pediatric New-Onset (Under 5 years)");
  }

  // Sudden weakness
  if (input.underlyingCauses.suddenOnsetNeurological) {
    riskScore += 8;
    detectedFlags.push("Suspected Stroke/Acute Neurological Insult");
  }

  // Suggestion Framing Messages
  const antiStigmaMessages: string[] = [
    "Epilepsy is a medical condition of the brain, not a curse or a result of spirits.",
    "Epilepsy is NOT contagious. You cannot catch it by touch or saliva.",
    "Promote dignity: People with epilepsy can lead productive lives and participate in school/work."
  ];

  const safetyAdvice: string[] = [
    "Avoid cooking over open fires alone.",
    "Do not swim or bathe in deep water alone.",
    "Avoid working at heights or with heavy machinery.",
    "Seizure First Aid: Turn on side, cushion head, do NOT put items in mouth."
  ];

  const counselingPoints: string[] = [
    "Adherence is critical: Take medicine at the same time every day.",
    "Maintain a seizure diary to track frequency and triggers.",
    "Ensure adequate sleep and avoid excessive alcohol."
  ];

  // 2. PHARMACOLOGIC PRINCIPLES
  let medGuidance = "";
  if (input.currentManagement) {
    if (input.currentManagement.adherence === 'poor') {
      medGuidance = "PRIORITY: Adherence counseling required before any dosage escalation.";
    } else if (input.currentManagement.sideEffects.length > 0) {
      medGuidance = `Monitor side effects: ${input.currentManagement.sideEffects.join(", ")}. Dose adjustment may be required.`;
    }
  } else if (riskScore < 5 && input.seizureHistory.frequency !== 'none') {
    medGuidance = "Consider starting first-line anti-seizure medication per National Essential Medicines List.";
  }

  // 3. DETERMINING URGENCY & TARGET FACILITY
  let urgency: UrgencyLevel = 'STABLE';
  let action = "Continue local management and monthly monitoring.";
  let destination = "Local Health Post";
  let followUp = "Follow up in 2-4 weeks.";
  let targetFacilityType: 'specialist' | 'district' | 'local' = 'local';

  if (riskScore >= 9) {
    urgency = 'EMERGENCY';
    action = "IMMEDIATE EMERGENCY ESCALATION REQUIRED";
    destination = "Tertiary Specialist Unit / Hospital";
    followUp = "Immediate handover to specialized care.";
    targetFacilityType = 'specialist';
  } else if (riskScore >= 5) {
    urgency = 'URGENT';
    action = "Refer for Clinician Review within 24-48 hours.";
    destination = "District Hospital / Clinician";
    followUp = "Urgent diagnostic review.";
    targetFacilityType = 'district';
  }

  const reasoning = detectedFlags.length > 0 
    ? `Governance Log: WHO mhGAP Protocols Triggered due to: ${detectedFlags.join(", ")}.`
    : `Clinical signs suggest chronic stabilization phase. Focus on psychosocial support.`;

  return {
    urgencyLevel: urgency,
    action,
    referralDestination: destination,
    followUpInterval: followUp,
    counselingPoints,
    antiStigmaMessages,
    safetyAdvice,
    medicationGuidance: medGuidance,
    riskScore,
    clinicalReasoning: reasoning,
    clinicianReviewRequired: riskScore >= 5,
    targetFacilityType,
    detectedRedFlags: detectedFlags
  };
}
