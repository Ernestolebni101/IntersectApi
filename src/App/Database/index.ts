export { UnitOfWorkAdapter } from './UnitOfWork/adapter.implements';
export { UnitOfWorkRepository } from './UnitOfWork/repositories.implements';
export {
  FIREBASE_APP_CLIENT,
  GPATH,
  GPATHID,
  FIRESTORE_DB,
} from './database.constants';
export { FunctionsManagerService } from './firebase/functionManager';
export {
  firebaseClient,
  firebaseProvider,
  firestoreDb,
} from './database-providers/firebase.provider';
export { User } from './firebase/user';
export type FirestoreCollection =
  FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
export type DocumentData = FirebaseFirestore.DocumentData;
export type Documents =
  FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[];
