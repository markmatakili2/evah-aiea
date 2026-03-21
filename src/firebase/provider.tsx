'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "demo-aiea.firebaseapp.com",
  projectId: "demo-aiea",
  storageBucket: "demo-aiea.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    // Return null instead of throwing to prevent crashes in non-wrapped sub-trees during build
    return null;
  }
  return context;
}

export function useAuth() {
  return useFirebase()?.auth || null;
}

export function useFirestore() {
  return useFirebase()?.db || null;
}
