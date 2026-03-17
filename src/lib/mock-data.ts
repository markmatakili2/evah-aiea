import type { Patient, UserProfile, Notification, Encounter } from './types';
import { AlertCircle, Calendar, ClipboardCheck } from 'lucide-react';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Samuel Mbeki',
    age: 12,
    gender: 'Male',
    village: 'Kijiji Village',
    contact: '+254 711 000 111',
    status: 'Urgent',
    lastEncounter: '2024-07-20T10:30:00Z',
  },
  {
    id: 'p2',
    name: 'Alice Wambui',
    age: 28,
    gender: 'Female',
    village: 'Lower River Crossing',
    contact: '+254 722 000 222',
    status: 'Stable',
    lastEncounter: '2024-07-15T09:00:00Z',
  },
  {
    id: 'p3',
    name: 'Emmanuel Kiprotich',
    age: 45,
    gender: 'Male',
    village: 'Green Hills',
    contact: '+254 733 000 333',
    status: 'Follow-up',
    lastEncounter: '2024-07-18T14:20:00Z',
  },
  {
    id: 'p4',
    name: 'Fatima Juma',
    age: 7,
    gender: 'Female',
    village: 'Kijiji Village',
    contact: '+254 744 000 444',
    status: 'Stable',
    lastEncounter: '2024-07-22T11:00:00Z',
  }
];

export const mockEncounters: Encounter[] = [
  {
    id: 'e1',
    patientId: 'p1',
    date: '2024-07-20T10:30:00Z',
    type: 'Emergency',
    summary: 'Patient presented with 3 tonic-clonic seizures within 2 hours. Family reports no recovery of consciousness between events.',
    redFlags: ['Repeated seizures without full recovery', 'Severe injury (tongue bite)'],
    recommendation: 'Immediate referral to tertiary hospital for Status Epilepticus management.'
  },
  {
    id: 'e2',
    patientId: 'p1',
    date: '2024-06-15T09:00:00Z',
    type: 'Routine',
    summary: 'Follow-up visit. Seizure frequency decreased to 1/month. Adherence to Phenobarbital is good.',
    redFlags: [],
    recommendation: 'Continue current dosage. Review in 3 months.'
  },
  {
    id: 'e3',
    patientId: 'p2',
    date: '2024-07-15T09:00:00Z',
    type: 'Initial',
    summary: 'New onset focal seizures. Patient remains conscious during events. No fever or injury.',
    redFlags: [],
    recommendation: 'Initiate Carbamazepine 200mg BD. Monitor for 2 weeks.'
  },
  {
    id: 'e4',
    patientId: 'p3',
    date: '2024-07-18T14:20:00Z',
    type: 'Routine',
    summary: 'Seizures continuing despite correct dosage. Patient reports stress as a major trigger.',
    redFlags: ['Seizures continuing despite medication at correct dose'],
    recommendation: 'Increase dosage by 25%. Counseling on stress management and sleep hygiene.'
  }
];

export const mockCHWProfile: UserProfile = {
    name: "Alex Miller",
    role: "chw",
    email: "alex.miller@assistant.ai",
    location: "Kijiji Sector",
    imageUrl: 'https://picsum.photos/seed/chw1/200/200',
};

export const mockNotifications: Notification[] = [
    { id: '1', icon: AlertCircle, text: "Urgent review needed for Samuel Mbeki", href: "/dashboard/records", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: '2', icon: ClipboardCheck, text: "Clinician approved Alice's follow-up plan", href: "/dashboard/records", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: '3', icon: Calendar, text: "Monthly report for supervisor is ready", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];
