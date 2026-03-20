'use client';

import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

/**
 * A specialized event emitter for Firebase-related errors.
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
