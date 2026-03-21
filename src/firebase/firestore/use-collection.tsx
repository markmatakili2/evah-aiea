'use client';

import { useState, useEffect } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';
import { mockPatients, mockEncounters } from '@/lib/mock-data';

export function useCollection(q: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo && q) {
      // Mock collection mapping
      const path = (q as any)._query?.path?.segments?.join('/') || '';
      
      if (path === 'patients') {
        setData(mockPatients);
      } else if (path.includes('/encounters')) {
        const segments = (q as any)._query?.path?.segments || [];
        const pId = segments[1];
        setData(mockEncounters.filter(e => e.patientId === pId));
      } else {
        setData([]);
      }
      
      setLoading(false);
      return;
    }

    if (!q) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [q]);

  return { data, loading, error };
}
