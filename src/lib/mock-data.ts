import { AlertCircle, Calendar, ClipboardCheck } from 'lucide-react';
import type { Notification, Test, Lab, TestResult, Withdrawal } from './types';

/**
 * @fileOverview This file now primarily hosts standard configuration and notifications.
 * Patient and Encounter data is now strictly managed via Firestore.
 */

export const mockNotifications: Notification[] = [
    { id: '1', icon: AlertCircle, text: "Urgent review needed for a new patient", href: "/dashboard/records", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: '2', icon: ClipboardCheck, text: "Clinical guidance updated to WHO 2024", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: '3', icon: Calendar, text: "Monthly sync completed successfully", href: "/dashboard", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];

// Fallback profile for initial development states
export const mockCHWProfile = {
    name: "Health Worker",
    role: "chw",
    email: "worker@assistant.ai",
    location: "Kijiji Sector",
    imageUrl: 'https://picsum.photos/seed/worker/200/200',
};

export const mockUserProfile = {
    firstName: "Worker",
    surname: "User",
    name: "Health Worker",
    role: "chw",
    email: "worker@assistant.ai",
    phone: "+254...",
    dob: "1990-05-15",
    gender: "Other",
    address: {
        line1: "Sector Office",
        city: "Local",
        country: "Region"
    },
    allowLocation: true,
    imageUrl: 'https://picsum.photos/seed/worker/200/200',
    location: "Local Sector",
    imageHint: "profile person"
};

// Legacy exports to maintain build compatibility
export const mockTests: Test[] = [];
export const mockLabs: Lab[] = [];
export const mockTestRequests: any[] = [];
export const mockTestResults: TestResult[] = [];
export const mockWithdrawals: Withdrawal[] = [];
export const mockReferredUsers: any[] = [];
export const mockPatients: any[] = [];
export const mockEncounters: any[] = [];
