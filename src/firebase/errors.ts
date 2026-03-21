
export class FirestorePermissionError extends Error {
  constructor(message: string = 'Permission denied to Firestore resource.') {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}
