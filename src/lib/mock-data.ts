import type { Patient, UserProfile, Notification } from './types';
import { AlertCircle, Calendar, ClipboardCheck, User } from 'lucide-react';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Samuel Mbeki',
    age: 12,
    gender: 'Male',
    village: 'Kijiji Village',
    status: 'Urgent',
    lastEncounter: '2024-07-20T10:30:00Z',
  },
  {
    id: 'p2',
    name: 'Alice Wambui',
    age: 28,
    gender: 'Female',
    village: 'Lower River Crossing',
    status: 'Stable',
    lastEncounter: '2024-07-15T09:00:00Z',
  },
  {
    id: 'p3',
    name: 'Emmanuel Kiprotich',
    age: 45,
    gender: 'Male',
    village: 'Green Hills',
    status: 'Follow-up',
    lastEncounter: '2024-07-18T14:20:00Z',
  },
  {
    id: 'p4',
    name: 'Fatima Juma',
    age: 7,
    gender: 'Female',
    village: 'Kijiji Village',
    status: 'Stable',
    lastEncounter: '2024-07-22T11:00:00Z',
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
