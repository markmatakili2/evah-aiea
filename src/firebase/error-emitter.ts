'use client';

import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

/**
 * Global event emitter for Firebase errors.
 * Used to surface security rule violations to the developer UI.
 */
class FirebaseErrorEmitter extends EventEmitter {
  emit(event: 'permission-error', error: FirestorePermissionError): boolean {
    return super.emit(event, error);
  }

  on(event: 'permission-error', listener: (error: FirestorePermissionError) => void): this {
    return super.on(event, listener);
  }

  off(event: 'permission-error', listener: (error: FirestorePermissionError) => void): this {
    return super.off(event, listener);
  }
}

export const errorEmitter = new FirebaseErrorEmitter();
