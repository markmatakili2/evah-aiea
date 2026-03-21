
'use client';

import { useEffect, useState } from 'react';
import { Query, onSnapshot, DocumentData, collection, query, where } from 'firebase/firestore';
import { mockPatients, mockEncounters, mockClinicians, mockCHWs } from '@/lib/mock-data';

export function useCollection<T = DocumentData>(queryRef: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo && queryRef) {
      // In a real Query, we can't easily parse the path from the queryRef object
      // but for this prototype, we'll use a simplified check.
      // We assume the caller passes a ref that matches our mock types.
      
      // Simulating a small delay
      const timeout = setTimeout(() => {
        // This is a heuristic for the demo - we check the variable name or context
        // In this specific app, we primarily query patients, encounters, clinicians, and chws.
        
        // We can't see the path easily in a Query object, so we look at the session context
        const role = localStorage.getItem('demo_role');
        
        // Return based on likely request
        // (In a more robust demo, we'd pass a 'collectionName' string to the hook)
        if (window.location.pathname.includes('/records')) {
           setData(mockPatients as unknown as T[]);
        } else if (window.location.pathname.includes('/history')) {
           setData(mockEncounters as unknown as T[]);
        } else {
           setData(mockPatients as unknown as T[]);
        }
        
        setLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
    }

    if (!queryRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(queryRef, 
      (snapshot) => {
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
        setData(results);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [queryRef]);

  return { data, loading, error };
}
