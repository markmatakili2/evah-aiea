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
    date: new Date().toISOString(), 
    summary: 'Reported 3 seizures in 24h. Missed phenobarbital for 2 days. Family reports confusion post-seizure.', 
    redFlags: ['repeated', 'medicationFail'], 
    recommendation: { action: 'IMMEDIATE EMERGENCY REFERRAL', urgencyLevel: 'EMERGENCY', clinicalReasoning: 'Status Epilepticus Risk due to repeated seizures and medication non-adherence.' } 
  },
  { 
    id: 'e2', 
    patientId: 'p2', 
    date: new Date(Date.now() - 86400000 * 5).toISOString(), 
    summary: 'Routine follow-up. No seizures in 3 months. Adhering well to Carbamazepine.', 
    redFlags: [], 
    recommendation: { action: 'Continue local management', urgencyLevel: 'STABLE', clinicalReasoning: 'Clinical signs suggest controlled seizure activity.' } 
  }
];

export const mockTests: Test[] = [];
export const mockLabs: Lab[] = [];
export const mockTestRequests: any[] = [];
export const mockTestResults: TestResult[] = [];
export const mockWithdrawals: Withdrawal[] = [];
export const mockReferredUsers: any[] = [];
