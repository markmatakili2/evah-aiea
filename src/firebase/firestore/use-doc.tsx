
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentReference } from 'firebase/firestore';
import { mockPatients, mockUserProfile } from '@/lib/mock-data';

export function useDoc(ref: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo && ref) {
      // Extract the path to decide which mock data to return
      const path = ref.path;
      
      if (path.startsWith('patients/')) {
        const id = path.split('/')[1];
        const patient = mockPatients.find(p => p.id === id);
        setData(patient || null);
      } else if (path.startsWith('users/')) {
        setData(mockUserProfile);
      }
      
      setLoading(false);
      return;
    }

    if (!ref) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
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
  }, [ref]);

  return { data, loading, error };
}
