import { ClinicalInput, Recommendation, UrgencyLevel } from './types';

/**
 * @fileOverview WHO mhGAP-aligned clinical logic engine for epilepsy management at the PHC level.
 */

export function runClinicalLogic(input: ClinicalInput): Recommendation {
  let riskScore = 0;
  const detectedFlags: string[] = [];
  
  const antiStigmaMessages: string[] = [
    "Epilepsy is a medical condition of the brain, not a curse or a result of spirits.",
    "Epilepsy is NOT contagious. You cannot catch it by touch or saliva.",
    "People with epilepsy can lead productive lives, go to school, and work."
  ];

  const safetyAdvice: string[] = [
    "Avoid cooking over open fires alone.",
    "Do not swim or bathe in deep water alone.",
    "Avoid working at heights or with heavy machinery.",
    "In case of a seizure: Turn the person on their side, cushion the head, do NOT put anything in the mouth."
  ];

  const counselingPoints: string[] = [
    "Adherence is critical: Take medicine at the same time every day.",
    "Maintain a seizure diary to track frequency and triggers.",
    "Ensure adequate sleep and avoid excessive alcohol."
  ];

  // 1. EMERGENCY EVALUATION (mhGAP Step 1)
  if (input.redFlags.prolongedSeizure || input.redFlags.repeated) {
    riskScore += 10;
    detectedFlags.push("Status Epilepticus Risk (Prolonged or Repeated Seizures)");
  }
  if (input.redFlags.isPregnant || input.patientProfile.isPregnant) {
    riskScore += 9;
    detectedFlags.push("Pregnancy with Seizures (Eclampsia/Neurological Risk)");
  }
  if (input.redFlags.feverNeck || input.underlyingCauses.suddenOnsetNeurological) {
    riskScore += 9;
    detectedFlags.push("Suspected CNS Infection or Acute Neurological Event");
  }
  if (input.redFlags.injury) {
    riskScore += 7;
    detectedFlags.push("Severe seizure-related injury");
  }

  // 2. UNDERLYING CAUSES & COMORBIDITIES
  if (input.underlyingCauses.headTrauma || input.underlyingCauses.perinatalInsult) {
    riskScore += 4;
    counselingPoints.push("History of brain insult noted; requires specialist structural evaluation.");
  }

  // 3. MEDICATION GUIDANCE (mhGAP Pharmacologic Principles)
  let medGuidance = "";
  if (input.currentManagement) {
    if (input.currentManagement.adherence === 'poor') {
      medGuidance = "PRIORITY: Adherence counseling required before adjusting dosage.";
    } else if (input.currentManagement.sideEffects.length > 0) {
      medGuidance = `Monitor side effects: ${input.currentManagement.sideEffects.join(", ")}. Consult clinician if worsening.`;
    }
  } else if (riskScore < 5 && input.seizureHistory.frequency !== 'none') {
    medGuidance = "Consider starting first-line anti-seizure medication (e.g., Carbamazepine or Valproate) per local PHC protocol.";
  }

  // 4. DETERMINING URGENCY
  let urgency: UrgencyLevel = 'STABLE';
  let action = "Continue local management and monitoring.";
  let destination = "Local Health Post";
  let followUp = "Follow up in 2-4 weeks.";
  let targetFacilityType: 'specialist' | 'district' | 'local' = 'local';

  if (riskScore >= 9) {
    urgency = 'EMERGENCY';
    action = "IMMEDIATE EMERGENCY REFERRAL";
    destination = "Tertiary Hospital / Specialist Unit";
    followUp = "Immediate handover to emergency team.";
    targetFacilityType = 'specialist';
  } else if (riskScore >= 5 || input.redFlags.medicationFail) {
    urgency = 'URGENT';
    action = "Refer for Clinician Review within 24-48 hours.";
    destination = "District Hospital / Clinician";
    followUp = "Review in 48 hours.";
    targetFacilityType = 'district';
  } else if (input.underlyingCauses.metabolicSuspicion || input.redFlags.newOnsetUnder5) {
    urgency = 'URGENT';
    action = "Refer for diagnostic workup (Labs/Pediatric review).";
    destination = "District Hospital";
    targetFacilityType = 'district';
  }

  const reasoning = detectedFlags.length > 0 
    ? `WHO mhGAP Protocols Triggered: ${detectedFlags.join(", ")}. High risk indicators identified.`
    : `Clinical signs suggest chronic management phase. Focus on adherence and anti-stigma counseling.`;

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
