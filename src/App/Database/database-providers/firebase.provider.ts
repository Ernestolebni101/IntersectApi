// Config Imports
import * as creds from '../../../keys/creds.json';
import { ConfigService } from '@nestjs/config';
// ------------------------------------------------------------
// Providers imports
import { Provider } from '@nestjs/common';
// ------------------------------------------------------------
import { app, ServiceAccount } from 'firebase-admin';
import * as firebase from 'firebase-admin';
import { FIREBASE_APP_CLIENT } from '../database.constants';
export type firebaseClient = app.App;

export const firebaseProvider: Provider[] = [
  {
    useFactory: (config: ConfigService): firebaseClient => {
      return firebase.initializeApp({
        credential: firebase.credential.cert(creds as ServiceAccount),
        databaseURL: config.get('DB_URL'),
        storageBucket: config.get('BUCKET_URL'),
      });
    },
    provide: FIREBASE_APP_CLIENT,
    inject: [ConfigService],
  },
];
