import { ClinicalInput, Recommendation, UrgencyLevel } from './types';

/**
 * @fileOverview WHO mhGAP-aligned clinical logic engine for epilepsy management.
 * Provides structured outputs: Urgency Level, Action, Follow-up Plan, and Counseling/Safety.
 */

export function runClinicalLogic(input: ClinicalInput): Recommendation {
  let riskScore = 0;
  const detectedFlags: string[] = [];
  
  // 1. DYNAMIC RED FLAG DETECTION
  if (Number(input.seizureHistory.duration) >= 5) {
    riskScore += 10;
    detectedFlags.push("Status Epilepticus Risk (Duration >= 5m)");
  }

  if (input.seizureHistory.isRepeated) {
    riskScore += 10;
    detectedFlags.push("Repeated Seizures (Cluster Risk)");
  }

  if (input.underlyingCauses.fever && input.underlyingCauses.neckStiffness) {
    riskScore += 9;
    detectedFlags.push("CNS Infection Risk (Fever + Neck Stiffness)");
  }

  if (input.patientProfile.isPregnant || (input.patientProfile.sex === 'female' && input.redFlags.isPregnant)) {
    riskScore += 9;
    detectedFlags.push("Eclampsia Risk (Pregnancy with Seizures)");
  }

  if (input.patientProfile.age < 5) {
    riskScore += 6;
    detectedFlags.push("Pediatric New-Onset (Under 5 years)");
  }

  if (input.underlyingCauses.suddenOnsetNeurological) {
    riskScore += 8;
    detectedFlags.push("Suspected Stroke/Acute Neurological Insult");
  }

  // Counseling & Safety Messages
  const counselingPoints: string[] = [
    "Epilepsy is a brain condition, not a curse.",
    "Epilepsy is NOT contagious.",
    "Adherence is critical: Take medicine at the same time every day.",
    "Maintain a seizure diary."
  ];

  const safetyWarnings: string[] = [
    "Avoid cooking over open fires alone.",
    "Do not swim or bathe in deep water alone.",
    "Avoid working at heights.",
    "First Aid: Turn on side, cushion head, NO items in mouth."
  ];

  // 2. DETERMINING PARAMETERS
  let urgency: UrgencyLevel = 'ROUTINE';
  let actionType: 'Counsel' | 'Refer' | 'Treat' = 'Counsel';
  let actionDescription = "Continue local management and monthly monitoring.";
  let destination = "Local Health Post";
  let followUp = "Follow up in 4 weeks for routine assessment.";
  let targetFacilityType: 'specialist' | 'district' | 'local' = 'local';

  if (riskScore >= 9) {
    urgency = 'EMERGENCY';
    actionType = 'Refer';
    actionDescription = "IMMEDIATE EMERGENCY REFERRAL REQUIRED.";
    destination = "Tertiary Specialist Unit";
    followUp = "Immediate specialist handover. Post-discharge review in 7 days.";
    targetFacilityType = 'specialist';
  } else if (riskScore >= 5) {
    urgency = 'URGENT';
    actionType = 'Refer';
    actionDescription = "Refer for Clinician Review within 24-48 hours.";
    destination = "District Hospital";
    followUp = "Urgent diagnostic review and follow-up in 2 weeks.";
    targetFacilityType = 'district';
  } else {
    // If established patient but stable, we might "Treat" (continue meds)
    if (input.seizureHistory.frequency !== 'none') {
      actionType = 'Treat';
      actionDescription = "Continue first-line anti-seizure medication per protocol.";
    }
  }

  const reasoning = detectedFlags.length > 0 
    ? `Protocol Triggered: ${detectedFlags.join(", ")}.`
    : `Stable chronic phase.`;

  return {
    urgencyLevel: urgency,
    action: actionType,
    actionDescription,
    referralDestination: destination,
    followUpPlan: followUp,
    counselingPoints,
    safetyWarnings,
    riskScore,
    clinicalReasoning: reasoning,
    targetFacilityType,
    detectedRedFlags: detectedFlags
  };
}
