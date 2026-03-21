
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { auth, db } from './config';

const FirebaseContext = createContext({ auth, db });

export const useFirebase = () => useContext(FirebaseContext);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}
