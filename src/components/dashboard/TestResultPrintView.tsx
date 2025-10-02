'use client';

import React from 'react';
import { Logo } from '@/components/logo';
import type { TestResult, UserProfile } from '@/lib/types';
import { mockUserProfile } from '@/lib/mock-data';

interface TestResultPrintViewProps {
  result: TestResult;
}

const ResultRow = ({
  label,
  value,
  range,
  flag,
}: {
  label: string;
  value: string;
  range: string;
  flag: 'Normal' | 'High' | 'Low';
}) => {
  const flagClasses = {
    Normal: '',
    High: 'font-bold text-red-600',
    Low: 'font-bold text-yellow-600',
  };

  return (
    <div className="grid grid-cols-4 items-center border-b py-2 text-sm">
      <div>{label}</div>
      <div className={`font-mono text-right ${flagClasses[flag]}`}>{value}</div>
      <div className="font-mono text-right text-gray-500">{range}</div>
      <div className={`text-right font-semibold ${flagClasses[flag]}`}>{flag}</div>
    </div>
  );
};

export const TestResultPrintView = React.forwardRef<HTMLDivElement, TestResultPrintViewProps>(
  ({ result }, ref) => {
    const user = mockUserProfile;
    return (
      <div ref={ref} className="p-10 font-sans bg-white text-gray-800">
        <header className="flex justify-between items-start border-b-2 border-gray-800 pb-4">
          <div>
            <Logo />
            <p className="text-sm text-gray-600 mt-1">123 Health St, Wellness City</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800">Lab Report</h1>
            <p className="text-sm">Report Date: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 my-6 text-sm">
          <div>
            <h2 className="text-lg font-bold mb-2">Patient Information</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <strong>Patient Name:</strong>
              <span>{user.firstName} {user.surname}</span>
              <strong>Request ID:</strong>
              <span>{result.requestId}</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Test Details</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <strong>Test Name:</strong>
                <span>{result.testName}</span>
                <strong>Collection Date:</strong>
                <span>{result.date}</span>
                <strong>Analysis Performed By:</strong>
                <span>{result.personnelName}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-2">Test Results</h2>
          <div className="grid grid-cols-4 items-center font-bold border-b-2 pb-2 text-sm">
            <div>Analyte</div>
            <div className="text-right">Value</div>
            <div className="text-right">Reference Range</div>
            <div className="text-right">Flag</div>
          </div>
          {Object.entries(result.results).map(([key, res]) => (
            <ResultRow key={key} label={key} value={res.value} range={res.range} flag={res.flag} />
          ))}
        </section>

        <footer className="mt-10 pt-4 border-t text-center text-xs text-gray-500">
          <p>*** This is not a medical diagnosis. Consult with a qualified healthcare professional for interpretation of these results. ***</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} DigiLab Connect. All rights reserved.</p>
        </footer>
      </div>
    );
  }
);

TestResultPrintView.displayName = 'TestResultPrintView';
