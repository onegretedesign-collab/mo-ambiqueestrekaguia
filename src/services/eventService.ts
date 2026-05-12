import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  type FirestoreError
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Event {
  id?: string;
  date: string;
  title: string;
  location: string;
  status: string;
  order: number;
}

export const subscribeToEvents = (callback: (events: Event[]) => void) => {
  const path = 'events';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
