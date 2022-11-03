import {
  IUnitOfWorkAdapter,
  IUnitOfWorkRepository,
} from '../IUnitOfWork/interfaces.unitofWork';
import { Injectable, Inject } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as fireorm from 'fireorm';
import { UnitOfWorkRepository } from './repositories.implements';
import { FIREBASE_APP_CLIENT, SETTINGS } from '../database.constants';
import { firebaseClient } from '../database-providers/firebase.provider';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class UnitOfWorkAdapter implements IUnitOfWorkAdapter {
  public Repositories: IUnitOfWorkRepository;
  public _transaction: firebase.firestore.WriteBatch;
  public _db: firebase.firestore.Firestore;

  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
  ) {
    this.initDataContext();
    this._transaction = this._db.batch();
    this.Repositories = new UnitOfWorkRepository();
  }
  /**
   * ! Se deshabilitaron las configuraciones de  la base de datos por la ejecucion de las pruebas
   */
  private initDataContext() {
    this._db = this.app.firestore();
    // this._db.settings(SETTINGS);
    fireorm.initialize(this._db);
  }
  public commitChanges = async (): Promise<void> => {
    await this._transaction.commit();
  };

  public getBucket = async (): Promise<Bucket> =>
    Promise.resolve(firebase.storage().bucket());
}
