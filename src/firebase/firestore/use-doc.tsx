
'use client';

import { useEffect, useState } from 'react';
import { DocumentReference, onSnapshot, DocumentData } from 'firebase/firestore';
import { mockUserProfile, mockPatients } from '@/lib/mock-data';

export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo && docRef) {
      const path = docRef.path;
      
      // Handle User Profile
      if (path.startsWith('users/')) {
        setData(mockUserProfile as unknown as T);
      } 
      // Handle Specific Patient
      else if (path.startsWith('patients/')) {
        const id = path.split('/')[1];
        const patient = mockPatients.find(p => p.id === id);
        setData((patient || null) as unknown as T);
      }
      
      setLoading(false);
      return;
    }

    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        setData(doc.exists() ? doc.data() : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [docRef?.path]);

  return { data, loading, error };
}
