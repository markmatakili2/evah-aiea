import { AlertCircle, Calendar, ClipboardCheck } from 'lucide-react';
import type { Notification, Test, Lab, TestResult, Withdrawal } from './types';
import type { HealthFacility } from './clinical-engine/types';

/**
 * @fileOverview Standardized mock data for the AI Epilepsy Assistant prototype.
 * All data is served locally to facilitate zero-backend demos.
 */

export const mockNotifications: Notification[] = [
    { id: '1', icon: AlertCircle, text: "Urgent review needed for Zahara Hassan", href: "/dashboard/records", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: '2', icon: ClipboardCheck, text: "Clinical guidance updated to WHO 2024", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: '3', icon: Calendar, text: "Monthly sync completed successfully", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];

export const mockUserProfile = {
    firstName: "Demo",
    surname: "Health Worker",
    name: "Demo Health Worker",
    role: "chw",
    email: "chw@demo.ai",
    phone: "+254 700 000 000",
    dob: "1990-05-15",
    gender: "Other",
    address: {
        line1: "Kijiji Health Post",
        city: "Local",
        country: "Kenya"
    },
    allowLocation: true,
    imageUrl: 'https://picsum.photos/seed/worker/200/200',
    location: "Kijiji Sector",
    imageHint: "profile person"
};

export const mockPatients = [
  { id: 'p1', name: 'Zahara Hassan', age: 24, gender: 'Female', location: 'Kijiji Village', status: 'Urgent', contact: '+254 711 000 111', updatedAt: new Date().toISOString(), chwId: 'demo-uid' },
  { id: 'p2', name: 'John Kamau', age: 45, gender: 'Male', location: 'Mlimani Sector', status: 'Stable', contact: '+254 722 000 222', updatedAt: new Date().toISOString(), chwId: 'demo-uid' },
  { id: 'p3', name: 'Amina Juma', age: 12, gender: 'Female', location: 'Pwani Area', status: 'Follow-up', contact: '+254 733 000 333', updatedAt: new Date().toISOString(), chwId: 'demo-uid' },
  { id: 'p4', name: 'David Omondi', age: 31, gender: 'Male', location: 'Ziwani Block', status: 'Stable', contact: '+254 744 000 444', updatedAt: new Date(Date.now() - 86400000).toISOString(), chwId: 'demo-uid' },
];

export const mockClinicians = [
  { id: 'c1', name: 'Dr. Sarah Mwangi', role: 'Senior Neurologist', hospital: 'National Referral', email: 's.mwangi@health.go.ke', phone: '+254 700 111 222', license: 'KMPDC-9982' },
  { id: 'c2', name: 'Dr. Robert Chen', role: 'General Practitioner', hospital: 'District General', email: 'r.chen@health.go.ke', phone: '+254 700 333 444', license: 'KMPDC-4421' },
];

export const mockCHWs = [
  { id: 'chw1', name: 'Alex Mutua', sector: 'Kijiji Village', activePatients: 28, email: 'a.mutua@chw.org', phone: '+254 711 555 666', performance: 'Excellent' },
  { id: 'chw2', name: 'Grace Achieng', sector: 'Mlimani Sector', activePatients: 15, email: 'g.achieng@chw.org', phone: '+254 711 777 888', performance: 'Good' },
];

export const mockHealthFacilities: HealthFacility[] = [
  {
    id: 'f1',
    name: 'National Referral Hospital',
    type: 'specialist',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    capabilities: ['ICU', 'Neurology Specialist', 'EEG', '24/7 Emergency'],
    contact: '+254 20 2726300',
    isOpen24h: true
  },
  {
    id: 'f2',
    name: 'District General Hospital',
    type: 'district',
    coordinates: { lat: -1.3000, lng: 36.8500 },
    capabilities: ['General Ward', 'CT Scan', 'Pharmacy', 'Emergency'],
    contact: '+254 20 1234567',
    isOpen24h: true
  },
  {
    id: 'f3',
    name: 'Kijiji Community Health Center',
    type: 'local',
    coordinates: { lat: -1.3100, lng: 36.8600 },
    capabilities: ['First Aid', 'Basic Meds', 'Observation'],
    contact: '+254 20 7654321',
    isOpen24h: false
  }
];

export const mockEncounters = [
  { 
    id: 'e1', 
    patientId: 'p1', 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
    summary: 'WHO Protocol: Emergency review. Patient reported 3 tonic-clonic seizures in 24 hours. Adherence check: missed 3 doses of Phenobarbital.', 
    redFlags: ['repeated', 'medicationFail'], 
    recommendation: { action: 'IMMEDIATE EMERGENCY REFERRAL', urgencyLevel: 'EMERGENCY', clinicalReasoning: 'WHO Status Epilepticus Risk detected. High frequency of repeated seizures coupled with treatment non-adherence.' } 
  },
  { 
    id: 'e2', 
    patientId: 'p2', 
    date: new Date(Date.now() - 86400000 * 15).toISOString(), 
    summary: 'Routine WHO follow-up. No seizure activity reported in last 3 months. Adherence is 100%. Family counseling provided on safety.', 
    redFlags: [], 
    recommendation: { action: 'Continue local management', urgencyLevel: 'STABLE', clinicalReasoning: 'Clinical signs suggest well-controlled epilepsy under current local protocols.' } 
  },
  {
    id: 'e3',
    patientId: 'p3',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    summary: 'Urgent review for pediatric onset. Fever reported alongside first focal seizure. WHO Pediatric Protocol triggered.',
    redFlags: ['newOnsetUnder5', 'feverNeck'],
    recommendation: { action: 'Refer for Clinician Review within 24h', urgencyLevel: 'URGENT', clinicalReasoning: 'Suspected underlying infection or fever-triggered seizure in a child under 5.' }
  },
  {
    id: 'e4',
    patientId: 'p4',
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    summary: 'Initial assessment. Seizure type generalized. Frequency 1/month. Triggers identified: Sleep deprivation.',
    redFlags: [],
    recommendation: { action: 'Continue monitoring and counseling', urgencyLevel: 'STABLE', clinicalReasoning: 'Infrequent seizures with clear triggers. Advised on sleep hygiene.' }
  }
];

export const mockTests: Test[] = [];
export const mockLabs: Lab[] = [];
export const mockTestRequests: any[] = [];
export const mockTestResults: TestResult[] = [];
export const mockWithdrawals: Withdrawal[] = [];
export const mockReferredUsers: any[] = [];
