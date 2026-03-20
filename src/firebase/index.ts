'use client';

/**
 * @fileOverview Firebase initialization and service getters.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes Firebase services if they haven't been initialized already.
 */
export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

// Export hooks and providers
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';

export function useFirebase() {
  return initializeFirebase();
}

export function useFirebaseApp() {
  return initializeFirebase().app;
}

export function useAuth() {
  return initializeFirebase().auth;
}

export function useFirestore() {
  return initializeFirebase().firestore;
}
