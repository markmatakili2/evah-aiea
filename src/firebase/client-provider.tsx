
'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<{
    firebaseApp: any;
    firestore: any;
    auth: any;
  }>({
    firebaseApp: null,
    firestore: null,
    auth: null,
  });

  useEffect(() => {
    const { firebaseApp, firestore, auth } = initializeFirebase();
    setServices({ firebaseApp, firestore, auth });
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      firestore={services.firestore}
      auth={services.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
