'use client';

import { useState, useEffect } from 'react';
import { DocumentReference, onSnapshot } from 'firebase/firestore';
import { mockUserProfile } from '@/lib/mock-data';

export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';
    
    if (isDemo && docRef) {
      // Logic to return mock profile if path matches users
      if (docRef.path.startsWith('users/')) {
        setData(mockUserProfile);
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
        setData(doc.exists() ? { id: doc.id, ...doc.data() } : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [docRef]);

  return { data, loading, error };
}
