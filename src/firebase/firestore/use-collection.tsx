'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { mockEncounters } from '@/lib/mock-data';

/**
 * A custom hook to listen to a Firestore collection or query in real-time.
 * 
 * Supports "Demo Mode" by returning mock data if Firestore is not available
 * or if the demo_session flag is set in localStorage.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // Check for Demo Mode
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_session') === 'true';

    if (isDemo) {
      // Simulate network delay
      const timer = setTimeout(() => {
        // If the query is for encounters, we try to filter by patient if possible
        // Otherwise return all encounters for the demo
        setData(mockEncounters as unknown as T[]);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const documents = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(documents);
        setLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: query.toString(),
          operation: 'list',
        });

        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
