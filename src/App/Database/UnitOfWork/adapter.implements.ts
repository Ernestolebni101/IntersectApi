import {
  IUnitOfWorkAdapter,
  IUnitOfWorkRepository,
} from '../IUnitOfWork/interfaces.unitofWork';
import { Injectable, Inject, Scope } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as fireorm from 'fireorm';
import { UnitOfWorkRepository } from './repositories.implements';
import {
  FIREBASE_APP_CLIENT,
  FIRESTORE_DB,
  SETTINGS,
} from '../database.constants';
import { firestoreDb } from '../database-providers/firebase.provider';
import { Bucket } from '@google-cloud/storage';

@Injectable({ scope: Scope.TRANSIENT })
export class UnitOfWorkAdapter implements IUnitOfWorkAdapter {
  public Repositories: IUnitOfWorkRepository;
  public _transaction: firebase.firestore.WriteBatch;

  constructor(@Inject(FIRESTORE_DB) private readonly db: firestoreDb) {
    fireorm.initialize(this.db);
    this._transaction = this.db.batch();
    this.Repositories = new UnitOfWorkRepository();
  }
  public commitChanges = async (): Promise<void> => {
    await this._transaction.commit();
  };

  public getBucket = async (): Promise<Bucket> =>
    Promise.resolve(firebase.storage().bucket());
}
