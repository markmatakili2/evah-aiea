export type Test = {
  id: string;
  name: string;
  description: string;
  prices: {
    labId: string;
    price: number;
  }[];
};

export type Lab = {
  id: string;
  name: string;
  location: string;
};

export type TestRequestStatus = 'Pending' | 'Allocated' | 'Sample Collected' | 'In Analysis' | 'Completed' | 'Cancelled';

export type TestRequest = {
  id: string;
  testId: string;
  testName: string;
  requestDate: string;
  status: TestRequestStatus;
  personnelName?: string;
  personnelId?: string;
  collectionDate?: string;
  progress: {
    step: number;
    details: string;
  };
};

export type TestResult = {
  id: string;
  requestId: string;
  testName: string;
  date: string;
  pdfUrl: string;
  personnelName: string;
  personnelId: string;
  rating?: number;
  results: Record<string, { value: string; range: string, flag: 'Normal' | 'High' | 'Low' }>;
};

export type UserProfile = {
    firstName: string;
    surname: string;
    email: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    phone: string;
    imageUrl: string;
    imageHint: string;
    address: {
        line1: string;
        city: string;
        country: string;
    };
    allowLocation: boolean;
};

export type FaqItem = {
    question: string;
    answer: string;
};
