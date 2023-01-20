// Config Imports
import * as creds from '../../../keys/creds.json';
import { ConfigService } from '@nestjs/config';
// ------------------------------------------------------------
// Providers imports
import { Provider } from '@nestjs/common';
// ------------------------------------------------------------
import { app, ServiceAccount } from 'firebase-admin';
import * as firebase from 'firebase-admin';
import {
  FIREBASE_APP_CLIENT,
  FIRESTORE_DB,
  SETTINGS,
} from '../database.constants';
import { Scope } from '@nestjs/common/interfaces';
export type firebaseClient = app.App;
export type firestoreDb = firebase.firestore.Firestore;
export const firebaseProvider: Provider[] = [
  {
    useFactory: (config: ConfigService): firebaseClient => {
      return !firebase.apps.length
        ? firebase.initializeApp({
            credential: firebase.credential.cert(creds as ServiceAccount),
            databaseURL: config.get<string>('DB_URL'),
            storageBucket: config.get<string>('BUCKET_URL'),
            projectId: config.get<string>('PID'),
          })
        : firebase.app();
    },
    provide: FIREBASE_APP_CLIENT,
    inject: [ConfigService],
    scope: Scope.DEFAULT,
  },
  {
    useFactory: (app: firebaseClient): firestoreDb => {
      const fireDb = app.firestore();
      fireDb.settings(SETTINGS);
      return fireDb;
    },
    provide: FIRESTORE_DB,
    inject: [FIREBASE_APP_CLIENT],
    scope: Scope.DEFAULT,
  },
];
