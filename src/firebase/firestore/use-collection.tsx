
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, type Query } from 'firebase/firestore';
import { mockPatients, mockEncounters } from '@/lib/mock-data';

export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo && query) {
      // Very basic path detection for demo mode
      const path = (query as any)._query?.path?.segments?.join('/') || '';
      
      if (path.includes('patients')) {
        setData(mockPatients);
      } else if (path.includes('encounters')) {
        setData(mockEncounters);
      }
      
      setLoading(false);
      return;
    }

    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
