
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';
import { mockUserProfile, mockPatients } from '@/lib/mock-data';

export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo) {
      // Handle demo mode data fetching
      const path = docRef.path;
      if (path.includes('users/')) {
        setData(mockUserProfile);
      } else if (path.includes('patients/')) {
        const id = path.split('/').pop();
        setData(mockPatients.find(p => p.id === id) || null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        setData(doc.exists() ? { id: doc.id, ...doc.data() } : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef?.path]);

  return { data, loading, error };
}
