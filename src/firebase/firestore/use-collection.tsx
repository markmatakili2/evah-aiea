
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, Query, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { mockPatients, mockEncounters } from '@/lib/mock-data';

export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo) {
      // Very basic logic to simulate collection queries in demo mode
      // This identifies if we are looking for patients or encounters
      const queryString = (query as any)._query?.path?.segments?.join('/') || '';
      
      if (queryString.includes('patients') && queryString.includes('encounters')) {
        // Nested encounters collection
        const patientId = queryString.split('/')[1];
        setData(mockEncounters.filter(e => e.patientId === patientId));
      } else if (queryString.includes('patients')) {
        setData(mockPatients);
      } else {
        setData([]);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
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
