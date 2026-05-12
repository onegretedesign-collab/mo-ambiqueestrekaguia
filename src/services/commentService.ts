import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
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

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Comment {
  id?: string;
  text: string;
  authorName: string;
  createdAt: any;
  userId?: string;
}

export const subscribeToComments = (callback: (comments: Comment[]) => void) => {
  const path = 'comments';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
    callback(comments);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const addComment = async (text: string, authorName: string) => {
  const path = 'comments';
  try {
    await addDoc(collection(db, path), {
      text,
      authorName,
      createdAt: serverTimestamp(),
      userId: auth.currentUser?.uid || null
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};
