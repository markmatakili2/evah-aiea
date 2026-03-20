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
 * In Demo Mode, it intercepts queries for 'encounters' and returns mock data.
 *
 * @param query - The Firestore query or collection reference to listen to.
 * @returns An object containing the data, loading state, and any error encountered.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // DEMO MODE HANDLING
    const isDemo = localStorage.getItem('demo_session') === 'true';
    
    if (isDemo && query) {
      // Small delay to simulate network latency
      const timer = setTimeout(() => {
        // Basic path detection for encounters
        // Since we can't easily get the path from a Query object in standard SDK,
        // we'll check if the query object looks like it's targeting encounters
        // In this prototype, we'll try to match patient-specific history
        const url = window.location.pathname;
        if (url.includes('/records/') && url.includes('/history')) {
          const patientId = url.split('/records/')[1].split('/')[0];
          const filtered = mockEncounters.filter(e => e.patientId === patientId);
          setData(filtered as T[]);
        } else {
          // Default to an empty array for other collections in demo
          setData([]);
        }
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!query) {
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
          path: 'collection', // query.path is not available on Query types directly
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
