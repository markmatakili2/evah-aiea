
import type { Test, Lab, TestRequest, TestResult, UserProfile, FaqItem } from './types';

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
      { labId: 'lab1', price: 35 },
      { labId: 'lab2', price: 40 },
      { labId: 'lab3', price: 38 },
    ],
  },
  {
    id: 'test2',
    name: 'Lipid Panel',
    description: 'Measures fats and fatty substances used as a source of energy by your body.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab1', price: 50 },
      { labId: 'lab3', price: 55 },
    ],
  },
  {
    id: 'test3',
    name: 'Thyroid Panel (TSH)',
    description: 'Evaluates thyroid gland function and helps diagnose thyroid disorders.',
    category: 'Endocrinology',
    prices: [
      { labId: 'lab2', price: 75 },
      { labId: 'lab3', price: 70 },
    ],
  },
  {
    id: 'test4',
    name: 'Basic Metabolic Panel (BMP)',
    description: 'Measures glucose, calcium, and electrolytes to check your kidney health.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab1', price: 45 },
      { labId: 'lab2', price: 48 },
    ],
  },
  {
    id: 'test5',
    name: 'Vitamin D Test',
    description: 'Measures the level of vitamin D in your blood to check for deficiencies.',
    category: 'Biochemistry',
    prices: [
      { labId: 'lab3', price: 60 },
    ],
  },
    {
    id: 'test6',
    name: 'Hemoglobin A1c (HbA1c)',
    description: 'Used to diagnose and monitor diabetes by measuring average blood sugar over 2-3 months.',
    category: 'Endocrinology',
    prices: [
        { labId: 'lab1', price: 40 },
        { labId: 'lab2', price: 42 },
        { labId: 'lab3', price: 39 },
    ],
  },
  {
    id: 'test7',
    name: 'Urine Culture',
    description: 'Checks for bacteria in your urine, which can cause a urinary tract infection (UTI).',
    category: 'Microbiology',
    prices: [
      { labId: 'lab1', price: 65 },
      { labId: 'lab2', price: 70 },
    ],
  },
  {
    id: 'test8',
    name: 'Hepatitis B Surface Antigen',
    description: 'Detects the presence of the hepatitis B virus.',
    category: 'Serology',
    prices: [
      { labId: 'lab1', price: 80 },
      { labId: 'lab3', price: 85 },
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
    personnelName: 'Jane Smith',
    personnelId: 'tech2',
    collectionDate: '2024-07-24T11:00:00Z',
    progress: [
        { status: 'Pending', date: '2024-07-23T09:15:00Z', details: 'Request submitted.' },
        { status: 'Allocated', date: '2024-07-23T10:00:00Z', details: 'Jane Smith assigned.' },
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
    progress: [
        { status: 'Pending', date: '2024-07-25T12:00:00Z', details: 'Awaiting allocation of lab personnel.' },
    ]
  },
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
