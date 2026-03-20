import { ClinicalInput, Recommendation, UrgencyLevel } from './types';

/**
 * @fileOverview Rule-based clinical logic engine aligned with WHO Epilepsy Guidelines.
 * Handles seizure classification, risk scoring, and triage recommendations.
 */

export function runClinicalLogic(input: ClinicalInput): Recommendation {
  let riskScore = 0;
  const detectedFlags: string[] = [];
  const counselingPoints: string[] = [
    "Advise family on safety during seizures (avoiding heights, open fires, water).",
    "Ensure consistent medication adherence at fixed times daily.",
    "Keep a seizure diary to track patterns and triggers."
  ];

  // 1. Evaluate Red Flags (WHO Guidelines)
  if (input.redFlags.repeated) {
    riskScore += 10;
    detectedFlags.push("Status Epilepticus Risk (Repeated seizures)");
  }
  if (input.redFlags.feverNeck) {
    riskScore += 9;
    detectedFlags.push("Suspected CNS Infection (Meningitis/Encephalitis)");
  }
  if (input.redFlags.isPregnant) {
    riskScore += 9;
    detectedFlags.push("Pregnancy-related seizure complication");
  }
  if (input.redFlags.injury) {
    riskScore += 7;
    detectedFlags.push("Severe seizure-related injury");
  }
  if (input.redFlags.newOnsetUnder5) {
    riskScore += 8;
    detectedFlags.push("New onset pediatric seizures with fever");
  }
  if (input.redFlags.medicationFail) {
    riskScore += 5;
    detectedFlags.push("Medication failure at correct dosage");
  }

  // 2. Determine Urgency and Destination
  let urgency: UrgencyLevel = 'STABLE';
  let action = "Continue local management and monitoring.";
  let destination = "Local Health Post";
  let followUp = "Follow up in 2 weeks.";
  let reviewRequired = false;

  if (riskScore >= 9) {
    urgency = 'EMERGENCY';
    action = "IMMEDIATE EMERGENCY REFERRAL";
    destination = "Tertiary Hospital / Specialist Unit";
    followUp = "Immediate handover to emergency team.";
    reviewRequired = true;
    counselingPoints.push("Stay with patient, ensure airway is clear, do not put items in mouth.");
  } else if (riskScore >= 5) {
    urgency = 'URGENT';
    action = "Refer for Clinician Review within 24-48 hours.";
    destination = "District Hospital / Clinician";
    followUp = "Review in 48 hours.";
    reviewRequired = true;
  } else if (input.seizureHistory.type === 'unknown' || input.seizureHistory.frequency === 'frequent') {
    urgency = 'ROUTINE';
    action = "Scheduled referral for diagnosis confirmation.";
    destination = "General Outpatient Clinic";
    followUp = "Review in 1 month.";
  }

  // 3. Clinical Reasoning Construction
  const reasoning = detectedFlags.length > 0 
    ? `Patient profile triggers safety alerts: ${detectedFlags.join(", ")}. These markers indicate high neurological risk or treatment instability.`
    : `Clinical signs suggest controlled seizure activity. Standard follow-up protocols apply.`;

  return {
    urgencyLevel: urgency,
    action,
    referralDestination: destination,
    followUpInterval: followUp,
    counselingPoints,
    riskScore,
    clinicalReasoning: reasoning,
    clinicianReviewRequired: reviewRequired
  };
}
