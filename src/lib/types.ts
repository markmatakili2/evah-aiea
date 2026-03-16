import type { LucideIcon } from "lucide-react";

export type Role = 'chw' | 'clinician' | 'supervisor';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  status: 'Stable' | 'Urgent' | 'Follow-up';
  lastEncounter?: string;
  referralId?: string;
};

export type Encounter = {
  id: string;
  patientId: string;
  date: string;
  type: 'Initial' | 'Routine' | 'Emergency';
  notes: string;
  recommendation: string;
};

export type UserProfile = {
    name: string;
    role: Role;
    email: string;
    imageUrl: string;
    location: string;
};

export type Notification = {
    id: string;
    icon: LucideIcon;
    text: string;
    href: string;
    timestamp: string;
    read: boolean;
};
