'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * Entry point for Firebase on the client.
 * Composes the FirebaseProvider and includes the global error listener.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, firestore, auth } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
