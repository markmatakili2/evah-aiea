
import type { Test, Lab, TestRequest, TestResult, UserProfile, FaqItem, Notification, ReferredUser } from './types';
import { CreditCard, MessageSquare, FileText, CheckCircle } from 'lucide-react';

export const mockLabs: Lab[] = [
  { id: 'lab1', name: 'City Central Labs', location: '123 Main St, Downtown' },
  { id: 'lab2', name: 'Suburb Diagnostics', location: '456 Oak Ave, Suburbia' },
  { id: 'lab3', name: 'Wellness Labs Inc.', location: '789 Pine Rd, Greenfield' },
];

export const mockTests: Test[] = [
  {
    id: 'test1',
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of your blood, including red and white blood cells.',
    category: 'Hematology',
    prices: [
      { labId: 'lab1', price: 3500 },
      { labId: 'lab2', price: 4000 },
      { labId: 'lab3', price: 3800 },
    ],
  },
  {
    id: 'test2',
    name: 'Lipid Panel',
    description: 'Measures fats and fatty substances used as a source of energy by your body.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab1', price: 5000 },
      { labId: 'lab3', price: 5500 },
    ],
  },
  {
    id: 'test3',
    name: 'Thyroid Panel (TSH)',
    description: 'Evaluates thyroid gland function and helps diagnose thyroid disorders.',
    category: 'Endocrinology',
    prices: [
      { labId: 'lab2', price: 7500 },
      { labId: 'lab3', price: 7000 },
    ],
  },
  {
    id: 'test4',
    name: 'Basic Metabolic Panel (BMP)',
    description: 'Measures glucose, calcium, and electrolytes to check your kidney health.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab1', price: 4500 },
      { labId: 'lab2', price: 4800 },
    ],
  },
  {
    id: 'test5',
    name: 'Vitamin D Test',
    description: 'Measures the level of vitamin D in your blood to check for deficiencies.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab3', price: 6000 },
    ],
  },
    {
    id: 'test6',
    name: 'Hemoglobin A1c (HbA1c)',
    description: 'Used to diagnose and monitor diabetes by measuring average blood sugar over 2-3 months.',
    category: 'Endocrinology',
    prices: [
        { labId: 'lab1', price: 4000 },
        { labId: 'lab2', price: 4200 },
        { labId: 'lab3', price: 3900 },
    ],
  },
  {
    id: 'test7',
    name: 'Urine Culture',
    description: 'Checks for bacteria in your urine, which can cause a urinary tract infection (UTI).',
    category: 'Microbiology',
    prices: [
      { labId: 'lab1', price: 6500 },
      { labId: 'lab2', price: 7000 },
    ],
  },
  {
    id: 'test8',
    name: 'Hepatitis B Surface Antigen',
    description: 'Detects the presence of the hepatitis B virus.',
    category: 'Serology',
    prices: [
      { labId: 'lab1', price: 8000 },
      { labId: 'lab3', price: 8500 },
    ],
  },
];

export const mockTestRequests: TestRequest[] = [
  {
    id: 'req1',
    testId: 'test1',
    testName: 'Complete Blood Count (CBC)',
    requestDate: '2024-07-20T10:30:00Z',
    status: 'Completed',
    personnelName: 'John Doe',
    personnelId: 'tech1',
    collectionDate: '2024-07-21T09:00:00Z',
    patient: { name: 'Alex Miller', email: 'a**x@example.com', phone: '****3-4567', age: 34, gender: 'Male' },
    lab: { id: 'lab1', name: 'City Central Labs' },
    progress: [
      { status: 'Pending', date: '2024-07-20T10:30:00Z', details: 'Request submitted.' },
      { status: 'Allocated', date: '2024-07-20T11:00:00Z', details: 'John Doe assigned.' },
      { status: 'Sample Collected', date: '2024-07-21T09:05:00Z', details: 'Sample collected.' },
      { status: 'In Analysis', date: '2024-07-21T14:20:00Z', details: 'Analysis started.' },
      { status: 'Completed', date: '2024-07-22T16:45:00Z', details: 'Results are available.' },
    ],
  },
  {
    id: 'req2',
    testId: 'test3',
    testName: 'Thyroid Panel (TSH)',
    requestDate: '2024-07-22T11:00:00Z',
    status: 'In Analysis',
    personnelName: 'Jane Smith',
    personnelId: 'tech2',
    collectionDate: '2024-07-22T14:00:00Z',
    patient: { name: 'Maria Garcia', email: 'm***a@example.com', phone: '****5-1234', age: 45, gender: 'Female' },
    lab: { id: 'lab2', name: 'Suburb Diagnostics' },
    progress: [
      { status: 'Pending', date: '2024-07-22T11:00:00Z', details: 'Request submitted.' },
      { status: 'Allocated', date: '2024-07-22T11:30:00Z', details: 'Jane Smith assigned.' },
      { status: 'Sample Collected', date: '2024-07-22T14:00:00Z', details: 'Sample collected.' },
      { status: 'In Analysis', date: '2024-07-23T09:00:00Z', details: 'Sample is being analyzed at the lab.' },
    ],
  },
  {
    id: 'req3',
    testId: 'test2',
    testName: 'Lipid Panel',
    requestDate: '2024-07-23T09:15:00Z',
    status: 'Sample Collected',
    personnelName: 'John Doe',
    personnelId: 'tech1',
    collectionDate: '2024-07-24T11:00:00Z',
    patient: { name: 'Chen Wang', email: 'c**n@example.com', phone: '****8-9012', age: 52, gender: 'Male' },
    lab: { id: 'lab3', name: 'Wellness Labs Inc.' },
    progress: [
        { status: 'Pending', date: '2024-07-23T09:15:00Z', details: 'Request submitted.' },
        { status: 'Allocated', date: '2024-07-23T10:00:00Z', details: 'John Doe assigned.' },
        { status: 'Sample Collected', date: '2024-07-24T11:05:00Z', details: 'Sample collected and en route to the lab.' },
    ]
  },
  {
    id: 'req4',
    testId: 'test4',
    testName: 'Basic Metabolic Panel (BMP)',
    requestDate: '2024-07-24T18:00:00Z',
    status: 'Allocated',
    personnelName: 'Alex Ray',
    personnelId: 'tech3',
    patient: { name: 'Fatima Al-Sayed', email: 'f***a@example.com', phone: '****2-3456', age: 29, gender: 'Female' },
    lab: { id: 'lab1', name: 'City Central Labs' },
    progress: [
        { status: 'Pending', date: '2024-07-24T18:00:00Z', details: 'Request submitted.' },
        { status: 'Allocated', date: '2024-07-24T18:30:00Z', details: 'Lab personnel has been assigned for collection.' },
    ]
  },
  {
    id: 'req5',
    testId: 'test5',
    testName: 'Vitamin D Test',
    requestDate: '2024-07-25T12:00:00Z',
    status: 'Pending',
    patient: { name: 'Liam Murphy', email: 'l**m@example.com', phone: '****1-8765', age: 60, gender: 'Male', proximity: '2.5km' },
    lab: { id: 'lab3', name: 'Wellness Labs Inc.' },
    progress: [
        { status: 'Pending', date: '2024-07-25T12:00:00Z', details: 'Awaiting allocation of lab personnel.' },
    ]
  },
  {
    id: 'req6',
    testId: 'test7',
    testName: 'Urine Culture',
    requestDate: '2024-07-25T14:00:00Z',
    status: 'Pending',
    patient: { name: 'Aisha Khan', email: 'a***a@example.com', phone: '****6-5432', age: 38, gender: 'Female', proximity: '5.1km' },
    lab: { id: 'lab1', name: 'City Central Labs' },
    progress: [
        { status: 'Pending', date: '2024-07-25T14:00:00Z', details: 'Awaiting allocation of lab personnel.' },
    ]
  },
  {
    id: 'req7',
    testId: 'test8',
    testName: 'Hepatitis B Surface Antigen',
    requestDate: '2024-07-25T15:30:00Z',
    status: 'Pending',
    patient: { name: 'Kenji Tanaka', email: 'k***i@example.com', phone: '****9-8765', age: 41, gender: 'Male', proximity: '1.2km' },
    lab: { id: 'lab2', name: 'Suburb Diagnostics' },
    progress: [
        { status: 'Pending', date: '2024-07-25T15:30:00Z', details: 'Awaiting allocation of lab personnel.' },
    ]
  }
];

export const mockTestResults: TestResult[] = [
  {
    id: 'res1',
    requestId: 'req1',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-07-22T16:45:00Z',
    pdfUrl: '#',
    personnelName: 'John Doe',
    personnelId: 'tech1',
    rating: 5,
    results: {
      'White Blood Cell': { value: '7.2', range: '4.5-11.0 x10^9/L', flag: 'Normal' },
      'Red Blood Cell': { value: '4.9', range: '4.2-5.4 x10^12/L', flag: 'Normal' },
      'Hemoglobin': { value: '15.1', range: '13.5-17.5 g/dL', flag: 'Normal' },
      'Platelets': { value: '250', range: '150-450 x10^9/L', flag: 'Normal' },
    },
  },
  {
    id: 'res2',
    requestId: 'hist1',
    testName: 'Lipid Panel',
    date: '2024-01-15T11:30:00Z',
    pdfUrl: '#',
    personnelName: 'Sarah Chen',
    personnelId: 'tech4',
    rating: 4,
    results: {
      'Total Cholesterol': { value: '210', range: '<200 mg/dL', flag: 'High' },
      'Triglycerides': { value: '160', range: '<150 mg/dL', flag: 'High' },
      'HDL Cholesterol': { value: '45', range: '>40 mg/dL', flag: 'Normal' },
      'LDL Cholesterol': { value: '133', range: '<100 mg/dL', flag: 'High' },
    },
  },
    {
    id: 'res3',
    requestId: 'hist2',
    testName: 'Complete Blood Count (CBC)',
    date: '2023-11-05T14:00:00Z',
    pdfUrl: '#',
    personnelName: 'John Doe',
    personnelId: 'tech1',
    results: {
      'White Blood Cell': { value: '8.1', range: '4.5-11.0 x10^9/L', flag: 'Normal' },
      'Red Blood Cell': { value: '4.5', range: '4.2-5.4 x10^12/L', flag: 'Normal' },
      'Hemoglobin': { value: '14.5', range: '13.5-17.5 g/dL', flag: 'Normal' },
      'Platelets': { value: '145', range: '150-450 x10^9/L', flag: 'Low' },
    },
  },
];

export const mockUserProfile: UserProfile = {
    firstName: "Alex",
    surname: "Miller",
    email: "alex.miller@example.com",
    dob: "1990-05-15",
    gender: "Male",
    phone: "+1 (555) 123-4567",
    imageUrl: 'https://picsum.photos/seed/101/200/200',
    imageHint: 'profile man',
    address: {
        line1: "456 Oak Avenue",
        city: "Springfield",
        country: "USA",
    },
    allowLocation: true,
};

export const mockNotifications: Notification[] = [
    { id: '1', icon: MessageSquare, text: "New message from Jane Smith", href: "/dashboard/chat", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: '2', icon: CreditCard, text: "Payment due for Lipid Panel", href: "/dashboard/requests", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: '3', icon: FileText, text: "Results for CBC are ready", href: "/dashboard/history", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
    { id: '4', icon: CheckCircle, text: "Your insurance details have been verified.", href: "/dashboard/profile", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), read: true },
];

export const mockReferredUsers: ReferredUser[] = [
    { id: 'ref1', name: 'Brenda M.', dateJoined: '2024-07-15T00:00:00Z', status: 'Completed' },
    { id: 'ref2', name: 'Samuel K.', dateJoined: '2024-07-10T00:00:00Z', status: 'Completed' },
    { id: 'ref3', name: 'Faith A.', dateJoined: '2024-06-28T00:00:00Z', status: 'Pending Test' },
    { id: 'ref4', name: 'David O.', dateJoined: '2024-06-12T00:00:00Z', status: 'Pending Test' },
];
