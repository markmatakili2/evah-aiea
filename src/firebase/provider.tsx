
'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Empty config for demo purposes - replace with real keys if connecting to backend
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "0000000000",
  appId: "1:0000000000:web:demo"
};

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => {
    // In a pure mock/demo environment, we don't strictly need to initialize
    // but we do it gracefully to satisfy hooks.
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);
      return { app, auth, db };
    } catch (e) {
      console.warn("Firebase initialization skipped or failed. Running in pure mock mode.");
      return { app: null, auth: null, db: null };
    }
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
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().db;
}
