import type { LucideIcon } from "lucide-react";

export type Role = 'chw' | 'clinician' | 'supervisor';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  contact: string;
  status: 'Stable' | 'Urgent' | 'Follow-up';
  lastEncounter?: string;
  referralId?: string;
};

export type Encounter = {
  id: string;
  patientId: string;
  date: string; // ISO format
  summary: string;
  redFlags: string[];
  recommendation: string;
  type: 'Initial' | 'Routine' | 'Emergency';
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

// Legacy types to support existing build routes
export type TestRequestStatus = "Pending" | "Allocated" | "Sample Collected" | "In Analysis" | "Completed" | "Cancelled";

export interface ProgressStep {
  status: TestRequestStatus;
  date: string;
  details: string;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  prices: { labId: string; price: number }[];
}

export interface Lab {
  id: string;
  name: string;
  address: string;
}

export interface TestResult {
  id: string;
  requestId: string;
  testName: string;
  date: string;
  personnelName: string;
  results: Record<string, { value: string; range: string; flag: "Normal" | "High" | "Low" }>;
  rating?: number;
}

export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Completed' | 'Rejected';
}
