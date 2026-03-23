import type { LucideIcon } from "lucide-react";

export type Role = 'chw' | 'clinician' | 'supervisor';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  contact: string;
  status: 'Stable' | 'Urgent' | 'Follow-up';
  updatedAt?: string;
  chwId?: string;
  chwName?: string; // Added for attribution
};

export type Encounter = {
  id: string;
  patientId: string;
  date: string; // ISO format
  summary: string;
  redFlags: string[];
  recommendation: {
    action: string;
    urgencyLevel?: string;
    referralDestination?: string;
    antiStigmaMessages?: string[];
    safetyAdvice?: string[];
  };
  type: 'Initial' | 'Routine' | 'Emergency';
  discordanceNote?: string;
  authorName: string; // Added for attribution
  authorRole: string; // Added for attribution
  isClinicianUpdated?: boolean;
};

export type UserProfile = {
    firstName?: string;
    surname?: string;
    name: string;
    role: string;
    email: string;
    imageUrl: string;
    location: string;
    phone?: string;
    dob?: string;
    gender?: string;
    address?: any;
    allowLocation?: boolean;
    imageHint?: string;
};

export type Notification = {
    id: string;
    icon: LucideIcon;
    text: string;
    href: string;
    timestamp: string;
    read: boolean;
};
