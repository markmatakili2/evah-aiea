import { AlertCircle, Calendar, ClipboardCheck } from 'lucide-react';
import type { Notification, Patient, UserProfile, Encounter } from './types';
import type { HealthFacility } from './clinical-engine/types';
import { addDays } from 'date-fns';

/**
 * @fileOverview WHO mhGAP-aligned mock data for the AI Epilepsy Assistant prototype.
 */

export const mockNotifications: Notification[] = [
    { id: '1', icon: AlertCircle, text: "Urgent review needed for Zahara Hassan", href: "/dashboard/records", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: '2', icon: ClipboardCheck, text: "Clinical guidance updated to mhGAP 2024", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: '3', icon: Calendar, text: "Monthly sync completed successfully", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];

export const mockUserProfile: UserProfile = {
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

export const mockPatients: Patient[] = [
  { 
    id: 'p1', 
    name: 'Zahara Hassan', 
    age: 24, 
    gender: 'Female', 
    location: 'Kijiji Village', 
    status: 'Urgent', 
    contact: '+254 711 000 111', 
    updatedAt: new Date().toISOString(), 
    nextFollowUpDate: new Date().toISOString(),
    chwId: 'chw1', 
    chwName: 'Alex Mutua' 
  },
  { 
    id: 'p2', 
    name: 'John Kamau', 
    age: 45, 
    gender: 'Male', 
    location: 'Mlimani Sector', 
    status: 'Stable', 
    contact: '+254 722 000 222', 
    updatedAt: new Date().toISOString(), 
    nextFollowUpDate: addDays(new Date(), 14).toISOString(),
    chwId: 'chw2', 
    chwName: 'Grace Achieng' 
  },
  { 
    id: 'p3', 
    name: 'Amina Juma', 
    age: 12, 
    gender: 'Female', 
    location: 'Pwani Area', 
    status: 'Follow-up', 
    contact: '+254 733 000 333', 
    updatedAt: new Date().toISOString(), 
    nextFollowUpDate: addDays(new Date(), 3).toISOString(),
    chwId: 'chw1', 
    chwName: 'Alex Mutua' 
  },
  { 
    id: 'p4', 
    name: 'David Omondi', 
    age: 31, 
    gender: 'Male', 
    location: 'Ziwani Block', 
    status: 'Stable', 
    contact: '+254 744 000 444', 
    updatedAt: new Date(Date.now() - 86400000).toISOString(), 
    nextFollowUpDate: addDays(new Date(), 21).toISOString(),
    chwId: 'chw2', 
    chwName: 'Grace Achieng' 
  },
];

export const mockEncounters: Encounter[] = [
  {
    id: 'e1',
    patientId: 'p1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    summary: 'Emergency presentation: Prolonged convulsive seizure lasting 7 minutes. Status Epilepticus protocol initiated. Patient was stabilized and referral to tertiary hospital recommended.',
    redFlags: ['Prolonged Seizure (> 5 min)', 'Repeated Seizures without recovery'],
    recommendation: { 
      action: 'IMMEDIATE EMERGENCY REFERRAL', 
      urgencyLevel: 'EMERGENCY',
      referralDestination: 'KUTRRH',
      antiStigmaMessages: ["Epilepsy is a medical condition of the brain."],
      safetyAdvice: ["Avoid cooking over open fires alone."]
    },
    type: 'Emergency',
    authorName: 'Alex Mutua',
    authorRole: 'CHW'
  },
  {
    id: 'e2',
    patientId: 'p1',
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    summary: 'Routine review. Patient reporting good adherence to medication. Seizure frequency decreased to 1 per month.',
    redFlags: [],
    recommendation: { 
      action: 'Continue current management and adherence counseling.', 
      urgencyLevel: 'STABLE',
      referralDestination: 'Local Health Post',
      antiStigmaMessages: ["Promote dignity: People with epilepsy can lead productive lives."],
      safetyAdvice: ["Ensure adequate sleep."]
    },
    type: 'Routine',
    authorName: 'Alex Mutua',
    authorRole: 'CHW'
  }
];

export const mockClinicians = [
  { id: 'c1', name: 'Dr. Sarah Mwangi', role: 'Senior Neurologist', hospital: 'National Referral', email: 's.mwangi@health.go.ke', phone: '+254 700 111 222', license: 'KMPDC-9982', status: 'Approved' },
  { id: 'c2', name: 'Dr. Robert Chen', role: 'General Practitioner', hospital: 'District General', email: 'r.chen@health.go.ke', phone: '+254 700 333 444', license: 'KMPDC-4421', status: 'Approved' },
  { id: 'c3', name: 'Dr. Emily Wanjiku', role: 'Medical Officer', hospital: 'Regional Hospital', email: 'e.wanjiku@health.go.ke', phone: '+254 700 555 666', license: 'KMPDC-7712', status: 'Pending' },
];

export const mockCHWs = [
  { id: 'chw1', name: 'Alex Mutua', sector: 'Kijiji Village', activePatients: 28, email: 'a.mutua@chw.org', phone: '+254 711 555 666', performance: 'Excellent', status: 'Approved' },
  { id: 'chw2', name: 'Grace Achieng', sector: 'Mlimani Sector', activePatients: 15, email: 'g.achieng@chw.org', phone: '+254 711 777 888', performance: 'Good', status: 'Approved' },
  { id: 'chw3', name: 'James Otieno', sector: 'Ziwani Block', activePatients: 0, email: 'j.otieno@chw.org', phone: '+254 711 999 000', performance: 'New', status: 'Pending' },
];

export const mockHealthFacilities: HealthFacility[] = [
  {
    id: 'f1',
    name: 'Kenyatta University Teaching, Referral and Research Hospital (KUTRRH)',
    type: 'specialist',
    coordinates: { lat: -1.1747, lng: 36.9264 },
    capabilities: ['Tertiary Epilepsy Care', 'Neurology Specialist', 'EEG/Video-EEG', '24/7 Emergency'],
    contact: '+254 800 721 038',
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
  }
];
