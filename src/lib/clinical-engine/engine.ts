import { ClinicalInput, Recommendation, UrgencyLevel } from './types';

/**
 * @fileOverview WHO mhGAP-aligned clinical logic engine for epilepsy management at the PHC level.
 * Aligned with Kenyan national protocols and EVAH CDSS safety guidelines.
 */

export function runClinicalLogic(input: ClinicalInput): Recommendation {
  let riskScore = 0;
  const detectedFlags: string[] = [];
  
  // Suggestion Framing Messages
  const framing = "SUGGESTION: Based on mhGAP protocols, the following management is proposed for your final decision.";

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

  // 1. EMERGENCY EVALUATION (mhGAP Step 1 - Safety Primary)
  if (input.redFlags.prolongedSeizure || input.redFlags.repeated) {
    riskScore += 10;
    detectedFlags.push("Status Epilepticus Risk (Prolonged/Repeated)");
  }
  if (input.redFlags.isPregnant || input.patientProfile.isPregnant) {
    riskScore += 9;
    detectedFlags.push("Pregnancy with Seizures (High Tier Eclampsia Risk)");
  }
  if (input.redFlags.feverNeck || input.underlyingCauses.suddenOnsetNeurological) {
    riskScore += 9;
    detectedFlags.push("Suspected CNS Infection (Meningitis/Encephalitis)");
  }
  if (input.redFlags.injury) {
    riskScore += 7;
    detectedFlags.push("Severe seizure-related trauma");
  }

  // 2. UNDERLYING CAUSES & SPECIAL POPULATIONS (Pediatrics)
  if (input.redFlags.newOnsetUnder5) {
    riskScore += 6;
    detectedFlags.push("Pediatric New-Onset (Under 5 years)");
  }
  if (input.underlyingCauses.headTrauma || input.underlyingCauses.perinatalInsult) {
    riskScore += 4;
    counselingPoints.push("Structural evaluate suggested due to trauma/birth history.");
  }

  // 3. PHARMACOLOGIC PRINCIPLES (Suggestive dose/titration)
  let medGuidance = "";
  if (input.currentManagement) {
    if (input.currentManagement.adherence === 'poor') {
      medGuidance = "PRIORITY: Adherence counseling required before any dosage escalation.";
    } else if (input.currentManagement.sideEffects.length > 0) {
      medGuidance = `Monitor side effects: ${input.currentManagement.sideEffects.join(", ")}. Dose adjustment or modification may be required.`;
    }
  } else if (riskScore < 5 && input.seizureHistory.frequency !== 'none') {
    medGuidance = "Consider starting first-line anti-seizure medication (e.g., Carbamazepine or Sodium Valproate) per National Essential Medicines List.";
  }

  // 4. DETERMINING URGENCY & TARGET FACILITY (GIS Guidance)
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
  } else if (riskScore >= 5 || input.redFlags.medicationFail) {
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
    targetFacilityType
  };
}
