'use client';

import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type FirebaseEvents = {
  'permission-error': [FirestorePermissionError];
};

class FirebaseErrorEmitter extends EventEmitter {
  emit<K extends keyof FirebaseEvents>(event: K, ...args: FirebaseEvents[K]): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof FirebaseEvents>(event: K, listener: (...args: FirebaseEvents[K]) => void): this {
    return super.on(event, listener as any);
  }

  off<K extends keyof FirebaseEvents>(event: K, listener: (...args: FirebaseEvents[K]) => void): this {
    return super.off(event, listener as any);
  }
}

export const errorEmitter = new FirebaseErrorEmitter();
